// Shared header + slide-in sidebar. Edit NAV once, every page updates.
// Figma: header-bar 239:2978, Sidebar 211:1949 (430x1024). Staff (211:1953) links to Attendance (2002:369).
const NAV = [
  ['dashboard', 'Dashboard', 'grid'], ['registration', 'Registration', 'users'], ['appointments', 'Appointments', 'calendar-check'],
  ['consultation', 'Consultation', 'clipboard-plus'], ['treatment', 'Treatment', 'bag'], ['nursing', 'Nursing', 'heart'],
  ['pharmacy', 'Pharmacy', 'pill'], ['attendance', 'Staff', 'users'], ['personnel', 'Personnel', 'id'],
  ['payroll', 'Payroll', 'peso'], ['departments', 'Departments', 'branches'], ['billing', 'Billing', 'receipt']
];

(function mountShell() {
  const page = document.body.dataset.page;
  if (!page) return;
  const u = HIS.user;
  const ini = u.name.replace('Dr. ', '').split(' ').map(s => s[0]).join('');
  document.body.insertAdjacentHTML('afterbegin',
    "<header class='header'><div class='hd'>" +
    "<button class='burger' id='burger' aria-label='Open menu'><i></i><i></i><i></i></button>" +
    "<img class='logo' src='assets/img/logo-removebg-preview%201.png' data-fallback='assets/img/logo.svg' alt=''>" +
    "<span class='brand'>MediHeal</span>" +
    "<div class='hd-date'>" + svg('calendar', 18) + '<span>' + HIS.fmtShort(HIS.today) + '</span></div>' +
    "<button class='bell' aria-label='Notifications'>" + svg('bell', 20) + '<b>4</b></button>' +
    "<div class='sep'></div>" +
    "<div class='profile'><span class='avatar'>" + ini + "<img src='assets/img/Avatar.png' alt='' data-hide></span><div><div class='nm'>" + u.name + '</div><small>' + u.role.toUpperCase() + '</small></div></div>' +
    '</div></header>' +
    "<div class='scrim' id='scrim'></div>" +
    "<aside class='drawer' aria-label='Main menu'><div class='dr-in'>" +
    "<img class='dr-logo' src='assets/img/logo-removebg-preview%201.png' data-fallback='assets/img/logo.svg' alt=''>" +
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
