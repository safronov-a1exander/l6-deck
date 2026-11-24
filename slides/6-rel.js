/* Л6 · блок 6: реляционная модель */
const B6 = 'Таблицы';
DECK.add(
{
  block: B6, glow: 'br', pill: 'Граница',
  title: 'Когда ключа-<br>значения мало',
  html: `
    <ul class="stars">
      <li data-a="up">Нужна часть данных: «все записи с типом огонь», «первые 20 по имени»</li>
      <li data-a="up">Записи ссылаются друг на друга: автор и его книги</li>
      <li data-a="up">Записей тысячи, читать всё в память ради одной долго</li>
    </ul>
    <div class="bridge same" data-a="up" style="margin-top:40px"><b>как у Максима</b>Ключ-значение, пока читаем и пишем целиком. Таблицы, когда нужна выборка по части</div>`,
  notes: 'Граница та же, что на Л5. В ЛР6 хватает ключа-значения, таблицы по желанию.',
},
{
  block: B6, glow: 'tr', pill: 'Первичный ключ',
  title: 'Таблица и<br>первичный ключ',
  html: `
    <div class="split" style="grid-template-columns:1fr 1fr;gap:60px">
      <table class="dbt" data-a="up"><caption>pokemon</caption>
        <tr><th class="pk">id 🔑</th><th>name</th><th>height</th></tr>
        <tr><td class="pk">1</td><td>bulbasaur</td><td>7</td></tr>
        <tr><td class="pk">4</td><td>charmander</td><td>6</td></tr>
        <tr><td class="pk">25</td><td>pikachu</td><td>4</td></tr>
      </table>
      <ul class="stars sm">
        <li data-a="up">Таблица про одну сущность. Строка это одна запись, колонка одно поле со своим типом</li>
        <li data-a="up"><b>Первичный ключ</b> отличает строку от всех остальных. Уникален и не меняется</li>
        <li data-a="up">Есть id с сервера, берём его. Нет, база выдаст сама: автоинкремент</li>
        <li data-a="up">Имя ключом не годится: его могут переименовать</li>
      </ul>
    </div>`,
  notes: 'Первичный ключ — primary key, PK. Автоинкремент: 1, 2, 3 по порядку вставки.',
},
{
  block: B6, glow: 'r', pill: 'Связи',
  title: 'Внешний ключ<br>и связи',
  html: `
    <div class="er">
      <div class="card" data-a="up"><h3>Один ко многим</h3>
        <div class="row"><span class="ent">author</span><span class="ar">1 → N</span><span class="ent">book</span></div>
        <table class="dbt"><caption>book</caption><tr><th class="pk">id</th><th>title</th><th class="fk">author_id</th></tr>
          <tr><td class="pk">10</td><td>Пикник на обочине</td><td class="fk">1</td></tr>
          <tr><td class="pk">11</td><td>Трудно быть богом</td><td class="fk">1</td></tr></table>
        <p class="note" style="font-size:22px">Внешний ключ лежит у «многих» и указывает на первичный ключ «одного»</p></div>
      <div class="card" data-a="up" data-step="1"><h3>Многие ко многим</h3>
        <div class="row"><span class="ent">book</span><span class="ar">N ↔ N</span><span class="ent">genre</span></div>
        <table class="dbt"><caption>book_genre</caption><tr><th class="fk">book_id</th><th class="fk">genre_id</th></tr>
          <tr><td class="fk">10</td><td class="fk">3</td></tr><tr><td class="fk">10</td><td class="fk">7</td></tr><tr><td class="fk">11</td><td class="fk">3</td></tr></table>
        <p class="note" style="font-size:22px">Нужна третья таблица: в ней только пары ключей</p></div>
    </div>`,
  notes: 'Внешний ключ — foreign key, FK. База не даст сослаться на автора, которого нет.',
},
ask(B6, 4, 'Сколько нужно<br>таблиц', 'У записи один или два типа. У типа есть название и цвет. Сколько таблиц и где какие ключи?', 3, [
  ['Одна', 'типы строкой «grass, poison»', T('no', 'нет')],
  ['Две', 'pokemon и type', T('no', 'не хватит: связь многие ко многим')],
  ['Три', 'pokemon, type, pokemon_type', T('ok', 'да: в третьей два внешних ключа')],
], 'Ответ показываем на следующем слайде анимацией.'),
{
  block: B6, glow: 'br', pill: 'Правила',
  title: 'Три правила<br>построения таблиц',
  html: `
    <div class="norm" data-a="up">
      <div class="flat">
        <table class="dbt" style="max-width:1300px"><caption>pokemon · всё в одной</caption>
          <tr><th class="pk">id</th><th>name</th><th>types</th><th>type_colors</th></tr>
          <tr><td class="pk">1</td><td>bulbasaur</td><td class="multi">grass, poison</td><td class="dup">#7AC74C, #A33EA1</td></tr>
          <tr><td class="pk">2</td><td>ivysaur</td><td class="multi">grass, poison</td><td class="dup">#7AC74C, #A33EA1</td></tr>
          <tr><td class="pk">4</td><td>charmander</td><td>fire</td><td class="dup">#EE8130</td></tr>
        </table>
        <ul class="stars sm" style="margin-top:34px">
          <li>В ячейке одно значение, а не список через запятую</li>
          <li>Одно и то же не повторяется: цвет травы записан дважды, менять в двух местах</li>
          <li>Одна таблица про одну сущность: здесь и покемоны, и типы</li>
        </ul>
      </div>
      <div class="three">
        <table class="dbt"><caption>pokemon</caption><tr><th class="pk">id</th><th>name</th></tr>
          <tr><td class="pk">1</td><td>bulbasaur</td></tr><tr><td class="pk">2</td><td>ivysaur</td></tr><tr><td class="pk">4</td><td>charmander</td></tr></table>
        <table class="dbt"><caption>pokemon_type</caption><tr><th class="fk">pokemon_id</th><th class="fk">type_id</th></tr>
          <tr><td class="fk">1</td><td class="fk">12</td></tr><tr><td class="fk">1</td><td class="fk">4</td></tr><tr><td class="fk">2</td><td class="fk">12</td></tr><tr><td class="fk">2</td><td class="fk">4</td></tr><tr><td class="fk">4</td><td class="fk">10</td></tr></table>
        <table class="dbt"><caption>type</caption><tr><th class="pk">id</th><th>name</th><th>color</th></tr>
          <tr><td class="pk">4</td><td>poison</td><td>#A33EA1</td></tr><tr><td class="pk">10</td><td>fire</td><td>#EE8130</td></tr><tr><td class="pk">12</td><td>grass</td><td>#7AC74C</td></tr></table>
      </div>
    </div>${STEP(1)}`,
  onStep(sec, s) { sec.querySelector('.norm').classList.toggle('split', s >= 1); },
  notes: 'Красным — нарушения. По стрелке таблица распадается на три. Это и есть нормализация, название можно не запоминать.',
},
{
  block: B6, glow: 'tr', pill: 'SQL',
  title: 'Запрос на SQL',
  html: `
    <div class="code" data-a="up"><span class="cap">все записи с типом fire, по имени, первые 20</span><pre><span class="k">SELECT</span> p.id, p.name
<span class="k">FROM</span> pokemon p
<span class="k">JOIN</span> pokemon_type pt <span class="k">ON</span> pt.pokemon_id = p.id
<span class="k">JOIN</span> type t <span class="k">ON</span> t.id = pt.type_id
<span class="k">WHERE</span> t.name = <span class="s">'fire'</span>
<span class="k">ORDER BY</span> p.name
<span class="k">LIMIT</span> <span class="t">20</span> <span class="k">OFFSET</span> <span class="t">0</span>;</pre></div>
    <p class="lead dotline" data-a="up" style="margin-top:30px;font-size:30px;line-height:42px">Это то, чего не умеет ключ-значение: выбрать часть, отсортировать, взять страницу. Пагинация как в ЛР3, только на устройстве</p>`,
  notes: 'JOIN склеивает строки таблиц по ключам. Писать SQL руками в ЛР не придётся.',
},
{
  block: B6, glow: 'r', pill: 'Миграции',
  title: 'Схема меняется,<br>данные остаются',
  html: `
    <div class="g3">
      <div class="card" data-a="up"><h3>Версия 1</h3><div class="code sm" style="margin-top:14px"><pre>pokemon(id, name)</pre></div></div>
      <div class="card" data-a="up"><h3>Версия 2</h3><div class="code sm" style="margin-top:14px"><pre>pokemon(id, name,
        <span class="hl">height</span>)</pre></div></div>
      <div class="card" data-a="up"><h3>Миграция 1 → 2</h3><div class="code sm" style="margin-top:14px"><pre><span class="k">ALTER TABLE</span> pokemon
<span class="k">ADD COLUMN</span> height <span class="t">INTEGER</span>;</pre></div></div>
    </div>
    <ul class="stars sm" style="margin-top:34px">
      <li data-a="up">У пользователя на диске версия 1. Новое приложение ждёт версию 2</li>
      <li data-a="up">База хранит номер своей версии, приложение досоздаёт недостающее по шагам</li>
      <li data-a="up" data-step="1">Забыли миграцию: падение при запуске у всех, кто обновился</li>
    </ul>`,
  notes: 'У ключа-значения то же самое, только руками: «формат JSON поменялся».',
},
);
