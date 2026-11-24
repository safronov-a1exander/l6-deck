/* Л6 · блок 9: ЛР6, два таргета, адаптив, выход */
const B9 = 'ЛР6';
DECK.add(
{
  block: B9, glow: 'br', pill: 'ЛР6',
  title: 'ЛР6: что сдать',
  html: `
    <table class="tb6 lr">
      <tr data-a="up"><td>Тема и язык после перезапуска</td><td>На месте, без мигания</td><td>${T('ac', 'обязательно')}</td></tr>
      <tr data-a="up"><td>Избранное после перезапуска</td><td>Запись в разделе «Избранное»</td><td>${T('ac', 'обязательно')}</td></tr>
      <tr data-a="up"><td>Без сети: список и избранное</td><td>Плашка «из кэша», названия, а не номера</td><td>${T('ac', 'обязательно')}</td></tr>
      <tr data-a="up"><td>Без сети и без кэша</td><td>Ошибка с «Повторить»</td><td>${T('ac', 'обязательно')}</td></tr>
      <tr data-a="up"><td>Окно шире 840 и уже</td><td>Две колонки и одна</td><td>${T('ac', 'обязательно')}</td></tr>
      <tr data-a="up"><td>Экспорт избранного</td><td>Скачивание, путь или сообщение</td><td>${T('ac', 'обязательно')}</td></tr>
      <tr data-a="up"><td>Два таргета: браузер и второй</td><td>Команды в README, скриншоты с обоих</td><td>${T('ac', 'обязательно')}</td></tr>
      <tr data-a="up"><td>Деталь без сети, drift</td><td>По желанию</td><td>${T('', 'желательно')}</td></tr>
    </table>`,
  notes: 'Пример: тег l6-storage в шаблоне. Текст ЛР6 будет на странице занятия. Сдача и оценка как в ЛР2 и ЛР3.',
},
{
  block: B9, glow: 'tr', pill: 'Два таргета',
  title: 'Браузер<br>и второй таргет',
  html: `
    <div class="split" style="grid-template-columns:1fr 1fr">
      <div class="code" data-a="up"><span class="cap">README вашего репозитория</span><pre><span class="c"># браузер</span>
flutter run -d chrome --web-port <span class="t">8080</span>

<span class="c"># второй таргет</span>
flutter devices
flutter run -d emulator-5554</pre></div>
      <ul class="stars sm">
        <li data-a="up">Второй — тот, что выбрали к ЛР2. Не выбирали: Android</li>
        <li data-a="up">Android: SDK и эмулятор ставит Android Studio, проверка <code>flutter doctor</code></li>
        <li data-a="up">На втором таргете тоже работают тема, избранное и офлайн, а экспорт кладёт файл и показывает путь</li>
        <li data-a="up" data-step="1">Скриншоты с обоих таргетов в PR. Ставьте SDK заранее: первая сборка Android идёт минуты</li>
      </ul>
    </div>`,
  notes: 'id эмулятора смотрим в flutter devices. Windows как второй таргет можно, нужна Visual Studio с C++.',
},
{
  block: B9, glow: 'r', pill: 'Адаптив',
  title: 'Список и деталь<br>рядом',
  html: `
    <div class="split" style="grid-template-columns:640px 1fr;gap:40px">
      <div class="shot2" data-a="up"><img src="assets/img/adaptive-wide.jpg" alt="Список слева, деталь справа"></div>
      <div class="code sm" data-a="up"><span class="cap">common/navigation/app_router.dart</span><pre><span class="t">ShellRoute</span>(
  builder: (context, state, child) =>
      <span class="t">AdaptiveShell</span>(child: child),
  routes: [ <span class="c">/* список, деталь, избранное */</span> ],
)
<span class="c">// AdaptiveShell</span>
<span class="k">if</span> (<span class="t">MediaQuery</span>.sizeOf(context).width &lt; <span class="t">840</span>) <span class="k">return</span> child;
<span class="k">return</span> <span class="t">Row</span>(children: [
  <span class="t">SizedBox</span>(width: <span class="t">420</span>, child: list),
  <span class="t">Expanded</span>(child: child),
]);</pre></div>
    </div>
    <ul class="stars sm" style="margin-top:22px">
      <li data-a="up">Решаем по ширине окна, а не по платформе. Ширина окна: <code>MediaQuery.sizeOf</code>, место у родителя: <code>LayoutBuilder</code></li>
      <li data-a="up" data-step="1">Экрану детали ключ по номеру, иначе справа останется прошлая запись</li>
    </ul>`,
  notes: '840 — тот же порог, что у Максима на Л5. ShellRoute: общий каркас вокруг экранов маршрутов.',
},
{
  block: B9, glow: 'c', pill: 'Итог',
  title: 'Что унести',
  html: `
    <ul class="stars">
      <li data-a="up">Память пропадает. Что должно остаться, кладём на диск</li>
      <li data-a="up">Настройки и небольшие списки в <code>shared_preferences</code>, секреты в защищённое, много записей в базу</li>
      <li data-a="up">Кэш это второй датасорс. Выбирает репозиторий, экран видит только флаг</li>
      <li data-a="up">Flutter ходит в натив через плагины. Где платформы расходятся, результат честно говорит, что получилось</li>
    </ul>
    <p class="note" data-a="up" style="margin-top:40px">В субботу 28.11 практика, тоже онлайн. Вопросы</p>`,
  notes: 'Вопросы.',
},
);
