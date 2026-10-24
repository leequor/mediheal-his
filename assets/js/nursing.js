// Nursing Care: ONE template (Figma 2047:20735) + state frames as JS states: Ward filter open (4011:5263), Give medicine (2047:21007), Record vitals (2047:21551), Add progress note (2047:22241).
// Prototype links read (session 16): overview Record vitals 2047:20779 -> 2047:21551; Give medicine 2047:20881 -> 2047:21007; Record vitals 2047:20885 -> 2047:21551; Add note 2047:22846 -> 2047:22241;
// Ward filter 2047:20794 -> 4011:5263; patient rows have NO reaction.
// Additions (not in Figma): clicking a row selects that patient (the 7 records other than PT-99213 are DERIVED), live search, the ward filter filters, modals are editable and change the record in memory only
// (reload resets), no localStorage writes. Figma quirk NOT copied: the state frames list "Maria Santos PT-99215" in place of "Rosa Mendoza PT-99220" and draw a shift of 7:00 AM to 3:00 PM / summary captions that differ from the main frame.
(function () {
  var N = HIS.nursing, stage = document.getElementById('stage');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ALL = 'All wards', NA = '\u2014';
  var qid = new URLSearchParams(location.search).get('id');
  var st = { sel: N.pts.some(function (p) { return p.id === qid; }) ? qid : 'PT-99213', q: '', ward: ALL, menu: false, modal: '', doses: 5, vitDue: 3, vitDone: {} };
  HIS.ncState = st;
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
  var at = function (cls, l, t, inner, extra) { return "<div class='tp-a " + cls + "' style='left:" + l + 'px;top:' + t + 'px;' + (extra || '') + "'>" + inner + '</div>'; };
  var byId = function (id) { return N.pts.filter(function (p) { return p.id === id; })[0]; };

  // records other than the drawn one are DERIVED from the patient row (not in Figma)
  function rec(p) {
    if (p.rec) return p.rec;
    var s = parseInt(p.id.slice(-2), 10) || 0, sys = 112 + s % 24, dia = 70 + s % 14, hr = 70 + s % 22, t = 36.5 + (s % 5) / 10, o = 95 + s % 4;
    var rd = function (a, b, c, d, e) { return 'BP ' + (sys + a) + '/' + (dia + b) + ' \u00b7 HR ' + (hr + c) + ' \u00b7 ' + (t + d).toFixed(1) + ' \u00b0C \u00b7 SpO\u2082 ' + (o + e) + '%'; };
    p.rec = {
      meds: [['Morning medicines \u00b7 8:00 AM', 'Given \u00b7 8:05 AM \u00b7 A. Santos, RN'], ['IV fluids \u00b7 as ordered', 'Running \u00b7 per plan'], ['Midday medicines \u00b7 12:00 PM', 'Given \u00b7 12:10 PM \u00b7 A. Santos, RN'], ['Pain relief \u00b7 as needed', 'None needed today'],
        ['Evening medicines \u00b7 ' + p.next, 'Due \u00b7 ' + p.next], ['Bedtime medicines \u00b7 9:00 PM', 'Due \u00b7 9:00 PM'], ['Oxygen \u00b7 as needed', 'Not needed \u00b7 SpO\u2082 ' + o + '%'], ['Missed or refused doses', 'None today']],
      vit: [['6:00 AM', rd(0, 0, 0, 0, 0)], ['10:00 AM', rd(-2, -1, -2, -0.1, 1)], ['2:00 PM', rd(-4, -2, -4, 0, 1)], ['6:00 PM', 'Next vitals due'], ['Pain score', '1 of 10 \u00b7 comfortable'], ['Allergy alert', 'None recorded']],
      care: [['Assigned nurse', 'Andrea Santos, RN'], ['Shift', 'Day \u00b7 7:00 AM to 7:00 PM'], ['Care setting', 'Inpatient \u00b7 ' + p.ward + ', ' + p.bed], ['Next step', 'Vitals due ' + p.next + ', then evening medicines']],
      upd: 'Updated Aug 31, 2026 \u00b7 2:15 PM \u00b7 A. Santos, RN'
    };
    return p.rec;
  }
  // sex and age come from the treatment plans / profiles / registrations when they exist (Figma draws them for PT-99213 only)
  function who(p) {
    var sex = p.sex, age = p.age;
    var tp = ((HIS.treatment || {}).plans || []).filter(function (x) { return x.id === p.id; })[0];
    if (tp) { sex = sex || tp.sex; age = age || tp.age; }
    var pr = (HIS.profiles || {})[p.id];
    if (pr && !age) { var m = /(\d+)\s*yrs/.exec(pr.meta || ''); if (m) age = m[1]; }
    var pa = (HIS.patients || []).filter(function (x) { return x.id === p.id; })[0];
    if (pa) { sex = sex || pa.sex || pa.gender; age = age || (pa.age ? String(pa.age) : ''); }
    return (sex || NA) + ' \u00b7 ' + (age ? age + ' years' : NA) + ' \u00b7 ' + p.ward + ', ' + p.bed;
  }

  var wrap = document.createElement('div'); wrap.id = 'tpc'; stage.appendChild(wrap);

  function visible() {
    return N.pts.filter(function (p) {
      return (st.ward === ALL || p.wk === st.ward) && (!st.q || (p.name + ' ' + p.id + ' ' + p.ward + ' ' + p.bed).toLowerCase().indexOf(st.q) > -1);
    });
  }

  function top() {
    var h = "<h1 class='tp-a tp-t' style='left:68px;top:115px'>Nursing Care</h1>" + at('tp-d', 68, 166, 'Record medicines given and vitals for each inpatient, and see who is due next on the ward.');
    h += at('tp-card tp-sum', 68, 207, '');
    h += at('tp-ico', 88, 224, ic('group', 22, 1.7));
    h += at('tp-v1', 152, 226.5, N.pts.length + ' inpatients') + at('tp-l', 152, 252.5, 'Your assigned wards');
    h += at('tp-sd', 281, 229, '');
    h += at('tp-v2', 302, 228.5, st.vitDue + ' vitals due') + at('tp-l', 302, 250.5, 'Due in the next 2 hours');
    h += at('tp-sd', 443, 229, '');
    h += at('tp-v2', 464, 228.5, st.doses + ' doses given') + at('tp-l', 464, 250.5, 'Today, Aug 31, 2026');
    h += "<button class='tp-a tp-rx' data-modal='vitals' style='left:1209px;top:225px;width:143px'>" + ic('userplus', 20, 1.8) + '<span>Record vitals</span></button>';
    return h;
  }

  function directory() {
    var v = visible();
    var h = at('tp-card tp-dir', 68, 309, '');
    h += at('tp-h2', 92, 333, 'Ward patients') + at('tp-s12', 92, 362, 'Select a patient to open the care record.');
    h += at('tp-cnt', 400, 347.5, String(v.length), 'width:100px');
    h += "<div class='tp-a tp-search'>" + ic('search', 18, 1.8) + "<input id='tpq' placeholder='Search patient name or ID' aria-label='Search patient' value='" + esc(st.q) + "'></div>";
    h += "<button class='tp-a tp-flt" + (st.menu ? ' open' : '') + "' id='tpd'><span class='v'>" + esc(st.ward) + '</span>' + ic('down', 16, 2) + '</button>';
    h += "<div class='tp-a tp-th'><span style='left:24px'>PATIENT / WARD</span><span style='left:409px'>DUE</span></div>";
    v.forEach(function (p, i) {
      var on = p.id === st.sel;
      h += "<button class='tp-a tp-r" + (on ? ' on' : '') + "' data-pt='" + p.id + "' style='top:" + (547 + 76 * i) + "px'>";
      h += "<span class='av'>" + p.ini + "</span><span class='nm'>" + esc(p.name) + "</span><span class='rl'>" + esc(p.ward + ' \u00b7 ' + p.bed + ' \u00b7 Next due ' + p.next) + "</span><span class='id'>" + p.id + '</span>';
      h += on ? "<span class='chv'>" + ic('right', 18, 2) + '</span>' : "<span class='dot'></span>";
      h += '</button>';
    });
    if (!v.length) h += at('tp-none', 68, 547, 'No patients match');
    h += "<div class='tp-a tp-ft'>" + at('tp-s12', 24, 18, 'Showing ' + (v.length ? '1\u2013' + v.length : '0') + ' of ' + N.pts.length + ' patients', 'font-size:11px;line-height:13.31px');
    h += at('tp-l', 375, 18, 'Page 1 of 1', 'color:#15405a') + '</div>';
    return h;
  }

  function field(l, t, lab, val) { return at('tp-fl', l, t, esc(lab)) + at('tp-fv', l, t + 19, esc(val)); }
  function rows(list, y0) {
    var h = '';
    for (var i = 0; i < list.length; i += 2) {
      h += field(572, y0 + 55 * (i / 2), list[i][0], list[i][1]);
      if (list[i + 1]) h += field(976, y0 + 55 * (i / 2), list[i + 1][0], list[i + 1][1]);
    }
    return h;
  }

  function profile() {
    var p = byId(st.sel), r = rec(p);
    var h = at('tp-card tp-prof', 548, 309, '');
    h += at('tp-h2', 572, 340.5, 'Nursing care record');
    [['Give medicine', 829, 132, 'med'], ['Record vitals', 1041, 125, 'vitals'], ['Add note', 1246, 102, 'note']].forEach(function (b) {
      h += "<button class='tp-a tp-btn2' data-modal='" + b[3] + "' style='left:" + b[1] + 'px;top:333px;width:' + b[2] + "px'>" + ic('pencil', 16, 1.8) + '<span>' + b[0] + '</span></button>';
    });
    h += at('tp-bav', 572, 395.5, p.ini);
    h += "<div class='tp-a' style='left:652px;top:391px;height:32px;display:flex;gap:12px;align-items:flex-start'><span class='tp-name'>" + esc(p.name) + "</span><span class='tp-badge' style='margin-top:4.5px;padding:0 9px'>On ward</span></div>";
    h += at('tp-role', 652, 429, esc(who(p))) + at('tp-eid', 652, 451, p.id);
    h += at('tp-hr', 548, 488, '', 'width:824px');
    h += at('tp-sico', 572, 514, ic('user', 17, 1.8)) + at('tp-sh', 598, 513, 'Medication record \u00b7 today');
    h += rows(r.meds, 550);
    h += at('tp-hr', 572, 774, '', 'width:776px');
    h += at('tp-sico', 572, 798, ic('brief', 17, 1.8)) + at('tp-sh', 598, 797, 'Vitals chart \u00b7 today');
    h += rows(r.vit, 834);
    h += at('tp-hr', 572, 1003, '', 'width:776px');
    h += at('tp-sico', 572, 1027, ic('phone', 17, 1.8)) + at('tp-sh', 598, 1026, 'Care team and shift');
    h += rows(r.care, 1063);
    h += "<div class='tp-a tp-foot'>" + at('tp-l', 24, 16, ic('shield', 15, 1.8, 'color:#6f8890'), '') + at('tp-l', 46, 17, 'Confidential patient record') + at('tp-l', 480, 17, esc(r.upd), 'width:320px;text-align:right') + '</div>';
    return h;
  }

  function menu() {
    if (!st.menu) return '';
    var opts = [ALL].concat(N.wards);
    var h = "<div class='tp-ml' data-close='1'></div><div class='tp-menu' style='height:" + (16 + 36 * opts.length) + "px'>";
    opts.forEach(function (o) { h += "<button class='tp-o" + (o === st.ward ? ' on' : '') + "' data-opt='" + esc(o) + "'>" + esc(o) + '</button>'; });
    return h + '</div>';
  }

  // ---- modals: every field is the Figma text for PT-99213; for the other patients the fields are blank or derived from the row ----
  function spec(kind, p) {
    var G = p.id === 'PT-99213', sub = p.name + ' \u00b7 ' + p.id + ' \u00b7 ' + p.ward + ', ' + p.bed;
    var al = String((rec(p).vit[5] || ['', 'None recorded'])[1]).split(' \u00b7 ')[0];
    if (kind === 'med') return { title: 'Give medicine', sub: sub, ok: 'Record dose', req: [0, 1, 3, 4],
      l: ['Medicine', 'Dose and route', 'Scheduled time', 'Given at', 'Given by', "Nurse's note"],
      v: G ? ['Atorvastatin 40 mg tablet', '40 mg \u00b7 oral', '6:00 PM', '6:05 PM', 'Andrea Santos, RN', 'Taken with water. No nausea or rash.'] : ['', '', p.next, '', 'Andrea Santos, RN', ''],
      bt: G ? 'Safety check passed' : 'Safety check', bx: G ? 'Right patient, drug, dose, route and time. No conflict with the Penicillin allergy.' : 'Right patient, drug, dose, route and time are checked against the recorded allergy (' + al + ').' };
    if (kind === 'vitals') return { title: 'Record vitals', sub: sub, ok: 'Save vitals', req: [0, 1, 2, 3],
      l: ['Blood pressure', 'Heart rate', 'Temperature', 'SpO\u2082', 'Pain score (0 to 10)', "Nurse's note"],
      v: G ? ['142/88 mmHg', '86 bpm', '36.8 \u00b0C', '98%', '1 of 10', 'Resting comfortably. No chest pain.'] : ['', '', '', '', '', ''],
      bt: G ? 'Reading noted against the plan' : 'Reading check', bx: G ? 'Target BP is below 130/80. Recheck in 4 hours and tell the doctor if above 160/100.' : 'Readings are noted against the plan. Tell the doctor if blood pressure is above 160/100.' };
    return { title: 'Add progress note', sub: sub, ok: 'Save note', req: [0, 2, 4],
      l: ['Note type', 'Shift', 'Written by', 'Patient condition', 'Progress note', 'Plan for next shift'],
      v: G ? ['Daily progress note', 'Day \u00b7 7:00 AM to 3:00 PM', 'Andrea Santos, RN', 'Stable, comfortable', 'Rested well, pain 1 of 10, walked with help', 'Vitals 6:00 PM, Atorvastatin due'] : ['Daily progress note', 'Day \u00b7 7:00 AM to 3:00 PM', 'Andrea Santos, RN', '', '', ''],
      bt: 'Shared with the care team', bx: G ? 'Time-stamped and visible to the attending doctor, Dr. Laurice Laureta.' : 'Time-stamped and visible to the attending doctor.' };
  }
  // [label top, input top, left, width]
  var POS = [[120, 142, 32, 300], [120, 142, 348, 300], [202, 224, 32, 300], [202, 224, 348, 300], [284, 306, 32, 616], [462, 484, 32, 616]];

  function modal() {
    if (!st.modal) return '';
    var s = spec(st.modal, byId(st.sel));
    var h = "<div class='tp-scrim' data-close='1'></div><div class='tp-modal' role='dialog' aria-modal='true' aria-label='" + esc(s.title) + "'>";
    h += "<button class='tp-m-x' data-close='1' aria-label='Close'>\u00d7</button><div class='tp-m-t'>" + esc(s.title) + "</div><div class='tp-m-s'>" + esc(s.sub) + "</div><div class='tp-m-d'></div>";
    POS.forEach(function (q, i) {
      h += "<div class='tp-m-l' style='left:" + q[2] + 'px;top:' + q[0] + "px'>" + esc(s.l[i]) + '</div>';
      if (i === 5) h += "<textarea class='tp-m-i' data-i='5' style='left:32px;top:" + q[1] + "px;width:616px'>" + esc(s.v[i]) + '</textarea>';
      else h += "<input class='tp-m-i' data-i='" + i + "' value='" + esc(s.v[i]) + "' style='left:" + q[2] + 'px;top:' + q[1] + 'px;width:' + q[3] + "px'>";
    });
    h += "<div class='tp-m-b'><b>" + esc(s.bt) + '</b><span>' + esc(s.bx) + '</span></div>';
    h += "<button class='tp-m-c' data-close='1'>Cancel</button><button class='tp-m-ok' data-ok='1'>" + esc(s.ok) + '</button></div>';
    return h;
  }

  var tipT;
  function tip(t) { var o = document.querySelector('.tp-tip'); if (o) o.remove(); var d = document.createElement('div'); d.className = 'tp-tip'; d.textContent = t; document.body.appendChild(d); clearTimeout(tipT); tipT = setTimeout(function () { d.remove(); }, 2600); }

  function render(keepFocus) {
    wrap.innerHTML = top() + directory() + profile() + "<div id='tpmenu'>" + menu() + "</div><div id='tpmodal'>" + modal() + '</div>';
    if (keepFocus) { var q = document.getElementById('tpq'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  }
  render();

  function vals() { var o = []; [].forEach.call(document.querySelectorAll('#tpmodal [data-i]'), function (n) { o[+n.dataset.i] = n.value.trim(); }); return o; }

  function confirm() {
    var kind = st.modal, s = spec(kind, byId(st.sel)), v = vals(), p = byId(st.sel), r = rec(p), bad = false, msg;
    [].forEach.call(document.querySelectorAll('#tpmodal [data-i]'), function (n) { var miss = s.req.indexOf(+n.dataset.i) > -1 && !n.value.trim(); n.classList.toggle('bad', miss); if (miss) bad = true; });
    if (bad) { tip('Fill in the highlighted fields'); return; }
    if (kind === 'med') {
      var w = v[0].toLowerCase().split(' ')[0], hit = -1;
      r.meds.forEach(function (m, i) { if (hit < 0 && /^due/i.test(m[1]) && m[0].toLowerCase().indexOf(w) === 0) hit = i; });
      if (hit > -1) r.meds[hit][1] = 'Given \u00b7 ' + v[3] + ' \u00b7 ' + v[4];
      st.doses++; msg = v[0] + ' given at ' + v[3];
    } else if (kind === 'vitals') {
      var reading = 'BP ' + v[0].replace(/\s*mmHg$/i, '') + ' \u00b7 HR ' + v[1].replace(/\s*bpm$/i, '') + ' \u00b7 ' + v[2] + ' \u00b7 SpO\u2082 ' + v[3];
      r.vit.forEach(function (m) { if (m[1] === 'Next vitals due') m[1] = reading; if (m[0] === 'Pain score' && v[4]) m[1] = v[4]; });
      if (!st.vitDone[p.id] && st.vitDue > 0) { st.vitDone[p.id] = true; st.vitDue--; }
      msg = 'Vitals saved for ' + p.name;
    } else {
      if (v[5]) r.care.forEach(function (m) { if (m[0] === 'Next step') m[1] = v[5]; });
      r.upd = 'Updated Aug 31, 2026 \u00b7 ' + v[2];
      msg = 'Progress note saved for ' + p.name;
    }
    st.modal = ''; render(); tip(msg + ' (in memory only)');
  }

  stage.addEventListener('click', function (ev) {
    var X = ev.target;
    if (X.closest('[data-close]')) { st.menu = false; st.modal = ''; render(); return; }
    var o = X.closest('.tp-o');
    if (o) { st.ward = o.dataset.opt; st.menu = false; render(); return; }
    if (X.closest('#tpd')) { st.menu = !st.menu; render(); return; }
    var r = X.closest('[data-pt]');
    if (r) { st.sel = r.dataset.pt; render(); return; }
    var m = X.closest('[data-modal]');
    if (m) { st.modal = m.dataset.modal; render(); var f = document.querySelector('#tpmodal .tp-m-i'); if (f) f.focus({ preventScroll: true }); return; }
    if (X.closest('[data-ok]')) confirm();
  });
  stage.addEventListener('input', function (ev) { if (ev.target.id === 'tpq') { st.q = ev.target.value.trim().toLowerCase(); render(true); } });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && (st.menu || st.modal)) { st.menu = false; st.modal = ''; render(); } });
})();
