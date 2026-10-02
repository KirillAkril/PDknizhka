/* ==========================================================================
   page1.js — интерактив страницы 1: раскачивание мальчика на стуле
   мышкой или гироскопом телефона.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var boy = document.getElementById('Boy');
  if (!boy) return;

  // Максимальный угол наклона стула в градусах
  var MAX_TILT_DEG = 12;

  var targetAngle = 0;
  var currentAngle = 0;
  var isGyroActive = false;

  /* ==========================================================
     1. Движение мыши (ПК / Ноутбуки)
     ========================================================== */
  function onMouseMove(e) {
    if (isGyroActive) return; // если активен датчик движения, мышь не перебивает

    var halfWidth = window.innerWidth / 2;
    // Значение от -1 (крайний левый край) до +1 (крайний правый край)
    var normalizedX = (e.clientX - halfWidth) / halfWidth;
    normalizedX = Math.max(-1, Math.min(1, normalizedX));

    targetAngle = normalizedX * MAX_TILT_DEG;
  }

  // При уходе мыши с окна стул плавно возвращается в исходное положение
  function onMouseLeave() {
    if (!isGyroActive) {
      targetAngle = 0;
    }
  }

  window.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseleave', onMouseLeave);

  /* ==========================================================
     2. Гироскоп / Акселерометр (Смартфоны)
     ========================================================== */
  function onOrientation(e) {
    var gamma = e.gamma; // Наклон влево-вправо (-90 до +90)
    if (typeof gamma === 'number' && !isNaN(gamma)) {
      isGyroActive = true;
      // Ограничиваем угол поворота устройства рабочим диапазоном ±30 градусов
      var clampedGamma = Math.max(-30, Math.min(30, gamma));
      // Переводим в целевой угол наклона мальчика
      targetAngle = (clampedGamma / 30) * MAX_TILT_DEG;
    }
  }

  // Запрос разрешений для iOS 13+
  function initOrientation() {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      // На iOS вызов разрешен только по первому клику/тапу пользователя
      var handleFirstInteraction = function () {
        DeviceOrientationEvent.requestPermission()
          .then(function (permission) {
            if (permission === 'granted') {
              window.addEventListener('deviceorientation', onOrientation);
            }
          })
          .catch(function () {});
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      };

      window.addEventListener('click', handleFirstInteraction, { once: true });
      window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    } else if ('DeviceOrientationEvent' in window) {
      // Для Android и остальных браузеров
      window.addEventListener('deviceorientation', onOrientation);
    }
  }

  initOrientation();

  /* ==========================================================
     3. Анимационный цикл (интерполяция для плавности движения)
     ========================================================== */
  function render() {
    // Коэффициент сглаживания (0.1 = мягкое затухание)
    currentAngle += (targetAngle - currentAngle) * 0.1;

    // Применяем вращение
    boy.style.transform = 'rotate(' + currentAngle.toFixed(2) + 'deg)';

    requestAnimationFrame(render);
  }

  render();
});