document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('scene');
  const background = document.getElementById('page6-background');

  if (!scene || !background) return;

  const isMobileDevice =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const maxMovement = 0.20; // Сдвиг до 20% размера сцены
  const maxTilt = 22;       // Наклон телефона, нужный для полного сдвига

  let baseBeta = null;
  let baseGamma = null;
  let sensorStarted = false;
  let permissionRequested = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function moveBackground(x, y) {
    const bounds = scene.getBoundingClientRect();

    background.style.setProperty(
      '--parallax-x',
      `${x * bounds.width * maxMovement}px`
    );
    background.style.setProperty(
      '--parallax-y',
      `${y * bounds.height * maxMovement}px`
    );
  }

  // Запасной способ управления пальцем или мышью.
  scene.addEventListener('pointermove', event => {
    const bounds = scene.getBoundingClientRect();
    const mouseX = (event.clientX - bounds.left) / bounds.width;
    const mouseY = (event.clientY - bounds.top) / bounds.height;

    moveBackground((0.5 - mouseX) * 2, (0.5 - mouseY) * 2);
  });

  scene.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') {
      moveBackground(0, 0);
    }
  });

  function handleOrientation(event) {
    if (event.beta === null || event.gamma === null) return;

    // Исходное положение телефона принимается за центр.
    if (baseBeta === null || baseGamma === null) {
      baseBeta = event.beta;
      baseGamma = event.gamma;
      return;
    }

    const tiltX = clamp((event.gamma - baseGamma) / maxTilt, -1, 1);
    const tiltY = clamp((event.beta - baseBeta) / maxTilt, -1, 1);

    // Нижний слой смещается в сторону, противоположную наклону.
    moveBackground(-tiltX, -tiltY);
  }

  function startTiltControl() {
    if (sensorStarted) return;

    sensorStarted = true;
    baseBeta = null;
    baseGamma = null;

    window.addEventListener('deviceorientation', handleOrientation, {
      passive: true
    });
  }

  const orientationAPI = window.DeviceOrientationEvent;

  if (!isMobileDevice || !orientationAPI) return;

  if (typeof orientationAPI.requestPermission === 'function') {
    // На iPhone разрешение запрашивается при первом касании,
    // без отдельной кнопки на странице.
    document.addEventListener(
      'pointerdown',
      async () => {
        if (permissionRequested) return;
        permissionRequested = true;

        try {
          const permission = await orientationAPI.requestPermission();

          if (permission === 'granted') {
            startTiltControl();
          }
          // Если пользователь отказал, управление пальцем остаётся доступно.
        } catch (error) {
          // При ошибке датчика продолжает работать управление пальцем.
        }
      },
      { once: true, capture: true }
    );
  } else {
    // На устройствах без отдельного запроса разрешения включаем датчик сразу.
    startTiltControl();
  }
});