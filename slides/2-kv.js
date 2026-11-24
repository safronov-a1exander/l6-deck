/* Л6 · блок 2: ключ-значение, shared_preferences */
const B2 = 'shared_preferences';
DECK.add(
{
  block: B2, glow: 'br', pill: 'Ключ-значение',
  title: 'Словарь, который<br>переживает перезапуск',
  html: `
    <div class="split" style="grid-template-columns:1fr 1fr">
      <div class="code" data-a="up"><span class="cap">что лежит</span><pre><span class="s">'theme_mode'</span>  →  <span class="s">'dark'</span>
<span class="s">'onboarded'</span>   →  <span class="k">true</span>
<span class="s">'launches'</span>    →  <span class="t">42</span>
<span class="s">'favorites'</span>   →  <span class="s">'[{"id":1,"name":…}]'</span></pre></div>
      <ul class="stars sm">
        <li data-a="up">Типы: <code>bool</code>, <code>int</code>, <code>double</code>, <code>String</code>, <code>List&lt;String&gt;</code></li>
        <li data-a="up">Модель или список моделей кладём JSON-строкой: <code>jsonEncode</code> и <code>jsonDecode</code>, как в ЛР3</li>
        <li data-a="up">Читаем и пишем значение целиком. Найти «все записи с типом огонь» внутри строки нельзя</li>
      </ul>
    </div>`,
  notes: 'Пакет shared_preferences 2.5.6, от команды Flutter.',
},
{
  block: B2, glow: 'tr', pill: 'API',
  title: 'Три способа<br>в одном пакете',
  html: `
    <div class="g3">
      <div class="code sm" data-a="up"><span class="cap">SharedPreferencesAsync</span><pre><span class="k">final</span> prefs = <span class="t">SharedPreferencesAsync</span>();

<span class="k">await</span> prefs.setString(<span class="s">'k'</span>, <span class="s">'v'</span>);
<span class="k">final</span> v = <span class="k">await</span> prefs.getString(<span class="s">'k'</span>);
<span class="k">await</span> prefs.remove(<span class="s">'k'</span>);</pre></div>
      <div class="code sm" data-a="up"><span class="cap">SharedPreferencesWithCache</span><pre><span class="k">final</span> prefs = <span class="k">await</span>
  <span class="t">SharedPreferencesWithCache</span>.create(
    cacheOptions: <span class="k">const</span>
      <span class="t">SharedPreferencesWithCacheOptions</span>(
        allowList: {<span class="s">'theme_mode'</span>},
      ),
  );
prefs.getString(<span class="s">'theme_mode'</span>); <span class="c">// без await</span></pre></div>
      <div class="code sm" data-a="up"><span class="cap">SharedPreferences · старый</span><pre><span class="k">final</span> prefs = <span class="k">await</span>
  <span class="t">SharedPreferences</span>.getInstance();

prefs.getString(<span class="s">'k'</span>);
<span class="k">await</span> prefs.setString(<span class="s">'k'</span>, <span class="s">'v'</span>);

<span class="c">// во всех статьях,</span>
<span class="c">// «will be deprecated»</span></pre></div>
    </div>
    <p class="lead dotline" data-a="up" data-step="1" style="margin-top:30px;font-size:30px;line-height:42px">Async: каждый вызов идёт на диск. WithCache: читаем один раз при старте, дальше из памяти</p>`,
  notes: 'Старый API README называет legacy, «will be deprecated in the future». Пока работает.',
},
{
  block: B2, glow: 'r', pill: 'До первого кадра',
  title: 'Настройки читаем<br>до runApp',
  html: `
    <div class="split" style="grid-template-columns:1.1fr 1fr">
      <div class="code sm" data-a="up"><span class="cap">lib/main.dart</span><pre><span class="t">Future</span>&lt;<span class="k">void</span>&gt; main() <span class="k">async</span> {
  <span class="c">// хранилище это плагин, готовим к нему Flutter</span>
  <span class="t">WidgetsFlutterBinding</span>.ensureInitialized();
  <span class="hl"><span class="k">final</span> settings = <span class="k">await</span> <span class="t">SettingsStorage</span>.create();</span>
  runApp(<span class="t">App</span>(settings: settings));
}</pre></div>
      <div class="code sm" data-a="up"><span class="cap">common/theme/theme_cubit.dart</span><pre><span class="k">class</span> <span class="t">ThemeCubit</span> <span class="k">extends</span> <span class="t">Cubit</span>&lt;<span class="t">ThemeMode</span>&gt; {
  <span class="t">ThemeCubit</span>(<span class="k">this</span>._settings)
      : <span class="k">super</span>(_settings.themeMode);

  <span class="k">void</span> toggle() {
    <span class="k">final</span> next = …;
    emit(next);
    _settings.setThemeMode(next);
  }
}</pre></div>
    </div>
    <div class="rule" data-a="up" data-step="1" style="margin-top:30px">Прочитали после первого кадра: экран мигнёт светлой темой и переключится на тёмную</div>`,
  notes: 'SettingsStorage — обёртка: ключи и формат знает только она. Cubit про shared_preferences не знает.',
},
{
  block: B2, glow: 'tr', pill: 'Обёртка',
  title: 'Ключи знает<br>один класс',
  html: `
    <div class="code sm" data-a="up"><span class="cap">common/settings/settings_storage.dart</span><pre><span class="k">class</span> <span class="t">SettingsStorage</span> {
  <span class="t">SettingsStorage</span>(<span class="k">this</span>._prefs);
  <span class="k">final</span> <span class="t">SharedPreferencesWithCache</span> _prefs;

  <span class="k">static const</span> _themeModeKey = <span class="s">'theme_mode'</span>;

  <span class="t">ThemeMode</span> <span class="k">get</span> themeMode => <span class="k">switch</span> (_prefs.getString(_themeModeKey)) {
    <span class="s">'dark'</span> => <span class="t">ThemeMode</span>.dark,
    _ => <span class="t">ThemeMode</span>.light,          <span class="c">// ничего нет или непонятное</span>
  };

  <span class="t">Future</span>&lt;<span class="k">void</span>&gt; setThemeMode(<span class="t">ThemeMode</span> m) =>
      _prefs.setString(_themeModeKey, m.name);
}</pre></div>
    <p class="lead dotline" data-a="up" style="margin-top:28px;font-size:30px;line-height:42px">Создаётся в корне, как датасорс в ЛР3. Опечатка в ключе возможна только здесь</p>`,
  notes: 'Ключ строкой в десяти местах — классическая ошибка: записали theme, читаем themeMode.',
},
{
  block: B2, glow: 'br', pill: 'F12',
  title: 'Где это видно<br>в браузере',
  html: `
    <div class="dt" data-a="up">
      <div class="bar"><span>Elements</span><span>Console</span><span>Network</span><b>Application</b></div>
      <div class="body">
        <div class="side"><div>Storage</div><div class="sub on">▾ Local storage</div><div class="sub" style="padding-left:66px">http://localhost:8080</div><div class="sub">▸ Session storage</div><div class="sub">▸ IndexedDB</div><div class="sub">▸ Cookies</div></div>
        <table><tr><th>Key</th><th>Value</th></tr>
          <tr class="sel"><td>theme_mode</td><td>"dark"</td></tr>
          <tr><td>favorites</td><td>"[{\\"id\\":1,\\"name\\":\\"bulbasaur\\",\\"imageUrl\\":\\"https://raw.githubusercontent…</td></tr>
          <tr><td>page_0_20</td><td>"[{\\"id\\":1,\\"name\\":\\"bulbasaur\\",\\"imageUrl\\":\\"https://raw.githubusercontent…</td></tr>
        </table>
      </div>
    </div>
    <p class="note" data-a="up" style="margin-top:26px">Значения сняты с покедекса на теге <code>l6-storage</code>. Страница списка из 20 записей занимает 11 КБ</p>`,
  notes: 'Мок вкладки с настоящими значениями из покедекса. Скриншот этой вкладки попросим в PR.',
},
{
  block: B2, glow: 'r', pill: 'Где ломается',
  title: 'Где ломается',
  html: `
    <div class="g2">
      <div class="card" data-a="up"><h3>Новая версия, старые данные</h3><p class="p" style="font-size:25px;line-height:35px;margin-top:14px">Обновили приложение, формат JSON другой. <code>jsonDecode</code> падает при запуске у всех сразу</p>
        <div class="code sm" style="margin-top:22px"><pre><span class="k">try</span> {
  <span class="k">return</span> parse(json);
} <span class="k">on</span> <span class="t">Object</span> {
  <span class="k">return null</span>;   <span class="c">// считаем, что ничего нет</span>
}</pre></div></div>
      <div class="card" data-a="up"><h3>Не для больших данных</h3><p class="p" style="font-size:25px;line-height:35px;margin-top:14px">Читается в память целиком. В браузере это <code>localStorage</code>: около <b>5 МБ</b> на сайт, сверху ошибка <code>QuotaExceededError</code></p>
        <p class="p" style="font-size:25px;line-height:35px;margin-top:14px">В 5 МБ влезет около 450 наших страниц по 11 КБ</p></div>
    </div>
    <div class="bridge same" data-a="up" data-step="1" style="margin-top:26px"><b>как у Максима</b>Битый кэш после обновления и «три строки в try» были на Л5</div>`,
  notes: '5 МиБ на origin — MDN, «Storage quotas and eviction criteria».',
},
);
