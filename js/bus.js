/* Связь колоды с окном ведущего (presenter.html): номер слайда туда, стрелки оттуда. */
(() => {
  const bus = 'BroadcastChannel' in window ? new BroadcastChannel('l6-deck') : null;
  if (!bus) return;
  const all = () => [...document.querySelectorAll('.stage > .slide')];
  function changed() {
    const i = all().findIndex(s => s.classList.contains('active'));
    if (i >= 0) bus.postMessage({ type: 'slide', i, total: all().length });
  }
  window.addEventListener('DOMContentLoaded', () => {
    const stage = document.querySelector('.stage');
    new MutationObserver(ms => { if (ms.some(m => m.target.classList && m.target.classList.contains('slide'))) changed(); })
      .observe(stage, { subtree: true, attributes: true, attributeFilter: ['class'] });
    setTimeout(changed, 300);
    bus.onmessage = e => {
      const m = e.data || {};
      if (m.type === 'next') DECK.api.next();
      else if (m.type === 'prev') DECK.api.prev();
      else if (m.type === 'go') DECK.api.go(m.i);
      else if (m.type === 'hello') changed();
    };
  });
})();
