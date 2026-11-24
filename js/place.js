/* Place floating objects into the free space of each slide and shrink them to fit, instead of hiding them:
   - the hero logo mark (.mark);
   - the style's background decoration (theme vars --deco, --deco-w/-h, --deco-min, --deco-bleed, --deco-flip, --deco-skip).
   Content boxes are measured with animations frozen; candidates are corners/edges (order follows the slide's `glow`),
   sizes go from 100 % down to the minimum. An object is hidden only if it does not fit even at the minimum size.
   Load right after js/engine.js; DECK.place() re-runs it after changing slides. */
(() => {
  let W = 1920, H = 1080; // read from the stage in place()
  const PAD = 36;
  const BLOCKS = 'img,svg,canvas,video,iframe,table,.card,.tcard,.photo,.shot,.qr,.stripe,.pill,.tab,.logo,.circle,.term,.tag';
  const ANCHOR = {
    br: (w, h, b) => [W - w * (1 - b), H - h * (1 - b)],
    r: (w, h, b) => [W - w * (1 - b), (H - h) / 2],
    tr: (w, h, b) => [W - w * (1 - b), -h * b],
    bc: (w, h, b) => [(W - w) / 2, H - h * (1 - b)],
    bl: (w, h, b) => [-w * b, H - h * (1 - b)],
    tc: (w, h, b) => [(W - w) / 2, -h * b],
    l: (w, h, b) => [-w * b, (H - h) / 2],
  };
  const ORDER = { br: ['br', 'r', 'tr', 'bc', 'bl', 'tc', 'l'], tr: ['tr', 'r', 'br', 'tc', 'bl', 'bc', 'l'], r: ['r', 'br', 'tr', 'bc', 'bl', 'tc', 'l'], c: ['bc', 'br', 'bl', 'r', 'tr', 'tc', 'l'] };
  const hit = (a, b) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;

  function obstacles(sec, toStage, skip) {
    const out = [];
    const add = r => { if (r.width && r.height) { const b = toStage(r); out.push({ x1: b.x1 - PAD, y1: b.y1 - PAD, x2: b.x2 + PAD, y2: b.y2 + PAD }); } };
    sec.querySelectorAll('.inner *, :scope > .logo, :scope > .tab').forEach(e => {
      if (skip.some(s => s.contains(e)) || e.closest('.ghost,.pixels,.tpl')) return;
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      if (e.matches(BLOCKS)) { if (!e.closest('svg') || e.matches('svg')) add(e.getBoundingClientRect()); return; }
      for (const n of e.childNodes) if (n.nodeType === 3 && n.textContent.trim()) {
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const r of rg.getClientRects()) add(r);
      }
    });
    out.push({ x1: 0, y1: H - 90, x2: 760, y2: H }); // HUD: slide number and block name
    return out;
  }

  // m: margin from the stage edge (0 for decoration that may touch or bleed; ~110 for content like a QR card)
  function fit(obs, w0, h0, min, bleed, anchors, m = 0) {
    for (let s = 1; s >= min - 1e-6; s *= 0.9) {
      const w = w0 * s, h = h0 * s;
      for (const a of anchors) {
        let [x, y] = ANCHOR[a](w, h, bleed);
        if (a === 'br' || a === 'r' || a === 'tr') x -= m;
        if (a === 'bl') x += m;
        if (a === 'br' || a === 'bc' || a === 'bl') y -= m;
        if (a === 'tr') y += m;
        const r = { x1: x, y1: y, x2: x + w, y2: y + h };
        if (!obs.some(o => hit(o, r))) return { a, x, y, w, h, r };
      }
    }
    return null;
  }

  function place() {
    const stage = document.querySelector('.stage');
    if (!stage) return;
    W = stage.offsetWidth; H = stage.offsetHeight;
    const root = document.documentElement;
    root.classList.add('placing');
    const s0 = stage.getBoundingClientRect(), k = s0.width / W;
    const toStage = r => ({ x1: (r.left - s0.left) / k, y1: (r.top - s0.top) / k, x2: (r.right - s0.left) / k, y2: (r.bottom - s0.top) / k });
    const cs = getComputedStyle(stage), num = (n, d) => { const v = parseFloat(cs.getPropertyValue(n)); return Number.isNaN(v) ? d : v; };
    const deco = cs.getPropertyValue('--deco').trim();
    const skipCls = cs.getPropertyValue('--deco-skip').split(',').map(x => x.trim()).filter(Boolean);

    [...stage.querySelectorAll(':scope > section.slide')].forEach((sec, i) => {
      const s = DECK.slides[i] || {};
      const taken = [];

      const mark = sec.querySelector('.mark');
      if (mark) {
        if (mark.parentElement !== sec) sec.append(mark);
        const f = fit(obstacles(sec, toStage, [mark]), 600, 552, 0.35, 0.06, ['br', 'r', 'bc', 'tr']);
        mark.hidden = !f;
        if (f) { Object.assign(mark.style, { position: 'absolute', right: 'auto', left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.h + 'px' }); taken.push(f.r); }
      }

      // any element marked data-place="br,r,bc" (optional data-min, data-margin): same search, keeps its aspect ratio
      sec.querySelectorAll('[data-place]').forEach(el => {
        if (!el._size) { const r0 = el.getBoundingClientRect(); el._size = [r0.width / k, r0.height / k]; }
        if (el.parentElement !== sec) sec.append(el);
        const anchors = el.dataset.place.split(',').map(x => x.trim()).filter(a => ANCHOR[a]);
        const f = fit(obstacles(sec, toStage, [el]).concat(taken), el._size[0], el._size[1], parseFloat(el.dataset.min || 0.5), 0,
          anchors.length ? anchors : ['br'], parseFloat(el.dataset.margin || 110));
        el.hidden = !f;
        if (f) { Object.assign(el.style, { position: 'absolute', right: 'auto', bottom: 'auto', left: f.x + 'px', top: f.y + 'px', width: f.w + 'px' }); taken.push(f.r); }
      });

      if (deco && deco !== 'none' && !skipCls.some(c => sec.classList.contains(c))) {
        let d = sec.querySelector(':scope > .deco-layer');
        if (!d) { d = document.createElement('div'); d.className = 'deco-layer'; sec.prepend(d); }
        const f = fit(obstacles(sec, toStage, [d]).concat(taken), num('--deco-w', 500), num('--deco-h', 500), num('--deco-min', 0.35), num('--deco-bleed', 0), ORDER[s.glow] || ORDER.br);
        d.hidden = !f;
        if (f) {
          const flip = num('--deco-flip', 0) === 1;
          const sx = flip && (f.a === 'bl' || f.a === 'bc') ? -1 : 1, sy = flip && f.a === 'tr' ? -1 : 1;
          Object.assign(d.style, { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.h + 'px', scale: `${sx} ${sy}` });
          d.dataset.anchor = f.a;
        }
      }
    });
    root.classList.remove('placing');
  }

  DECK.place = place;
  // place() is idempotent: run after fonts are ready and again on load (late images/fonts change the layout).
  // setTimeout, not requestAnimationFrame: rAF may not fire in background tabs or automation.
  addEventListener('DOMContentLoaded', () => document.fonts.ready.then(() => setTimeout(place, 0)));
  addEventListener('load', () => setTimeout(place, 0));
})();
