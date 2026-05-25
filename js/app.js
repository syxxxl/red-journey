// ══════════════════════════════════════════════
// APP — Entry point, bootstraps everything
// ══════════════════════════════════════════════
import { navigateTo, updateTopBar, updateTopNav } from './navigation.js';
import { animateParticles } from './particles.js';
import { initMouseSparks, initScrollReveal } from './effects.js';
import {
  expandTimeline, collectFragment, initQuiz, handleQuizClick,
  submitPledge, selectFuture, buildSummary, resetAll, initSubNav
} from './features.js';
import { QUIZ_DATA } from './constants.js';

// Expose functions to global scope for onclick handlers
window._navigateTo = navigateTo;
window.expandTimeline = expandTimeline;
window.collectFragment = collectFragment;
window.submitPledge = submitPledge;
window.selectFuture = selectFuture;

// Navigation wrapper that also builds summary
window.navigateTo = function(pageId) {
  if (pageId === 'summary') buildSummary();
  navigateTo(pageId);
};

// Reset wrapper
window.resetAll = function() {
  resetAll();
  navigateTo('landing');
};

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Start particle animation
  animateParticles();

  // Init mouse sparks
  initMouseSparks();

  // Init scroll reveal
  const sr = initScrollReveal();

  // Init sub-navigation
  initSubNav();

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

  // Keyboard shortcuts for hub
  document.addEventListener('keydown', function(e) {
    if (document.activeElement.tagName === 'INPUT') return;
    const current = document.querySelector('.page.active');
    if (!current || current.id !== 'hub') return;
    if (e.key === '1') navigateTo('history-section');
    if (e.key === '2') navigateTo('reality-section');
    if (e.key === '3') navigateTo('future-section');
  });

  // Initial state
  updateTopBar();
  updateTopNav();

  // Refresh scroll reveal after nav changes
  const origNavigate = window.navigateTo;
  window.navigateTo = function(pageId) {
    origNavigate(pageId);
    setTimeout(() => sr.refresh(), 700);
  };

  // Console branding
  console.log('%c薪火新程 %c红色寻访实践团 %c2026',
    'font-size:28px;color:#C9A84C;font-weight:bold',
    'font-size:16px;color:#E0E0E0',
    'color:#C41E3A');
  console.log('%c建党105周年 · 长征胜利90周年 | 历史·现实·未来',
    'font-size:14px;color:#4FC3F7');
  console.log('%c12枚精神碎片等你收集 | 3组知识闯关 | 青春誓言墙 | 6条未来道路',
    'font-size:12px;color:#A0A0B8');
});
