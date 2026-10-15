document.addEventListener('DOMContentLoaded', () => {
  const sailors = document.querySelectorAll('.sailor');
  if (sailors.length === 0) return;

  let currentIndex = -1;
  let idleTimer = null;
  let sequentialInterval = null;
  let isSequentialMode = false;
  let shownIndices = new Set(); // Хранит индексы уже вылезших матросов

  const IDLE_WAIT = 3000;       // 3 секунды бездействия перед началом выхода
  const STEP_INTERVAL = 1200;   // Интервал (в мс) между появлением каждого нового матроса

  // Функция для показа одного конкретного или случайного матроса
  function showSingle(index = -1, isInitial = false) {
    stopSequentialMode();
    
    // Скрываем всех
    sailors.forEach(s => s.classList.remove('active'));
    shownIndices.clear();

    const limit = (isInitial && sailors.length >= 7) ? 7 : sailors.length;

    let newIndex;
    if (index >= 0) {
      newIndex = index;
    } else {
      do {
        newIndex = Math.floor(Math.random() * limit);
      } while (newIndex === currentIndex && limit > 1);
    }

    currentIndex = newIndex;
    sailors[currentIndex].classList.add('active');
    shownIndices.add(currentIndex); // Текущий уже считается показанным

    resetIdleTimer();
  }

  // Запуск последовательного появления матросов (текущий чел остается на месте)
  function startSequentialMode() {
    isSequentialMode = true;

    // Находим всех матросов, которые еще не активны
    let remainingIndices = [];
    sailors.forEach((_, idx) => {
      if (!shownIndices.has(idx)) {
        remainingIndices.push(idx);
      }
    });

    // Перемешиваем оставшихся в случайном порядке, чтобы они вылазили не строго по порядку номеров в DOM
    remainingIndices.sort(() => Math.random() - 0.5);

    let step = 0;
    sequentialInterval = setInterval(() => {
      if (step < remainingIndices.length) {
        const nextIdx = remainingIndices[step];
        sailors[nextIdx].classList.add('active');
        shownIndices.add(nextIdx);
        step++;
      } else {
        // Когда все вылезли, останавливаем интервал
        clearInterval(sequentialInterval);
        sequentialInterval = null;
      }
    }, STEP_INTERVAL);
  }

  // Остановка последовательного режима
  function stopSequentialMode() {
    if (sequentialInterval) {
      clearInterval(sequentialInterval);
      sequentialInterval = null;
    }
    isSequentialMode = false;
  }

  // Перезапуск таймера бездействия
  function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (!isSequentialMode) {
      idleTimer = setTimeout(startSequentialMode, IDLE_WAIT);
    }
  }

  // Навешиваем события на каждого матроса
  sailors.forEach((sailor) => {
    const triggerAction = (e) => {
      if (e.type === 'click') e.stopPropagation();
      resetIdleTimer();
      // При наведении или клике всё сбрасывается к одному случайному матросу
      showSingle(-1, false);
    };

    sailor.addEventListener('mouseenter', triggerAction);
    sailor.addEventListener('click', triggerAction);
  });

  // Дополнительный сброс таймера при движении мыши или касании
  document.addEventListener('mousemove', resetIdleTimer);
  document.addEventListener('touchstart', resetIdleTimer);

  // СРАЗУ при загрузке страницы показываем одного матроса из первых 7
  showSingle(-1, true);
});