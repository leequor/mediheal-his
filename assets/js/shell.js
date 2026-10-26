// Shared header + slide-in sidebar. Edit NAV once, every page updates.
// Figma: header-bar 239:2978, Sidebar 211:1949 (430x1024). Staff (211:1953) links to Attendance (2002:369).
// Fit-to-width (assets/js/fit.js v3, session 22) is loaded from here so every shell page gets it; index.html (sign-in) loads it itself. No effect at 1440px and wider.
(function () { var s = document.createElement('script'); s.src = 'assets/js/fit.js'; document.head.appendChild(s); })();
const NAV = [
  ['dashboard', 'Dashboard', 'grid'], ['registration', 'Registration', 'users'], ['appointments', 'Appointments', 'calendar-check'],
  ['consultation', 'Consultation', 'clipboard-plus'], ['treatment', 'Treatment', 'bag'], ['nursing', 'Nursing', 'heart'],
  ['pharmacy', 'Pharmacy', 'pill'], ['attendance', 'Staff', 'users'], ['personnel', 'Personnel', 'id'],
  ['payroll', 'Payroll', 'peso'], ['departments', 'Departments', 'branches'], ['billing', 'Billing', 'receipt']
];

(function mountShell() {
  const page = document.body.dataset.page;
  if (!page) return;
  // favicon: stops the /favicon.ico 404 on every page (small logo PNG)
  if (!document.querySelector('link[rel~="icon"]')) document.head.insertAdjacentHTML('beforeend', "<link rel='icon' type='image/png' href='assets/img/logo-removebg-preview%201.png'>");
  const u = HIS.user;
  const ini = u.name.replace('Dr. ', '').split(' ').map(s => s[0]).join('');
  document.body.insertAdjacentHTML('afterbegin',
    "<header class='header'><div class='hd'>" +
    "<button class='burger' id='burger' aria-label='Open menu'><i></i><i></i><i></i></button>" +
    "<img class='logo' src='assets/img/logo-large.png' data-fallback='assets/img/logo-removebg-preview%201.png' alt=''>" +
    "<span class='brand'>MediHeal</span>" +
    "<div class='hd-date'>" + svg('calendar', 18) + '<span>' + HIS.fmtShort(HIS.today) + '</span></div>' +
    "<button class='bell' aria-label='Notifications'>" + svg('bell', 20) + '<b>4</b></button>' +
    "<div class='sep'></div>" +
    "<div class='profile'><span class='avatar'>" + ini + "<img src='assets/img/Avatar.png' alt='' data-hide></span><div><div class='nm'>" + u.name + '</div><small>' + u.role.toUpperCase() + '</small></div></div>' +
    '</div></header>' +
    "<div class='scrim' id='scrim'></div>" +
    "<aside class='drawer' aria-label='Main menu'><div class='dr-in'>" +
    "<img class='dr-logo' src='assets/img/logo-large.png' data-fallback='assets/img/logo-removebg-preview%201.png' alt=''>" +
    "<span class='dr-brand'>MediHeal</span>" +
    "<a class='dr-exit' href='index.html' aria-label='Sign out'>" + svg('exit', 25) + '</a>' +
    '<nav>' + NAV.map(n => "<a href='" + n[0] + ".html'>" + svg(n[2], 44) + n[1] + '</a>').join('') + '</nav>' +
    "<a class='dr-out' href='index.html'>Sign out</a>" +
    "<div class='dr-contact'>" + HIS.contact.email + '<br>' + HIS.contact.phone + '</div>' +
    '</div></aside>');
  document.querySelectorAll('img[data-fallback]').forEach(i => i.addEventListener('error', () => { i.src = i.dataset.fallback; }, { once: true }));
  document.querySelectorAll('img[data-hide]').forEach(i => i.addEventListener('error', () => i.remove(), { once: true }));
  const toggle = open => document.body.classList.toggle('menu-open', open);
  document.getElementById('burger').onclick = () => toggle(true);
  document.getElementById('scrim').onclick = () => toggle(false);
  document.addEventListener('keydown', e => e.key === 'Escape' && toggle(false));
})();

// ---- Notifications panel (session 22). Figma: "Notifications panel" 2072:3499 (Dashboard "Notifications open" 2072:3112; the same panel is drawn on every page, e.g. overlay 2008:1064).
// Measured, frame-local: panel (952,90) 420x492 r16 white, stroke #c8dcea. Panel-local: title (24,20) Lexend 500 18 #1b4e6b; subtitle (24,46) Inter 12 #6f8890;
// close button (360,20) 36x36 r8 stroke #c8dcea, "\u2715" Inter 500 16 #1b4e6b; divider y68 h1 #e3edf3; rows x24, y84 + 86*i, 372x78 r10 fill #f6fafd stroke #e3edf3
// (dot (14,17) 8x8 #1c6d9c; title (32,12) Inter 600 13 #1c2b30; body (32,33) Inter 12 #6f8890; time (32,55) Inter 500 11 #5b8db8); "Mark all as read" (24,436) 372x40 r8 #1c6d9c, Inter 600 13 white.
// ESTIMATED (Figma draws only the all-unread state): shadow, the read look (white row, no dot, title weight 500), "All caught up" subtitle, the disabled look of the button, hiding the bell badge at 0.
// Read state persists in localStorage key `mh_notif_read` (array of row indexes); delete the key to reset. Esc, the close button or a click outside closes the panel.
// The outside-click test uses composedPath() because render() replaces the clicked button (panel.contains(target) would be false and close the panel).
(function notifications() {
  const bell = document.querySelector('.bell');
  if (!bell) return;
  const stage = document.querySelector('.stage,#stage') || document.body;
  if (getComputedStyle(stage).position === 'static') stage.style.position = 'relative';
  const ITEMS = [
    ['Leave approved', 'Sofia Mendoza \u00b7 Sick leave, Aug 31 (1 day)', 'Today, 8:05 AM'],
    ['Leave request pending', 'Miguel Reyes \u00b7 Vacation leave, Sep 2\u20134', 'Today, 7:40 AM'],
    ['Absence needs review', 'Daniel Cruz \u00b7 No clock entry or leave on file', 'Today, 9:00 AM'],
    ['Payroll sync ready', '7 of 8 records ready for the Aug 16\u201331 period', 'Today, 9:15 AM']
  ];
  const KEY = 'mh_notif_read';
  let read = [];
  try { read = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { read = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(read)); } catch (e) { /* storage blocked: memory only */ } };
  const css = document.createElement('style');
  css.textContent =
    '.nf-p{position:absolute;left:952px;top:90px;width:420px;height:492px;box-sizing:border-box;background:#fff;border-radius:16px;box-shadow:inset 0 0 0 1px #c8dcea,0 12px 32px rgba(15,30,46,.18);z-index:22;display:none;font-family:Inter,sans-serif}' +
    '.nf-p.on{display:block}' +
    '.nf-p *{box-sizing:border-box;margin:0}' +
    '.nf-t{position:absolute;left:24px;top:20px;font:500 18px/22.5px Lexend,Inter,sans-serif;color:#1b4e6b;white-space:nowrap}' +
    '.nf-s{position:absolute;left:24px;top:46px;font:400 12px/14.5px Inter,sans-serif;color:#6f8890;white-space:nowrap}' +
    '.nf-x{position:absolute;left:360px;top:20px;width:36px;height:36px;border:0;border-radius:8px;background:#fff;box-shadow:inset 0 0 0 1px #c8dcea;font:500 16px/36px Inter,sans-serif;color:#1b4e6b;cursor:pointer;padding:0;text-align:center}' +
    '.nf-x:hover{background:#e8f4fb}' +
    '.nf-d{position:absolute;left:0;top:68px;width:420px;height:1px;background:#e3edf3}' +
    '.nf-r{position:absolute;left:24px;width:372px;height:78px;border:0;border-radius:10px;background:#f6fafd;box-shadow:inset 0 0 0 1px #e3edf3;text-align:left;padding:0;cursor:pointer;font-family:Inter,sans-serif}' +
    '.nf-r:hover{background:#e8f4fb}' +
    '.nf-r.rd{background:#fff}' +
    '.nf-dot{position:absolute;left:14px;top:17px;width:8px;height:8px;border-radius:50%;background:#1c6d9c}' +
    '.nf-r.rd .nf-dot{display:none}' +
    '.nf-rt{position:absolute;left:32px;top:12px;font:600 13px/15.7px Inter,sans-serif;color:#1c2b30;white-space:nowrap}' +
    '.nf-r.rd .nf-rt{font-weight:500}' +
    '.nf-rb{position:absolute;left:32px;top:33px;font:400 12px/14.5px Inter,sans-serif;color:#6f8890;white-space:nowrap}' +
    '.nf-rm{position:absolute;left:32px;top:55px;font:500 11px/13.3px Inter,sans-serif;color:#5b8db8;white-space:nowrap}' +
    '.nf-m{position:absolute;left:24px;top:436px;width:372px;height:40px;border:0;border-radius:8px;background:#1c6d9c;color:#fff;font:600 13px/40px Inter,sans-serif;text-align:center;cursor:pointer;padding:0}' +
    '.nf-m:hover{background:#1b4e6b}' +
    '.nf-m:disabled{opacity:.5;cursor:default;background:#1c6d9c}';
  document.head.appendChild(css);
  const panel = document.createElement('div');
  panel.className = 'nf-p'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Notifications');
  stage.appendChild(panel);
  // Billing, Departments and Profile rebuild the stage with innerHTML, which drops the panel;
  // put it back so the bell keeps working on those pages.
  if (window.MutationObserver) new MutationObserver(() => { if (!panel.isConnected) stage.appendChild(panel); }).observe(stage, { childList: true });
  const badge = bell.querySelector('b');
  function render() {
    const unread = ITEMS.filter((_, i) => read.indexOf(i) < 0).length;
    panel.innerHTML =
      "<div class='nf-t'>Notifications</div>" +
      "<div class='nf-s'>" + (unread ? unread + ' unread' : 'All caught up') + ' \u00b7 Attendance and payroll</div>' +
      "<button class='nf-x' data-act='close' aria-label='Close notifications'>\u2715</button>" +
      "<div class='nf-d'></div>" +
      ITEMS.map((n, i) => "<button class='nf-r" + (read.indexOf(i) < 0 ? '' : ' rd') + "' data-n='" + i + "' style='top:" + (84 + 86 * i) + "px'><span class='nf-dot'></span><span class='nf-rt'>" + n[0] + "</span><span class='nf-rb'>" + n[1] + "</span><span class='nf-rm'>" + n[2] + '</span></button>').join('') +
      "<button class='nf-m' data-act='all'" + (unread ? '' : ' disabled') + '>Mark all as read</button>';
    if (badge) { badge.textContent = unread; badge.style.display = unread ? '' : 'none'; }
    bell.setAttribute('aria-label', unread ? 'Notifications, ' + unread + ' unread' : 'Notifications');
  }
  function setOpen(o) {
    if (o && !panel.isConnected) stage.appendChild(panel);
    panel.classList.toggle('on', o);
    bell.setAttribute('aria-expanded', o ? 'true' : 'false');
    if (o) document.body.classList.remove('menu-open');
  }
  panel.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.act === 'close') { setOpen(false); bell.focus(); return; }
    if (b.dataset.act === 'all') { read = ITEMS.map((_, i) => i); save(); render(); return; }
    if (b.dataset.n != null) { const i = +b.dataset.n; if (read.indexOf(i) < 0) { read.push(i); save(); render(); } }
  });
  bell.addEventListener('click', () => setOpen(!panel.classList.contains('on')));
  document.addEventListener('click', e => {
    if (!panel.classList.contains('on')) return;
    const path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(panel) < 0 && path.indexOf(bell) < 0) setOpen(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('on')) setOpen(false); });
  render();
})();
