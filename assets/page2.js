/* ==========================================================================
   page2.js — интерактив страницы 2: включение/выключение света по клику на лампу
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var lightLayer = document.getElementById('lampon');
  var lampTrigger = document.getElementById('lamp-trigger');

  if (!lightLayer || !lampTrigger) return;

  function toggleLight() {
    lightLayer.classList.toggle('is-lit');
  }

  // Клик или тап по лампе
  lampTrigger.addEventListener('click', toggleLight);

  // Поддержка нажатия с клавиатуры (Enter / Space)
  lampTrigger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLight();
    }
  });
});