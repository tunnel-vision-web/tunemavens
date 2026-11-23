// Resilient multi-app static and API reverse-proxy server for TuneMavens frontends
// Runs without native C++/Rust binary dependencies, unaffected by Windows Smart App Control
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.on('uncaughtException', (err) => {
  console.error('[Global Exception Guard]', err?.stack || err?.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Global Rejection Guard]', reason);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4'
};

function proxyRequest(req, res, targetPort) {
  const options = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${targetPort}`
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    if (res.writableEnded) return;
    try {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    } catch (e) {
      console.warn(`[Proxy Stream Pipe Warning]`, e.message);
    }
  });

  proxyReq.on('error', (err) => {
    console.error(`[Proxy Error] 127.0.0.1:${targetPort}${req.url} -> ${err.message}`);
    if (!res.headersSent && !res.writableEnded) {
      try {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad Gateway', details: err.message }));
      } catch (_) {}
    }
  });

  req.on('error', () => {
    try { proxyReq.destroy(); } catch (_) {}
  });

  res.on('error', () => {
    try { proxyReq.destroy(); } catch (_) {}
  });

  req.pipe(proxyReq, { end: true });
}

function createAppServer(appName, distPath, port, proxyPrefixes, targetPort = 8001) {
  const server = http.createServer((req, res) => {
    try {
      let pathname = '/';
      try {
        const parsedUrl = new URL(req.url, `http://localhost:${port}`);
        pathname = decodeURIComponent(parsedUrl.pathname);
      } catch (_) {
        pathname = req.url.split('?')[0];
      }

      // Check proxy paths
      const shouldProxy = proxyPrefixes.some(prefix => pathname.startsWith(prefix));
      if (shouldProxy) {
        return proxyRequest(req, res, targetPort);
      }

      // Serve static files from dist
      let filePath = path.join(distPath, pathname);

      // Check if filePath is a directory, if so look for index.html
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      // If file doesn't exist, SPA fallback to dist/index.html
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        filePath = path.join(distPath, 'index.html');
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
        });
        const stream = fs.createReadStream(filePath);
        stream.on('error', (err) => {
          if (!res.headersSent && !res.writableEnded) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('File read error');
          }
        });
        stream.pipe(res);
      } else {
        if (!res.headersSent && !res.writableEnded) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
      }
    } catch (handlerErr) {
      console.error(`[${appName} Handler Error]`, handlerErr);
      if (!res.headersSent && !res.writableEnded) {
        try {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } catch (_) {}
      }
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`[${appName}] Serving on http://localhost:${port} -> dist: ${distPath}`);
  });

  server.on('error', (err) => {
    console.error(`[${appName}] Server socket error on port ${port}:`, err.message);
  });

  return server;
}

// 1. Portal (3000)
createAppServer(
  'Portal',
  path.join(root, 'apps', 'portal', 'dist'),
  3000,
  ['/api', '/uploads', '/heroes', '/headers'],
  8001
);

// 2. TuneStream (3001)
createAppServer(
  'TuneStream',
  path.join(root, 'apps', 'tunestream', 'dist'),
  3001,
  ['/api', '/uploads', '/heroes', '/headers'],
  8001
);

// 3. SyncMavens (3002)
createAppServer(
  'SyncMavens',
  path.join(root, 'apps', 'syncmavens', 'dist'),
  3002,
  ['/api', '/uploads'],
  8001
);
