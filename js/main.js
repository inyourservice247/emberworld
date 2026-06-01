// ── MAIN ─────────────────────────────────────────────────────
// This file just boots everything in the right order.

function enterWorld() {
  const intro = document.getElementById('intro');
  intro.classList.add('fade-out');

  setTimeout(() => {
    intro.style.display = 'none';
    document.getElementById('world').classList.add('visible');
    document.getElementById('moon-label').textContent = getMoonPhase();
    document.getElementById('coord-toggle').style.display = 'block';

    initGL();        // webgl.js  — start the sky renderer
    buildStars();    // stars.js  — place star elements
    setupInput();    // input.js  — touch and mouse
    startShootingStars(); // ui.js — shooting stars canvas

    animating = true;
    animateGL();     // webgl.js  — start render loop
  }, 1400);
}

// Boot the entry screen stars immediately
buildBgStars();
