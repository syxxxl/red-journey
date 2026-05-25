// ══════════════════════════════════════════════
// EFFECTS — Sparks, Toast, Scroll Reveal, Typewriter, Count-up
// ══════════════════════════════════════════════

// ── Gold spark particles ──
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
    const dist = 30 + Math.random() * 70;
    spark.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
    spark.style.setProperty('--sy', Math.sin(angle) * dist - 40 - Math.random() * 60 + 'px');
    spark.style.width = (4 + Math.random() * 8) + 'px';
    spark.style.height = spark.style.width;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  }
}

// ── Mouse sparks ──
export function initMouseSparks() {
  document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.25) return;
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = e.clientX + 'px';
    spark.style.top = e.clientY + 'px';
    spark.style.width = '5px'; spark.style.height = '5px';
    spark.style.setProperty('--sx', (Math.random() - 0.5) * 30 + 'px');
    spark.style.setProperty('--sy', (Math.random() - 0.5) * 30 + 'px');
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  });
}

// ── Achievement toast ──
let toastTimer = null;
export function showAchievement(icon, text) {
  if (toastTimer) clearTimeout(toastTimer);
  let toast = document.querySelector('.achievement-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'achievement-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = '<span style="font-size:1.4rem">' + icon + '</span> ' + text;
  requestAnimationFrame(() => toast.classList.add('show'));
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Scroll reveal ──
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

  return {
    refresh() {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => observer.observe(el));
    }
  };
}

// ── Typewriter effect ──
let typewriterTimer = null;
export function typewriterText(element, text, speed = 50, onComplete) {
  if (typewriterTimer) clearInterval(typewriterTimer);
  element.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '|';
  element.appendChild(cursor);

  typewriterTimer = setInterval(() => {
    if (i < text.length) {
      cursor.before(document.createTextNode(text.charAt(i)));
      i++;
    } else {
      clearInterval(typewriterTimer);
      cursor.remove();
      if (onComplete) onComplete();
    }
  }, speed);
}

// ── Count-up animation ──
export function animateCountUp(el, target, duration = 1200) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}
