/* Л6 · блок 7: SQLite во Flutter — sqflite и drift */
const B7 = 'SQLite во Flutter';
DECK.add(
{
  block: B7, glow: 'br', pill: 'sqflite',
  title: 'sqflite: SQL<br>строками',
  html: `
    <div class="split" style="grid-template-columns:1.25fr 1fr">
      <div class="code sm" data-a="up"><span class="cap">sqflite 2.4.6</span><pre><span class="k">final</span> db = <span class="k">await</span> openDatabase(<span class="s">'app.db'</span>, version: <span class="t">1</span>,
  onCreate: (db, v) => db.execute(
    <span class="s">'CREATE TABLE favorite ('</span>
    <span class="s">'id INTEGER PRIMARY KEY, name TEXT NOT NULL)'</span>,
  ),
);

<span class="k">await</span> db.insert(<span class="s">'favorite'</span>, {<span class="s">'id'</span>: <span class="t">1</span>, <span class="s">'name'</span>: <span class="s">'bulbasaur'</span>});
<span class="k">final</span> rows = <span class="k">await</span> db.query(<span class="s">'favorite'</span>,
    where: <span class="s">'name LIKE ?'</span>, whereArgs: [<span class="s">'bulb%'</span>]);
<span class="c">// rows: List&lt;Map&lt;String, Object?&gt;&gt;</span></pre></div>
      <ul class="stars sm">
        <li data-a="up">База в одном файле на устройстве, сервер не нужен</li>
        <li data-a="up">Опечатка в имени колонки найдётся только при запуске</li>
        <li data-a="up">Android, iOS, macOS. Desktop и web через отдельные пакеты, web экспериментально</li>
      </ul>
    </div>`,
  notes: 'Знак ? в where: значение подставляет база. Склеивать SQL строкой из ввода пользователя нельзя.',
},
{
  block: B7, glow: 'tr', pill: 'drift',
  title: 'drift: таблицы<br>классами Dart',
  html: `
    <div class="g2">
      <div class="code sm" data-a="up"><span class="cap">пишем мы</span><pre><span class="k">class</span> <span class="t">Favorites</span> <span class="k">extends</span> <span class="t">Table</span> {
  <span class="t">IntColumn</span> <span class="k">get</span> id => integer()();
  <span class="t">TextColumn</span> <span class="k">get</span> name => text()();
  <span class="t">TextColumn</span> <span class="k">get</span> imageUrl => text().nullable()();

  <span class="k">@override</span>
  <span class="t">Set</span>&lt;<span class="t">Column</span>&gt; <span class="k">get</span> primaryKey => {id};
}

<span class="hl">@DriftDatabase(tables: [Favorites])</span>
<span class="k">class</span> <span class="t">AppDatabase</span> <span class="k">extends</span> _$<span class="t">AppDatabase</span> {
  <span class="t">AppDatabase</span>(<span class="k">super</span>.e);
  <span class="k">@override</span>
  <span class="t">int</span> <span class="k">get</span> schemaVersion => <span class="t">1</span>;
}</pre></div>
      <div class="code sm" data-a="up" data-step="1"><span class="cap">build_runner генерирует, примерно</span><pre><span class="k">CREATE TABLE</span> favorites (
  id <span class="t">INTEGER</span> <span class="k">NOT NULL</span>,
  name <span class="t">TEXT</span> <span class="k">NOT NULL</span>,
  image_url <span class="t">TEXT</span>,
  <span class="k">PRIMARY KEY</span> (id)
);

<span class="c">// и классы Favorite, FavoritesCompanion,</span>
<span class="c">// методы select, insert, update, delete</span></pre></div>
    </div>`,
  notes: 'Тот же build_runner, что для json_serializable в ЛР3. drift 2.35.4. Колонку переименовали в классе, а в запросе старое имя: ошибка компиляции, а не падение у пользователя.',
},
{
  block: B7, glow: 'r', pill: 'Запросы',
  title: 'watch: экран<br>обновляется сам',
  html: `
    <div class="split" style="grid-template-columns:1.2fr 1fr">
      <div class="code sm" data-a="up"><span class="cap">запросы</span><pre><span class="c">// один раз</span>
<span class="k">final</span> all = <span class="k">await</span> select(favorites).get();

<span class="c">// Stream: новое значение при каждом изменении таблицы</span>
<span class="t">Stream</span>&lt;<span class="t">List</span>&lt;<span class="t">Favorite</span>&gt;&gt; watchAll() =>
    <span class="hl">select(favorites).watch()</span>;

<span class="k">await</span> into(favorites).insertOnConflictUpdate(
  <span class="t">FavoritesCompanion</span>.insert(id: <span class="t">1</span>, name: <span class="s">'bulbasaur'</span>),
);</pre></div>
      <ul class="stars sm">
        <li data-a="up"><code>Stream</code> знаем с Л3. Cubit подписался, звезду нажали в другом месте, список обновился</li>
        <li data-a="up">Миграции: <code>schemaVersion</code> и шаги <code>onUpgrade(from, to)</code> в одном месте</li>
        <li data-a="up">Web: положить <code>sqlite3.wasm</code> и воркер в <code>web/</code>. Хранит в OPFS или IndexedDB</li>
      </ul>
    </div>`,
  notes: 'Файлы для web берутся из релиза drift на GitHub, версии должны совпадать. Это главная грабля drift на web.',
},
{
  block: B7, glow: 'br', pill: 'Итог',
  title: 'Что выбрать',
  html: `
    <table class="tb6">
      <tr data-a="up"><th></th><th>Что хранит</th><th>Web</th><th>Шифрует</th><th>Когда брать</th></tr>
      <tr data-a="up"><td>shared_preferences</td><td>ключ → простое значение</td><td>localStorage</td><td>нет</td><td>Настройки, избранное, небольшой кэш</td></tr>
      <tr data-a="up"><td>flutter_secure_storage</td><td>ключ → строка</td><td>экспериментально</td><td>да</td><td>Токены, секреты</td></tr>
      <tr data-a="up"><td>sqflite</td><td>таблицы, SQL строками</td><td>отдельный пакет</td><td>нет</td><td>Таблицы без кодогенерации</td></tr>
      <tr data-a="up"><td>drift</td><td>таблицы, классы Dart</td><td>wasm + воркер</td><td>нет</td><td>Много записей, связи, выборки</td></tr>
      <tr data-a="up"><td>файлы</td><td>байты</td><td>нет файловой системы</td><td>нет</td><td>Картинки, экспорт</td></tr>
    </table>`,
  notes: 'В ЛР6 обязателен shared_preferences, drift по желанию.',
},
);
