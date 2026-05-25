// ══════════════════════════════════════════════
// CARDS3D — 3D card flip for hub & hero cards
// ══════════════════════════════════════════════

export function init3DCards() {
  // Add 3D flip to path cards on hover (desktop only)
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.path-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-16px)`;
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });

  // Hero cards tilt
  document.querySelectorAll('.hero-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
}

// ── 3D flip on click (for hero cards) ──
export function flipCard(cardEl) {
  cardEl.classList.toggle('flipped');
}
