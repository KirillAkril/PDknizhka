/* ==========================================================================
   page3.js — анимация по 1 клику
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('scene');
  const img31 = document.getElementById('img31');
  const img32 = document.getElementById('img32');
  const img33 = document.getElementById('img33');

  if (!scene || !img31 || !img32 || !img33) return;

  let isStarted = false; // Защита от повторных нажатий

  scene.addEventListener('click', () => {
    if (isStarted) return; // Если уже нажали — ничего не делаем
    isStarted = true;

    // Шаг 1: Сразу меняем 31 на 32
    img31.classList.remove('active');
    img32.classList.add('active');

    // Шаг 2: Через 1 секунду (1000 миллисекунд) меняем 32 на 33
    setTimeout(() => {
      img32.classList.remove('active');
      img33.classList.add('active');
    }, 1000);
  });
});