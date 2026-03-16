/* ════════════════════════════════════════════════════
   CivicPulse — shared-ui.js  v4
   
   FOLDER STRUCTURE:
     ROOT:       index.html
                 assets/js/shared-ui.js  ← this file
                 assets/js/app.js
                 assets/css/style.css
                 assets/css/mobile-fix.css
                 image/shobhit.png
     PAGE/:      page/report.html
                 page/reports.html
                 page/emergency.html
                 page/resources.html
                 page/activity.html
                 page/dashboard.html
                 page/team.html
                 page/contact.html
                 page/features.html

   AUTO-DETECTION:
     index.html  loads script as:  assets/js/shared-ui.js
     page/*.html loads script as:  ../assets/js/shared-ui.js
     
     We detect via window.location.pathname whether
     we are inside /page/ or at root, then prefix all
     navigation links accordingly.
════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────
     STEP 1 — Detect folder context
  ──────────────────────────────────────────────── */
  var _path   = window.location.pathname;
  var _inPage = _path.indexOf('/page/') !== -1;

  /* P   = prefix for page/ files
     IDX = correct path to index.html (Home)           */
  var P   = _inPage ? ''               : 'page/';
  var IDX = _inPage ? '../index.html'  : 'index.html';

  /* Image prefix for avatar */
  var IMG = _inPage ? '../image/' : 'image/';

  /* ────────────────────────────────────────────────
     STEP 2 — Navigation config (paths auto-resolved)
  ──────────────────────────────────────────────── */

  /* Sidebar full nav */
  var NAV_ITEMS = [
    { icon: '🏠', label: 'Home',          href: IDX,                     key: 'home'      },
    { icon: '🚨', label: 'Report Issue',  href: P + 'report.html',       key: 'report'    },
    { icon: '📋', label: 'Track Reports', href: P + 'reports.html',      key: 'reports'   },
    { icon: '👥', label: 'Community',     href: P + 'activity.html',     key: 'activity'  },
    { icon: '🔍', label: 'Resources',     href: P + 'resources.html',    key: 'resources' },
    { icon: '📊', label: 'Dashboard',     href: P + 'dashboard.html',    key: 'dashboard' },
    { icon: '📞', label: 'Contact',       href: P + 'contact.html',      key: 'contact'   },
    { icon: '⭐', label: 'Features',      href: P + 'features.html',     key: 'features'  },
    { icon: '👤', label: 'Team',          href: P + 'team.html',         key: 'team'      },
  ];

  var SOS_ITEM = {
    icon: '⚡', label: 'Emergency SOS', href: P + 'emergency.html', key: 'emergency'
  };

  /* Bottom nav — 5 core tabs */
  var BOTTOM_NAV = [
    { icon: '🏠', label: 'Home',      href: IDX,                    key: 'home'      },
    { icon: '🚨', label: 'Report',    href: P + 'report.html',      key: 'report'    },
    { icon: '📋', label: 'Track',     href: P + 'reports.html',     key: 'reports'   },
    { icon: '👥', label: 'Community', href: P + 'activity.html',    key: 'activity'  },
    { icon: '⚡', label: 'SOS',       href: P + 'emergency.html',   key: 'emergency' },
  ];

  /* ────────────────────────────────────────────────
     STEP 3 — Detect which page is currently active
  ──────────────────────────────────────────────── */
  function getCurrentPage() {
    var file = _path.split('/').pop() || 'index.html';
    var MAP = {
      'index.html':     'home',
      'report.html':    'report',
      'reports.html':   'reports',
      'activity.html':  'activity',
      'resources.html': 'resources',
      'dashboard.html': 'dashboard',
      'contact.html':   'contact',
      'features.html':  'features',
      'team.html':      'team',
      'emergency.html': 'emergency',
      '':               'home',
    };
    return MAP[file] || '';
  }

  /* ────────────────────────────────────────────────
     STEP 4 — Build sidebar HTML
  ──────────────────────────────────────────────── */
  function buildSidebar() {
    var cur = getCurrentPage();

    var navItemsHTML = NAV_ITEMS.map(function(item) {
      return '<a href="' + item.href + '" class="cp-nav-item ' + (cur === item.key ? 'cp-active' : '') + '" data-key="' + item.key + '">' +
        '<span class="cp-nav-icon">' + item.icon + '</span>' +
        '<span class="cp-nav-label">' + item.label + '</span>' +
        '</a>';
    }).join('');

    var sosHTML = '<div class="cp-nav-divider"></div>' +
      '<a href="' + SOS_ITEM.href + '" class="cp-nav-item cp-nav-sos ' + (cur === SOS_ITEM.key ? 'cp-active' : '') + '">' +
      '<span class="cp-nav-icon">' + SOS_ITEM.icon + '</span>' +
      '<span class="cp-nav-label">' + SOS_ITEM.label + '</span>' +
      '</a>';

    var avatarSrc = IMG + 'shobhit.png';

    return '<div class="cp-sidebar-overlay" id="cpSidebarOverlay"></div>' +
      '<nav class="cp-sidebar" id="cpSidebar" role="navigation" aria-label="Main navigation">' +

      '<div class="cp-sidebar-header">' +
        '<div class="cp-sidebar-brand">' +
          '<div class="cp-sidebar-logo">' +
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' +
            '<circle cx="8" cy="8" r="3" fill="#060c14"/>' +
            '<path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="#060c14" stroke-width="1.5" stroke-linecap="round"/>' +
            '</svg>' +
          '</div>' +
          '<span class="cp-sidebar-title">CivicPulse</span>' +
        '</div>' +
        '<button class="cp-sidebar-close" id="cpSidebarClose" aria-label="Close menu" type="button">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +

      '<div class="cp-nav-section">Navigation</div>' +

      '<div class="cp-sidebar-nav">' + navItemsHTML + sosHTML + '</div>' +

      '<div class="cp-sidebar-footer">' +
        '<div class="cp-sidebar-user">' +
          '<div class="cp-sidebar-avatar" style="padding:0;overflow:hidden;">' +
            '<img src="' + avatarSrc + '" alt="SA"' +
            ' style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"' +
            ' onerror="this.style.display=\'none\';this.parentElement.textContent=\'SA\';' +
              'Object.assign(this.parentElement.style,{display:\'flex\',alignItems:\'center\',' +
              'justifyContent:\'center\',background:\'linear-gradient(135deg,#00e5cc,#00cfff)\',' +
              'color:\'#060c14\',fontWeight:\'800\',fontSize:\'0.8rem\'});"' +
            '/>' +
          '</div>' +
          '<div>' +
            '<div class="cp-sidebar-username">Shobhit Asthana</div>' +
            '<div class="cp-sidebar-role">Level 4 · Null Pointer</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '</nav>';
  }

  /* ────────────────────────────────────────────────
     STEP 5 — Build bottom nav HTML
  ──────────────────────────────────────────────── */
  function buildBottomNav() {
    var cur = getCurrentPage();

    var itemsHTML = BOTTOM_NAV.map(function(item) {
      return '<a href="' + item.href + '"' +
        ' class="tab-item ' + (cur === item.key ? 'active' : '') + '"' +
        ' data-key="' + item.key + '">' +
        '<span class="tab-icon">' + item.icon + '</span>' +
        '<span class="tab-label">' + item.label + '</span>' +
        '</a>';
    }).join('');

    return '<nav class="bottom-nav" id="cpBottomNav" role="navigation" aria-label="Bottom navigation">' +
      itemsHTML + '</nav>';
  }

  /* ────────────────────────────────────────────────
     STEP 6 — Inject into DOM
  ──────────────────────────────────────────────── */
  function inject() {
    if (document.getElementById('cpSidebar')) return;

    var sc = document.createElement('div');
    sc.id = 'cpSidebarContainer';
    sc.innerHTML = buildSidebar();
    document.body.insertBefore(sc, document.body.firstChild);

    if (!document.getElementById('cpBottomNav')) {
      var bc = document.createElement('div');
      bc.innerHTML = buildBottomNav();
      document.body.appendChild(bc);
    }
  }

  /* ────────────────────────────────────────────────
     STEP 7 — Sidebar toggle logic
  ──────────────────────────────────────────────── */
  function initSidebarToggle() {
    var sidebar   = document.getElementById('cpSidebar');
    var overlay   = document.getElementById('cpSidebarOverlay');
    var closeBtn  = document.getElementById('cpSidebarClose');
    var hamburger = document.querySelector('.hamburger');

    if (!sidebar || !overlay) {
      setTimeout(initSidebarToggle, 100);
      return;
    }

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }

    if (hamburger) {
      /* clone to remove any old listeners */
      var nh = hamburger.cloneNode(true);
      hamburger.parentNode.replaceChild(nh, hamburger);
      nh.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', function(e) { e.stopPropagation(); closeSidebar(); });
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeSidebar(); });

    sidebar.querySelectorAll('.cp-nav-item').forEach(function(item) {
      item.addEventListener('click', closeSidebar);
    });
  }

  /* ────────────────────────────────────────────────
     STEP 8 — Styles (bottom nav + hamburger)
  ──────────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('cpBottomNavStyles')) return;

    var style = document.createElement('style');
    style.id = 'cpBottomNavStyles';
    style.textContent = [
      ':root{--tab-h:58px}',

      /* ── Bottom Nav ── */
      '.bottom-nav{',
        'position:fixed;bottom:0;left:0;right:0;z-index:100;',
        'display:flex;align-items:stretch;',
        'background:rgba(6,12,20,.97);',
        'border-top:1px solid rgba(255,255,255,.07);',
        'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);',
        'padding-bottom:env(safe-area-inset-bottom,0px);',
        'height:calc(var(--tab-h,58px) + env(safe-area-inset-bottom,0px));',
      '}',

      '.tab-item{',
        'flex:1;display:flex;flex-direction:column;',
        'align-items:center;justify-content:center;gap:3px;',
        'text-decoration:none;color:#475569;padding:8px 4px;',
        'transition:color .18s ease;',
        '-webkit-tap-highlight-color:transparent;',
        'position:relative;cursor:pointer;min-width:0;',
      '}',

      '.tab-item.active{color:#00e5cc}',

      /* SOS always orange */
      '.tab-item[data-key="emergency"]{color:#fb923c}',
      '.tab-item[data-key="emergency"].active{color:#fb923c}',

      '.tab-icon{',
        'font-size:1.1rem;line-height:1;display:block;',
        'transition:transform .18s cubic-bezier(.34,1.56,.64,1);',
      '}',
      '.tab-item.active .tab-icon{transform:translateY(-2px) scale(1.1)}',

      '.tab-label{',
        'font-family:Syne,sans-serif;font-weight:600;font-size:.6rem;',
        'letter-spacing:.3px;white-space:nowrap;overflow:hidden;',
        'text-overflow:ellipsis;max-width:100%;',
      '}',

      /* Active glow dot */
      '.tab-item.active::after{',
        'content:"";position:absolute;bottom:5px;left:50%;',
        'transform:translateX(-50%);width:4px;height:4px;',
        'border-radius:50%;background:currentColor;box-shadow:0 0 6px currentColor;',
      '}',

      /* ── Hamburger ── */
      '.hamburger{',
        'display:flex!important;flex-direction:column!important;',
        'justify-content:space-between!important;align-items:flex-start!important;',
        'width:22px!important;height:16px!important;',
        'min-width:22px!important;max-width:22px!important;',
        'min-height:16px!important;max-height:16px!important;',
        'cursor:pointer!important;background:none!important;border:none!important;',
        'padding:0!important;margin:0!important;flex-shrink:0!important;',
        'overflow:visible!important;position:relative!important;',
        'z-index:201!important;-webkit-tap-highlight-color:transparent!important;',
        'touch-action:manipulation!important;',
      '}',
      '.hamburger span{',
        'display:block!important;width:100%!important;height:2px!important;',
        'background:#94a3b8!important;border-radius:2px!important;',
        'transition:background .2s ease!important;flex-shrink:0!important;',
        'pointer-events:none!important;',
      '}',
      '.hamburger span:nth-child(2){width:75%!important}',
      '.hamburger:hover span,.hamburger[aria-expanded="true"] span{background:#00e5cc!important}',
    ].join('');

    document.head.appendChild(style);
  }

  /* ────────────────────────────────────────────────
     STEP 9 — Toast (fallback)
  ──────────────────────────────────────────────── */
  if (typeof window.showToast === 'undefined') {
    window.showToast = function(message, type) {
      var existing = document.getElementById('cpToast');
      if (existing) existing.remove();

      var COLORS = {
        info:    {bg:'rgba(0,207,255,.12)',  border:'rgba(0,207,255,.3)',  color:'#00cfff'},
        success: {bg:'rgba(0,229,204,.12)',  border:'rgba(0,229,204,.3)',  color:'#00e5cc'},
        error:   {bg:'rgba(255,77,109,.12)', border:'rgba(255,77,109,.3)', color:'#ff4d6d'},
        warning: {bg:'rgba(251,146,60,.12)', border:'rgba(251,146,60,.3)', color:'#fb923c'},
      };
      var c = COLORS[type] || COLORS.info;

      var t = document.createElement('div');
      t.id = 'cpToast';
      t.style.cssText = 'position:fixed;bottom:calc(var(--tab-h,58px) + env(safe-area-inset-bottom,0px) + 14px);' +
        'left:50%;transform:translateX(-50%) translateY(20px);' +
        'background:' + c.bg + ';border:1px solid ' + c.border + ';color:' + c.color + ';' +
        'padding:10px 20px;border-radius:50px;font-family:Syne,sans-serif;font-weight:700;font-size:.82rem;' +
        'white-space:nowrap;z-index:9999;backdrop-filter:blur(12px);' +
        'box-shadow:0 4px 24px rgba(0,0,0,.3);transition:all .3s cubic-bezier(.34,1.56,.64,1);' +
        'max-width:calc(100vw - 32px);text-align:center;overflow:hidden;text-overflow:ellipsis;opacity:0;';
      t.textContent = message;
      document.body.appendChild(t);

      requestAnimationFrame(function() {
        t.style.transform = 'translateX(-50%) translateY(0)';
        t.style.opacity = '1';
      });
      setTimeout(function() {
        t.style.transform = 'translateX(-50%) translateY(10px)';
        t.style.opacity = '0';
        setTimeout(function() { t.remove(); }, 300);
      }, 2800);
    };
  }

  /* ────────────────────────────────────────────────
     STEP 10 — Init
  ──────────────────────────────────────────────── */
  function init() {
    injectStyles();
    inject();
    setTimeout(initSidebarToggle, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.initSidebar = initSidebarToggle;

})();
