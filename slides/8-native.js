/* Л6 · блок 8: как Flutter уходит в натив */
const B8 = 'Натив';
const PL = (on) => ['Android', 'iOS', 'Web', 'Windows'].map(p => `<span class="${on.includes(p) ? '' : 'n'}">${p}</span>`).join('');
DECK.add(
{
  block: B8, glow: 'br', pill: 'С Л0',
  title: 'Момент решения',
  html: `
    <table class="tb6">
      <tr data-a="up"><th></th><th>Compose Multiplatform</th><th>Flutter</th></tr>
      <tr data-a="up"><td>Как подключается платформенное</td><td>Объявление в общем коде, реализации по таргетам</td><td>Плагин: общий Dart API и реализация на каждой платформе</td></tr>
      <tr data-a="up"><td>Кто выбирает реализацию</td><td>Компилятор</td><td>Рантайм: вызов ищет обработчик по имени канала</td></tr>
      <tr data-a="up"><td>Когда узнаёшь об ошибке</td><td>При сборке</td><td>При вызове, у пользователя</td></tr>
    </table>
    <div class="bridge diff" data-a="up" data-step="1" style="margin-top:30px"><b>у Максима на Л5</b><code>expect/actual</code>: пропущенный <code>actual</code> не даёт собрать проект</div>`,
  notes: 'Слайд с вводной лекции, обещали разобрать сегодня. На Л5 Максим показывал, что от expect в сборке не остаётся ничего: метод, адрес или строка импорта.',
},
{
  block: B8, glow: 'tr', pill: 'Плагин',
  title: 'shared_preferences<br>изнутри',
  html: `
    <div class="ptree">
      <div class="lv" data-a="down"><div class="nd root"><code>shared_preferences</code><div>то, что мы подключили</div></div></div>
      <div class="lv" data-a="down"><div class="nd"><code>…_platform_interface</code><div>общий контракт на Dart</div></div></div>
      <div class="lv impl">
        <div class="nd" data-a="up"><code>…_android</code><div>Kotlin, DataStore</div></div>
        <div class="nd" data-a="up"><code>…_foundation</code><div>Swift, UserDefaults · iOS, macOS</div></div>
        <div class="nd" data-a="up"><code>…_web</code><div>Dart, localStorage</div></div>
        <div class="nd" data-a="up"><code>…_windows · _linux</code><div>Dart, JSON-файл</div></div>
      </div>
    </div>
    <p class="lead dotline" data-a="up" data-step="1" style="margin-top:34px;font-size:30px;line-height:42px">Весь час мы пользовались плагином. В натив он уходит только там, где без этого нельзя</p>`,
  notes: 'Такая раскладка называется федеративный плагин: поддержку новой платформы добавляют отдельным пакетом, не трогая чужой код.',
},
{
  block: B8, glow: 'r', pill: 'MethodChannel',
  title: 'Канал: сообщение<br>по имени',
  html: `
    <div class="chan" data-a="up">
      <div class="side"><h3>Dart</h3><p>общий код</p></div>
      <div class="pipe"><span class="msg m1">getBatteryLevel → байты</span><span class="msg m2">← 87</span></div>
      <div class="side"><h3>Kotlin / Swift</h3><p>платформа</p></div>
    </div>
    <div class="g2" style="margin-top:10px">
      <div class="code sm" data-a="up"><span class="cap">Dart</span><pre><span class="k">const</span> ch = <span class="t">MethodChannel</span>(<span class="s">'samples.flutter.dev/battery'</span>);
<span class="k">final</span> level = <span class="k">await</span> ch.invokeMethod&lt;<span class="t">int</span>&gt;(<span class="s">'getBatteryLevel'</span>);</pre></div>
      <div class="code sm" data-a="up"><span class="cap">Kotlin</span><pre>channel.setMethodCallHandler { call, result ->
  <span class="k">if</span> (call.method == <span class="s">"getBatteryLevel"</span>) result.success(level())
  <span class="k">else</span> result.notImplemented()
}</pre></div>
    </div>
    <ul class="stars sm" style="margin-top:22px">
      <li data-a="up" data-step="1">Всегда асинхронно: <code>await</code>, даже если ответ мгновенный. Данные кодируются и копируются, как между изолятами на Л3</li>
      <li data-a="up" data-step="1">Нет обработчика на этой платформе: <code>MissingPluginException</code> в момент вызова</li>
    </ul>`,
  notes: 'Пример из документации Flutter, Platform channels. Имя канала и метода — просто строки.',
},
{
  block: B8, glow: 'br', pill: 'Способы',
  title: 'Как ещё<br>ходят в натив',
  html: `
    <div class="g3">
      <div class="card" data-a="up"><h3>Pigeon</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px">Описали методы один раз на Dart, генератор пишет обе стороны. Опечатка в имени метода не соберётся</p></div>
      <div class="card" data-a="up"><h3>FFI</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px">Вызов функции на C напрямую, без сообщений. Так <code>drift</code> работает с SQLite</p></div>
      <div class="card" data-a="up"><h3>JS interop</h3><p class="p" style="font-size:24px;line-height:33px;margin-top:12px">В браузере родной код платформы это JavaScript. <code>localStorage</code> плагин зовёт через <code>package:web</code></p></div>
    </div>
    <div class="rule" data-a="up" data-step="1" style="margin-top:34px">Свежие версии <code>shared_preferences</code> на Android и iOS уже не используют MethodChannel: Pigeon генерирует прямые вызовы. Документация Flutter советует для новых проектов Pigeon и генераторы FFI</div>`,
  notes: 'Источник: CHANGELOG shared_preferences_android 2.5.0 и _foundation 2.6.0, страница Platform channels.',
},
{
  block: B8, glow: 'tr', pill: 'Свой код',
  title: 'Разное поведение<br>в своём коде',
  html: `
    <div class="split" style="grid-template-columns:1.1fr 1fr">
      <div class="code sm" data-a="up"><span class="cap">common/platform/file_export.dart</span><pre><span class="k">export</span> <span class="s">'file_export_io.dart'</span>
    <span class="k">if</span> (dart.library.js_interop) <span class="s">'file_export_web.dart'</span>;

<span class="k">sealed class</span> <span class="t">ExportResult</span> {}
<span class="k">class</span> <span class="t">SavedTo</span> <span class="k">extends</span> <span class="t">ExportResult</span> { <span class="k">final</span> <span class="t">String</span> path; }
<span class="k">class</span> <span class="t">Downloaded</span> <span class="k">extends</span> <span class="t">ExportResult</span> {}
<span class="k">class</span> <span class="t">NotSupported</span> <span class="k">extends</span> <span class="t">ExportResult</span> {}
<span class="k">class</span> <span class="t">ExportFailed</span> <span class="k">extends</span> <span class="t">ExportResult</span> { <span class="k">final</span> <span class="t">String</span> reason; }</pre></div>
      <ul class="stars sm">
        <li data-a="up"><code>kIsWeb</code>: запущены ли мы в браузере</li>
        <li data-a="up"><code>defaultTargetPlatform</code>: Android, iOS, Windows и другие</li>
        <li data-a="up">Условный импорт: на web берётся другой файл. В нём можно трогать браузер, а <code>dart:io</code> нельзя</li>
        <li data-a="up" data-step="1">Не умеет платформа: пишем об этом на экране, а не молчим</li>
      </ul>
    </div>`,
  notes: 'Экспорт — платформенная фича вехи из контракта, в ЛР6 обязательна. На Android и desktop файл и путь, в браузере скачивание.',
},
{
  block: B8, glow: 'br', pill: 'Экспорт',
  title: 'Две реализации<br>одной функции',
  html: `
    <div class="g2">
      <div class="code sm" data-a="up"><span class="cap">file_export_web.dart · браузер</span><pre><span class="c">// файловой системы нет: файл в памяти</span>
<span class="k">final</span> blob = web.<span class="t">Blob</span>([content.toJS].toJS);
<span class="k">final</span> url = web.<span class="t">URL</span>.createObjectURL(blob);
web.<span class="t">HTMLAnchorElement</span>()
  ..href = url
  ..download = fileName
  ..click();         <span class="c">// как ссылка «скачать»</span>
<span class="k">return const</span> <span class="t">Downloaded</span>();</pre></div>
      <div class="code sm" data-a="up"><span class="cap">file_export_io.dart · Android, desktop</span><pre><span class="k">final</span> dir = <span class="k">await</span> getDownloadsDirectory()
    ?? <span class="k">await</span> getApplicationDocumentsDirectory();
<span class="k">final</span> file = <span class="t">File</span>(<span class="s">'\${dir.path}/\$fileName'</span>);
<span class="k">await</span> file.writeAsString(content);
<span class="k">return</span> <span class="t">SavedTo</span>(file.path);

<span class="c">// нет реализации path_provider</span>
<span class="c">// → NotSupported, нет места → ExportFailed</span></pre></div>
    </div>
    <ul class="stars sm" style="margin-top:24px">
      <li data-a="up"><code>package:web</code> даёт браузерные объекты из Dart, <code>path_provider</code> даёт папки платформы</li>
      <li data-a="up">Экран делает <code>switch</code> по результату и всегда показывает сообщение. На Android путь ведёт в папку приложения, и это честно пишем</li>
    </ul>`,
  notes: 'Код из шаблона, тег l6-storage, сокращён. Blob — файл в памяти браузера.',
},
{
  block: B8, glow: 'r', pill: 'Где нужен натив',
  title: 'Где без натива<br>не обойтись',
  html: `
    <div class="feat">
      <div class="card" data-a="up"><h3><i>🔔</i>Уведомления</h3><p><code>flutter_local_notifications</code>. Android 13+ спрашивает разрешение</p><div class="pl">${PL(['Android', 'iOS', 'Web', 'Windows'])}</div></div>
      <div class="card" data-a="up"><h3><i>🧩</i>Виджет на экране</h3><p><code>home_widget</code>. Сам виджет пишется на Kotlin и Swift, Flutter отдаёт данные</p><div class="pl">${PL(['Android', 'iOS'])}</div></div>
      <div class="card" data-a="up"><h3><i>📷</i>Камера</h3><p><code>camera</code>. Разрешение и описание в манифесте и Info.plist</p><div class="pl">${PL(['Android', 'iOS', 'Web'])}</div></div>
      <div class="card" data-a="up"><h3><i>📍</i>Геолокация</h3><p><code>geolocator</code>. Разрешение, на Android три исхода</p><div class="pl">${PL(['Android', 'iOS', 'Web', 'Windows'])}</div></div>
      <div class="card" data-a="up"><h3><i>👆</i>Отпечаток, лицо</h3><p><code>local_auth</code>. Настройка Activity на Android</p><div class="pl">${PL(['Android', 'iOS', 'Windows'])}</div></div>
      <div class="card" data-a="up"><h3><i>🔗</i>Ссылки в приложение</h3><p><code>app_links</code>. Настройка в манифесте и файл на своём сайте</p><div class="pl">${PL(['Android', 'iOS', 'Web', 'Windows'])}</div></div>
      <div class="card" data-a="up"><h3><i>🗺️</i>Карты</h3><p><code>yandex_mapkit</code>. Ключ в нативной конфигурации</p><div class="pl">${PL(['Android', 'iOS'])}</div></div>
      <div class="card" data-a="up"><h3><i>💾</i>Сохранить файл</h3><p><code>file_saver</code>, <code>share_plus</code>. В браузере это скачивание</p><div class="pl">${PL(['Android', 'iOS', 'Web', 'Windows'])}</div></div>
    </div>`,
  notes: 'Платформы по тегам pub.dev на 24.11. Разрешения на Android: дали, отказали, отказали навсегда, у Максима на Л5.',
},
);
