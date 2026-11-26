// Local preview of dist/. Behaves like Netlify for what this site uses:
// clean URLs, the 404 page, and form posts (logged here instead of stored).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT || 4321);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e5) req.destroy(); });
    req.on('end', () => {
      const fields = Object.fromEntries(new URLSearchParams(body));
      console.log(`[form] ${fields['form-name'] || '(no form-name)'}`, JSON.stringify(fields));
      res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
    });
    return;
  }

  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!file.startsWith(DIST)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) && fs.existsSync(path.join(file + '/index.html'))) {
    return res.writeHead(301, { Location: url.pathname + '/' }).end();
  }
  const found = fs.existsSync(file);
  const target = found ? file : path.join(DIST, '404.html');
  res.writeHead(found ? 200 : 404, { 'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
}).listen(PORT, () => console.log(`OAZI IMAGERY preview on http://localhost:${PORT}`));
