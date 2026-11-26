// Builds the site into dist/:
//   1. pre-renders every page in src/site.config.js to static HTML,
//   2. writes a small browser bundle for interactive pages,
//   3. copies public/ and writes sitemap.xml, robots.txt and the favicon.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseHTML } from 'linkedom';
import { createRenderer } from '../src/render.js';
import { SITE, PAGES, ROUTES } from '../src/site.config.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const COMP_DIR = path.join(SRC, 'components');
const OUT = path.join(ROOT, 'dist');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// ---------- components ----------
const names = fs.readdirSync(COMP_DIR).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5));
const comps = {};
for (const name of names) {
  const tpl = fs.readFileSync(path.join(COMP_DIR, `${name}.html`), 'utf8').replaceAll('{{signInUrl}}', SITE.signInUrl);
  const jsFile = path.join(COMP_DIR, `${name}.js`);
  const cssFile = path.join(COMP_DIR, `${name}.css`);
  comps[name] = {
    tpl,
    logic: fs.existsSync(jsFile) ? (await import(pathToFileURL(jsFile).href)).default : null,
    css: fs.existsSync(cssFile) ? fs.readFileSync(cssFile, 'utf8') : '',
  };
}

// Components a page needs, following <dc-import name="...">.
function deps(name, seen = new Set()) {
  if (seen.has(name) || !comps[name]) return seen;
  seen.add(name);
  for (const m of comps[name].tpl.matchAll(/<dc-import\s+name="([A-Za-z]+)"/g)) deps(m[1], seen);
  return seen;
}

// ---------- image sizes, so the browser reserves space before images load ----------
const PUBLIC = path.join(ROOT, 'public');
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}
const sizeCache = {};
const SIZES = {};
for (const f of fs.readdirSync(path.join(PUBLIC, 'img'))) {
  const dim = imageSize(path.join(PUBLIC, 'img', f));
  if (dim) SIZES[`/img/${f}`] = dim;
}

// ---------- page shell ----------
function shell(page, body, script) {
  const canonical = SITE.url + (page.path === '/404.html' ? '/' : page.path);
  const css = [...deps(page.component)].map((n) => comps[n].css).filter(Boolean);
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.path === '/404.html' ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}${SITE.ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1C1A19">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css">
<style>${[...new Set(css)].join('\n')}</style>
${script ? `<script type="module" src="${script}"></script>` : ''}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div id="app">${body}</div>
</body>
</html>
`;
}

// ---------- build ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(PUBLIC, OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'js', 'c'), { recursive: true });
fs.copyFileSync(path.join(SRC, 'render.js'), path.join(OUT, 'js', 'render.js'));

for (const page of PAGES) {
  const { document } = parseHTML('<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>');
  const app = document.getElementById('app');
  createRenderer(document, comps, ROUTES).mount(page.component, app, SIZES);

  let script = null;
  if (page.interactive) {
    const need = [...deps(page.component)];
    const lines = [`import { createRenderer } from '/js/render.js';`];
    const entries = [];
    for (const n of need) {
      if (comps[n].logic) {
        fs.copyFileSync(path.join(COMP_DIR, `${n}.js`), path.join(OUT, 'js', 'c', `${n}.js`));
        lines.push(`import ${n} from '/js/c/${n}.js';`);
      }
      entries.push(`  ${n}: { tpl: ${JSON.stringify(comps[n].tpl)}, logic: ${comps[n].logic ? n : 'null'} }`);
    }
    lines.push(`const comps = {\n${entries.join(',\n')}\n};`);
    lines.push(`const sizes = ${JSON.stringify(SIZES)};`);
    lines.push(`createRenderer(document, comps, ${JSON.stringify(ROUTES)}).mount(${JSON.stringify(page.component)}, document.getElementById('app'), sizes);`);
    script = `/js/${page.component.toLowerCase()}.js`;
    fs.writeFileSync(path.join(OUT, script), lines.join('\n') + '\n');
  }

  const file = page.path.endsWith('.html') ? page.path : path.posix.join(page.path, 'index.html');
  fs.mkdirSync(path.dirname(path.join(OUT, file)), { recursive: true });
  fs.writeFileSync(path.join(OUT, file), shell(page, app.innerHTML, script));
  console.log(`  ${file}`);
}

// ---------- sitemap, robots, favicon ----------
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.filter((p) => p.sitemap !== false).map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="#F4EFE9"/><path d="M 78.6 99.9 A 44 44 0 1 1 101.35 75.05" fill="none" stroke="#C1832A" stroke-width="14" stroke-linecap="round"/><path d="M 43 84 L 60 46 L 77 84" fill="none" stroke="#1C1A19" stroke-width="12"/><circle cx="102.4" cy="102.4" r="8" fill="#C1832A"/></svg>\n`);

console.log(`Built ${PAGES.length} pages into dist/`);
