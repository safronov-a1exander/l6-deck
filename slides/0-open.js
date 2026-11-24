/* Л6 · блок 0: обложка, план, вход.
 * ask() — вопрос залу: карточки, ответы по стрелке. */
window.ask = (block, n, title, lead, cols, items, notes) => ({
  block, glow: 'r', pill: 'Вопрос ' + n, title,
  html: `
    <div class="qhead" data-a="up"><span class="hand">✋</span><p>${lead}</p></div>
    <div class="ask c${cols}">
      ${items.map(([q, sub, a]) => `<div class="q" data-a="up"><b>${q}</b>${sub ? `<span>${sub}</span>` : ''}<div class="a" data-step="1" data-a="pop">${a}</div></div>`).join('')}
    </div>`,
  notes,
});
window.STEP = n => `<i data-step="${n}" style="display:none"></i>`;
window.T = (cls, txt) => `<span class="tag2 ${cls}">${txt}</span>`;

DECK.add(
{
  block: 'Вход', hero: true, glow: 'br', pill: 'Л6 · 24.11',
  title: 'Хранилища<br>и платформа',
  subtitle: 'Кроссплатформенная разработка · Flutter',
  html: `
    <div class="mark"><svg viewBox="0 0 25 23">
      <path style="--d:500ms" d="M3.41797 11.4751L16.317 6.1322C18.6915 5.14862 19.8191 2.4263 18.8355 0.0516636L5.93664 5.39456C3.562 6.37814 2.43439 9.10055 3.41797 11.4751Z"/>
      <path style="--d:700ms" d="M13.2544 14.9564C15.6289 13.9728 16.7566 11.2505 15.773 8.87588L2.87405 14.2188C0.499497 15.2024 -0.628112 17.9248 0.35547 20.2993L13.2544 14.9564Z"/>
      <path style="--d:900ms" d="M24.1791 12.9503L6.98047 20.0741C7.96414 22.4487 10.6865 23.5764 13.061 22.5928L21.6604 19.0308C24.035 18.0472 25.1625 15.3249 24.1791 12.9503Z"/>
    </svg></div>
    <div class="hero-meta note" data-a="up">ПИН-252т · веха В3 «Платформа»</div>`,
  notes: 'Шестая лекция, парная к Л5 Максима.',
},
{
  block: 'Вход', glow: 'tr', pill: 'Вход',
  title: 'Приложение<br>ничего не помнит',
  html: `
    <div class="split" style="grid-template-columns:1fr 1fr">
      <div class="demo" data-a="up">
        <div class="url">тег l3-network · ЛР3</div>
        <ol>
          <li>Включаем тёмную тему, жмём F5. Тема снова светлая</li>
          <li>F12 → Network → Offline, F5. Экран ошибки</li>
          <li>Избранного нет вовсе: его некуда было бы положить</li>
        </ol>
      </div>
      <div class="rule" data-a="up" data-step="1" style="align-self:center">Всё, что было в Cubit и в полях, жило в памяти вкладки. Закрыли вкладку, памяти нет</div>
    </div>`,
  notes: 'Покедекс на теге l3-network, живьём не запускаю: рассказываю по шагам.',
},
{
  block: 'Вход', glow: 'r', pill: 'Вопрос пары',
  title: 'Куда класть данные,<br>чтобы они остались',
  html: `
    <p class="lead" data-a="up">И какие данные куда: настройки, кэш, токены, большие каталоги</p>
    <div class="bridge same" data-a="up" style="margin-top:40px"><b>как у Максима</b>На Л5: источник правды это хранилище на устройстве, сеть его обновляет. Граница «ключ-значение или таблицы» та же</div>
    <div class="bridge diff" data-a="up" style="margin-top:22px"><b>нового</b>Безопасность, браузер, основы таблиц, как Flutter ходит в натив</div>
    <p class="note" data-a="up" data-step="1" style="margin-top:36px">✋ Поднимите руку, кто на ПЗ5 или в ЛР5 делал офлайн</p>`,
  notes: 'Спросить про ПЗ5 и ЛР5. Если рук много, блок про кэш проходим быстрее.',
},
{
  block: 'Вход', glow: 'tr', pill: 'План',
  title: 'План',
  html: `
    <div class="g4" style="gap:22px">
      <div class="card" data-a="up"><h3>1 · Для ЛР6</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px">Какие бывают хранилища, <code>shared_preferences</code>, кэш и избранное в приложении</p></div>
      <div class="card" data-a="up"><h3>2 · Что где хранить</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px">Безопасность, защищённое хранилище, браузер: cookie, localStorage, IndexedDB</p></div>
      <div class="card" data-a="up"><h3>3 · Таблицы</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px">Ключи и связи, правила построения, SQLite через <code>sqflite</code> и <code>drift</code></p></div>
      <div class="card" data-a="up"><h3>4 · Платформа</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px">Как плагин доходит до платформы, экспорт файла, два таргета и адаптив для ЛР6</p></div>
    </div>`,
  notes: 'Первая часть закрывает ЛР6. Дальше по порядку, сколько успеем.',
},
);
