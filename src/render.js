// Shared template renderer. The build runs it in Node (with linkedom) to
// pre-render every page to static HTML. Interactive pages also load it in the
// browser and re-render on load, which binds the click handlers.
//
// Template syntax (from the original OAZI design export):
//   {{path.to.value}}             text or attribute value
//   <sc-for list="{{xs}}" as="x"> repeat children for each item
//   <sc-if value="{{flag}}">      render children only if truthy
//   <dc-import name="Header" a="b"> render another component with props
//   onClick="{{fn}}"              event handler (browser only)
//   hint-*="..."                  design-tool hints, dropped

export class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; }
  setState(p) { Object.assign(this.state, typeof p === 'function' ? p(this.state) : p); if (this.__r) this.__r(); }
  forceUpdate() { if (this.__r) this.__r(); }
}

const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;

function getPath(scope, path) {
  path = path.trim();
  if (path === 'true') return true;
  if (path === 'false') return false;
  if (path === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
  if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
  let v = scope;
  for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; }
  return v;
}

function interp(str, scope) {
  const m = str.match(/^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/);
  if (m) return getPath(scope, m[1]);
  return str.replace(HOLE, (_, p) => { const v = getPath(scope, p); return v == null ? '' : String(v); });
}

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

let maskN = 0;
function markSVG(doc, p) {
  const v = p.variant || 'ring', size = Number(p.size || 160), c = p.color || '#16429B', ink = p.ink || '#2B2D2F';
  let s;
  if (v === 'word') {
    const w = Math.round(size * 246 / 80);
    s = `<svg viewBox="0 0 246 80" width="${w}" height="${size}" role="img" aria-label="OAZI"><circle cx="38" cy="40" r="28.5" fill="none" stroke="${ink}" stroke-width="13"/><polygon points="82,74 106,6 122,6 146,74 132,74 114,22 96,74" fill="${ink}"/><polygon points="158,6 214,6 214,18 174,62 214,62 214,74 158,74 158,62 198,18 158,18" fill="${ink}"/><rect x="228" y="6" width="13" height="68" fill="${ink}"/></svg>`;
  } else if (v === 'lens') {
    const id = 'lens' + (++maskN);
    s = `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="OAZI mark"><defs><mask id="${id}"><rect width="120" height="120" fill="#fff"/><circle cx="60" cy="60" r="41" fill="none" stroke="#000" stroke-width="3.5"/><path d="M 41 88 L 60 44 L 79 88" fill="none" stroke="#000" stroke-width="13"/></mask></defs><circle cx="60" cy="60" r="52" fill="${c}" mask="url(#${id})"/></svg>`;
  } else {
    s = `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="OAZI mark"><path d="M 78.6 99.9 A 44 44 0 1 1 101.35 75.05" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round"/><path d="M 43 84 L 60 46 L 77 84" fill="none" stroke="${ink}" stroke-width="12"/><circle cx="102.4" cy="102.4" r="8" fill="${c}"/></svg>`;
  }
  const span = doc.createElement('span');
  span.setAttribute('style', 'display:inline-flex;line-height:0');
  span.innerHTML = s;
  return span;
}

// comps: { Name: { tpl: string, logic: (DCLogic) => class } }
// routes: { 'About.dc.html': '/about/', ... } rewrites design-file links to real URLs.
export function createRenderer(doc, comps, routes = {}) {
  const parsed = {};
  for (const name in comps) {
    const t = doc.createElement('template');
    t.innerHTML = comps[name].tpl;
    parsed[name] = { root: t.content, Cls: comps[name].logic ? comps[name].logic(DCLogic) : null };
  }

  function renderComponent(name, props, out) {
    const def = parsed[name];
    if (!def) throw new Error(`Unknown component: ${name}`);
    const inst = def.Cls ? new def.Cls(props) : null;
    const vals = inst && inst.renderVals ? inst.renderVals() : {};
    for (const ch of def.root.childNodes) render(ch, vals, out);
  }

  function render(node, scope, out) {
    if (node.nodeType === 3) {
      out.appendChild(doc.createTextNode(node.data.replace(HOLE, (_, p) => { const v = getPath(scope, p); return v == null ? '' : String(v); })));
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.localName;
    if (tag === 'sc-for') {
      const list = interp(node.getAttribute('list') || '', scope) || [];
      const as = node.getAttribute('as') || 'item';
      list.forEach((item, i) => {
        const s = Object.create(scope); s[as] = item; s.$index = i;
        for (const ch of node.childNodes) render(ch, s, out);
      });
      return;
    }
    if (tag === 'sc-if') {
      if (interp(node.getAttribute('value') || '', scope)) for (const ch of node.childNodes) render(ch, scope, out);
      return;
    }
    if (tag === 'dc-import') {
      const props = {};
      let name = '';
      for (const a of node.attributes) {
        if (a.name === 'name') { name = a.value; continue; }
        if (a.name.startsWith('hint-')) continue;
        props[camel(a.name)] = interp(a.value, scope);
      }
      if (name === 'Mark') out.appendChild(markSVG(doc, props));
      else renderComponent(name, props, out);
      return;
    }
    const el = node.namespaceURI && node.namespaceURI !== 'http://www.w3.org/1999/xhtml'
      ? doc.createElementNS(node.namespaceURI, tag) : doc.createElement(tag);
    for (const a of node.attributes) {
      if (a.name.startsWith('hint-')) continue;
      if (a.name.startsWith('on') && a.value.includes('{{')) {
        const fn = interp(a.value, scope);
        if (typeof fn === 'function') el.addEventListener(a.name.slice(2).toLowerCase(), (e) => { fn(e); });
        continue;
      }
      let v = a.value.includes('{{') ? interp(a.value, scope) : a.value;
      if (v === false || v == null) continue;
      if (a.name === 'href' && typeof v === 'string' && v.endsWith('.dc.html')) {
        v = routes[v.replace(/^.*\//, '')] || '/';
      }
      el.setAttribute(a.name, String(v));
    }
    const kids = tag === 'template' ? node.content.childNodes : node.childNodes;
    for (const ch of kids) render(ch, scope, el);
    if (tag === 'select' && el.hasAttribute('value')) el.value = el.getAttribute('value');
    out.appendChild(el);
  }

  // Renders a page into `app`. In the browser, state changes re-render it and
  // keep whatever the visitor has typed into form fields.
  // `sizes` maps image src to [width, height].
  function mount(page, app, sizes = {}) {
    const def = parsed[page];
    const inst = def.Cls ? new def.Cls({}) : null;
    const FOCUSABLE = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex]';
    const draw = () => {
      // Remember which control had keyboard focus, so a re-render keeps it.
      const active = doc.activeElement;
      const focusIdx = active && app.contains(active) ? [...app.querySelectorAll(FOCUSABLE)].indexOf(active) : -1;
      const fields = [...app.querySelectorAll('input,textarea,select')].map((x) => (x.type === 'checkbox' ? x.checked : x.value));
      const vals = inst && inst.renderVals ? inst.renderVals() : {};
      const frag = doc.createDocumentFragment();
      for (const ch of def.root.childNodes) render(ch, vals, frag);
      app.replaceChildren(frag);
      const now = app.querySelectorAll('input,textarea,select');
      if (now.length === fields.length) {
        now.forEach((x, i) => {
          if (x.type === 'hidden') return;
          if (x.type === 'checkbox') x.checked = fields[i] === true;
          else x.value = fields[i];
        });
      }
      polish(app, sizes);
      // An element marked data-focus (e.g. a confirmation panel) takes focus
      // and scrolls into view; otherwise focus returns to the same control.
      const target = app.querySelector('[data-focus]');
      if (target && target.focus) {
        target.focus({ preventScroll: true });
        if (target.scrollIntoView) target.scrollIntoView({ block: 'center' });
      } else if (focusIdx >= 0) {
        const again = app.querySelectorAll(FOCUSABLE)[focusIdx];
        if (again && again.focus) again.focus({ preventScroll: true });
      }
    };
    if (inst) inst.__r = draw;
    draw();
    return inst;
  }

  return { mount };
}

// Clean-up applied after every render, in the build and in the browser.
function polish(app, sizes) {
  // The first block after the site header is the skip link's target.
  const header = app.querySelector('header');
  const main = header && header.parentElement && header.parentElement.nextElementSibling;
  if (main && !app.querySelector('#main')) {
    if (!main.id) main.id = 'main';
    else main.insertAdjacentHTML('beforebegin', '<span id="main"></span>');
  }
  // Images: reserve their space before they load; lazy-load all but the first two.
  [...app.querySelectorAll('img')].forEach((img, i) => {
    const dim = sizes[img.getAttribute('src')];
    if (dim && !img.hasAttribute('width')) { img.setAttribute('width', dim[0]); img.setAttribute('height', dim[1]); }
    img.setAttribute('decoding', 'async');
    if (i > 1 && !img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  });
}
