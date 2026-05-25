// ══════════════════════════════════════════════
// GENEALOGY — Spirit Genealogy interactive graph
// ══════════════════════════════════════════════
import { State } from './state.js';
import { FRAGMENT_NAMES, GENEALOGY_RINGS } from './constants.js';

export function renderGenealogy() {
  const canvas = document.getElementById('genealogyCanvas');
  if (!canvas) return;

  const rings = GENEALOGY_RINGS;
  const allFragments = [...rings.history.fragments, ...rings.reality.fragments, ...rings.heroes.fragments];
  const collected = State.get('fragments');

  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  const maxR = Math.min(cx, cy) * 0.85;
  const ringRadii = { history: maxR * 0.4, reality: maxR * 0.65, heroes: maxR * 0.88 };

  let html = '';

  // Draw connector lines between rings
  for (const [ringName, ringData] of Object.entries(rings)) {
    const radius = ringRadii[ringName];
    const frags = ringData.fragments;
    const angleStep = (Math.PI * 2) / frags.length;
    const startAngle = ringName === 'heroes' ? Math.PI / 8 : 0;

    frags.forEach((fid, i) => {
      const angle = startAngle + angleStep * i - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      const isCollected = collected.has(fid);
      const name = FRAGMENT_NAMES[fid] || fid;

      html += `<div class="genealogy-node${isCollected ? ' collected' : ''}"
        style="left:${x}px;top:${y}px"
        title="${name}${isCollected ? ' ✓ 已收集' : ''}"
        onclick="window._showFragmentInfo('${fid}','${name}')">${isCollected ? '★' : '●'}</div>`;
    });
  }

  // Center star
  html += `<div style="position:absolute;left:${cx}px;top:${cy}px;width:64px;height:64px;
    background:var(--gold-foil);clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
    display:flex;align-items:center;justify-content:center;font-size:22px;z-index:10;
    box-shadow:0 0 30px rgba(255,215,0,0.6);animation:starPulse 3s ease-in-out infinite;
    transform:translate(-50%,-50%);"
    title="红色精神核心">🔥</div>`;

  // Ring labels
  for (const [ringName, ringData] of Object.entries(rings)) {
    const radius = ringRadii[ringName];
    html += `<div style="position:absolute;left:${cx - 36}px;top:${cy + radius - 12}px;
      color:${ringData.color};font-size:0.75rem;letter-spacing:3px;font-family:var(--font-serif);pointer-events:none;text-align:center;width:72px;">
      ${ringData.label}</div>`;
  }

  canvas.innerHTML = html;
}

// Fragment info panel (global)
window._showFragmentInfo = function(fid, name) {
  const collected = State.get('fragments').has(fid);
  const existing = document.querySelector('.genealogy-info-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.className = 'genealogy-info-popup';
  popup.style.cssText = `
    position:fixed;bottom:40px;left:50%;transform:translateX(-50%);z-index:3000;
    padding:16px 28px;background:rgba(74,0,0,0.95);border:1px solid var(--gold-foil);
    border-radius:12px;color:var(--gold-pale);font-size:0.92rem;letter-spacing:3px;
    box-shadow:0 8px 32px rgba(0,0,0,0.6);text-align:center;
  `;
  popup.innerHTML = `${collected ? '★' : '○'} <strong>${name}</strong> — ${collected ? '已收集 ✓' : '待探索 → 前往对应页面收集'}`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2500);
};
