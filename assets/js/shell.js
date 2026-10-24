// Shared header + slide-in menu. Edit NAV once, every page updates.
// Figma: header 2002:370, menu 211:1949
const NAV = [
  ['dashboard', 'Dashboard'], ['registration', 'Registration'], ['appointments', 'Appointments'],
  ['consultation', 'Consultation'], ['treatment', 'Treatment'], ['nursing', 'Nursing'],
  ['pharmacy', 'Pharmacy'], ['staff', 'Staff'], ['personnel', 'Personnel'],
  ['payroll', 'Payroll'], ['departments', 'Departments'], ['billing', 'Billing']
];

(function mountShell() {
  const page = document.body.dataset.page;
  if (!page) return;
  const u = HIS.user;
  const initials = u.name.replace('Dr. ', '').split(' ').map(s => s[0]).join('');
  document.body.insertAdjacentHTML('afterbegin', `
    <header class="header">
      <div class="left">
        <button class="burger" aria-label="Open menu" id="burger"><i></i><i></i><i></i></button>
        <span class="brand">MediHeal</span>
      </div>
      <div class="right">
        <span class="chip">\u{1F4C5} ${HIS.fmtShort(HIS.today)}</span>
        <button class="bell" aria-label="Notifications">\u{1F514}<b>4</b></button>
        <div class="profile"><span class="avatar">${initials}</span><div>${u.name}<small>${u.role.toUpperCase()}</small></div></div>
      </div>
    </header>
    <div class="scrim" id="scrim"></div>
    <aside class="drawer" aria-label="Main menu">
      <h2>MediHeal</h2>
      <nav>${NAV.map(([id, label]) => `<a href="${id}.html" class="${id === page ? 'active' : ''}">${label}</a>`).join('')}</nav>
      <a class="signout" href="index.html">Sign out</a>
      <small>${HIS.contact.email}<br>${HIS.contact.phone}</small>
    </aside>`);
  const toggle = open => document.body.classList.toggle('menu-open', open);
  document.getElementById('burger').onclick = () => toggle(true);
  document.getElementById('scrim').onclick = () => toggle(false);
  document.addEventListener('keydown', e => e.key === 'Escape' && toggle(false));
})();
