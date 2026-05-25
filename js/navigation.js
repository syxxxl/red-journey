// ══════════════════════════════════════════════
// NAVIGATION — Silk curtain transitions
// ══════════════════════════════════════════════
import { State } from './state.js';
import { ALL_PAGES, PAGE_NAMES } from './constants.js';
import { setParticleDensity } from './particles.js';

let threeDimensionsShown = false;
let isTransitioning = false;

function curtainClose(callback) {
  if (isTransitioning) return;
  isTransitioning = true;
  const curtain = document.getElementById('curtain');
  curtain.classList.add('closed');
  setTimeout(() => {
    callback();
    setTimeout(() => {
      curtain.classList.remove('closed');
      setTimeout(() => { isTransitioning = false; }, 500);
    }, 80);
  }, 450);
}

export function navigateTo(pageId) {
  if (isTransitioning) return;
  const currentActive = document.querySelector('.page.active');
  if (currentActive && currentActive.id === pageId) return;

  if (currentActive) {
    currentActive.classList.add('exiting');
    currentActive.classList.remove('active');
    setTimeout(() => currentActive.classList.remove('exiting'), 500);
  }

  const target = document.getElementById(pageId);
  if (!target) return;

  curtainClose(() => {
    target.classList.add('active');
    target.scrollTop = 0;
  });

  State._data.pageHistory.push(pageId);
  State._data.currentPage = pageId;

  if (ALL_PAGES.includes(pageId) && pageId !== 'landing' && pageId !== 'prologue') {
    State.addVisited(pageId);
  }

  updateTopBar();
  updateTopNav();
  updateBreadcrumb(pageId);
  setParticleDensity(pageId);

  // Timeline animation on history page
  if (pageId === 'history-section') {
    setTimeout(() => {
      document.querySelectorAll('.timeline-event').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });
    }, 600);
  }

  // Scroll reveal refresh
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
      el.classList.add('revealed');
    });
  }, 800);

  // Three dimensions achievement
  const v = State.get('visited');
  if (!threeDimensionsShown && v.has('history-section') && v.has('reality-section') && v.has('future-section')) {
    threeDimensionsShown = true;
    import('./effects.js').then(m => {
      setTimeout(() => m.showAchievement('🏆', '三维探索者：你已走完历史·现实·未来全部旅程！'), 600);
    });
  }
}

export function updateTopBar() {
  const total = 10;
  const pct = Math.min(State.get('visited').size, total) / total * 100;
  document.getElementById('topBar').style.transform = `scaleX(${pct / 100})`;
}

export function updateTopNav() {
  const current = document.querySelector('.page.active');
  document.getElementById('topNav').classList.toggle('show', current && current.id !== 'landing');
}

export function updateBreadcrumb(pageId) {
  const bc = document.getElementById('breadcrumb');
  if (pageId === 'landing') {
    bc.classList.remove('show');
    return;
  }
  bc.classList.add('show');
  let html = '<span onclick="window._navigateTo(\'landing\')">首页</span>';
  if (pageId === 'prologue') {
    html += '<span class="sep">›</span><span>团队简介</span>';
  } else if (pageId === 'hub') {
    html += '<span class="sep">›</span><span>寻访枢纽</span>';
  } else if (pageId === 'summary') {
    html += '<span class="sep">›</span><span onclick="window._navigateTo(\'hub\')">寻访枢纽</span><span class="sep">›</span><span>寻访总结</span>';
  } else if (pageId === 'genealogy-section') {
    html += '<span class="sep">›</span><span onclick="window._navigateTo(\'hub\')">寻访枢纽</span><span class="sep">›</span><span>精神谱系</span>';
  } else if (pageId === 'heroes-section') {
    html += '<span class="sep">›</span><span onclick="window._navigateTo(\'hub\')">寻访枢纽</span><span class="sep">›</span><span>英雄谱</span>';
  } else if (pageId === 'voices-section') {
    html += '<span class="sep">›</span><span onclick="window._navigateTo(\'hub\')">寻访枢纽</span><span class="sep">›</span><span>薪火之声</span>';
  } else {
    html += '<span class="sep">›</span><span onclick="window._navigateTo(\'hub\')">寻访枢纽</span><span class="sep">›</span><span>' + (PAGE_NAMES[pageId] || pageId) + '</span>';
  }
  bc.innerHTML = html;
}
