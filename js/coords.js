// ── COORDINATE PICKER ────────────────────────────────────────
// Press 📍 coords button to activate.
// Tap anywhere on the sky → saves lon/lat to log + copies to clipboard.
// Use these values in poems.js to place new stars.

let coordPickerOn = false;
const coordLog = [];

function toggleCoordPicker() {
  coordPickerOn = !coordPickerOn;
  const hud = document.getElementById('coord-hud');
  const btn = document.getElementById('coord-toggle');
  hud.classList.toggle('open', coordPickerOn);
  btn.textContent = coordPickerOn ? '✕ close' : '📍 coords';
}

function clearCoords() {
  coordLog.length = 0;
  document.getElementById('coord-log-list').innerHTML = '';
  document.getElementById('coord-current').textContent = 'tap anywhere on the sky to get coordinates';
}

function screenToSkyCoords(clientX, clientY) {
  const c = document.getElementById('sky-canvas');
  const W = c.width, H = c.height;
  const nx = (clientX / W) * 2 - 1;
  const ny = 1 - (clientY / H) * 2;
  const fr  = fov * Math.PI / 180;
  const f   = 1 / Math.tan(fr * 0.5);
  const asp = W / H;
  let rx = nx / f * asp, ry = ny / f, rz = -1;
  const len = Math.sqrt(rx*rx + ry*ry + rz*rz);
  rx /= len; ry /= len; rz /= len;
  const yr = yaw   * Math.PI / 180;
  const pr = pitch * Math.PI / 180;
  const cy = Math.cos(yr), sy = Math.sin(yr);
  const cp = Math.cos(pr), sp = Math.sin(pr);
  const x1 = cy*rx + sy*rz, z1 = -sy*rx + cy*rz;
  const y2 = cp*ry - sp*z1, z2 =  sp*ry + cp*z1;
  const lon = (Math.atan2(x1, -z2) * 180 / Math.PI).toFixed(1);
  const lat = (Math.asin(Math.max(-1, Math.min(1, y2))) * 180 / Math.PI).toFixed(1);
  return { lon, lat };
}

function saveCoord(clientX, clientY) {
  const { lon, lat } = screenToSkyCoords(clientX, clientY);
  const entry = `lon: ${lon},  lat: ${lat}`;
  coordLog.unshift(entry);
  navigator.clipboard.writeText(`lon: ${lon}, lat: ${lat}`).catch(() => {});
  document.getElementById('coord-current').textContent = `✓ copied: ${entry}`;
  const list = document.getElementById('coord-log-list');
  list.innerHTML = coordLog.slice(0, 12).map(c => `<div>📋 ${c}</div>`).join('');
}

// live coords on mouse hover (desktop)
document.addEventListener('mousemove', function(e) {
  if (!coordPickerOn) return;
  const { lon, lat } = screenToSkyCoords(e.clientX, e.clientY);
  document.getElementById('coord-current').textContent = `lon: ${lon}   lat: ${lat}   (tap to save)`;
});
