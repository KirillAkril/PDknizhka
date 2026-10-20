document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('scene');
  const anchor = document.getElementById('page5-anchor');

  if (!scene || !anchor) return;

  const shakeTargets = [
    document.getElementById('faza1'),
    document.getElementById('page5-hand'),
    document.getElementById('page5-deck')
  ].filter(Boolean);

  function replayShake() {
    scene.classList.remove('is-shaking');
    void scene.offsetWidth;
    scene.classList.add('is-shaking');
  }

  function pushAnchor() {
    const minX = 28;
    const maxX = 38;
    const minY = 85;
    const maxY = 95;

    const currentX = parseFloat(anchor.style.left) || 36.41;
    const currentY = parseFloat(anchor.style.top) || 88.05;

    let nextX;
    let nextY;

    // Выбираем случайную точку подальше от текущей.
    do {
      nextX = minX + Math.random() * (maxX - minX);
      nextY = minY + Math.random() * (maxY - minY);
    } while (Math.hypot(nextX - currentX, nextY - currentY) < 6);

    anchor.style.left = `${nextX}%`;
    anchor.style.top = `${nextY}%`;
    anchor.style.transform = `rotate(${Math.random() * 120 - 60}deg)`;
  }

  // Первое качание после загрузки.
  window.setTimeout(replayShake, 200);

  // Нажатие на фон, руку или палубу запускает качание заново.
  shakeTargets.forEach(target => {
    target.addEventListener('click', replayShake);
  });

  // Каждое нажатие толкает якорь в новое случайное место.
  anchor.addEventListener('click', pushAnchor);

  anchor.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      pushAnchor();
    }
  });
});