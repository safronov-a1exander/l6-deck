/* Л6 · блок 1: какие бывают хранилища */
const B1 = 'Хранилища';
DECK.add(
{
  block: B1, glow: 'br', pill: 'Память и диск',
  title: 'Что остаётся<br>после закрытия',
  html: `
    <div class="life" data-a="up">
      <div class="box mem"><h3>🧠 Память процесса</h3>
        <div class="it"><span class="ch">состояние Cubit</span><span class="ch">поля State</span><span class="ch">загруженный список</span><span class="ch">текст в поиске</span></div>
        <p class="note" style="font-size:22px">Быстро, но живёт, пока работает приложение</p></div>
      <div class="mid"><span class="x">✕</span>закрыли<br>приложение</div>
      <div class="box disk"><h3>💾 Диск устройства</h3>
        <div class="it"><span class="ch">тема</span><span class="ch">язык</span><span class="ch">избранное</span><span class="ch">кэш списка</span></div>
        <p class="note" style="font-size:22px">Медленнее, зато переживает закрытие и перезагрузку</p></div>
    </div>${STEP(1)}`,
  onStep(sec, s) { sec.querySelector('.life').classList.toggle('closed', s >= 1); },
  notes: 'По стрелке приложение закрывается: память гаснет, диск остаётся.',
},
{
  block: B1, glow: 'tr', pill: 'Виды',
  title: 'Пять мест<br>для данных',
  html: `
    <div class="kinds">
      <div class="card" data-a="up"><span class="ic">🔑</span><h3>Ключ-значение</h3><p>Настройки, небольшие списки. Строка-ключ и значение</p><span class="pk">shared_preferences</span></div>
      <div class="card" data-a="up"><span class="ic">🔒</span><h3>Защищённое</h3><p>То же, но значение зашифровано ключом системы. Токены</p><span class="pk">flutter_secure_storage</span></div>
      <div class="card" data-a="up"><span class="ic">📄</span><h3>Файлы</h3><p>Картинки, экспорт, большие JSON. Папки документов, кэша, временных</p><span class="pk">path_provider</span></div>
      <div class="card" data-a="up"><span class="ic">🗄️</span><h3>База данных</h3><p>Тысячи записей, фильтры, связи. SQLite в одном файле</p><span class="pk">sqflite · drift</span></div>
      <div class="card" data-a="up"><span class="ic">☁️</span><h3>Сервер</h3><p>Общее для всех устройств пользователя. Нужна сеть</p><span class="pk">dio, ЛР3</span></div>
    </div>`,
  notes: 'Под каждым видом пакет, которым это делают во Flutter.',
},
{
  block: B1, glow: 'r', pill: 'Где лежит',
  title: 'Один Dart-код,<br>разные места на диске',
  html: `
    <table class="mx">
      <tr data-a="up"><th></th><th>Android</th><th>iOS</th><th>Браузер</th><th>Windows</th></tr>
      <tr data-a="up"><td>shared_preferences</td><td>DataStore, файл приложения</td><td>UserDefaults</td><td><code>localStorage</code></td><td>JSON-файл в AppData</td></tr>
      <tr data-a="up"><td>flutter_secure_storage</td><td>шифр, ключ в Keystore</td><td>Keychain</td><td>WebCrypto, экспериментально</td><td>шифр, ключ в Credential Manager</td></tr>
      <tr data-a="up"><td>sqflite / drift</td><td>файл SQLite</td><td>файл SQLite</td><td>SQLite в WebAssembly, OPFS или IndexedDB</td><td>файл SQLite</td></tr>
      <tr data-a="up"><td>path_provider</td><td>папка приложения</td><td>Documents</td><td class="no-fs">файловой системы нет</td><td>профиль пользователя</td></tr>
    </table>`,
  notes: 'Источник: README пакетов на pub.dev, проверено 24.11.',
},
ask(B1, 1, 'Что должно<br>пережить перезапуск', 'Пользователь закрыл приложение и открыл снова. Что должно остаться?', 4, [
  ['Текст в поиске', '', T('no', 'обычно нет')],
  ['Позиция прокрутки', '', T('no', 'обычно нет')],
  ['Тема', '', T('ok', 'да')],
  ['Язык', '', T('ok', 'да')],
  ['Избранное', '', T('ok', 'да')],
  ['Загруженный список', '', T('ac', 'да, ради офлайна')],
  ['Токен входа', 'чтобы не входить заново', T('ok', 'да, но не туда же')],
  ['Открытая вкладка', 'на мобильном', T('ac', 'по ситуации')],
], 'Голосуем руками на каждый пункт. Токен: да, но в защищённое хранилище, это блок 3.'),
);
