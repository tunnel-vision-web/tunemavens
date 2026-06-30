import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // Sandbox: allow all hosts so the Emergent edge proxy can reach Vite
    // regardless of which internal hostname it uses (`*.emergentcf.cloud`,
    // `*.preview.emergentagent.com`, custom domains, etc).
    allowedHosts: true,
    hmr: {
      // The preview hits us over HTTPS through the Emergent ingress, but
      // HMR's default ws:// websocket can't reach back through the proxy.
      // Disable HMR for the preview; full reloads still work.
      clientPort: 443,
      protocol: 'wss',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
})
