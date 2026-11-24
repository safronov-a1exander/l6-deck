/* Л6 · блок 4: безопасность, flutter_secure_storage, вопрос «куда положить» */
const B4 = 'Безопасность';
DECK.add(
{
  block: B4, glow: 'br', pill: 'Открытый текст',
  title: 'shared_preferences<br>не шифрует',
  html: `
    <div class="who2">
      <div class="card" data-a="up"><h3>Android</h3><p class="w">Приложение с правами root</p><p class="w">Резервная копия, если её не выключили</p></div>
      <div class="card" data-a="up"><h3>iOS</h3><p class="w">Резервная копия устройства на компьютере</p></div>
      <div class="card" data-a="up"><h3>Браузер</h3><p class="w">Любой скрипт на странице, в том числе чужой, если сайт пропустил XSS</p><p class="w">Человек с F12</p></div>
      <div class="card" data-a="up"><h3>Desktop</h3><p class="w">Любой, кто откроет JSON-файл в профиле пользователя</p></div>
    </div>
    <p class="lead dotline" data-a="up" data-step="1" style="margin-top:36px;font-size:32px;line-height:44px">Тема и избранное здесь нормально. Токены, пароли и PIN сюда не кладём</p>`,
  notes: 'XSS: на страницу попал чужой скрипт. Он видит всё, что видит наш JS.',
},
{
  block: B4, glow: 'tr', pill: 'Защищённое',
  title: 'flutter_secure_storage',
  subtitle: 'Тот же «ключ → строка», но значение зашифровано ключом, который хранит система',
  html: `
    <div class="split" style="grid-template-columns:1fr 1fr">
      <div class="code sm" data-a="up"><span class="cap">API</span><pre><span class="k">const</span> storage = <span class="t">FlutterSecureStorage</span>();

<span class="k">await</span> storage.write(key: <span class="s">'refresh_token'</span>, value: t);
<span class="k">final</span> t = <span class="k">await</span> storage.read(key: <span class="s">'refresh_token'</span>);
<span class="k">await</span> storage.delete(key: <span class="s">'refresh_token'</span>);
<span class="k">await</span> storage.deleteAll();   <span class="c">// при выходе</span></pre></div>
      <table class="mx" data-a="up">
        <tr><td>iOS, macOS</td><td>Keychain</td></tr>
        <tr><td>Android</td><td>AES, ключ в Keystore</td></tr>
        <tr><td>Windows</td><td>AES, ключ в Credential Manager</td></tr>
        <tr><td>Linux</td><td>libsecret, нужен keyring</td></tr>
        <tr class="hot"><td>Браузер</td><td>экспериментально: WebCrypto, всё лежит в localStorage</td></tr>
      </table>
    </div>
    <p class="note" data-a="up" data-step="1" style="margin-top:26px">Все методы через <code>await</code>. Версия 11.2.0, источник: README пакета</p>`,
  notes: 'В браузере ключ шифрования лежит в том же браузере. Скрипт на странице расшифрует так же, как наш код.',
},
{
  block: B4, glow: 'r', pill: 'Правила',
  title: 'Что где хранить',
  html: `
    <table class="tb6">
      <tr data-a="up"><th>Данные</th><th>Куда</th></tr>
      <tr data-a="up"><td>Пароль пользователя</td><td>Никуда. Отдали серверу, получили токен</td></tr>
      <tr data-a="up"><td>Токены входа</td><td>Защищённое хранилище. В браузере лучше cookie с <code>HttpOnly</code>, дальше в лекции</td></tr>
      <tr data-a="up"><td>PIN-код</td><td>Защищённое хранилище, и не сам PIN, а его хэш</td></tr>
      <tr data-a="up"><td>Ключ платного API</td><td>Не в приложении. Всё, что вы отдали пользователю, вы отдали всем</td></tr>
      <tr data-a="up"><td>Тема, язык, избранное, кэш</td><td><code>shared_preferences</code> или база</td></tr>
    </table>
    <p class="note" data-a="up" data-step="1" style="margin-top:26px">Обфускация переименовывает классы и методы. Она не шифрует строки и картинки в сборке</p>`,
  notes: 'Ключ в клиенте — ключ в открытом репозитории, это правило из контракта курса.',
},
{
  block: B4, glow: 'c', pill: 'Мем',
  title: 'Классика',
  html: `
    <div style="display:flex;flex-direction:column;gap:18px">
      <div class="meme" data-a="left"><div class="f">🙅</div><div class="t"><code>prefs.setString('password', 'qwerty123')</code></div></div>
      <div class="meme" data-a="left" data-step="1"><div class="f ok">👉</div><div class="t">Пароль не храним. Токен в <code>flutter_secure_storage</code></div></div>
    </div>`,
  notes: 'Пауза, улыбнулись, идём дальше.',
},
ask(B4, 2, 'Куда бы вы<br>это положили', 'Варианты: shared_preferences, защищённое, база, файл, никуда. Голосуем руками', 4, [
  ['Тема интерфейса', 'светлая или тёмная', T('ok', 'shared_preferences')],
  ['Refresh-токен', 'по нему сервер выдаёт новый доступ', T('ac', 'защищённое')],
  ['Каталог на 5000 записей', 'с фильтром по категории', T('ok', 'база')],
  ['Избранное', 'id и названия, до сотни', T('ok', 'shared_preferences или база')],
  ['Пароль пользователя', 'для входа', T('no', 'никуда')],
  ['Черновик комментария', 'не дописал и закрыл', T('ok', 'shared_preferences')],
  ['Картинки карточек', 'скачанные с сервера', T('ok', 'файлы, кэш')],
  ['PIN-код', 'вход в приложение', T('ac', 'защищённое, хэшем')],
], 'По одной карточке: зачитываю, руки, потом ответ по стрелке.'),
);
