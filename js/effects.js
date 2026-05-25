// ══════════════════════════════════════════════
// EFFECTS — Sparks, Toast, Scroll Reveal
// ══════════════════════════════════════════════

// ── Spark particles ──
export function spawnSparks(el, count = 14) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = cx + 'px';
    spark.style.top = cy + 'px';
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 80;
    spark.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
    spark.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  }
}

// Mouse trail sparks (30% chance per move)
export function initMouseSparks() {
  document.addEventListener('mousemove', e => {
    if (Math.random() > 0.7) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 60;
      spark.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
      spark.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 800);
    }
  });
}

// ── Achievement Toast ──
export function showAchievement(icon, text) {
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${text}</span>`;
  document.body.appendChild(toast);
  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3200);
}

// ── Scroll Reveal ──
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Re-scan after navigation
  return {
    refresh() {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => observer.observe(el));
    }
  };
}
