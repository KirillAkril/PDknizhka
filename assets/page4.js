/* ==========================================================================
   page4.js — логика засыпания и пробуждения (фаза 1 длится 5 секунд)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('scene');
  const faza1 = document.getElementById('faza1');
  const faza2 = document.getElementById('faza2');
  const faza3 = document.getElementById('faza3');
  const faza4 = document.getElementById('faza4');
  const legs = document.querySelectorAll('.leg');

  if (!scene || !faza1 || !faza2 || !faza3 || !faza4) return;

  const phases = [faza1, faza2, faza3, faza4];
  let currentPhase = 0;
  let sleepTimer = null;
  let isSleeping = false;

  function startFallingAsleep() {
    isSleeping = false;
    scene.classList.remove('can-wake-up');
    currentPhase = 0;
    
    // Возвращаем ноги в исходное состояние при сбросе
    legs.forEach(leg => {
      leg.style.display = 'block';
      leg.classList.remove('hiding');
    });
    
    updatePhases();

    // ПЕРХОД С ФАЗЫ 1 НА ФАЗУ 2 (Длительность фазы 1 увеличена до 5 секунд)
    sleepTimer = setTimeout(() => {
      
      // Переключаем фон и отдельные ноги в одном кадре: так между
      // фазами не появляется мальчик без ног из-за перекрывающегося fade.
      scene.classList.add('phase-switching');
      legs.forEach(leg => {
        leg.style.display = 'none';
        leg.classList.remove('hiding');
      });
      currentPhase = 1; // фаза 2
      updatePhases();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        scene.classList.remove('phase-switching');
      }));

      // Переход фазы 2 -> 3 через 2 секунды
      sleepTimer = setTimeout(() => {
        currentPhase = 2; // фаза 3
        updatePhases();

        // Переход фазы 3 -> 4 (полностью заснул) через 2 секунды
        sleepTimer = setTimeout(() => {
          currentPhase = 3; // фаза 4
          updatePhases();
          isSleeping = true;
          scene.classList.add('can-wake-up');
        }, 2000);
      }, 2000);

    }, 5000); // Фаза 1 длится 5 секунд
  }

  function updatePhases() {
    phases.forEach((phase, index) => {
      if (index === currentPhase) {
        phase.classList.add('active');
      } else {
        phase.classList.remove('active');
      }
    });
  }

  // Клик по заснувшему мальчику для пробуждения
  scene.addEventListener('click', () => {
    if (isSleeping) {
      clearTimeout(sleepTimer);
      startFallingAsleep();
    }
  });

  // Старт анимации при загрузке
  startFallingAsleep();
});