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

OUT_DIR = os.path.abspath(r'apps\portal\src\assets\images')

def capture_podcaster(lang, country, currency):
    filename = f"podcaster_dashboard_actual_{lang}.png"
    out_path = os.path.join(OUT_DIR, filename)
    url = "http://localhost:3000/#/dashboard?tab=podcaster-studio&role=podcaster"

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
        for i in range(12):
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
        time.sleep(1.0)

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
    capture_podcaster('en', 'US', 'USD')
    capture_podcaster('sw', 'KE', 'KES')
    print("PODCASTER STUDIO DASHBOARDS CAPTURED PERFECTLY!", flush=True)
