import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Small Vite plugin that neuters the dev-server client script. In this
// sandbox the Emergent HTTPS tunnel drops idle websockets every 30–60s;
// the Vite client's `polling-for-restart` reconnect then triggers a full
// `location.reload()`. Serving an empty `/@vite/client` module removes
// both the websocket and the auto-reload behaviour. Manual browser
// refresh still picks up new code.
function killViteClient() {
  return {
    name: 'kill-vite-client',
    configureServer(server) {
      server.middlewares.use('/@vite/client', (_req, res) => {
        res.setHeader('Content-Type', 'application/javascript')
        // Stub Vite client — provides all exports Vite injects into user
        // modules (createHotContext etc.) but opens NO websocket. This
        // avoids the tunnel-drop → auto-reload loop.
        res.end(`
const noop = () => {};
const hotStub = {
  get data() { return {}; },
  accept: noop, acceptExports: noop, dispose: noop, prune: noop,
  decline: noop, invalidate: noop, on: noop, off: noop, send: noop
};
export const createHotContext = () => hotStub;
export const updateStyle = (id, content) => {
  let style = document.querySelector('style[data-vite-dev-id="' + id + '"]');
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    document.head.appendChild(style);
  }
  style.textContent = content;
};
export const removeStyle = (id) => {
  const style = document.querySelector('style[data-vite-dev-id="' + id + '"]');
  if (style) style.remove();
};
export const injectQuery = (url, q) => url;
export const ErrorOverlay = class HTMLElement {};
`)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), killViteClient()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // Sandbox: allow all hosts so the Emergent edge proxy can reach Vite
    // regardless of which internal hostname it uses.
    allowedHosts: true,
    hmr: false,
    watch: {
      usePolling: false,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/backend/**',
        '**/dist/**',
        '**/__pycache__/**',
      ],
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
})
