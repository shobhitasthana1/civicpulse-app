/* ════════════════════════════════════════════════════
   CivicPulse — shared-ui.js
   Injects: Sidebar + Bottom Nav
   Handles: Hamburger toggle, overlay close, active state
   
   FIXED: Sidebar was blank because HTML was not being
   injected properly. This file rebuilds the full system.
════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAV CONFIG ── */
  const NAV_ITEMS = [
    { icon: '🏠', label: 'Home',          href: 'index.html',     key: 'home' },
    { icon: '🚨', label: 'Report Issue',  href: 'report.html',    key: 'report' },
    { icon: '📡', label: 'Track Reports', href: 'dashboard.html', key: 'dashboard' },
    { icon: '👥', label: 'Community',     href: 'activity.html',  key: 'activity' },
    { icon: '🔍', label: 'Resources',     href: 'resources.html', key: 'resources' },
    { icon: '📞', label: 'Contact',       href: 'contact.html',   key: 'contact' },
    { icon: '⭐', label: 'Features',      href: 'features.html',  key: 'features' },
    { icon: '👤', label: 'Team',          href: 'team.html',      key: 'team' },
  ];

  const SOS_ITEM = {
    icon: '⚡', label: 'Emergency SOS', href: 'emergency.html', key: 'emergency'
  };

  /* ── BOTTOM NAV CONFIG ── */
  const BOTTOM_NAV = [
    { icon: '🏠', label: 'Home',      href: 'index.html',       key: 'home' },
    { icon: '🚨', label: 'Report',    href: 'report.html',      key: 'report' },
    { icon: '📋', label: 'Track',     href: 'dashboard.html',   key: 'dashboard' },
    { icon: '👥', label: 'Community', href: 'activity.html',    key: 'activity' },
    { icon: '⚡', label: 'SOS',       href: 'emergency.html',   key: 'emergency' },
  ];

  /* ── DETECT CURRENT PAGE ── */
  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    for (const item of [...NAV_ITEMS, SOS_ITEM]) {
      if (file === item.href || file.includes(item.key)) return item.key;
    }
    if (file === '' || file === 'index.html') return 'home';
    return '';
  }

  /* ── BUILD SIDEBAR HTML ── */
  function buildSidebar() {
    const currentPage = getCurrentPage();

    const navItemsHTML = NAV_ITEMS.map(item => `
      <a href="${item.href}" class="cp-nav-item ${currentPage === item.key ? 'cp-active' : ''}" data-key="${item.key}">
        <span class="cp-nav-icon">${item.icon}</span>
        <span class="cp-nav-label">${item.label}</span>
      </a>
    `).join('');

    const sosHTML = `
      <div class="cp-nav-divider"></div>
      <a href="${SOS_ITEM.href}" class="cp-nav-item cp-nav-sos ${currentPage === SOS_ITEM.key ? 'cp-active' : ''}">
        <span class="cp-nav-icon">${SOS_ITEM.icon}</span>
        <span class="cp-nav-label">${SOS_ITEM.label}</span>
      </a>
    `;

    return `
      <!-- Sidebar Overlay -->
      <div class="cp-sidebar-overlay" id="cpSidebarOverlay"></div>

      <!-- Sidebar Panel -->
      <nav class="cp-sidebar" id="cpSidebar" role="navigation" aria-label="Main navigation">

        <!-- Header -->
        <div class="cp-sidebar-header">
          <div class="cp-sidebar-brand">
            <div class="cp-sidebar-logo">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" fill="#060c14"/>
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="#060c14" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="cp-sidebar-title">CivicPulse</span>
          </div>
          <button class="cp-sidebar-close" id="cpSidebarClose" aria-label="Close menu" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Nav section label -->
        <div class="cp-nav-section">Navigation</div>

        <!-- Nav items -->
        <div class="cp-sidebar-nav">
          ${navItemsHTML}
          ${sosHTML}
        </div>

        <!-- Footer user info -->
        <div class="cp-sidebar-footer">
          <div class="cp-sidebar-user">
            <div class="cp-sidebar-avatar">SA</div>
            <div>
              <div class="cp-sidebar-username">Shobhit Asthana</div>
              <div class="cp-sidebar-role">Level 4 · Null Pointer</div>
            </div>
          </div>
        </div>

      </nav>
    `;
  }

  /* ── BUILD BOTTOM NAV HTML ── */
  function buildBottomNav() {
    const currentPage = getCurrentPage();

    const itemsHTML = BOTTOM_NAV.map(item => `
      <a href="${item.href}" class="tab-item ${currentPage === item.key ? 'active' : ''}" data-key="${item.key}">
        <span class="tab-icon">${item.icon}</span>
        <span class="tab-label">${item.label}</span>
      </a>
    `).join('');

    return `
      <nav class="bottom-nav" id="cpBottomNav" role="navigation" aria-label="Bottom navigation">
        ${itemsHTML}
      </nav>
    `;
  }

  /* ── INJECT INTO DOM ── */
  function inject() {
    // Check if already injected
    if (document.getElementById('cpSidebar')) return;

    // Inject sidebar + overlay before main content
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'cpSidebarContainer';
    sidebarContainer.innerHTML = buildSidebar();
    document.body.insertBefore(sidebarContainer, document.body.firstChild);

    // Inject bottom nav at end of body
    if (!document.getElementById('cpBottomNav')) {
      const bottomNavContainer = document.createElement('div');
      bottomNavContainer.innerHTML = buildBottomNav();
      document.body.appendChild(bottomNavContainer);
    }
  }

  /* ── SIDEBAR TOGGLE LOGIC ── */
  function initSidebarToggle() {
    const sidebar    = document.getElementById('cpSidebar');
    const overlay    = document.getElementById('cpSidebarOverlay');
    const closeBtn   = document.getElementById('cpSidebarClose');
    // Hamburger button — in header, may load before or after sidebar injection
    const hamburger  = document.querySelector('.hamburger');

    if (!sidebar || !overlay) {
      console.warn('CivicPulse: Sidebar elements not found, retrying...');
      setTimeout(initSidebarToggle, 100);
      return;
    }

    /* Open sidebar */
    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      hamburger && hamburger.setAttribute('aria-expanded', 'true');
    }

    /* Close sidebar */
    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
    }

    /* Hamburger click → toggle */
    if (hamburger) {
      // Remove any previous listener to avoid double-bind
      const newHamburger = hamburger.cloneNode(true);
      hamburger.parentNode.replaceChild(newHamburger, hamburger);

      newHamburger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = sidebar.classList.contains('open');
        if (isOpen) { closeSidebar(); } else { openSidebar(); }
      });

      // Also bind to the replaced element reference
      window._cpHamburger = newHamburger;
    } else {
      console.warn('CivicPulse: .hamburger button not found in DOM');
    }

    /* Close button → close */
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeSidebar();
      });
    }

    /* Overlay click → close */
    overlay.addEventListener('click', function () {
      closeSidebar();
    });

    /* Escape key → close */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });

    /* Nav item click → close sidebar then navigate */
    sidebar.querySelectorAll('.cp-nav-item').forEach(function (item) {
      item.addEventListener('click', function () {
        closeSidebar();
      });
    });
  }

  /* ── BOTTOM NAV STYLES (injected inline) ── */
  function injectBottomNavStyles() {
    if (document.getElementById('cpBottomNavStyles')) return;

    const style = document.createElement('style');
    style.id = 'cpBottomNavStyles';
    style.textContent = `
      .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
        display: flex;
        align-items: stretch;
        background: rgba(6, 12, 20, 0.97);
        border-top: 1px solid rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
        height: calc(var(--tab-h, 58px) + env(safe-area-inset-bottom, 0px));
      }

      .tab-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        text-decoration: none;
        color: #475569;
        padding: 8px 4px;
        transition: color 0.18s ease;
        -webkit-tap-highlight-color: transparent;
        position: relative;
        cursor: pointer;
        min-width: 0;
      }

      .tab-item.active {
        color: #00e5cc;
      }

      /* SOS item special color */
      .tab-item[data-key="emergency"],
      .tab-item[href="emergency.html"] {
        color: #fb923c;
      }

      .tab-item[data-key="emergency"].active,
      .tab-item[href="emergency.html"].active {
        color: #fb923c;
      }

      .tab-icon {
        font-size: 1.1rem;
        line-height: 1;
        display: block;
        transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .tab-item.active .tab-icon {
        transform: translateY(-2px) scale(1.1);
      }

      .tab-label {
        font-family: 'Syne', sans-serif;
        font-weight: 600;
        font-size: 0.6rem;
        letter-spacing: 0.3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      /* Active indicator dot */
      .tab-item.active::after {
        content: '';
        position: absolute;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: currentColor;
      }

      /* Hamburger button — strict size control */
      .hamburger {
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
        width: 22px !important;
        height: 16px !important;
        min-width: 22px !important;
        max-width: 22px !important;
        min-height: 16px !important;
        max-height: 16px !important;
        cursor: pointer !important;
        background: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        flex-shrink: 0 !important;
        overflow: visible !important;
        position: relative !important;
        z-index: 201 !important;
        -webkit-tap-highlight-color: transparent !important;
        /* Larger tap area without changing visual size */
        touch-action: manipulation !important;
      }

      .hamburger span {
        display: block !important;
        width: 100% !important;
        height: 2px !important;
        background: #94a3b8 !important;
        border-radius: 2px !important;
        transition: background 0.2s ease !important;
        flex-shrink: 0 !important;
        pointer-events: none !important;
      }

      .hamburger span:nth-child(2) {
        width: 75% !important;
      }

      .hamburger:hover span,
      .hamburger[aria-expanded="true"] span {
        background: #00e5cc !important;
      }

      /* CSS variable for tab height — used by page-content padding */
      :root { --tab-h: 58px; }
    `;
    document.head.appendChild(style);
  }

  /* ── TOAST SYSTEM (if not defined by app.js) ── */
  if (typeof window.showToast === 'undefined') {
    window.showToast = function (message, type) {
      const existing = document.getElementById('cpToast');
      if (existing) existing.remove();

      const colors = {
        info:    { bg: 'rgba(0,207,255,0.12)',  border: 'rgba(0,207,255,0.3)',  color: '#00cfff' },
        success: { bg: 'rgba(0,229,204,0.12)',  border: 'rgba(0,229,204,0.3)',  color: '#00e5cc' },
        error:   { bg: 'rgba(255,77,109,0.12)', border: 'rgba(255,77,109,0.3)', color: '#ff4d6d' },
        warning: { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', color: '#fb923c' },
      };
      const c = colors[type] || colors.info;

      const toast = document.createElement('div');
      toast.id = 'cpToast';
      toast.style.cssText = `
        position: fixed;
        bottom: calc(var(--tab-h, 58px) + env(safe-area-inset-bottom, 0px) + 14px);
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: ${c.bg};
        border: 1px solid ${c.border};
        color: ${c.color};
        padding: 10px 20px;
        border-radius: 50px;
        font-family: 'Syne', sans-serif;
        font-weight: 700;
        font-size: 0.82rem;
        white-space: nowrap;
        z-index: 9999;
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: calc(100vw - 32px);
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      toast.textContent = message;
      document.body.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
      });

      setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 2800);
    };
  }

  /* ── INIT ── */
  function init() {
    injectBottomNavStyles();
    inject();

    // Wait for DOM paint then bind events
    // Using setTimeout(0) ensures injected HTML is in DOM before we query it
    setTimeout(function () {
      initSidebarToggle();
    }, 0);
  }

  /* Run when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose initSidebar globally in case app.js calls it */
  window.initSidebar = initSidebarToggle;

})();