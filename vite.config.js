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
    // HMR is disabled in the sandbox. The Emergent ingress does not tunnel
    // the Vite websocket cleanly, so with HMR on the client keeps losing its
    // dev-server connection and Vite auto-refreshes the page every few
    // seconds. Manual browser refresh still picks up new code.
    hmr: false,
    // Also stop the built-in file watcher from cycling on things like
    // background pyc writes / editor swap files that occasionally touch
    // /app while a review is in progress.
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
