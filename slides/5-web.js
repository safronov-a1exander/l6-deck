/* Л6 · блок 5: браузер — cookie, localStorage, sessionStorage, IndexedDB */
const B5 = 'Браузер';
DECK.add(
{
  block: B5, glow: 'br', pill: 'Хранилища браузера',
  title: 'Четыре места<br>в браузере',
  html: `
    <table class="tb6">
      <tr data-a="up"><th></th><th>Объём</th><th>Кто читает</th><th>Сколько живёт</th></tr>
      <tr data-a="up"><td>Cookie</td><td>около 4 КБ на одну</td><td>Сервер: уходит с каждым запросом. JS, если нет <code>HttpOnly</code></td><td>До срока, который задал сервер</td></tr>
      <tr data-a="up"><td>localStorage</td><td>5 МБ на сайт</td><td>Любой JS сайта, только строки</td><td>Пока не очистят</td></tr>
      <tr data-a="up"><td>sessionStorage</td><td>5 МБ на сайт</td><td>JS этой вкладки</td><td>До закрытия вкладки</td></tr>
      <tr data-a="up"><td>IndexedDB</td><td>гигабайты, доля диска</td><td>JS сайта, асинхронно, объекты</td><td>Пока не очистят</td></tr>
    </table>
    <p class="note" data-a="up" style="margin-top:22px">Сайт здесь значит схема, адрес и порт вместе. Источник цифр: MDN</p>`,
  notes: 'Flutter: shared_preferences пишет в localStorage, drift в OPFS или IndexedDB.',
},
{
  block: B5, glow: 'tr', pill: 'Cookie',
  title: 'Cookie едет<br>в каждом запросе',
  html: `
    <div class="ck" data-a="up">
      <div class="end">🌐 Браузер<span>хранит cookie</span></div>
      <div class="wire"><div class="ln a"></div><div class="ln b"></div>
        <div class="pk req">GET /api · Cookie: session=a8f…</div>
        <div class="pk res">Set-Cookie: …; HttpOnly</div></div>
      <div class="end">🖥️ Сервер<span>узнаёт сессию</span></div>
    </div>
    <div class="g3" style="margin-top:20px">
      <div class="card" data-a="up"><h3>HttpOnly</h3><p class="p" style="font-size:23px;margin-top:10px">JS её не видит. Украсть через XSS нельзя</p></div>
      <div class="card" data-a="up"><h3>Secure</h3><p class="p" style="font-size:23px;margin-top:10px">Только по HTTPS</p></div>
      <div class="card" data-a="up"><h3>SameSite</h3><p class="p" style="font-size:23px;margin-top:10px">Не уходит с запросами, которые начал чужой сайт</p></div>
    </div>`,
  notes: 'Cookie ставит сервер заголовком Set-Cookie. Браузер сам прикладывает её к запросам на тот же сайт.',
},
{
  block: B5, glow: 'r', pill: 'Когда что',
  title: 'Когда что брать',
  html: `
    <div class="g3">
      <div class="card" data-a="up"><h3>Вход на сайт</h3><p class="p" style="font-size:25px;line-height:35px;margin-top:12px">Cookie с <code>HttpOnly</code> и <code>Secure</code>. Её ставит сервер, наш код её не трогает</p></div>
      <div class="card" data-a="up"><h3>Настройки интерфейса</h3><p class="p" style="font-size:25px;line-height:35px;margin-top:12px"><code>localStorage</code>. Во Flutter это <code>shared_preferences</code></p></div>
      <div class="card" data-a="up"><h3>Много данных офлайн</h3><p class="p" style="font-size:25px;line-height:35px;margin-top:12px">IndexedDB или OPFS. Во Flutter это <code>drift</code> на web</p></div>
    </div>
    <div class="bridge diff" data-a="up" data-step="1" style="margin-top:34px"><b>на мобильном</b>Cookie нет в том же смысле: токен в защищённом хранилище, в заголовок кладёт интерсептор dio</div>`,
  notes: 'Интерсептор показывали на Л3: он стоит на пути каждого запроса.',
},
{
  block: B5, glow: 'tr', pill: 'Грабли',
  title: 'Где пропадают<br>данные в браузере',
  html: `
    <div class="g3">
      <div class="card" data-a="up"><h3>Новый порт</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px"><code>flutter run -d chrome</code> каждый раз берёт случайный порт. Новый порт, новый сайт, пустое хранилище</p>
        <div class="code sm" style="margin-top:18px"><pre>flutter run -d chrome --web-port 8080</pre></div></div>
      <div class="card" data-a="up"><h3>Инкогнито</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px">Хранилище пустое при каждом открытии окна. Если «не сохраняется», первым делом проверить режим окна</p></div>
      <div class="card" data-a="up"><h3>Браузер чистит сам</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px">Safari стирает всё, что записал JS, если на сайт не заходили 7 дней. Важное, что нельзя потерять, держим на сервере</p></div>
    </div>`,
  notes: 'Порт: исходник flutter_tools, флаг --web-port. Safari: блог WebKit про ITP.',
},
ask(B5, 3, 'Токен входа<br>на сайте', 'Сайт после входа получил токен сессии. Где его держать?', 2, [
  ['Cookie с HttpOnly', 'ставит сервер, JS её не видит', T('ok', 'да')],
  ['localStorage', 'кладёт наш код, читает любой JS', T('no', 'нет: XSS прочитает')],
], 'Ответ: cookie. Если на страницу попал чужой скрипт, localStorage он прочитает, HttpOnly cookie нет.'),
);
