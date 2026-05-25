// ══════════════════════════════════════════════
// PARTICLES — Red Star particle system
// ══════════════════════════════════════════════

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const MAX = 80;
let globalAlpha = 0.55;
let globalSpeed = 0.35;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Draw a 5-pointed star
function drawStar(cx, cy, r, alpha) {
  const spikes = 5;
  const outerR = r;
  const innerR = r * 0.4;
  let rot = Math.PI / 2 * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerR;
    let y = cy - Math.sin(rot) * outerR;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerR;
    y = cy - Math.sin(rot) * innerR;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(255,215,0,${alpha})`;
  ctx.shadowColor = `rgba(255,80,20,${alpha * 0.8})`;
  ctx.shadowBlur = r * 1.2;
  ctx.fill();
  ctx.shadowBlur = 0;
}

class Particle {
  constructor() {
    this.reset(true);
  }
  reset(initial) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
    this.size = 1.5 + Math.random() * 5;
    this.speedY = -(0.15 + Math.random() * globalSpeed);
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = (Math.random() - 0.5) * 0.02;
    this.alpha = 0.15 + Math.random() * globalAlpha;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.wobble) * 0.3;
    this.wobble += this.wobbleSpeed;
    if (this.y < -20) { this.y = canvas.height + 20; this.x = Math.random() * canvas.width; }
    if (this.x < -20) this.x = canvas.width + 20;
    if (this.x > canvas.width + 20) this.x = -20;
  }
  draw() {
    drawStar(this.x, this.y, this.size, this.alpha);
  }
}

for (let i = 0; i < MAX; i++) {
  particles.push(new Particle());
}

export function setParticleDensity(pageId) {
  const map = { 'landing': 0.65, 'history-section': 0.7, 'reality-section': 0.55, 'future-section': 0.5, 'heroes-section': 0.6, 'voices-section': 0.35, 'summary': 0.75 };
  globalAlpha = map[pageId] || 0.5;
  globalSpeed = globalAlpha * 0.7;
  particles.forEach(p => { p.alpha = 0.15 + Math.random() * globalAlpha; p.speedY = -(0.15 + Math.random() * globalSpeed); });
}

export function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Constellation lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        const alpha = (1 - dist / 110) * 0.12;
        ctx.strokeStyle = `rgba(255,215,0,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
