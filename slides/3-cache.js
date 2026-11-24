/* Л6 · блок 3: кэш в приложении, офлайн и избранное */
const B3 = 'Кэш и офлайн';
DECK.add(
{
  block: B3, glow: 'br', pill: 'Слои',
  title: 'Второй датасорс<br>рядом с сетевым',
  html: `
    <div class="chain" style="grid-template-columns:repeat(4,1fr)">
      <div class="card" data-a="up"><h3>API-клиент</h3><p>Как в ЛР3</p><span class="no">dio</span></div>
      <div class="card" data-a="up"><h3>Датасорсы</h3><p><b>Network</b>: сеть, как в ЛР3<br><b style="color:var(--accent)">Local</b>: хранилище на устройстве</p><span class="no">shared_preferences</span></div>
      <div class="card on" data-a="up"><h3>Репозиторий</h3><p>Решает, откуда взять. Сохраняет ответ сети</p><span class="no">Cubit про кэш не знает</span></div>
      <div class="card" data-a="up"><h3>Cubit и экран</h3><p>Получают данные и флаг «из кэша»</p><span class="no">плашка над списком</span></div>
    </div>
    <div class="bridge same" data-a="up" style="margin-top:36px"><b>обещали на Л3</b>«Понадобится кэш на диске: добавляем второй датасорс, репозиторий выбирает между ними»</div>`,
  notes: 'Так и в effective_coffee: Network и Db датасорсы за интерфейсами.',
},
{
  block: B3, glow: 'tr', pill: 'Два пути',
  title: 'Сеть есть<br>и сети нет',
  html: `
    <div class="paths" data-a="up">
      <svg viewBox="0 0 1680 560" preserveAspectRatio="none">
        <path class="p-cub" d="M330 280 L520 280"/>
        <path class="p-net" d="M820 250 C 950 250, 1000 110, 1180 110"/>
        <path class="p-loc" d="M820 310 C 950 310, 1000 450, 1180 450"/>
        <path class="p-save" d="M1330 160 L1330 400"/>
      </svg>
      <div class="nd n-cub" style="left:30px;top:220px"><h3>Cubit</h3><p>просит страницу</p></div>
      <div class="nd n-rep" style="left:520px;top:220px"><h3>Репозиторий</h3><p>решает</p></div>
      <div class="nd n-net" style="left:1180px;top:50px"><h3>Сеть</h3><p>NetworkDataSource</p></div>
      <div class="nd n-loc" style="left:1180px;top:390px"><h3>Хранилище</h3><p>LocalDataSource</p></div>
      <div class="lb l1" style="left:1360px;top:250px">ответ сохраняем</div>
      <div class="lb l2" style="left:860px;top:30px">NoConnection или таймаут</div>
      <div class="lb l3" style="left:430px;top:400px;max-width:500px">в хранилище пусто: та же ошибка с «Повторить», как в ЛР3</div>
    </div>${STEP(3)}`,
  onStep(sec, s) {
    const on = (q, v, c = 'on') => sec.querySelector(q).classList.toggle(c, v);
    const online = s === 1, offline = s >= 2;
    on('.p-cub', s >= 1); on('.n-rep', s >= 1);
    on('.p-net', online); on('.n-net', online); on('.p-save', online); on('.l1', online);
    on('.p-net', offline, 'bad'); on('.n-net', offline, 'off'); on('.l2', offline); on('.p-loc', offline);
    on('.n-loc', s >= 1);
    on('.l3', s >= 3);
  },
  notes: 'Шаг 1: сеть есть, ответ сохраняем. Шаг 2: сети нет, читаем из хранилища. Шаг 3: пусто.',
},
{
  block: B3, glow: 'r', pill: 'Код',
  title: 'Репозиторий<br>выбирает',
  html: `
    <div class="code sm" data-a="up"><span class="cap">features/pokemon/data/pokemon_repository.dart</span><pre><span class="t">Future</span>&lt;<span class="t">PokemonPageModel</span>&gt; getPokemons({<span class="k">required</span> <span class="t">int</span> offset, <span class="k">required</span> <span class="t">int</span> limit}) <span class="k">async</span> {
  <span class="k">try</span> {
    <span class="k">final</span> items = <span class="k">await</span> _loadFromNetwork(offset, limit);
    <span class="hl"><span class="k">await</span> _local.savePage(offset: offset, limit: limit, items: …);</span>
    <span class="k">return</span> <span class="t">PokemonPageModel</span>(items: items, fromCache: <span class="k">false</span>);
  } <span class="k">on</span> <span class="t">LoadException</span> <span class="k">catch</span> (error) {
    <span class="c">// 404 и ошибку сервера кэшем не прикрываем: сервер ответил</span>
    <span class="k">if</span> (error <span class="k">is!</span> <span class="t">NoConnectionException</span> &amp;&amp; error <span class="k">is!</span> <span class="t">TimeoutLoadException</span>) <span class="k">rethrow</span>;
    <span class="k">final</span> cached = <span class="k">await</span> _local.getPage(offset: offset, limit: limit);
    <span class="k">if</span> (cached == <span class="k">null</span>) <span class="k">rethrow</span>;
    <span class="k">return</span> <span class="t">PokemonPageModel</span>(items: …, <span class="hl">fromCache: <span class="k">true</span></span>);
  }
}</pre></div>
    <p class="note" data-a="up" style="margin-top:24px">Каждую страницу сохраняем отдельно: до конца списка можно и не долистать, а офлайн наступит всё равно</p>`,
  notes: 'Флаг fromCache идёт в состояние Cubit, экран рисует плашку.',
},
{
  block: B3, glow: 'br', pill: 'Избранное',
  title: 'Хранить запись<br>целиком',
  html: `
    <div class="trap">
      <div class="card bad" data-a="up"><h3>✗ Только номера</h3>
        <div class="code sm"><pre><span class="s">'favorites'</span> → <span class="s">'[1, 4, 25]'</span></pre></div>
        <div class="row"><span class="n">#001</span>???</div><div class="row"><span class="n">#004</span>???</div>
        <p class="note" style="font-size:22px">С сетью всё работает. Без сети названия взять негде</p></div>
      <div class="card good" data-a="up" data-step="1"><h3>✓ Запись целиком</h3>
        <div class="code sm"><pre><span class="s">'favorites'</span> → <span class="s">'[{"id":1,"name":"bulbasaur",</span>
                   <span class="s">"types":["grass","poison"],…}]'</span></pre></div>
        <div class="row"><span class="n">#001</span>Bulbasaur</div><div class="row"><span class="n">#004</span>Charmander</div>
        <p class="note" style="font-size:22px">Свой формат хранилища, <code>StoredPokemonDto</code>, и маппер в обе стороны</p></div>
    </div>
    <div class="bridge same" data-a="up" data-step="1" style="margin-top:24px"><b>как у Максима</b>Ловушка «в хранилище только id» с ПЗ5</div>`,
  notes: 'Формат хранилища свой, не ответ сервера: сервер поменяет ответ, сохранённое у пользователя останется читаемым.',
},
{
  block: B3, glow: 'tr', pill: 'Без сети',
  title: 'Покедекс<br>без сети',
  html: `
    <div class="split" style="grid-template-columns:900px 1fr;gap:56px">
      <div class="shot2" data-a="up"><img src="assets/img/offline-list.jpg" alt="Список без сети с плашкой"></div>
      <div class="demo" data-a="up">
        <div class="url">тег l6-storage</div>
        <ol>
          <li>Открываю с сетью</li>
          <li>F12 → Network → Offline, F5</li>
          <li>Тот же список и плашка</li>
          <li>Звезда в шапке: избранное с названиями</li>
          <li>Clear site data, F5: ошибка с «Повторить»</li>
        </ol>
      </div>
    </div>`,
  notes: 'Скриншот покедекса на теге l6-storage. Справа шаги проверки, они же для скриншотов в PR.',
},
{
  block: B3, glow: 'r', pill: 'Стратегия',
  title: 'Три вопроса<br>к любому кэшу',
  html: `
    <table class="tb6">
      <tr data-a="up"><th>Вопрос</th><th>Варианты</th><th>Что в покедексе</th></tr>
      <tr data-a="up"><td>Когда показывать кэш</td><td>Сразу, потом обновить из сети. Или только когда сеть отказала</td><td>Когда сеть отказала</td></tr>
      <tr data-a="up"><td>Сколько он живёт</td><td>Вечно. Или срок жизни: старше суток не показываем</td><td>Вечно</td></tr>
      <tr data-a="up"><td>Сеть принесла другое</td><td>Перезаписать целиком, слить по полям, спросить пользователя</td><td>Перезаписать целиком</td></tr>
    </table>
    <p class="lead dotline" data-a="up" data-step="1" style="margin-top:34px;font-size:30px;line-height:42px">В ЛР берём самый простой ответ. Важно, что вопрос вы видите</p>`,
  notes: 'У Максима на Л5 те же три вопроса. От стека не зависит.',
},
);
