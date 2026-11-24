/* Deck engine: scaling, navigation, steps, animations. Slides register via DECK.add(). */
const DECK = {
  slides: [],
  add(...s) { this.slides.push(...s); },
};

(() => {
  const W = 1920, H = 1080; // 16:9 — TVs, monitors, projectors. For 16:10 use 1241 here and in css/deck.css .stage
  // ?final — every step shown, no animation, no enter(): static pages for PDF and screenshots (scripts/build-pdf.sh)
  const FINAL = new URLSearchParams(location.search).has('final');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let stage, els = [], cur = -1, step = 0;

  function splitTitle(el) {
    let n = 0;
    const walk = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('i'); i.textContent = part;
            i.style.setProperty('--d', (n++ * 70 + 150) + 'ms');
            w.append(i); frag.append(w);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
      });
    };
    walk(el);
    return n;
  }

  function build(s, idx) {
    const sec = document.createElement('section');
    sec.className = 'slide' + (s.tab ? ' has-tab' : '') + (s.hero ? ' hero' : '') + (!s.pill && !s.tab ? ' no-pill' : '') + (s.cls ? ' ' + s.cls : '');
    const head = s.tab ? `<div class="tab">${s.tab}</div>` : '';
    const pill = s.pill ? `<div class="pill${s.hero ? ' pill--fill' : ''}" data-a="left">${s.pill}</div>` : '';
    const title = s.title ? `<h2 class="title${s.hero ? ' title--hero' : ''}">${s.title}</h2>` : '';
    const sub = s.subtitle ? `<div class="subtitle" data-a="up">${s.subtitle}</div>` : '';
    sec.innerHTML = `${head}${s.logo === false ? '' : '<img class="logo" data-a="fade" src="assets/logo-white.svg" alt="effective">'}
      <div class="inner">${pill}${title}${sub}<div class="body">${s.html || ''}</div></div>`;
    const t = $('.title', sec);
    // longest title line in characters → CSS can shrink long titles instead of letting them overflow
    if (t) t.style.setProperty('--tc', Math.max(1, ...(s.title || '').split(/<br\s*\/?>/i).map(l => l.replace(/<[^>]+>/g, '').trim().length)));
    const words = t ? splitTitle(t) : 0;
    // auto stagger for non-step animated elements
    let d = 250 + words * 70;
    $$('[data-a]:not([data-step]), [data-draw]:not([data-step])', $('.body', sec)).forEach(e => {
      if (!e.style.getPropertyValue('--d')) { e.style.setProperty('--d', d + 'ms'); d += +(e.dataset.gap || 90); }
    });
    sec._steps = Math.max(0, ...$$('[data-step]', sec).map(e => +e.dataset.step));
    return sec;
  }

  function sparks() {
    const bg = $('.bg', stage);
    for (let i = 0; i < 16; i++) {
      const sp = document.createElement('i'); sp.className = 'spark';
      sp.style.left = (55 + Math.random() * 45) + '%';
      sp.style.top = (35 + Math.random() * 65) + '%';
      const k = .5 + Math.random();
      sp.style.width = sp.style.height = (10 + 14 * k) + 'px';
      sp.style.setProperty('--t', (3 + Math.random() * 4) + 's');
      sp.style.setProperty('--dl', (Math.random() * 5) + 's');
      bg.append(sp);
    }
  }

  function countUp(el) {
    const to = parseFloat(el.dataset.count.replace(',', '.'));
    const dec = (el.dataset.count.split(/[.,]/)[1] || '').length;
    const pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (FINAL) { el.textContent = pre + to.toFixed(dec).replace('.', ',') + suf; return; }
    const t0 = performance.now(), dur = +(el.dataset.dur || 1600);
    const tick = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = pre + (to * e).toFixed(dec).replace('.', ',') + suf;
      if (k < 1) el._raf = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(el._raf); el._raf = requestAnimationFrame(tick);
  }

  function reveal(sec, upto) {
    $$('[data-step]', sec).forEach(e => {
      const on = +e.dataset.step <= upto;
      if (on && !e.classList.contains('in')) {
        e.classList.add('in');
        $$('[data-count]', e).concat(e.dataset.count ? [e] : []).forEach(countUp);
        e.dispatchEvent(new CustomEvent('reveal', { bubbles: true }));
      }
      if (!on) e.classList.remove('in');
    });
    const s = DECK.slides[els.indexOf(sec)];
    s.onStep && s.onStep(sec, upto);
  }

  function go(i, st = 0) {
    i = Math.max(0, Math.min(els.length - 1, i));
    const prev = els[cur], sec = els[i], s = DECK.slides[i];
    if (prev && prev !== sec) {
      prev.classList.remove('active', 'play');
      const p = prev;
      setTimeout(() => { if (!p.classList.contains('active')) $$('.in', p).forEach(e => e.classList.remove('in')); }, 800);
      DECK.slides[cur].leave && DECK.slides[cur].leave(prev);
    }
    els.forEach((e, k) => e.classList.toggle('past', k < i));
    stage.dataset.glow = s.glow || 'br';
    const fresh = cur !== i;
    cur = i; step = FINAL ? sec._steps : st;
    sec.classList.add('active');
    if (fresh) {
      setTimeout(() => (() => {
        sec.classList.add('play');
        $$('[data-a]:not([data-step]), [data-draw]:not([data-step])', sec).forEach(e => e.classList.add('in'));
        $$('[data-count]', sec).filter(e => !e.closest('[data-step]')).forEach(e => setTimeout(() => countUp(e), parseInt(getComputedStyle(e).getPropertyValue('--d')) || 400));
        if (!FINAL && s.enter) s.enter(sec, API);
      })(), 40);
    }
    reveal(sec, step);
    $('.progress', stage).style.setProperty('--p', ((i + 1) / els.length * 100) + '%');
    $('.hud', stage).innerHTML = `<span>${String(i + 1).padStart(2, '0')} / ${els.length}</span><span class="blk">${s.block || ''}</span>`;
    $('.notes').innerHTML = `<b>${i + 1}. ${(s.title || '').replace(/<[^>]+>/g, ' ')}</b><br>${s.notes || '—'}`;
    history.replaceState(null, '', '#' + (i + 1));
    $$('.menu a').forEach((a, k) => a.classList.toggle('cur', k === i));
  }

  const next = () => { const sec = els[cur]; if (step < sec._steps) { step++; reveal(sec, step); } else if (cur < els.length - 1) go(cur + 1); };
  const prev = () => { const sec = els[cur]; if (step > 0) { step--; reveal(sec, step); } else if (cur > 0) go(cur - 1, els[cur - 1]._steps); };
  const API = { next, prev, go, countUp, $, $$ };
  DECK.api = API;

  function fit() {
    const k = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `scale(${k}) translate(-50%, -50%)`;
  }

  window.addEventListener('DOMContentLoaded', () => {
    stage = $('.stage');
    sparks();
    els = DECK.slides.map(build);
    document.documentElement.classList.toggle('final', FINAL);
    document.documentElement.dataset.slides = els.length;
    els.forEach(e => stage.append(e));
    const menu = $('.menu');
    menu.innerHTML = DECK.slides.map((s, k) => `<a href="#${k + 1}"><span>${k + 1}</span>${(s.title || s.pill || '').replace(/<[^>]+>/g, ' ')}</a>`).join('');
    menu.addEventListener('click', e => { const a = e.target.closest('a'); if (a) { e.preventDefault(); menu.classList.remove('on'); go(+a.getAttribute('href').slice(1) - 1); } });
    fit(); addEventListener('resize', fit);
    let buf = '';
    addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k) && !(k === 'Enter' && buf)) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
      else if (k === 'Home') go(0);
      else if (k === 'End') go(els.length - 1);
      else if (k === 'n' || k === 'т') $('.notes').classList.toggle('on');
      else if (k === 'm' || k === 'ь') menu.classList.toggle('on');
      else if (k === 'f' || k === 'а') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
      else if (k === 'Escape') { menu.classList.remove('on'); }
      if (/^\d$/.test(k)) { buf += k; clearTimeout(buf._t); setTimeout(() => (buf = ''), 1500); }
      if (k === 'Enter' && buf) { go(+buf - 1); buf = ''; }
    });
    const h = parseInt(location.hash.slice(1));
    go(h ? h - 1 : 0);
  });
})();
