// ══════════════════════════════════════════════
// PARTICLES — Constellation background system
// ══════════════════════════════════════════════
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
const PARTICLE_COUNT = 100;
const CONNECT_DIST = 120;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * H;
  }
  reset() {
    this.x = Math.random() * W;
    this.y = -10;
    this.r = Math.random() * 2 + 0.8;
    this.v = Math.random() * 0.35 + 0.12;
    this.a = Math.random() * 0.4 + 0.15;
    this.waveAmp = Math.random() * 1.8 + 0.5;
    this.waveFreq = Math.random() * 0.01 + 0.004;
  }
  update() {
    this.y += this.v;
    this.x += Math.sin(this.y * this.waveFreq) * this.waveAmp * 0.3;
    if (this.y > H + 15) this.reset();
    // wrap horizontally
    if (this.x < -10) this.x = W + 10;
    if (this.x > W + 10) this.x = -10;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,168,67,${this.a})`;
    ctx.fill();
  }
}

// Initialize particles
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = new Particle();
  p.y = Math.random() * H;
  particles.push(p);
}

// Draw connecting lines between nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST) {
        const alpha = (1 - dist / CONNECT_DIST) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

export function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

// Adjust particle density based on page
export function setParticleDensity(pageId) {
  const densityMap = {
    'landing': 1.2,
    'prologue': 1.0,
    'hub': 0.8,
    'history-section': 1.1,
    'reality-section': 1.0,
    'future-section': 0.9,
    'summary': 1.3
  };
  const factor = densityMap[pageId] || 1.0;
  particles.forEach(p => {
    p.v = (Math.random() * 0.35 + 0.12) * factor;
    p.a = Math.min(0.6, (Math.random() * 0.4 + 0.15) * factor);
  });
}
