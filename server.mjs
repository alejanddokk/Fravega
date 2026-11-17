import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const publicFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/shop.css', ['shop.css', 'text/css; charset=utf-8']],
  ['/main.mjs', ['main.mjs', 'text/javascript; charset=utf-8']],
  ['/shop.mjs', ['shop.mjs', 'text/javascript; charset=utf-8']],
  ['/motion.mjs', ['motion.mjs', 'text/javascript; charset=utf-8']],
  ['/gallery.css', ['gallery.css', 'text/css; charset=utf-8']],
  ['/gallery.mjs', ['gallery.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/hero.jpg', ['assets/hero.jpg', 'image/jpeg']],
  ['/assets/products.jpg', ['assets/products.jpg', 'image/jpeg']],
  ['/assets/favicon.png', ['assets/favicon.png', 'image/png']],
  ['/assets/scene-tv.jpg', ['assets/scene-tv.jpg', 'image/jpeg']],
  ['/assets/scene-kitchen.jpg', ['assets/scene-kitchen.jpg', 'image/jpeg']],
]);

const host = '127.0.0.1';
const port = Number(process.env.PORT ?? 4173);
createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const file = publicFiles.get(request.url.split('?')[0]);
  if (!file) {
    response.writeHead(404).end();
    return;
  }

  const [path, type] = file;
  try {
    const data = await readFile(new URL(path, import.meta.url));
    response.writeHead(200, { 'Content-Type': type, 'Content-Length': data.length });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end();
  }
}).listen(port, host, () => console.log(`Frávega · http://${host}:${port}`));
