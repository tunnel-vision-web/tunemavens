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

OUT_DIR = os.path.abspath(r'C:\Users\maven\.gemini\antigravity\brain\8dcbd9b3-1f46-45e2-b33c-1d82119fd264')
req_counter = 0

def call_cdp(ws, method, params=None):
    global req_counter
    req_counter += 1
    req_id = req_counter
    payload = {'id': req_id, 'method': method}
    if params:
        payload['params'] = params
    ws.send(json.dumps(payload))
    while True:
        raw = ws.recv()
        msg = json.loads(raw)
        if msg.get('id') == req_id:
            return msg.get('result', {})

def eval_js(ws, expr):
    res = call_cdp(ws, 'Runtime.evaluate', {'expression': expr, 'returnByValue': True})
    return res.get('result', {}).get('value')

def main():
    temp_dir = tempfile.mkdtemp()
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9222',
        f'--user-data-dir={temp_dir}',
        '--disable-gpu',
        '--no-sandbox',
        '--window-size=1680,1050',
        'http://localhost:3000/#/native-apps/tunestream'
    ])

    try:
        time.sleep(3)
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9222/json').read())
        page_tabs = [t for t in tabs if t.get('type') == 'page']
        target_tab = page_tabs[0] if page_tabs else tabs[0]
        ws = websocket.create_connection(target_tab['webSocketDebuggerUrl'])

        # Wait for React
        for _ in range(15):
            val = eval_js(ws, 'document.body.innerText.length')
            if val and val > 50:
                break
            time.sleep(0.5)

        # Set English region and dismiss welcome modal
        setup_js = '''
            localStorage.setItem("tunemaven_region", JSON.stringify({ country: "US", currency: "USD", language: "en" }));
            localStorage.setItem("synergy_market", "US");
            localStorage.setItem("synergy_currency", "USD");
            localStorage.setItem("synergy_lang", "en");
            localStorage.setItem("tunemavens_locale_welcomed", "true");
            location.reload();
        '''
        eval_js(ws, setup_js)
        time.sleep(3)

        cur_url = eval_js(ws, 'window.location.href')
        print(f"Current URL: {cur_url}", flush=True)

        btns = eval_js(ws, 'Array.from(document.querySelectorAll("button, a")).map(b => b.innerText.trim()).filter(Boolean)')
        print(f"Sample buttons (EN): {btns[:14]}", flush=True)

        # Click "My Suite" dropdown trigger
        suite_click = eval_js(ws, '''
            (() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const btn = buttons.find(b => b.innerText.includes('My Suite') || b.innerText.includes('Mkusanyiko'));
                if (btn) {
                    btn.click();
                    return "Clicked: " + btn.innerText;
                }
                const trigger = document.querySelector('.dropdown-container .dropdown-trigger');
                if (trigger) {
                    trigger.click();
                    return "Clicked trigger: " + trigger.innerText;
                }
                return "Not found";
            })()
        ''')
        print(f"Suite Click Result: {suite_click}", flush=True)
        time.sleep(1)

        # Screenshot of open dropdown showing My Suite and Tours and Events
        shot1 = call_cdp(ws, 'Page.captureScreenshot', {'format': 'png'})
        if shot1 and 'data' in shot1:
            raw_png = base64.b64decode(shot1['data'])
            path1 = os.path.join(OUT_DIR, 'tunestream_my_suite_dropdown_verified.png')
            with open(path1, 'wb') as f:
                f.write(raw_png)
            print(f"Saved {path1} ({len(raw_png)} bytes)", flush=True)

        # Click Tours and Events link in dropdown
        tours_click = eval_js(ws, '''
            (() => {
                const lnk = document.querySelector('a[href*="view=tours"]');
                if (lnk) {
                    lnk.click();
                    return "Clicked: " + lnk.innerText;
                }
                return "Not found";
            })()
        ''')
        print(f"Tours Click Result: {tours_click}", flush=True)
        time.sleep(3)

        # Screenshot of Tours and Events view on TuneStream
        shot2 = call_cdp(ws, 'Page.captureScreenshot', {'format': 'png'})
        if shot2 and 'data' in shot2:
            raw_png = base64.b64decode(shot2['data'])
            path2 = os.path.join(OUT_DIR, 'tunestream_tours_view_verified.png')
            with open(path2, 'wb') as f:
                f.write(raw_png)
            print(f"Saved {path2} ({len(raw_png)} bytes)", flush=True)

        # Scroll down to tabs and live concert cards
        eval_js(ws, 'window.scrollTo(0, 520);')
        time.sleep(1)

        # Screenshot of tabs and cards
        shot3 = call_cdp(ws, 'Page.captureScreenshot', {'format': 'png'})
        if shot3 and 'data' in shot3:
            raw_png = base64.b64decode(shot3['data'])
            path3 = os.path.join(OUT_DIR, 'tunestream_tours_tabs_verified.png')
            with open(path3, 'wb') as f:
                f.write(raw_png)
            print(f"Saved {path3} ({len(raw_png)} bytes)", flush=True)

    finally:
        proc.terminate()

if __name__ == '__main__':
    main()
