// ── INPUT — TOUCH & MOUSE ────────────────────────────────────

function setupInput() {
  const canvas = document.getElementById('sky-canvas');
  let drag = false;
  let lastX = 0, lastY = 0, lastDist = 0;
  let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
  let moved = false;

  // ── MOUSE ──
  canvas.addEventListener('mousedown', e => {
    drag = true; moved = false;
    lastX = e.clientX; lastY = e.clientY;
    stopAutoRotate();
  });

  window.addEventListener('mousemove', e => {
    if (!drag) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
    targetYaw   -= dx * 0.2;
    targetPitch += dy * 0.15;
    targetPitch = Math.max(-60, Math.min(60, targetPitch));
    lastX = e.clientX; lastY = e.clientY;
  });

  window.addEventListener('mouseup', e => {
    // if barely moved + coord picker on → save coord
    if (!moved && coordPickerOn) {
      saveCoord(e.clientX, e.clientY);
    }
    drag = false;
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    fov = Math.max(40, Math.min(120, fov + e.deltaY * 0.05));
    renderGL();
  }, { passive: false });

  // ── TOUCH ──
  document.addEventListener('touchstart', function(e) {
    // let the poem overlay and coord hud handle their own touches
    if (document.getElementById('poem-overlay').classList.contains('open')) return;
    if (document.getElementById('coord-hud').contains(e.target)) return;
    if (document.getElementById('coord-toggle').contains(e.target)) return;
    if (document.getElementById('close-btn').contains(e.target)) return;

    e.preventDefault();
    drag = true; moved = false;
    touchStartX = lastX = e.touches[0].clientX;
    touchStartY = lastY = e.touches[0].clientY;
    touchStartTime = Date.now();

    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist = Math.sqrt(dx*dx + dy*dy);
    }
    stopAutoRotate();
  }, { passive: false });

  document.addEventListener('touchmove', function(e) {
    if (document.getElementById('poem-overlay').classList.contains('open')) return;
    if (document.getElementById('coord-hud').contains(e.target)) return;
    e.preventDefault();
    if (!drag) return;

    if (e.touches.length === 2) {
      // pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      fov = Math.max(40, Math.min(120, fov + (lastDist - dist) * 0.15));
      lastDist = dist;
      renderGL();
    } else {
      // pan
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      targetYaw   -= dx * 0.25;
      targetPitch += dy * 0.2;
      targetPitch = Math.max(-60, Math.min(60, targetPitch));
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }
  }, { passive: false });

  document.addEventListener('touchend', function(e) {
    const duration   = Date.now() - touchStartTime;
    const totalMove  = Math.abs(e.changedTouches[0].clientX - touchStartX)
                     + Math.abs(e.changedTouches[0].clientY - touchStartY);
    const isTap      = duration < 250 && totalMove < 12;
    const onStar     = e.target.classList.contains('star-dot');
    const onUI       = document.getElementById('coord-hud').contains(e.target)
                    || document.getElementById('coord-toggle').contains(e.target);

    // tap on sky with coord picker on → save coord
    if (isTap && coordPickerOn && !onStar && !onUI) {
      saveCoord(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
    drag = false;
  }, { passive: false });
}
