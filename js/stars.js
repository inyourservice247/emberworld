// ── STARS ────────────────────────────────────────────────────

function projectStar(lon, lat) {
  const c = document.getElementById('sky-canvas');
  const W = c.width, H = c.height;
  const yr = yaw   * Math.PI / 180;
  const pr = pitch * Math.PI / 180;
  const lr = lon   * Math.PI / 180;
  const ar = lat   * Math.PI / 180;

  let x = Math.cos(ar) * Math.sin(lr);
  let y = Math.sin(ar);
  let z = -Math.cos(ar) * Math.cos(lr);

  const cy = Math.cos(-yr), sy = Math.sin(-yr);
  const x1 = cy*x + sy*z, z1 = -sy*x + cy*z;
  x = x1; z = z1;

  const cp = Math.cos(-pr), sp = Math.sin(-pr);
  const y2 = cp*y - sp*z, z2 = sp*y + cp*z;
  y = y2; z = z2;

  if (z >= 0) return null;

  const fr  = fov * Math.PI / 180;
  const f   = 1 / Math.tan(fr * 0.5);
  const asp = W / H;
  const px  = (x / (-z)) * f / asp;
  const py  = (y / (-z)) * f;

  if (px < -1 || px > 1 || py < -1 || py > 1) return null;

  return {
    sx: (px + 1) * 0.5 * W,
    sy: (1 - (py + 1) * 0.5) * H
  };
}

function updateStarPositions() {
  poems.forEach(p => {
    const el  = document.getElementById('star-' + p.id);
    const lbl = document.getElementById('lbl-'  + p.id);
    if (!el) return;
    const pos = projectStar(p.lon, p.lat);
    if (!pos) {
      el.style.display = 'none';
      if (lbl) lbl.style.display = 'none';
    } else {
      el.style.display  = 'block';
      el.style.left     = pos.sx + 'px';
      el.style.top      = pos.sy + 'px';
      if (lbl && !p.hidden) {
        lbl.style.display = 'block';
        lbl.style.left    = pos.sx + 'px';
        lbl.style.top     = (pos.sy + p.size + 6) + 'px';
      }
    }
  });
}

function buildStars() {
  const layer = document.getElementById('stars-layer');
  poems.forEach(p => {
    const el = document.createElement('div');
    el.id = 'star-' + p.id;
    el.className = 'star-dot';
    const g1 = `0 0 ${p.size*2}px rgba(255,220,120,${p.brightness*0.7})`;
    const g2 = `0 0 ${p.size*3}px rgba(255,235,150,${p.brightness*0.9})`;
    el.style.cssText = `
      width:${p.size*2}px;
      height:${p.size*2}px;
      background:radial-gradient(circle,
        rgba(255,245,200,${p.brightness}) 0%,
        rgba(255,210,100,${p.brightness*0.4}) 60%,
        transparent 100%);
      box-shadow:${g1};
      animation:starPulse ${(2+Math.random()*2).toFixed(1)}s ease-in-out infinite;
    `;

    const handler = () => { stopAutoRotate(); openPoem(p); };
    el.addEventListener('click', handler);
    el.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      handler();
    }, { passive: false });

    layer.appendChild(el);

    if (!p.hidden) {
      const lbl = document.createElement('div');
      lbl.id = 'lbl-' + p.id;
      lbl.className = 'star-label';
      lbl.textContent = p.title;
      layer.appendChild(lbl);
    }
  });
}
