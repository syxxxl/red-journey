// ══════════════════════════════════════════════
// APP — Entry point, bootstraps everything
// ══════════════════════════════════════════════
import { navigateTo, updateTopBar, updateTopNav } from './navigation.js';
import { animateParticles } from './particles.js';
import { initMouseSparks, initScrollReveal, typewriterText } from './effects.js';
import {
  expandTimeline, collectFragment, initQuiz, handleQuizClick,
  submitPledge, selectFuture, buildSummary, resetAll, initSubNav
} from './features.js';
import { QUIZ_DATA, HERO_DATA, VOICE_QUOTES } from './constants.js';
import { init3DCards } from './cards3d.js';
import { renderGenealogy } from './genealogy.js';
import { renderMap } from './map.js';

// ── Expose to global scope ──
window._navigateTo = navigateTo;
window.expandTimeline = expandTimeline;
window.collectFragment = collectFragment;
window.submitPledge = submitPledge;
window.selectFuture = selectFuture;

window.navigateTo = function(pageId) {
  if (pageId === 'summary') buildSummary();
  if (pageId === 'genealogy-section') {
    setTimeout(() => renderGenealogy(), 400);
  }
  if (pageId === 'reality-section') {
    // Inject map if the map-container doesn't exist yet in loc-overview
    setTimeout(() => {
      const overview = document.getElementById('loc-overview');
      if (overview && !overview.querySelector('.map-container')) {
        const mapDiv = document.createElement('div');
        mapDiv.innerHTML = '<div class="map-container" id="journeyMap" style="margin-top:30px"></div>';
        overview.appendChild(mapDiv.firstElementChild);
        renderMap('journeyMap');
      }
    }, 500);
  }
  navigateTo(pageId);
};

window.resetAll = function() {
  resetAll();
  navigateTo('landing');
};

// ── Voice carousel ──
let voiceIndex = 0;
let voiceAutoTimer = null;

function showVoice(index) {
  const quote = VOICE_QUOTES[index];
  if (!quote) return;
  voiceIndex = index;
  const textEl = document.getElementById('voiceText');
  const attrEl = document.getElementById('voiceAttr');
  typewriterText(textEl, quote.text, 45, () => {
    attrEl.textContent = '—— ' + quote.author + '  |  ' + quote.context;
  });
  // Update dots
  document.querySelectorAll('.voice-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

window.nextVoice = function() {
  voiceIndex = (voiceIndex + 1) % VOICE_QUOTES.length;
  showVoice(voiceIndex);
  resetVoiceAuto();
};
window.prevVoice = function() {
  voiceIndex = (voiceIndex - 1 + VOICE_QUOTES.length) % VOICE_QUOTES.length;
  showVoice(voiceIndex);
  resetVoiceAuto();
};

function resetVoiceAuto() {
  if (voiceAutoTimer) clearTimeout(voiceAutoTimer);
  voiceAutoTimer = setTimeout(() => {
    voiceIndex = (voiceIndex + 1) % VOICE_QUOTES.length;
    showVoice(voiceIndex);
    resetVoiceAuto();
  }, 10000);
}

function initVoices() {
  // Create dots
  const dotsContainer = document.getElementById('voiceDots');
  VOICE_QUOTES.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'voice-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => { showVoice(i); resetVoiceAuto(); };
    dotsContainer.appendChild(dot);
  });
  showVoice(0);
  resetVoiceAuto();
}

// ── Hero gallery ──
function initHeroes() {
  const scroll = document.getElementById('heroesScroll');
  if (!scroll || scroll.children.length > 0) return;

  HERO_DATA.forEach(hero => {
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.innerHTML = `
      <div class="hero-portrait">${hero.emoji}</div>
      <div class="hero-info">
        <h4>${hero.name}</h4>
        <div class="hero-role">${hero.role}</div>
        <div class="hero-years">${hero.years}</div>
        <div class="hero-bio">${hero.bio}</div>
        <div class="hero-quote">${hero.quote}</div>
      </div>
    `;
    card.addEventListener('click', function() {
      if (hero.fragmentId) collectFragment(hero.fragmentId);
    });
    scroll.appendChild(card);
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  animateParticles();
  initMouseSparks();
  const sr = initScrollReveal();
  initSubNav();
  init3DCards();
  initHeroes();
  initVoices();

  // Init quizzes
  Object.keys(QUIZ_DATA).forEach(id => initQuiz(id));

  // Quiz click handler
  document.addEventListener('click', function(e) {
    const opt = e.target.closest('.quiz-opt');
    if (opt) handleQuizClick(opt);
  });

  // Pledge enter key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement === document.getElementById('pledgeInput')) {
      submitPledge();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (document.activeElement.tagName === 'INPUT') return;
    const current = document.querySelector('.page.active');
    if (!current) return;
    if (current.id === 'hub') {
      if (e.key === '1') navigateTo('history-section');
      if (e.key === '2') navigateTo('reality-section');
      if (e.key === '3') navigateTo('future-section');
    }
    if (current.id === 'voices-section') {
      if (e.key === 'ArrowLeft') window.prevVoice();
      if (e.key === 'ArrowRight') window.nextVoice();
    }
  });

  // Refresh scroll reveal after nav
  const origNavigate = window.navigateTo;
  window.navigateTo = function(pageId) {
    origNavigate(pageId);
    setTimeout(() => sr.refresh(), 800);
  };

  updateTopBar();
  updateTopNav();

  // Console branding
  console.log('%c薪火新程 %c赤色华章 %c2026',
    'font-size:28px;color:#FFD700;font-weight:bold',
    'font-size:16px;color:#FF4444',
    'color:#DE2910');
  console.log('%c建党105周年 · 长征胜利90周年 | 历史·现实·未来',
    'font-size:14px;color:#FFD700');
  console.log('%c20枚精神碎片等你收集 | 15道知识闯关 | 8位英雄 | 10条名言 | 青春誓言墙',
    'font-size:12px;color:#FF6666');
});
