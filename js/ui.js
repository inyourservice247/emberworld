// ── UI ───────────────────────────────────────────────────────

// ── MOON PHASE ──
const LAUNCH = new Date('2024-01-01').getTime();
function getMoonPhase() {
  const elapsed = (Date.now() - LAUNCH) / 86400000;
  const phases = [
    'new moon', 'waxing crescent', 'first quarter', 'waxing gibbous',
    'full moon', 'waning gibbous', 'last quarter',  'waning crescent'
  ];
  return phases[Math.floor((elapsed % 30) / 30 * 8) % 8];
}

// ── ENTRY SCREEN STARS ──
function buildBgStars() {
  const container = document.getElementById('bg-stars');
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'bg-star';
    const sz = Math.random() * 1.6 + 0.4;
    s.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      --d:${(Math.random()*3+2).toFixed(1)}s;
      --delay:${(Math.random()*4).toFixed(1)}s;
      --min:${(Math.random()*0.08+0.04).toFixed(2)};
      --max:${(Math.random()*0.5+0.15).toFixed(2)};
    `;
    container.appendChild(s);
  }
}

// ── POEM OVERLAY ──
function openPoem(p) {
  const card = document.getElementById('poem-card');
  card.innerHTML = `
    <div class="poem-date">${p.date}</div>
    <div class="poem-title">${p.title}</div>
    <div class="poem-lines">
      ${p.lines.map((l, i) => `
        <span class="poem-line" onclick="toggleComment(${i})">${l.text}</span>
        ${l.comment
          ? `<div class="line-comment" id="lc-${i}">✦ ${l.comment}</div>`
          : `<div style="height:6px"></div>`}
      `).join('')}
    </div>
    ${p.constellation ? `<div class="poem-constellation">${p.constellation}</div>` : ''}
    <div class="poem-divider"></div>
  `;
  document.getElementById('poem-overlay').classList.add('open');
  document.getElementById('close-btn').style.display = 'block';
}

function toggleComment(i) {
  const el = document.getElementById('lc-' + i);
  if (el) el.classList.toggle('show');
}

function closePoem() {
  document.getElementById('poem-overlay').classList.remove('open');
  document.getElementById('close-btn').style.display = 'none';
}

document.getElementById('poem-overlay').addEventListener('click', function(e) {
  if (e.target === this) closePoem();
});

// ── SHOOTING STARS ──
function startShootingStars() {
  const canvas = document.getElementById('shoot-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let shoots = [];

  function spawn() {
    shoots.push({
      x:        Math.random() * canvas.width * 0.7 + 50,
      y:        Math.random() * canvas.height * 0.35 + 20,
      len:      Math.random() * 120 + 60,
      angle:    Math.PI / 6 + Math.random() * 0.3,
      progress: 0,
      speed:    0.025 + Math.random() * 0.015
    });
  }

  function schedule() {
    setTimeout(() => { spawn(); schedule(); }, 12000 + Math.random() * 13000);
  }
  schedule();
  setTimeout(spawn, 4000); // first one early

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shoots = shoots.filter(s => s.progress < 1.2);
    shoots.forEach(s => {
      s.progress += s.speed;
      const p  = Math.min(s.progress, 1);
      const t  = Math.max(0, p - 0.25);
      const x1 = s.x + Math.cos(s.angle) * t * s.len;
      const y1 = s.y + Math.sin(s.angle) * t * s.len;
      const x2 = s.x + Math.cos(s.angle) * p * s.len;
      const y2 = s.y + Math.sin(s.angle) * p * s.len;
      const g  = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, 'rgba(245,235,210,0)');
      g.addColorStop(1, `rgba(245,235,210,${(1-p)*0.85})`);
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath();
      ctx.arc(x2, y2, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,245,220,${(1-p)*0.7})`; ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
}
