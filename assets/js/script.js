/* ===================================================
   CivicPulse — script.js
=================================================== */

/* ─── Navbar scroll ─────────────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

/* ─── Mobile toggle ─────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  }));
}

/* ─── Scroll reveal ─────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Counter animation ─────────────────────────── */
function animateCounter(el, target, suffix) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 25);
}
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, parseInt(e.target.dataset.count), e.target.dataset.suffix || '');
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

/* ─── Progress bars ─────────────────────────────── */
const progObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      progObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.progress-fill[data-width]').forEach(b => progObs.observe(b));

/* ─── FAQ accordion ─────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question')?.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ─── Toast ─────────────────────────────────────── */
function showToast(message, icon = '✅') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="font-size:1.3rem">${icon}</span><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ─── Contact form ──────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const rules = [
    { id: 'contactName',    msg: 'Name must be at least 2 characters.', rule: v => v.length >= 2 },
    { id: 'contactEmail',   msg: 'Please enter a valid email address.', rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'contactSubject', msg: 'Please enter a subject.',             rule: v => v.length >= 3 },
    { id: 'contactMessage', msg: 'Message must be at least 20 chars.',  rule: v => v.length >= 20 },
  ];
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    rules.forEach(({ id, msg, rule }) => {
      const inp = document.getElementById(id);
      const err = document.getElementById(id + 'Error');
      if (!inp) return;
      if (!rule(inp.value.trim())) {
        inp.classList.add('invalid');
        if (err) { err.textContent = msg; err.classList.add('show'); }
        valid = false;
      } else {
        inp.classList.remove('invalid');
        if (err) err.classList.remove('show');
      }
    });
    if (valid) {
      const btn = contactForm.querySelector('[type=submit]');
      btn.textContent = 'Sending…'; btn.disabled = true;
      setTimeout(() => {
        showToast("Message sent! We'll reply within 24 hours.");
        contactForm.reset(); btn.textContent = 'Send Message'; btn.disabled = false;
      }, 1200);
    }
  });
  contactForm.querySelectorAll('.form-input,.form-textarea').forEach(inp => {
    inp.addEventListener('input', () => {
      inp.classList.remove('invalid');
      const err = document.getElementById(inp.id + 'Error');
      if (err) err.classList.remove('show');
    });
  });
}

/* ─── Dashboard data ────────────────────────────── */
let issues = [
  { id:'CP-001', title:'Broken streetlight on MG Road',     category:'Infrastructure', location:'MG Road, Sector 5',    status:'progress', date:'2025-06-10' },
  { id:'CP-002', title:'Illegal dumping near Green Park',   category:'Sanitation',    location:'Green Valley Park',     status:'open',     date:'2025-06-11' },
  { id:'CP-003', title:'Pothole on NH44 near overpass',     category:'Infrastructure', location:'NH44 Overpass',         status:'resolved', date:'2025-06-08' },
  { id:'CP-004', title:'Water logging after rain — Sector 12', category:'Drainage',   location:'Sector 12 Colony',      status:'open',     date:'2025-06-12' },
  { id:'CP-005', title:'Stray dog menace near school',      category:'Safety',        location:'Sunrise Public School',  status:'progress', date:'2025-06-09' },
];

const statusCls   = { open:'status-open',     progress:'status-progress', resolved:'status-resolved' };
const statusLabel = { open:'Open',             progress:'In Progress',     resolved:'Resolved' };

function renderTable() {
  const tbody = document.getElementById('issueTableBody');
  if (!tbody) return;
  tbody.innerHTML = issues.slice().reverse().map(iss => `
    <tr>
      <td><span class="mono text-muted">${iss.id}</span></td>
      <td><strong>${iss.title}</strong></td>
      <td><span class="tag tag-green">${iss.category}</span></td>
      <td style="font-size:.85rem;color:var(--text-muted)">${iss.location}</td>
      <td><span class="status-badge ${statusCls[iss.status]}">${statusLabel[iss.status]}</span></td>
      <td style="font-size:.85rem;color:var(--text-muted)">${iss.date}</td>
      <td>
        <button class="btn btn-sm" style="background:none;border:1.5px solid var(--green-accent);color:var(--green-accent);padding:.4rem 1rem;border-radius:50px;cursor:pointer;font-family:inherit;font-size:.8rem;font-weight:600"
          onclick="cycleStatus('${iss.id}')">Update ↻</button>
      </td>
    </tr>`).join('');
  const el = id => document.getElementById(id);
  if (el('statOpen'))     el('statOpen').textContent     = issues.filter(i => i.status==='open').length;
  if (el('statProgress')) el('statProgress').textContent = issues.filter(i => i.status==='progress').length;
  if (el('statResolved')) el('statResolved').textContent = issues.filter(i => i.status==='resolved').length;
  if (el('statTotal'))    el('statTotal').textContent    = issues.length;
}

window.cycleStatus = function(id) {
  const iss = issues.find(i => i.id === id);
  if (!iss) return;
  iss.status = { open:'progress', progress:'resolved', resolved:'open' }[iss.status];
  renderTable();
  showToast(`Issue ${id} updated to "${statusLabel[iss.status]}"`, '🔄');
};

/* ─── Report form ───────────────────────────────── */
const reportForm = document.getElementById('reportForm');
if (reportForm) {
  reportForm.addEventListener('submit', e => {
    e.preventDefault();
    const v = id => document.getElementById(id)?.value.trim();
    let ok = true;
    const checks = [
      ['issueTitle',    v('issueTitle')?.length >= 5,    'Title must be at least 5 characters.'],
      ['issueCategory', !!v('issueCategory'),             'Please select a category.'],
      ['issueLocation', v('issueLocation')?.length >= 3,  'Please enter a location.'],
      ['issueDesc',     v('issueDesc')?.length >= 15,     'Description needs at least 15 characters.'],
    ];
    checks.forEach(([id, pass, msg]) => {
      const inp = document.getElementById(id);
      const err = document.getElementById(id + 'Error');
      if (!pass) {
        inp?.classList.add('invalid');
        if (err) { err.textContent = msg; err.classList.add('show'); }
        ok = false;
      } else {
        inp?.classList.remove('invalid');
        if (err) err.classList.remove('show');
      }
    });
    if (ok) {
      const newId = 'CP-' + String(issues.length + 1).padStart(3,'0');
      issues.push({ id:newId, title:v('issueTitle'), category:v('issueCategory'), location:v('issueLocation'), status:'open', date:new Date().toISOString().split('T')[0] });
      renderTable();
      reportForm.reset();
      showToast(`Issue ${newId} reported! Civic team notified.`, '📍');
      document.getElementById('issuesSection')?.scrollIntoView({ behavior:'smooth' });
    }
  });
  reportForm.querySelectorAll('.form-input,.form-select,.form-textarea').forEach(inp => {
    inp.addEventListener('input', () => {
      inp.classList.remove('invalid');
      const err = document.getElementById(inp.id+'Error');
      if (err) err.classList.remove('show');
    });
  });
}

/* ─── Filter buttons ────────────────────────────── */
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.style.background = 'none';
      b.style.color = 'var(--text-muted)';
    });
    btn.style.background = 'var(--green-accent)';
    btn.style.color = '#fff';
    const f = btn.dataset.filter;
    document.querySelectorAll('#issueTableBody tr').forEach(row => {
      if (f === 'all') { row.style.display = ''; return; }
      const badge = row.querySelector('.status-badge');
      row.style.display = badge?.classList.contains('status-'+f) ? '' : 'none';
    });
  });
});

/* ─── Mini chart ────────────────────────────────── */
function renderMiniChart() {
  const canvas = document.getElementById('issueChart');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const data = [4, 7, 5, 9, 6, 8, 12];
  const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const max = Math.max(...data);
  const w = canvas.offsetWidth || 400, h = 160;
  canvas.width = w; canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  const gap = 8, barW = (w - 48) / data.length - gap;
  data.forEach((val, i) => {
    const x = 24 + i * ((w - 48) / data.length);
    const barH = (val / max) * (h - 40);
    const y = h - 24 - barH;
    const g = ctx.createLinearGradient(0, y, 0, h);
    g.addColorStop(0, '#40916c'); g.addColorStop(1, 'rgba(64,145,108,0.15)');
    ctx.fillStyle = g;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, 4);
    else ctx.rect(x, y, barW, barH);
    ctx.fill();
    ctx.fillStyle = 'rgba(74,124,99,0.7)';
    ctx.font = '10px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW/2, h - 6);
  });
}

/* ─── Active nav link ───────────────────────────── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

/* ─── Init ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  setTimeout(renderMiniChart, 100);
});