// Doctor Consultation: ONE template (Figma 2030:3609) + state frames as JS states: Department filter open (4001:3818), Record diagnosis (2030:3877 and the 3 other outcomes 2047:14674 / 14971 / 15268),
// Outcome list (2047:17647), Diagnosis saved (2030:4174, 2047:16753 / 17050 / 17347).
// Prototype link read (session 17): overview Record diagnosis 2030:3653 -> 2030:3877. Other buttons/rows not read (rows have no reaction in the sibling pages).
// Additions (not in Figma): clicking a row selects that patient (7 records are DERIVED), live search, the department filter filters, the diagnosis modal is editable and changes the record in memory only (reload resets),
// View history has no Figma frame (tooltip). Figma quirks NOT copied: the filter state frame lists other patients (Ramon Bautista, Carla Tan, Nina Flores); the saved frames always draw "Unstable angina \u00b7 I20.0" (the build shows the saved form values).
(function () {
  var C = HIS.consult, stage = document.getElementById('stage');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ALL = 'All departments', NA = '\u2014', DR = 'Dr. Laurice Laureta';
  var qid = new URLSearchParams(location.search).get('id');
  var st = { sel: C.pts.some(function (p) { return p.id === qid; }) ? qid : 'PT-99213', q: '', dept: ALL, menu: false, modal: '', pn: false, f: [], saved: null, prog: 2, comp: 3, done: {} };
  HIS.csState = st;
  var css = document.createElement('style');
  css.textContent = '.cs-pn{position:absolute;left:348px;top:270px;width:300px;height:160px;background:#fff;border-radius:12px;box-shadow:inset 0 0 0 1px #c8dcea,0 8px 24px rgba(15,30,46,.12);z-index:5}' +
    '.cs-op{position:absolute;left:8px;width:284px;height:36px;border:0;border-radius:8px;background:transparent;text-align:left;padding:0 0 0 12px;font:500 13px/36px Inter,sans-serif;color:#1c2b30;cursor:pointer}' +
    '.cs-op:hover{background:#f1f7fb}.cs-op.on{background:#e8f4fb}.cs-op .ck{position:absolute;left:248px;top:0;font:700 14px/36px Inter,sans-serif;color:#1c6d9c}' +
    '.cs-out{cursor:pointer;text-align:left}.cs-out.open{box-shadow:inset 0 0 0 1px #1c6d9c}';
  document.head.appendChild(css);
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
  var byId = function (id) { return C.pts.filter(function (p) { return p.id === id; })[0]; };

  function rec(p) {
    if (p.rec) return p.rec;
    var s = parseInt(p.id.slice(-2), 10) || 0, sys = 112 + s % 24, dia = 70 + s % 14, hr = 70 + s % 22, t = 36.5 + (s % 5) / 10, o = 95 + s % 4;
    p.rec = {
      s1: [['Chief complaint', p.cc], ['Onset', 'Aug 30, 2026'], ['Severity', '4 of 10 \u00b7 intermittent'], ['Associated symptoms', 'None reported'], ['Medical history', 'None recorded'], ['Current medication', 'None recorded'], ['Family history', 'None recorded'], ['Last visit', NA]],
      s2: [['Allergies', 'None recorded'], ['Allergy severity', NA], ['Blood pressure', sys + '/' + dia + ' mmHg'], ['Heart rate', hr + ' bpm'], ['Temperature', t.toFixed(1) + ' \u00b0C'], ['SpO\u2082 \u00b7 Weight', o + '% \u00b7 ' + NA]],
      s3: [['Attending doctor', C.doctors[p.dept] || 'Dr. Elsie Chen'], ['Department', p.dept], ['Visit type', 'Outpatient consultation'], ['Next step', 'Record diagnosis']],
      upd: 'Updated Aug 31, 2026 \u00b7 ' + (C.doctors[p.dept] || 'Dr. Elsie Chen')
    };
    return p.rec;
  }
  function who(p) {
    var sex = p.sex, age = p.age, kind = p.kind;
    var pr = (HIS.profiles || {})[p.id];
    if (pr && !age) { var m = /(\d+)\s*yrs/.exec(pr.meta || ''); if (m) age = m[1]; }
    var pa = (HIS.patients || []).filter(function (x) { return x.id === p.id; })[0];
    if (pa) { sex = sex || pa.sex || pa.gender; age = age || (pa.age ? String(pa.age) : ''); kind = kind || pa.type; }
    return (sex || NA) + ' \u00b7 ' + (age ? age + ' years' : NA) + ' \u00b7 ' + (kind || 'Outpatient');
  }
  var wrap = document.createElement('div'); wrap.id = 'tpc'; stage.appendChild(wrap);

  function visible() {
    return C.pts.filter(function (p) {
      return (st.dept === ALL || p.dept === st.dept) && (!st.q || (p.name + ' ' + p.id + ' ' + p.rl).toLowerCase().indexOf(st.q) > -1);
    });
  }

  function top() {
    var h = "<h1 class='tp-a tp-t' style='left:68px;top:115px'>Doctor Consultation</h1>" + at('tp-d', 68, 166, "Open a patient's visit, review history, allergies and vitals, then record the diagnosis.");
    h += at('tp-card tp-sum', 68, 207, '');
    h += at('tp-ico', 88, 224, ic('group', 22, 1.7));
    h += at('tp-v1', 152, 226.5, C.pts.length + ' patients today') + at('tp-l', 152, 252.5, 'Consultation queue');
    h += at('tp-sd', 315, 229, '');
    h += at('tp-v2', 336, 228.5, st.prog + ' in progress') + at('tp-l', 336, 250.5, 'Vitals already recorded');
    h += at('tp-sd', 477, 229, '');
    h += at('tp-v2', 498, 228.5, st.comp + ' completed') + at('tp-l', 498, 250.5, 'Updated Aug 31, 2026');
    h += "<button class='tp-a tp-rx' data-modal='dx' style='left:1182px;top:225px;width:170px'>" + ic('userplus', 20, 1.8) + '<span>Record diagnosis</span></button>';
    return h;
  }

  function directory() {
    var v = visible();
    var h = at('tp-card tp-dir', 68, 309, '');
    h += at('tp-h2', 92, 333, 'Patient queue') + at('tp-s12', 92, 362, 'Select a patient to open the consultation.');
    h += at('tp-cnt', 400, 347.5, String(v.length), 'width:100px');
    h += "<div class='tp-a tp-search'>" + ic('search', 18, 1.8) + "<input id='tpq' placeholder='Search patient name or ID' aria-label='Search patient' value='" + esc(st.q) + "'></div>";
    h += "<button class='tp-a tp-flt" + (st.menu ? ' open' : '') + "' id='tpd'><span class='v'>" + esc(st.dept) + '</span>' + ic('down', 16, 2) + '</button>';
    h += "<div class='tp-a tp-th'><span style='left:24px'>PATIENT / COMPLAINT</span><span style='left:393px'>QUEUE</span></div>";
    v.forEach(function (p, i) {
      var on = p.id === st.sel;
      h += "<button class='tp-a tp-r" + (on ? ' on' : '') + "' data-pt='" + p.id + "' style='top:" + (547 + 76 * i) + "px'>";
      h += "<span class='av'>" + p.ini + "</span><span class='nm'>" + esc(p.name) + "</span><span class='rl'>" + esc(p.rl) + "</span><span class='id'>" + p.id + '</span>';
      h += on ? "<span class='chv'>" + ic('right', 18, 2) + '</span>' : "<span class='dot'></span>";
      h += '</button>';
    });
    if (!v.length) h += at('tp-none', 68, 547, 'No patients match');
    h += "<div class='tp-a tp-ft'>" + at('tp-s12', 24, 18, 'Showing ' + (v.length ? '1\u2013' + v.length : '0') + ' of ' + C.pts.length + ' patients', 'font-size:11px;line-height:13.31px');
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
    h += at('tp-h2', 572, 340.5, 'Consultation');
    h += "<button class='tp-a tp-btn2' data-hist='1' style='left:1226px;top:333px;width:122px'>" + ic('pencil', 16, 1.8) + '<span>View history</span></button>';
    h += at('tp-bav', 572, 395.5, p.ini);
    h += "<div class='tp-a' style='left:652px;top:391px;height:32px;display:flex;gap:12px;align-items:flex-start'><span class='tp-name'>" + esc(p.name) + "</span><span class='tp-badge' style='margin-top:4.5px;padding:0 9px'>In consultation</span></div>";
    h += at('tp-role', 652, 429, esc(who(p))) + at('tp-eid', 652, 451, p.id);
    h += at('tp-hr', 548, 488, '', 'width:824px');
    h += at('tp-sico', 572, 514, ic('user', 17, 1.8)) + at('tp-sh', 598, 513, 'Chief complaint & history');
    h += rows(r.s1, 550);
    h += at('tp-hr', 572, 774, '', 'width:776px');
    h += at('tp-sico', 572, 798, ic('brief', 17, 1.8)) + at('tp-sh', 598, 797, 'Allergies & vital signs');
    h += rows(r.s2, 834);
    h += at('tp-hr', 572, 1003, '', 'width:776px');
    h += at('tp-sico', 572, 1027, ic('phone', 17, 1.8)) + at('tp-sh', 598, 1026, 'Visit details');
    h += rows(r.s3, 1063);
    h += "<div class='tp-a tp-foot'>" + at('tp-l', 24, 16, ic('shield', 15, 1.8, 'color:#6f8890'), '') + at('tp-l', 46, 17, 'Confidential patient record') + at('tp-l', 480, 17, esc(r.upd), 'width:320px;text-align:right') + '</div>';
    return h;
  }

  function menu() {
    if (!st.menu) return '';
    var opts = [ALL].concat(C.depts);
    var h = "<div class='tp-ml' data-close='1'></div><div class='tp-menu' style='height:" + (16 + 36 * opts.length) + "px'>";
    opts.forEach(function (o) { h += "<button class='tp-o" + (o === st.dept ? ' on' : '') + "' data-opt='" + esc(o) + "'>" + esc(o) + '</button>'; });
    return h + '</div>';
  }

  // ---- Record diagnosis modal: Figma values for PT-99213, blank/derived for the others ----
  var FD = { admit: ['Unstable angina', 'I20.0'], other: ['Acute coronary syndrome', 'I24.9'] };
  function dxInit(p) {
    var G = p.id === 'PT-99213';
    return G ? ['Unstable angina', 'I20.0', 'Moderate', 'Admit for observation', 'ST depression on ECG; chest wall tenderness absent', 'Order troponin and 2D echo. Avoid penicillin.'] : ['', '', '', 'Prescribe medication', '', ''];
  }
  function sub(p) {
    var r = rec(p), al = String(r.s2[0][1]).split(' \u00b7 ')[0], bp = String(r.s2[2][1]).replace(/\s*mmHg$/i, '');
    return p.name + ' \u00b7 ' + p.id + ' \u00b7 Allergy: ' + al + ' \u00b7 BP ' + bp;
  }
  var POS = [[120, 142, 32, 300], [120, 142, 348, 300], [202, 224, 32, 300], [202, 224, 348, 300], [284, 306, 32, 616], [366, 388, 32, 616]];
  var LAB = ['Diagnosis / condition', 'ICD-10 code', 'Severity', 'Outcome', 'Clinical findings', "Doctor's notes and plan"];
  function modal() {
    if (!st.modal) return '';
    var p = byId(st.sel), h;
    if (st.modal === 'saved') {
      var s = st.saved, L = ['Diagnosis', 'Outcome', 'Recorded by', 'Next step'], V = [s.diag, s.outcome, s.by, s.next];
      h = "<div class='tp-scrim' data-close='1'></div><div class='tp-modal' role='dialog' aria-modal='true' aria-label='Diagnosis saved' style='height:368px'>";
      h += "<button class='tp-m-x' data-close='1' aria-label='Close'>\u00d7</button><div class='tp-m-t'>Diagnosis saved</div><div class='tp-m-s'>Added to the record of " + esc(p.name) + ' \u00b7 ' + p.id + ' \u00b7 Aug 31, 2026</div><div class="tp-m-d"></div>';
      for (var i = 0; i < 4; i++) {
        var q = POS[i];
        h += "<div class='tp-m-l' style='left:" + q[2] + 'px;top:' + q[0] + "px'>" + L[i] + '</div>';
        h += "<input class='tp-m-i' readonly value='" + esc(V[i]) + "' style='left:" + q[2] + 'px;top:' + q[1] + 'px;width:' + q[3] + "px'>";
      }
      h += "<button class='tp-m-c' data-close='1' style='top:300px'>Back to queue</button><button class='tp-m-ok' data-close='1' style='top:300px'>View record</button></div>";
      return h;
    }
    h = "<div class='tp-scrim' data-close='1'></div><div class='tp-modal' role='dialog' aria-modal='true' aria-label='Record diagnosis' style='height:568px'>";
    h += "<button class='tp-m-x' data-close='1' aria-label='Close'>\u00d7</button><div class='tp-m-t'>Record diagnosis</div><div class='tp-m-s'>" + esc(sub(p)) + "</div><div class='tp-m-d'></div>";
    POS.forEach(function (q, i) {
      h += "<div class='tp-m-l' style='left:" + q[2] + 'px;top:' + q[0] + "px'>" + LAB[i] + '</div>';
      if (i === 5) h += "<textarea class='tp-m-i' data-i='5' style='left:32px;top:388px;width:616px'>" + esc(st.f[5]) + '</textarea>';
      else if (i === 3) h += "<input class='tp-m-i cs-out" + (st.pn ? ' open' : '') + "' id='csout' data-i='3' readonly value='" + esc(st.f[3]) + "' style='left:348px;top:224px;width:300px'>";
      else h += "<input class='tp-m-i' data-i='" + i + "' value='" + esc(st.f[i]) + "' style='left:" + q[2] + 'px;top:' + q[1] + 'px;width:' + q[3] + "px'>";
    });
    if (st.pn) {
      h += "<div class='cs-pn'>";
      C.outcomes.forEach(function (o, i) { var on = o === st.f[3]; h += "<button class='cs-op" + (on ? ' on' : '') + "' data-oc='" + esc(o) + "' style='top:" + (8 + 36 * i) + "px'>" + esc(o) + (on ? "<span class='ck'>\u2713</span>" : '') + '</button>'; });
      h += '</div>';
    }
    h += "<button class='tp-m-c' data-close='1' style='top:504px'>Cancel</button><button class='tp-m-ok' data-ok='1' style='top:504px'>Save diagnosis</button></div>";
    return h;
  }

  var tipT;
  function tip(t) { var o = document.querySelector('.tp-tip'); if (o) o.remove(); var d = document.createElement('div'); d.className = 'tp-tip'; d.textContent = t; document.body.appendChild(d); clearTimeout(tipT); tipT = setTimeout(function () { d.remove(); }, 2600); }

  function render(keepFocus) {
    wrap.innerHTML = top() + directory() + profile() + "<div id='tpmenu'>" + menu() + "</div><div id='tpmodal'>" + modal() + '</div>';
    if (keepFocus) { var q = document.getElementById('tpq'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  }
  render();

  function nextStep(o, p) {
    if (o === 'Prescribe medication') return 'Prescription sent to Pharmacy';
    if (o === 'Order tests') return 'Orders sent to Laboratory';
    if (o === 'Refer to specialist') return p.id === 'PT-99213' ? 'Referral sent to Cardiology' : 'Referral sent to specialist';
    return 'Admit to ward for observation';
  }
  function confirm() {
    var p = byId(st.sel), r = rec(p), bad = false, f = st.f;
    [0, 1, 2, 3, 4].forEach(function (i) {
      var n = document.querySelector('#tpmodal [data-i="' + i + '"]'), miss = !String(f[i] || '').trim();
      if (n) n.classList.toggle('bad', miss);
      if (miss) bad = true;
    });
    if (bad) { tip('Fill in the highlighted fields'); return; }
    var nx = nextStep(f[3], p);
    r.s3.forEach(function (m) { if (m[0] === 'Next step') m[1] = nx; });
    r.upd = 'Updated Aug 31, 2026 \u00b7 ' + DR;
    if (!st.done[p.id]) { st.done[p.id] = true; if (st.prog > 0) st.prog--; st.comp++; }
    st.saved = { diag: f[0].trim() + ' \u00b7 ' + f[1].trim(), outcome: f[3], by: DR, next: nx };
    st.modal = 'saved'; st.pn = false; render(); tip('Diagnosis saved for ' + p.name + ' (in memory only)');
  }

  stage.addEventListener('click', function (ev) {
    var X = ev.target;
    if (X.closest('[data-close]')) { st.menu = false; st.modal = ''; st.pn = false; render(); return; }
    var oc = X.closest('[data-oc]');
    if (oc) {
      var v = oc.dataset.oc, G = st.sel === 'PT-99213';
      if (G && (st.f[0] === FD.admit[0] || st.f[0] === FD.other[0])) { var d = v === 'Admit for observation' ? FD.admit : FD.other; st.f[0] = d[0]; st.f[1] = d[1]; }
      st.f[3] = v; st.pn = false; render(); return;
    }
    if (X.closest('#csout')) { st.pn = !st.pn; render(); return; }
    var o = X.closest('.tp-o');
    if (o) { st.dept = o.dataset.opt; st.menu = false; render(); return; }
    if (X.closest('#tpd')) { st.menu = !st.menu; render(); return; }
    var r = X.closest('[data-pt]');
    if (r) { st.sel = r.dataset.pt; render(); return; }
    if (X.closest('[data-hist]')) { tip('Visit history is not drawn in Figma'); return; }
    var m = X.closest('[data-modal]');
    if (m) { st.modal = 'dx'; st.pn = false; st.f = dxInit(byId(st.sel)); render(); var fi = document.querySelector('#tpmodal .tp-m-i'); if (fi) fi.focus({ preventScroll: true }); return; }
    if (X.closest('[data-ok]')) confirm();
  });
  stage.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.id === 'tpq') { st.q = t.value.trim().toLowerCase(); render(true); }
    else if (t.dataset && t.dataset.i !== undefined && st.modal === 'dx') st.f[+t.dataset.i] = t.value;
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    if (st.pn) { st.pn = false; render(); } else if (st.menu || st.modal) { st.menu = false; st.modal = ''; render(); }
  });
})();
