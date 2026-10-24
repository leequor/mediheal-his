// Treatment Plans: ONE template (Figma 2047:17739) + state frames as JS states: Department filter open (4011:4115), Prescribe (2047:18007), Order lab/imaging (2047:19218),
// Schedule procedure (2047:20125), Assign ward and bed (2047:23469), Update status (2047:24075), Dispense medication (2047:25913, modal 2047:26162), Medication dispensed (2047:26213, modal 2047:26462),
// Discharge summary (2047:25314, modal 2047:25563; session 19, moved here from the profile page, ?modal=summary).
// Prototype links read: Prescribe 2047:17783 -> 2047:18007; Status 2047:25308 and 2047:24672 -> 2047:24075; Order tests 2047:17885 -> 2047:19218; Schedule procedure 2047:20722 -> 2047:20125;
// Nursing care 2047:22236 -> Nursing Care page 2047:20735 (nursing.html); Assign bed 2047:23456 -> 2047:23469; Department filter 2047:17798 -> 4011:4115; patient rows have NO reaction.
// Pharmacy (session 18): pharmacy.html redirects to treatment.html?modal=pharmacy (no Pharmacy page frame exists in Figma). Dispense -> Medication dispensed (680x368, 4 visible fields, buttons y300; Figma clips Input 5/6).
// Additions (not in Figma): clicking a row selects that plan (the 7 plans other than PT-99213 have DERIVED details), live search, department filter filters, modals are editable.
// Session 21: saved changes persist in this browser under localStorage key `mh_treatment_state` ({ stock, plans: { <id>: { pstat, type, f: { meds, next, procs, care } } } }); delete the key to reset.
// Figma quirk NOT copied: the overlay frames draw a single "Plan history" button where the main frame has 5 action buttons; the Dispensed frame sits over a Personnel clone.
(function () {
  var T = HIS.treatment, stage = document.getElementById('stage');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ALL = 'All departments', NA = '\u2014';
  var qs = new URLSearchParams(location.search), qid = qs.get('id');
  var st = { sel: T.plans.some(function (p) { return p.id === qid; }) ? qid : 'PT-99213', q: '', dept: ALL, menu: false, modal: qs.get('modal') === 'pharmacy' ? 'pharmacy' : qs.get('modal') === 'summary' ? 'summary' : '', stock: 240, disp: null };
  HIS.tpState = st;
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
  var byId = function (id) { return T.plans.filter(function (p) { return p.id === id; })[0]; };

  // ---- persistence (localStorage, own key) ----
  var KEY = 'mh_treatment_state';
  function saveState() {
    try {
      var o = { stock: st.stock, plans: {} };
      T.plans.forEach(function (p) { o.plans[p.id] = { pstat: p.pstat || '', type: p.type, f: { meds: p.f.meds, next: p.f.next, procs: p.f.procs, care: p.f.care } }; });
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) { /* storage blocked: keep the change in memory only */ }
  }
  (function loadState() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!o) return;
      if (typeof o.stock === 'number') st.stock = o.stock;
      T.plans.forEach(function (p) {
        var s = o.plans && o.plans[p.id];
        if (!s) return;
        if (s.pstat) p.pstat = s.pstat; else delete p.pstat;
        if (s.type) p.type = s.type;
        ['meds', 'next', 'procs', 'care'].forEach(function (k) { if (s.f && s.f[k] != null) p.f[k] = s.f[k]; });
      });
    } catch (e) { /* ignore bad data */ }
  })();

  // age and sex come from the patient profile / registration data when it exists (Figma lists no age for the other plans)
  function who(p) {
    var pr = (HIS.profiles || {})[p.id], age = p.age || '', sex = p.sex;
    if (pr) { var m = /(\d+)\s*yrs/.exec(pr.meta || ''); if (m && !p.age) age = m[1]; }
    var pa = (HIS.patients || []).filter(function (x) { return x.id === p.id; })[0];
    if (pa && !age && pa.age) age = String(pa.age);
    return sex + ' \u00b7 ' + (age ? age + ' years' : NA) + ' \u00b7 ' + p.type;
  }
  var pill = function (p) { return p.pstat === 'done' ? ['Plan completed', 'done'] : p.pstat === 'stop' ? ['Plan cancelled', 'stop'] : ['Plan active', '']; };

  var wrap = document.createElement('div'); wrap.id = 'tpc'; stage.appendChild(wrap);

  function visible() {
    return T.plans.filter(function (p) {
      return (st.dept === ALL || p.dept === st.dept) && (!st.q || (p.name + ' ' + p.id + ' ' + p.sub).toLowerCase().indexOf(st.q) > -1);
    });
  }

  function top() {
    var stopped = T.plans.filter(function (p) { return p.pstat; }).length, done = T.plans.filter(function (p) { return p.pstat === 'done'; }).length;
    var h = "<h1 class='tp-a tp-t' style='left:68px;top:115px'>Treatment Plans</h1>" + at('tp-d', 68, 166, 'Review the diagnosis, set goals and manage the care plan, then prescribe, order tests or schedule procedures.');
    h += at('tp-card tp-sum', 68, 207, '');
    h += at('tp-ico', 88, 224, ic('group', 22, 1.7));
    h += at('tp-v1', 152, 226.5, (T.plans.length - stopped) + ' active plans') + at('tp-l', 152, 252.5, 'Treatment queue');
    h += at('tp-sd', 295, 229, '');
    h += at('tp-v2', 316, 228.5, '3 due for review') + at('tp-l', 316, 250.5, 'Reviews due this week');
    h += at('tp-sd', 455, 229, '');
    h += at('tp-v2', 476, 228.5, (2 + done) + ' completed') + at('tp-l', 476, 250.5, 'Updated Aug 31, 2026');
    h += "<button class='tp-a tp-rx' data-modal='rx'>" + ic('userplus', 20, 1.8) + '<span>Prescribe</span></button>';
    h += "<button class='tp-a tp-btn2' data-modal='status' style='left:1265px;top:227px;width:87px'>" + ic('pencil', 16, 1.8) + '<span>Status</span></button>';
    return h;
  }

  function directory() {
    var v = visible();
    var h = at('tp-card tp-dir', 68, 309, '');
    h += at('tp-h2', 92, 333, 'Active plans') + at('tp-s12', 92, 362, 'Select a patient to open the plan.');
    h += at('tp-cnt', 400, 347.5, String(v.length), 'width:100px');
    h += "<div class='tp-a tp-search'>" + ic('search', 18, 1.8) + "<input id='tpq' placeholder='Search patient name or ID' aria-label='Search patient' value='" + esc(st.q) + "'></div>";
    h += "<button class='tp-a tp-flt" + (st.menu ? ' open' : '') + "' id='tpd'><span class='v'>" + esc(st.dept) + '</span>' + ic('down', 16, 2) + '</button>';
    h += "<div class='tp-a tp-th'><span style='left:24px'>PATIENT / DIAGNOSIS</span><span style='left:402px'>PLAN</span></div>";
    v.forEach(function (p, i) {
      var on = p.id === st.sel;
      h += "<button class='tp-a tp-r" + (on ? ' on' : '') + "' data-plan='" + p.id + "' style='top:" + (547 + 76 * i) + "px'>";
      h += "<span class='av'>" + p.ini + "</span><span class='nm'>" + esc(p.name) + "</span><span class='rl'>" + esc(p.sub) + "</span><span class='id'>" + p.id + '</span>';
      h += on ? "<span class='chv'>" + ic('right', 18, 2) + '</span>' : "<span class='dot" + (p.pstat ? ' off' : '') + "'></span>";
      h += '</button>';
    });
    if (!v.length) h += at('tp-none', 68, 547, 'No plans match');
    h += "<div class='tp-a tp-ft'>" + at('tp-s12', 24, 18, 'Showing ' + (v.length ? '1\u2013' + v.length : '0') + ' of ' + T.plans.length + ' plans', 'font-size:11px;line-height:13.31px');
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
    var p = byId(st.sel), f = p.f, ps = pill(p);
    var h = at('tp-card tp-prof', 548, 309, '');
    h += at('tp-h2', 572, 340.5, 'Treatment plan');
    [['Order tests', 714.8, 115, 'order'], ['Schedule procedure', 836.6, 167, 'proc'], ['Nursing care', 1010.4, 123, 'nurse'], ['Assign bed', 1140.2, 114, 'bed'], ['Status', 1261, 87, 'status']].forEach(function (b) {
      h += "<button class='tp-a tp-btn2' data-modal='" + b[3] + "' style='left:" + b[1] + 'px;top:333px;width:' + b[2] + "px'>" + ic('pencil', 16, 1.8) + '<span>' + b[0] + '</span></button>';
    });
    h += at('tp-bav', 572, 395.5, p.ini);
    h += "<div class='tp-a' style='left:652px;top:391px;height:32px;display:flex;gap:12px;align-items:flex-start'><span class='tp-name'>" + esc(p.name) + "</span><span class='tp-badge " + ps[1] + "' style='margin-top:4.5px;padding:0 9px'>" + ps[0] + '</span></div>';
    h += at('tp-role', 652, 429, esc(who(p))) + at('tp-eid', 652, 451, p.id);
    h += at('tp-hr', 548, 488, '', 'width:824px');
    h += at('tp-sico', 572, 514, ic('user', 17, 1.8)) + at('tp-sh', 598, 513, 'Diagnosis &amp; care plan');
    h += rows([['Primary diagnosis', f.pdx], ['Plan started', f.started], ['Treatment goal', f.goal], ['Expected duration', f.duration], ['Medication', f.meds], ['Procedures', f.procs], ['Monitoring', f.monitoring], ['Next review', f.review]], 550);
    h += at('tp-hr', 572, 774, '', 'width:776px');
    h += at('tp-sico', 572, 798, ic('brief', 17, 1.8)) + at('tp-sh', 598, 797, 'Allergies &amp; vital signs');
    h += rows([['Allergies', f.allergies], ['Allergy severity', f.severity], ['Blood pressure', f.bp], ['Heart rate', f.hr], ['Temperature', f.temp], ['SpO\u2082 \u00b7 Weight', f.spo2]], 834);
    h += at('tp-hr', 572, 1003, '', 'width:776px');
    h += at('tp-sico', 572, 1027, ic('phone', 17, 1.8)) + at('tp-sh', 598, 1026, 'Plan details');
    h += rows([['Attending doctor', f.attending], ['Department', f.department], ['Care setting', f.care], ['Next step', f.next]], 1063);
    h += "<div class='tp-a tp-foot'>" + at('tp-l', 24, 16, ic('shield', 15, 1.8, 'color:#6f8890'), '') + at('tp-l', 46, 17, 'Confidential patient record') + at('tp-l', 480, 17, 'Updated Aug 31, 2026 \u00b7 ' + esc(f.attending), 'width:320px;text-align:right') + '</div>';
    return h;
  }

  function menu() {
    if (!st.menu) return '';
    var opts = [ALL].concat(T.depts);
    var h = "<div class='tp-ml' data-close='1'></div><div class='tp-menu' style='height:" + (16 + 36 * opts.length) + "px'>";
    opts.forEach(function (o) { h += "<button class='tp-o" + (o === st.dept ? ' on' : '') + "' data-opt='" + esc(o) + "'>" + esc(o) + '</button>'; });
    return h + '</div>';
  }

  // ---- modals: every field is the Figma text for PT-99213; for the other plans the fields are blank or derived from the plan ----
  function stockBox(n) {
    var over = n > st.stock;
    return { bt: over ? '\u2715 Not enough stock' : '\u2713 Stock available', bx: over ? 'Only ' + st.stock + ' tablets are on hand.' : st.stock + ' tablets on hand. ' + (n > 0 ? 'After dispensing, ' + (st.stock - n) + ' tablets remain in the Pharmacy stock.' : 'Enter a quantity to see the remaining stock.') };
  }
  function spec(kind, p) {
    var G = p.id === 'PT-99213', f = p.f;
    var al = String(f.allergies || '').split(' \u00b7 ')[0], bp = String(f.bp || '').replace(/\s*mmHg/, '');
    var sub1 = p.name + ' \u00b7 ' + p.id + ' \u00b7 Allergy: ' + al + ' \u00b7 BP ' + bp;
    var dx = p.sub.split(' \u00b7 ')[0];
    if (kind === 'pharmacy') {
      var med = G ? 'Atorvastatin 40 mg tablet' : String(f.meds || '').split(/,\s*/)[0].replace(NA, ''), sb = stockBox(G ? 30 : 0);
      return { title: 'Dispense medication', ro: [1], ok: 'Dispense', req: [0, 2],
        sub: G ? 'Isabel Geliz \u00b7 Cardiology \u00b7 Ward 3, Bed 12' : p.name + ' \u00b7 ' + f.department + ' \u00b7 ' + String(f.care).replace(' \u00b7 ', ' '),
        l: ['Medication', 'Stock check', 'Quantity to dispense', 'Dispensed by', 'Prescription', 'Pharmacist notes'],
        v: [med, 'In stock \u00b7 ' + st.stock + ' tablets', G ? '30 tablets (30 days)' : '', 'Pharmacist on duty',
          G ? 'Atorvastatin 40 mg once daily at night \u00b7 Dr. Laurice Laureta' : (med ? med + ' \u00b7 ' + f.attending : ''),
          G ? 'Counsel the patient: take at night, report muscle pain. Stock is updated after dispensing.' : ''],
        bt: sb.bt, bx: sb.bx };
    }
    if (kind === 'summary') return { title: 'Discharge summary', ok: 'Discharge', req: [0, 2],
      sub: G ? 'Isabel Geliz V. Ramos \u00b7 Cardiology \u00b7 Ward 3, Bed 12' : p.name + ' \u00b7 ' + f.department + ' \u00b7 ' + String(f.care).replace(' \u00b7 ', ' '),
      l: ['Final diagnosis', 'Condition at discharge', 'Discharge date', 'Discharged by', 'Medications to continue', 'Follow-up instructions'],
      v: G ? ['Acute coronary syndrome (I24.9)', 'Stable', 'Sep 7, 2026', 'Dr. Laurice Laureta', 'Atorvastatin 40 mg once daily at night', 'Cardiology clinic visit in 2 weeks. Return to the ER for chest pain.'] : [f.pdx || '', 'Stable', '', f.attending || '', f.meds || '', ''],
      bt: 'Ready to discharge', bx: 'Follow-up instructions are given to the patient and saved in the treatment history.' };
    if (kind === 'dispensed') { var d = st.disp; return { title: 'Medication dispensed', sub: d.sub, l: ['Medication', 'Quantity', 'Dispensed by', 'Stock remaining'], v: [d.med, d.qty, d.by, d.left + ' tablets'] }; }
    if (kind === 'rx') return { title: 'Prescribe medication', sub: sub1, ok: 'Send to pharmacy', green: G, req: [0, 1, 3],
      l: ['Medication', 'Dose', 'Route', 'Frequency', 'Duration', 'Instructions for pharmacy and patient'],
      v: G ? ['Atorvastatin 40 mg tablet', '1 tablet (40 mg)', 'Oral', 'Once daily at bedtime', '30 days \u00b7 30 tablets', 'Take after dinner. Repeat liver enzyme test in 6 weeks.'] : ['', '', 'Oral', '', '', ''],
      bt: G ? '\u2713 Safety check passed' : 'Safety check', bx: G ? 'No conflict with allergy (Penicillin) or current medication (Amlodipine, Metformin, Aspirin). Checked before sending.' : 'The medication is checked against the recorded allergy (' + al + ') before sending.' };
    if (kind === 'order') return { title: 'Order lab / imaging test', sub: sub1, ok: 'Place order', req: [0, 4],
      l: ['Test', 'Category', 'Priority', 'Specimen / site', 'Clinical reason', 'Notes for laboratory / radiology'],
      v: G ? ['Troponin I (blood test)', 'Laboratory', 'STAT (urgent)', 'Venous blood', 'Acute coronary syndrome, chest pain', 'Repeat in 6 hours. Report result to Dr. Laurice Laureta.'] : ['', 'Laboratory', 'Routine', '', dx, ''],
      bt: 'Order is recorded on the plan', bx: "The result will appear on this plan, visible to the care team only. The charge is added to the patient's bill." };
    if (kind === 'proc') return { title: 'Schedule procedure', sub: p.name + ' \u00b7 ' + p.id + ' \u00b7 ' + String(f.care).replace(' \u00b7 ', ' '), ok: 'Schedule procedure', req: [0, 1, 3],
      l: ['Procedure', 'Performing doctor', 'Room', 'Date', 'Time and duration', 'Pre-procedure instructions'],
      v: G ? ['Coronary angiography', 'Dr. Laurice Laureta (Cardiology)', 'Cath Lab 1', 'Sep 2, 2026', '9:00 AM \u00b7 about 60 minutes', 'Nothing by mouth 6 hours before. Hold Metformin that morning. Signed consent required.'] : ['', f.attending + ' (' + f.department + ')', '', '', '', ''],
      bt: G ? 'Room and doctor available' : 'Room and doctor check', bx: G ? 'Slot check: Cath Lab 1 and Dr. Laureta are free on Sep 2 at 9:00 AM. No conflict found.' : 'Enter the procedure, doctor, room, date and time to check the slot.' };
    if (kind === 'bed') return { title: 'Assign ward and bed', sub: p.name + ' \u00b7 ' + p.id + ' \u00b7 ' + f.department + ' admission', ok: 'Assign bed', req: [0, 1],
      l: ['Ward', 'Bed', 'Admission date', 'Attending doctor', 'Isolation precautions', 'Admission notes'],
      v: G ? ['Inpatient Ward 3', 'Bed 12 (vacant)', 'Aug 31, 2026', 'Dr. Laurice Laureta, Cardiology', 'None required', 'Admitted for cardiac monitoring. Telemetry requested. Family contact is on file at the front desk.'] : ['', '', 'Aug 31, 2026', f.attending + ', ' + f.department, 'None required', ''],
      bt: G ? 'Bed available' : 'Bed check', bx: G ? 'Bed check: Bed 12 in Ward 3 is vacant and cleaned. No isolation conflict with the neighbouring beds.' : 'Enter a ward and bed to check availability.' };
    return { title: 'Update treatment status', sub: p.name + ' \u00b7 ' + p.id + ' \u00b7 ' + f.department, ok: 'Update status', req: [2],
      l: ['Treatment', 'Current status', 'New status', 'Updated by', 'Reason for change', 'Status notes'],
      v: G ? ['Cardiac monitoring', 'Ordered', 'In progress', 'Dr. Laurice Laureta', 'Telemetry connected on Ward 3', 'Telemetry connected at 6:30 PM. Nursing notified to check vitals every 4 hours.'] : ['', 'Ordered', 'In progress', f.attending, '', ''],
      bt: 'Change allowed', bx: 'Ordered to In progress is allowed. Cancelled needs a reason and stays in the plan history.' };
  }
  // [label top, input top, left, width]
  var POS = [[120, 142, 32, 300], [120, 142, 348, 300], [202, 224, 32, 300], [202, 224, 348, 300], [284, 306, 32, 616], [462, 484, 32, 616]];

  function modal() {
    if (!st.modal || st.modal === 'nurse') return '';
    var kind = st.modal, s = spec(kind, byId(st.sel)), dn = kind === 'dispensed', pos = dn ? POS.slice(0, 4) : POS;
    var h = "<div class='tp-scrim' data-close='1'></div><div class='tp-modal' role='dialog' aria-modal='true' aria-label='" + esc(s.title) + "'" + (dn ? " style='height:368px'" : '') + '>';
    h += "<button class='tp-m-x' data-close='1' aria-label='Close'>\u00d7</button><div class='tp-m-t'>" + esc(s.title) + "</div><div class='tp-m-s'>" + esc(s.sub) + "</div><div class='tp-m-d'></div>";
    pos.forEach(function (q, i) {
      var ro = dn || (s.ro || []).indexOf(i) > -1 ? ' readonly' : '';
      h += "<div class='tp-m-l' style='left:" + q[2] + 'px;top:' + q[0] + "px'>" + esc(s.l[i]) + '</div>';
      if (i === 5) h += "<textarea class='tp-m-i' data-i='5' style='left:32px;top:" + q[1] + "px;width:616px'>" + esc(s.v[i]) + '</textarea>';
      else h += "<input class='tp-m-i' data-i='" + i + "' value='" + esc(s.v[i]) + "'" + ro + " style='left:" + q[2] + 'px;top:' + q[1] + 'px;width:' + q[3] + "px'>";
    });
    if (dn) return h + "<button class='tp-m-c' data-close='1' style='top:300px'>Back to plan</button><button class='tp-m-ok' data-close='1' style='top:300px'>Close</button></div>";
    h += "<div class='tp-m-b" + (s.green ? ' green' : '') + "'><b>" + esc(s.bt) + '</b><span>' + esc(s.bx) + '</span></div>';
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
  if (st.modal) { var f0 = document.querySelector('#tpmodal .tp-m-i:not([readonly])'); if (f0) f0.focus({ preventScroll: true }); }

  function vals() { var o = []; [].forEach.call(document.querySelectorAll('#tpmodal [data-i]'), function (n) { o[+n.dataset.i] = n.value.trim(); }); return o; }
  function qtyOf(v) { return parseInt(String(v || '').replace(/[^0-9]/g, ' ').trim().split(' ')[0], 10) || 0; }

  function confirm() { confirm0(); saveState(); }
  function confirm0() {
    var kind = st.modal, s = spec(kind, byId(st.sel)), v = vals(), p = byId(st.sel), f = p.f, bad = false;
    var req = s.req.slice(); if (kind === 'status' && /cancel/i.test(v[2] || '')) req.push(4);
    [].forEach.call(document.querySelectorAll('#tpmodal [data-i]'), function (n) { var miss = req.indexOf(+n.dataset.i) > -1 && !n.value.trim(); n.classList.toggle('bad', miss); if (miss) bad = true; });
    if (bad) { tip(kind === 'status' ? 'Enter the new status (a reason is required to cancel)' : 'Fill in the highlighted fields'); return; }
    var msg;
    if (kind === 'pharmacy') {
      var n = qtyOf(v[2]);
      if (n < 1 || n > st.stock) { document.querySelector('#tpmodal [data-i="2"]').classList.add('bad'); tip(n > st.stock ? 'Only ' + st.stock + ' tablets in stock' : 'Enter a quantity to dispense'); return; }
      st.stock -= n; st.disp = { sub: s.sub, med: v[0], qty: v[2], by: v[3] || 'Pharmacist on duty', left: st.stock };
      f.next = 'Medication dispensed'; st.modal = 'dispensed'; render(); return;
    }
    if (kind === 'summary') {
      // ESTIMATED behaviour (Figma has no discharged state): the plan is marked completed and the next step reads Discharged
      p.pstat = 'done'; f.next = 'Discharged on ' + v[2]; st.modal = ''; render(); tip('Discharge summary saved for ' + p.name); return;
    }
    if (kind === 'rx') {
      var nm = v[0].replace(/\s+tablets?$/i, '');
      if (f.meds.toLowerCase().indexOf(nm.split(' ')[0].toLowerCase()) < 0) f.meds += ', ' + nm;
      f.next = 'Dispense at pharmacy'; msg = nm + ' sent to pharmacy';
    } else if (kind === 'order') { f.next = 'Awaiting result: ' + v[0].replace(/\s*\(.*\)$/, ''); msg = v[0] + ' ordered (' + (v[2] || 'Routine') + ')'; }
    else if (kind === 'proc') { f.procs = v[0] + ' \u00b7 ' + v[3]; msg = v[0] + ' scheduled for ' + v[3]; }
    else if (kind === 'bed') { f.care = 'Inpatient \u00b7 ' + v[0].replace(/^Inpatient\s+/i, '') + ', ' + v[1].replace(/\s*\(.*\)$/, ''); p.type = 'Inpatient'; msg = 'Bed assigned: ' + v[0] + ', ' + v[1].replace(/\s*\(.*\)$/, ''); }
    else { p.pstat = /complet/i.test(v[2]) ? 'done' : /cancel/i.test(v[2]) ? 'stop' : ''; msg = 'Status updated to ' + v[2]; }
    st.modal = ''; render(); tip(msg);
  }

  stage.addEventListener('click', function (ev) {
    var X = ev.target;
    if (X.closest('[data-close]')) { st.menu = false; st.modal = ''; render(); return; }
    var o = X.closest('.tp-o');
    if (o) { st.dept = o.dataset.opt; st.menu = false; render(); return; }
    if (X.closest('#tpd')) { st.menu = !st.menu; render(); return; }
    var r = X.closest('[data-plan]');
    if (r) { st.sel = r.dataset.plan; render(); return; }
    var m = X.closest('[data-modal]');
    if (m) { if (m.dataset.modal === 'nurse') { location.href = 'nursing.html'; return; } st.modal = m.dataset.modal; render(); var f = document.querySelector('#tpmodal .tp-m-i'); if (f) f.focus({ preventScroll: true }); return; }
    if (X.closest('[data-ok]')) confirm();
  });
  stage.addEventListener('input', function (ev) {
    if (ev.target.id === 'tpq') { st.q = ev.target.value.trim().toLowerCase(); render(true); return; }
    if (st.modal === 'pharmacy' && ev.target.getAttribute('data-i') === '2') {
      var sb = stockBox(qtyOf(ev.target.value)), b = document.querySelector('#tpmodal .tp-m-b');
      b.querySelector('b').textContent = sb.bt; b.querySelector('span').textContent = sb.bx; ev.target.classList.remove('bad');
    }
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && (st.menu || st.modal)) { st.menu = false; st.modal = ''; render(); } });
})();
