/* ═══════════════════════════════════════════════
   CivicPulse — app.js  (sidebar-fix + shared JS)
   Load order: app.js → shared-ui.js
   Sidebar DOM is injected by shared-ui.js AFTER
   DOMContentLoaded, so we use a robust late-bind.
═══════════════════════════════════════════════ */

/* ── PARTICLES ── */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const count = window.innerWidth < 768 ? 28 : 52;
  const COLORS = ['rgba(0,229,204,', 'rgba(0,207,255,', 'rgba(147,51,234,'];
  for (let i = 0; i < count; i++) {
    pts.push({
      x: Math.random() * 1400, y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.3 + 0.4,
      c: COLORS[Math.floor(Math.random() * 3)],
      a: Math.random() * 0.28 + 0.07
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')'; ctx.fill();
    });
    if (W > 768) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,229,204,${0.028 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── COUNTERS ── */
function animateCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = +el.dataset.counter;
    const dur = 1300;
    const start = performance.now();
    setTimeout(() => {
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, 300);
  });
}

/* ── RIPPLE ── */
function ripple(el) {
  const r = document.createElement('span');
  r.style.cssText = 'position:absolute;border-radius:50%;background:rgba(0,229,204,0.2);width:80px;height:80px;left:50%;top:50%;transform:translate(-50%,-50%) scale(0);animation:rippleAnim 0.5s ease forwards;pointer-events:none;z-index:10;';
  const pos = getComputedStyle(el).position;
  if (pos === 'static') el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(r);
  setTimeout(() => r.remove(), 550);
}
// alias used in index.html
function rippleEl(el) { ripple(el); }

/* ══════════════════════════════════════════════
   SIDEBAR — the only tricky part.

   shared-ui.js injects the sidebar HTML at the
   END of its own DOMContentLoaded handler.
   So we cannot bind the hamburger in our own
   DOMContentLoaded — the elements don't exist yet.

   Solution: we expose initSidebar() globally.
   shared-ui.js calls it right after injection.
   We also call it ourselves as a fallback 50 ms
   after load in case the call order shifts.
══════════════════════════════════════════════ */
function initSidebar() {
  const sidebar  = document.querySelector('.sidebar');
  const overlay  = document.querySelector('.sidebar-overlay');
  const burgers  = document.querySelectorAll('.hamburger');
  const closeBtn = document.querySelector('.sidebar-close');

  if (!sidebar || sidebar._sidebarBound) return;
  sidebar._sidebarBound = true; // prevent double-binding

  function openSidebar() {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
    burgers.forEach(b => b.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    burgers.forEach(b => b.classList.remove('open'));
    document.body.style.overflow = '';
  }

  burgers.forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  });

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  // Swipe-left to close on mobile
  let touchStartX = 0;
  sidebar.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  sidebar.addEventListener('touchend', e => {
    if (touchStartX - e.changedTouches[0].clientX > 60) closeSidebar();
  }, { passive: true });

  // Close nav links on mobile
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 768) closeSidebar();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });
}

/* ── TOAST ── */
function showToast(msg, type = 'success') {
  const map = {
    success: ['rgba(0,229,204,0.12)', 'rgba(0,229,204,0.3)', '#00e5cc', '✓'],
    error:   ['rgba(255,77,109,0.12)', 'rgba(255,77,109,0.3)', '#ff4d6d', '✕'],
    info:    ['rgba(0,207,255,0.10)', 'rgba(0,207,255,0.3)', '#00cfff', 'ℹ'],
  };
  const [bg, brd, clr, ico] = map[type] || map.success;
  const existing = document.querySelector('.cp-toast');
  if (existing) existing.remove();

  const t = document.createElement('div');
  t.className = 'cp-toast';
  const isMobile = window.innerWidth < 768;
  const bottomOffset = isMobile ? 'calc(var(--tab-h, 62px) + var(--safe-b, 0px) + 14px)' : '28px';
  t.style.cssText = `position:fixed;bottom:${bottomOffset};left:50%;transform:translateX(-50%) translateY(20px);background:${bg};border:1px solid ${brd};color:${clr};font-family:'Syne',sans-serif;font-weight:700;font-size:0.82rem;padding:11px 20px;border-radius:50px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 8px 32px rgba(0,0,0,0.35);z-index:9999;opacity:0;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);display:flex;align-items:center;gap:8px;white-space:nowrap;max-width:90vw;`;
  t.innerHTML = `<span>${ico}</span><span style="overflow:hidden;text-overflow:ellipsis;">${msg}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => {
    t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

/* ── INIT on DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  animateCounters();
  // Fallback: try to bind sidebar 60ms after load
  // (shared-ui.js should call initSidebar() first, but this covers edge cases)
  setTimeout(() => initSidebar(), 60);
});