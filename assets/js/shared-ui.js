/* ═══════════════════════════════════════════════
   CivicPulse — shared-ui.js
   Injects sidebar + bottom tab bar into every page,
   then immediately calls initSidebar() so hamburger
   bindings are set before any user interaction.
═══════════════════════════════════════════════ */

(function () {
  const PAGE = {
    'index.html':     { id: 'dashboard' },
    'report.html':    { id: 'report'    },
    'reports.html':   { id: 'reports'   },
    'resources.html': { id: 'resources' },
    'emergency.html': { id: 'emergency' },
    'activity.html':  { id: 'activity'  },
    'team.html':      { id: 'team'      },
  };

  const file    = location.pathname.split('/').pop() || 'index.html';
  const current = PAGE[file] || { id: 'dashboard' };

  const NAV = [
    { id:'dashboard', href:'index.html',     icon:'🏠', label:'Dashboard'   },
    { id:'report',    href:'report.html',    icon:'🚨', label:'Report Issue' },
    { id:'reports',   href:'reports.html',   icon:'📋', label:'Track Reports'},
    { id:'resources', href:'resources.html', icon:'🔍', label:'Resources'    },
    { id:'activity',  href:'activity.html',  icon:'📡', label:'Community'    },
    { id:'team',      href:'team.html',      icon:'👥', label:'Team'         },
    { id:'emergency', href:'emergency.html', icon:'⚡', label:'Emergency SOS', sos:true },
  ];

  const TABS = [
    { id:'dashboard', href:'index.html',    icon:'🏠', label:'Home'    },
    { id:'report',    href:'report.html',   icon:'🚨', label:'Report'  },
    { id:'reports',   href:'reports.html',  icon:'📋', label:'Track'   },
    { id:'activity',  href:'activity.html', icon:'📡', label:'Community'},
    { id:'emergency', href:'emergency.html',icon:'⚡', label:'SOS', sos:true },
  ];

  const sidebarHTML = `
<aside class="sidebar" id="appSidebar" role="navigation" aria-label="Main navigation">
  <div class="sidebar-logo">
    <div class="logo-icon">
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3" fill="#060c14"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="#060c14" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
    <span class="logo-text">CivicPulse</span>
    <button class="sidebar-close" aria-label="Close navigation">✕</button>
  </div>
  <nav class="sidebar-nav">
    ${NAV.map(n => `
    <a href="${n.href}" class="nav-item${n.sos ? ' sos-nav' : ''}${current.id === n.id ? ' active' : ''}" ${current.id === n.id ? 'aria-current="page"' : ''}>
      <span class="nav-icon">${n.icon}</span>
      ${n.label}
    </a>`).join('')}
  </nav>
  <div class="sidebar-footer">
    <div class="sidebar-user">
      <div class="avatar" style="width:32px;height:32px;font-size:0.72rem;flex-shrink:0;">SA</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.8rem;font-weight:600;color:#e2eaf4;font-family:'Syne',sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Shobhit Asthana</div>
        <div style="font-size:0.64rem;color:#64748b;">Team Leader · Null Pointer</div>
      </div>
    </div>
  </div>
</aside>
<div class="sidebar-overlay" id="sidebarOverlay" role="button" aria-label="Close navigation" tabindex="-1"></div>`;

  const bottomBarHTML = `
<nav class="bottom-bar" id="bottomBar" aria-label="Bottom navigation">
  ${TABS.map(t => `
  <a href="${t.href}" class="tab-item${t.sos ? ' sos-tab' : ''}${current.id === t.id ? ' active' : ''}" ${current.id === t.id ? 'aria-current="page"' : ''}>
    <span class="tab-icon">${t.icon}</span>
    <span>${t.label}</span>
  </a>`).join('')}
</nav>`;

  function inject() {
    const layout = document.querySelector('.app-layout');
    if (layout && !document.getElementById('appSidebar')) {
      layout.insertAdjacentHTML('afterbegin', sidebarHTML);
    }
    if (!document.getElementById('bottomBar')) {
      document.body.insertAdjacentHTML('beforeend', bottomBarHTML);
    }
    // Call initSidebar immediately after DOM injection
    if (typeof initSidebar === 'function') {
      initSidebar();
    }
  }

  // Inject as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    // DOM already ready (script loaded late)
    inject();
  }
})();