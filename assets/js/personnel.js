// Personnel Details: ONE template (Figma 623:1805) + state frames as JS states: Department filter open (4001:3264),
// Add personnel modal (2030:4480), Edit personnel modal (2030:4777).
// Prototype links read: Add personnel 623:1854 -> 2030:4480; Edit personnel 623:1970 -> 2030:4777; Department filter 623:1871 -> 4001:3264; employee rows have NO reaction in Figma.
// Additions (not in Figma): clicking a row selects that employee (profiles other than EMP-002 are derived), live search, department filter really filters,
// Add personnel saves in memory (EMP-009...), Edit saves in memory, Deactivate marks the employee Inactive (in memory).
(function () {
  var P = HIS.personnel, stage = document.getElementById('stage');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ALL = 'All departments';
  var st = { sel: 'EMP-002', q: '', dept: ALL, menu: false, modal: '' };
  HIS.peState = st;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var IC = {
    group: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'/>",
    userplus: "<path d='M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='8.5' cy='7' r='4'/><path d='M19 8v6M16 11h6'/>",
    pencil: "<path d='M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z'/>",
    search: "<circle cx='11' cy='11' r='7'/><path d='m21 21-4.3-4.3'/>",
    down: "<path d='M6 9l6 6 6-6'/>",
    right: "<path d='M9 6l6 6-6 6'/>",
    user: "<circle cx='12' cy='8' r='4'/><path d='M4 21a8 8 0 0 1 16 0'/>",
    brief: "<rect x='2' y='7' width='20' height='14' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20'/>",
    phone: "<path d='M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'/>",
    shield: "<path d='M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z'/><path d='m9 12 2 2 4-4'/>"
  };
  var ic = function (n, w, sw, style) { return "<svg width='" + w + "' height='" + w + "' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='" + (sw || 2) + "' stroke-linecap='round' stroke-linejoin='round'" + (style ? " style='" + style + "'" : '') + '>' + IC[n] + '</svg>'; };
  var at = function (cls, l, t, inner, extra) { return "<div class='pe-a " + cls + "' style='left:" + l + 'px;top:' + t + 'px;' + (extra || '') + "'>" + inner + '</div>'; };
  var initials = function (n) { var w = n.replace(/^Dr\.\s*/, '').trim().split(/\s+/); return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase(); };
  var longDate = function (iso) { if (!iso) return '\u2014'; var p = iso.split('-'); return MONTHS[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0]; };
  var age = function (iso) { var a = iso.split('-').map(Number), t = P.today.split('-').map(Number), y = t[0] - a[0]; if (t[1] < a[1] || (t[1] === a[1] && t[2] < a[2])) y--; return y; };
  var byId = function (id) { return P.emps.filter(function (e) { return e.id === id; })[0]; };

  var wrap = document.createElement('div'); wrap.id = 'pec'; stage.appendChild(wrap);

  function visible() {
    return P.emps.filter(function (e) {
      return (st.dept === ALL || e.dept === st.dept) && (!st.q || (e.name + ' ' + e.id + ' ' + e.role + ' ' + e.dept).toLowerCase().indexOf(st.q) > -1);
    });
  }

  function top() {
    var E = P.emps, act = E.filter(function (e) { return e.status === 'Active'; }).length, dn = {};
    E.forEach(function (e) { dn[e.dept] = 1; });
    var h = "<h1 class='pe-a pe-t' style='left:68px;top:115px'>Personnel Details</h1>" + at('pe-d', 68, 166, 'Manage employee records, contact information and employment details.');
    h += at('pe-card pe-sum', 68, 207, '');
    h += at('pe-ico', 88, 224, ic('group', 22, 1.7));
    h += at('pe-v1', 152, 226.5, E.length + ' employees') + at('pe-l', 152, 252.5, 'Hospital personnel directory');
    h += at('pe-sd', 319, 229, '');
    h += at('pe-v2', 340, 228.5, Object.keys(dn).length + ' departments') + at('pe-l', 340, 250.5, 'Clinical and support teams');
    h += at('pe-sd', 499, 229, '');
    h += at('pe-v2', 520, 228.5, act + ' active records') + at('pe-l', 520, 250.5, 'Updated Aug 31, 2026');
    h += "<button class='pe-a pe-add' data-modal='add'>" + ic('userplus', 20, 1.8) + '<span>Add personnel</span></button>';
    return h;
  }

  function directory() {
    var v = visible();
    var h = at('pe-card pe-dir', 68, 309, '');
    h += at('pe-h2', 92, 333, 'Employee directory') + at('pe-s12', 92, 362, 'Select an employee to view their record.');
    h += at('pe-cnt', 400, 347.5, String(v.length), 'width:100px');
    h += "<div class='pe-a pe-search'>" + ic('search', 18, 1.8) + "<input id='peq' placeholder='Search employee name or ID' aria-label='Search employee' value='" + esc(st.q) + "'></div>";
    h += "<button class='pe-a pe-flt" + (st.menu ? ' open' : '') + "' id='ped'><span class='v'>" + esc(st.dept) + '</span>' + ic('down', 16, 2) + '</button>';
    h += "<div class='pe-a pe-th'><span style='left:24px'>EMPLOYEE / DEPARTMENT</span><span style='left:391px'>ACTIVE</span></div>";
    v.forEach(function (e, i) {
      var on = e.id === st.sel;
      h += "<button class='pe-a pe-r" + (on ? ' on' : '') + "' data-emp='" + e.id + "' style='top:" + (547 + 76 * i) + "px'>";
      h += "<span class='av'>" + initials(e.name) + "</span><span class='nm'>" + esc(e.name) + "</span><span class='rl'>" + esc(e.role) + ' \u00b7 ' + esc(e.dept) + "</span><span class='id'>" + e.id + '</span>';
      h += on ? "<span class='chv'>" + ic('right', 18, 2) + '</span>' : "<span class='dot" + (e.status === 'Active' ? '' : ' off') + "'></span>";
      h += '</button>';
    });
    if (!v.length) h += at('pe-none', 68, 547, 'No employees match');
    h += "<div class='pe-a pe-ft'>" + at('pe-s12', 24, 18, 'Showing ' + (v.length ? '1\u2013' + v.length : '0') + ' of ' + P.emps.length + ' employees', 'font-size:11px;line-height:13.31px');
    h += at('pe-l', 375, 18, 'Page 1 of 1', 'color:#15405a') + '</div>';
    return h;
  }

  function field(l, t, lab, val) { return at('pe-fl', l, t, esc(lab)) + at('pe-fv', l, t + 19, esc(val)); }
  function rows(list, y0) {
    var h = '';
    for (var i = 0; i < list.length; i += 2) {
      h += field(572, y0 + 55 * (i / 2), list[i][0], list[i][1]);
      if (list[i + 1]) h += field(976, y0 + 55 * (i / 2), list[i + 1][0], list[i + 1][1]);
    }
    return h;
  }

  function profile() {
    var e = byId(st.sel), off = e.status !== 'Active';
    var h = at('pe-card pe-prof', 548, 309, '');
    h += at('pe-h2', 572, 340.5, 'Employee profile');
    h += "<button class='pe-a pe-btn2' data-modal='edit'>" + ic('pencil', 16, 1.8) + '<span>Edit personnel</span></button>';
    h += at('pe-bav', 572, 395.5, initials(e.name));
    h += "<div class='pe-a' style='left:652px;top:391px;height:32px;display:flex;gap:12px;align-items:flex-start'><span class='pe-name'>" + esc(e.name) + "</span><span class='pe-badge" + (off ? ' off' : '') + "' style='margin-top:4.5px;padding:0 9px'>" + (off ? 'Inactive' : 'Active') + '</span></div>';
    h += at('pe-role', 652, 429, esc(e.role) + ' \u00b7 ' + esc(e.dept)) + at('pe-eid', 652, 451, e.id);
    h += at('pe-hr', 548, 488, '', 'width:824px');
    h += at('pe-sico', 572, 514, ic('user', 17, 1.8)) + at('pe-sh', 598, 513, 'Personal &amp; contact information');
    h += rows([['Full name', e.full], ['Date of birth', e.dob ? longDate(e.dob) + ' \u00b7 ' + age(e.dob) + ' years' : '\u2014'], ['Sex', e.sex], ['Civil status', e.civil],
      ['Email address', e.email], ['Mobile number', e.mobile], ['Home address', e.addr], ['Office contact', e.office]], 550);
    h += at('pe-hr', 572, 774, '', 'width:776px');
    h += at('pe-sico', 572, 798, ic('brief', 17, 1.8)) + at('pe-sh', 598, 797, 'Employment details');
    h += rows([['Employee ID', e.id], ['Employment type', e.type], ['Role / position', e.role], ['Department', e.dept], ['Date joined', longDate(e.joined)], ['Reports to', e.reports]], 834);
    h += at('pe-hr', 572, 1003, '', 'width:776px');
    h += at('pe-sico', 572, 1027, ic('phone', 17, 1.8)) + at('pe-sh', 598, 1026, 'Emergency contact');
    h += rows([['Contact name', e.ec.name], ['Relationship', e.ec.rel], ['Primary phone', e.ec.phone], ['Alternative phone', e.ec.alt]], 1063);
    h += "<div class='pe-a pe-foot'>" + at('pe-l', 24, 16, ic('shield', 15, 1.8, 'color:#6f8890'), '') + at('pe-l', 46, 17, 'Confidential personnel record') + at('pe-l', 580, 17, 'Updated Aug 31, 2026 \u00b7 HR Administration', 'width:220px;text-align:right') + '</div>';
    return h;
  }

  function menu() {
    if (!st.menu) return '';
    var opts = [ALL].concat(P.depts);
    var h = "<div class='pe-ml' data-close='1'></div><div class='pe-menu' style='height:" + (8 + 36 * opts.length) + "px'>";
    opts.forEach(function (o) { h += "<button class='pe-o" + (o === st.dept ? ' on' : '') + "' data-opt='" + esc(o) + "'>" + esc(o) + '</button>'; });
    return h + '</div>';
  }

  function modal() {
    if (!st.modal) return '';
    var add = st.modal === 'add', e = add ? null : byId(st.sel), d = add ? P.addDraft : { full: e.full, role: e.role, dept: e.dept, type: e.type, addr: e.addr, ec: e.ec.name + ' \u00b7 ' + e.ec.rel + ' \u00b7 ' + e.ec.phone };
    var nextId = 'EMP-' + ('00' + (P.emps.length + 1)).slice(-3);
    var sub = add ? 'New record \u00b7 Employee ID ' + nextId + ' \u00b7 Date joined Aug 31, 2026' : e.name + ' \u00b7 ' + e.id + ' \u00b7 Joined ' + longDate(e.joined);
    var sel = function (list, cur, f, l, t) { return "<select class='pe-m-i' data-f='" + f + "' style='left:" + l + 'px;top:' + t + "px;width:300px'>" + list.map(function (o) { return '<option' + (o === cur ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>'; };
    var h = "<div class='pe-scrim' data-close='1'></div><div class='pe-modal' role='dialog' aria-modal='true'>";
    h += "<button class='pe-m-x' data-close='1' aria-label='Close'>\u00d7</button><div class='pe-m-t'>" + (add ? 'Add personnel' : 'Edit personnel') + "</div><div class='pe-m-s'>" + esc(sub) + "</div><div class='pe-m-d'></div>";
    [['Full name', 32, 120], ['Role / position', 348, 120], ['Department', 32, 202], ['Employment type', 348, 202], ['Home address', 32, 284], ['Emergency contact (name \u00b7 relationship \u00b7 phone)', 32, 366]].forEach(function (l) {
      h += "<div class='pe-m-l' style='left:" + l[1] + 'px;top:' + l[2] + "px'>" + esc(l[0]) + '</div>';
    });
    h += "<input class='pe-m-i' data-f='full' style='left:32px;top:142px;width:300px' value='" + esc(d.full) + "'>";
    h += "<input class='pe-m-i' data-f='role' style='left:348px;top:142px;width:300px' value='" + esc(d.role) + "'>";
    h += sel(P.depts, d.dept, 'dept', 32, 224) + sel(P.types, d.type, 'type', 348, 224);
    h += "<input class='pe-m-i' data-f='addr' style='left:32px;top:306px;width:616px' value='" + esc(d.addr) + "'>";
    h += "<textarea class='pe-m-i' data-f='ec' style='left:32px;top:388px;width:616px'>" + esc(d.ec) + '</textarea>';
    if (!add) h += "<button class='pe-m-off' data-off='1' style='top:504px'>Deactivate</button>";
    h += "<button class='pe-m-c' data-close='1' style='top:504px'>Cancel</button><button class='pe-m-ok' data-ok='1' style='top:504px'>" + (add ? 'Add personnel' : 'Save changes') + '</button></div>';
    return h;
  }

  var tipT;
  function tip(t) { var o = document.querySelector('.pe-tip'); if (o) o.remove(); var d = document.createElement('div'); d.className = 'pe-tip'; d.textContent = t; document.body.appendChild(d); clearTimeout(tipT); tipT = setTimeout(function () { d.remove(); }, 2400); }

  function render(keepFocus) {
    wrap.innerHTML = top() + directory() + profile() + "<div id='pemenu'>" + menu() + "</div><div id='pemodal'>" + modal() + '</div>';
    if (keepFocus) { var q = document.getElementById('peq'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  }
  render();

  function readForm() { var o = {}; [].forEach.call(document.querySelectorAll('#pemodal [data-f]'), function (n) { o[n.dataset.f] = n.value.trim(); }); return o; }
  function parseEc(s, old) { var p = s.split('\u00b7').map(function (x) { return x.trim(); }); return { name: p[0] || '\u2014', rel: p[1] || '\u2014', phone: p[2] || '\u2014', alt: old ? old.alt : '\u2014' }; }

  stage.addEventListener('click', function (ev) {
    var T = ev.target;
    if (T.closest('[data-close]')) { st.menu = false; st.modal = ''; render(); return; }
    var o = T.closest('.pe-o');
    if (o) { st.dept = o.dataset.opt; st.menu = false; render(); return; }
    if (T.closest('#ped')) { st.menu = !st.menu; render(); return; }
    var r = T.closest('[data-emp]');
    if (r) { st.sel = r.dataset.emp; render(); return; }
    var m = T.closest('[data-modal]'); if (m) { st.modal = m.dataset.modal; render(); return; }
    if (T.closest('[data-off]')) { var x = byId(st.sel); x.status = 'Inactive'; st.modal = ''; render(); tip(x.name + ' marked Inactive'); return; }
    if (T.closest('[data-ok]')) {
      var f = readForm(), bad = false;
      [].forEach.call(document.querySelectorAll('#pemodal [data-f]'), function (n) { var miss = (n.dataset.f === 'full' || n.dataset.f === 'role') && !n.value.trim(); n.classList.toggle('bad', miss); if (miss) bad = true; });
      if (bad) { tip('Full name and role are required'); return; }
      if (st.modal === 'add') {
        var id = 'EMP-' + ('00' + (P.emps.length + 1)).slice(-3);
        P.emps.push({ id: id, name: f.full, role: f.role, dept: f.dept, status: 'Active', full: f.full, dob: '', sex: '\u2014', civil: '\u2014', email: '\u2014', mobile: '\u2014', addr: f.addr || '\u2014', office: '\u2014', type: f.type, joined: P.today, reports: P.chief, ec: parseEc(f.ec) });
        st.sel = id; st.q = ''; st.dept = ALL; st.modal = ''; render(); tip(f.full + ' added as ' + id);
      } else {
        var e = byId(st.sel);
        e.full = f.full; e.role = f.role; e.dept = f.dept; e.type = f.type; e.addr = f.addr || '\u2014'; e.ec = parseEc(f.ec, e.ec);
        st.modal = ''; render(); tip('Changes saved for ' + e.name);
      }
    }
  });
  stage.addEventListener('input', function (ev) { if (ev.target.id === 'peq') { st.q = ev.target.value.trim().toLowerCase(); render(true); } });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && (st.menu || st.modal)) { st.menu = false; st.modal = ''; render(); } });
})();
