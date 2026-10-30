import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import json
import time
import subprocess
import tempfile
import base64
import websocket
import os

DASHBOARDS = [
    ('creator', 'http://localhost:3000/#/dashboard?tab=catalog&role=creator'),
    ('label', 'http://localhost:3000/#/dashboard?tab=catalog&role=label'),
    ('dj', 'http://localhost:3000/#/dashboard?tab=djpool&role=dj'),
    ('mediahouse', 'http://localhost:3000/#/dashboard?tab=corporate-ads&role=media_house'),
    ('supervisor', 'http://localhost:3000/#/dashboard?tab=sync&role=supervisor'),
    ('consumer', 'http://localhost:3000/#/native-apps/tunestream?view=listen'),
    ('corporate', 'http://localhost:3000/#/dashboard?tab=corporate-ads&role=corporate'),
    ('vc', 'http://localhost:3000/#/dashboard?tab=vc-portfolio&role=vc'),
    ('tour', 'http://localhost:3000/#/dashboard?tab=tours-vault&role=vc')
]

OUT_DIR = os.path.abspath(r'apps\portal\src\assets\images')

def capture_single(key, url, lang, country, currency):
    suffix = f'_{lang}'
    filename = f"{key}_dashboard_actual{suffix}.png"
    out_path = os.path.join(OUT_DIR, filename)

    temp_dir = tempfile.mkdtemp()
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9222',
        f'--user-data-dir={temp_dir}',
        '--disable-gpu',
        '--no-sandbox',
        '--window-size=1680,1050',
        url
    ])

    try:
        time.sleep(3)
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9222/json').read())
        target_tab = next(t for t in tabs if 'localhost:3000' in t.get('url', ''))
        ws = websocket.create_connection(target_tab['webSocketDebuggerUrl'])

        setup_js = f'''
            localStorage.setItem("tunemaven_region", JSON.stringify({{ country: "{country}", currency: "{currency}", language: "{lang}" }}));
            localStorage.setItem("synergy_market", "{country}");
            localStorage.setItem("synergy_currency", "{currency}");
            localStorage.setItem("synergy_lang", "{lang}");
            localStorage.setItem("tunemavens_locale_welcomed", "true");
            location.reload();
        '''
        ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': setup_js}}))
        ws.recv()
        time.sleep(3.5)

        # Wait until text rendered
        for i in range(10):
            ws.send(json.dumps({'id': 10+i, 'method': 'Runtime.evaluate', 'params': {'expression': 'document.body.innerText.length'}}))
            res = json.loads(ws.recv())
            t_len = res.get('result', {}).get('result', {}).get('value', 0)
            if t_len > 100:
                break
            time.sleep(1)

        # Apply localization if available
        apply_js = f'''
            if (window.SynergyLocalization && typeof window.SynergyLocalization.setLanguage === "function") {{
                window.SynergyLocalization.setLanguage("{lang}");
            }}
            if (window.SynergyLocalization && typeof window.SynergyLocalization.applyLocalization === "function") {{
                window.SynergyLocalization.applyLocalization();
            }}
        '''
        ws.send(json.dumps({'id': 20, 'method': 'Runtime.evaluate', 'params': {'expression': apply_js}}))
        ws.recv()
        time.sleep(0.8)

        # Capture screenshot
        ws.send(json.dumps({'id': 30, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
        while True:
            m = json.loads(ws.recv())
            if m.get('id') == 30:
                data = base64.b64decode(m['result']['data'])
                with open(out_path, 'wb') as f:
                    f.write(data)
                print(f"Captured [{lang.upper()}] {filename}: {len(data)} bytes", flush=True)
                break
    finally:
        proc.terminate()

if __name__ == '__main__':
    for key, url in DASHBOARDS:
        capture_single(key, url, 'en', 'US', 'USD')
        capture_single(key, url, 'sw', 'KE', 'KES')
    print("ALL 18 SCREENSHOTS CAPTURED PERFECTLY!", flush=True)
