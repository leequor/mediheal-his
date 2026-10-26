// Attendance: ONE template (Figma 2002:369) + state frames as JS states: Department filter (2008:1077), Status filter (2010:1439), pickers (2021:700/2021:833/2021:896),
// overlays Export (2014:2582), Approve timesheets (2014:2571), Sync to payroll (2014:2574), Leave updated (2014:2578), Recorded (2011:2563), Details (2014:2585),
// New leave request (2030:9301), Leave requests list (2030:9330).
// Additions (not in Figma): live search, row selection, Clock in/out really update the register (in memory), Approve/Decline change the first pending request, New request adds one,
// Export downloads a CSV, details of employees other than EMP-001 are derived, validation of the Record attendance form.
(function () {
  var A = HIS.attendance, stage = document.getElementById('stage');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ALL_D = 'All departments', ALL_S = 'All attendance statuses';
  var st = { q: '', dept: ALL_D, status: ALL_S, menu: '', pick: '', sel: {}, modal: '', emp: null, ok: null, f: { emp: '', tin: '', tout: '' }, bad: {} };
  HIS.atState = st;
  var IC = {
    users: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'/>",
    usercheck: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='m16 11 2 2 4-4'/>",
    clock: "<circle cx='12' cy='12' r='9'/><path d='M12 7v5l3 2'/>",
    calendarx: "<rect x='3' y='4' width='18' height='18' rx='2'/><path d='M16 2v4M8 2v4M3 10h18M10 14l4 4M14 14l-4 4'/>",
    download: "<path d='M12 3v12M7 10l5 5 5-5M5 21h14'/>",
    file: "<path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6'/>",
    send: "<path d='M22 2 11 13M22 2l-7 20-4-9-9-4z'/>",
    calendar: "<rect x='3' y='4' width='18' height='18' rx='2'/><path d='M16 2v4M8 2v4M3 10h18'/>",
    chevron: "<path d='M6 9l6 6 6-6'/>",
    search: "<circle cx='11' cy='11' r='7'/><path d='m21 21-4.3-4.3'/>",
    shield: "<path d='M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z'/><path d='m9 12 2 2 4-4'/>",
    check: "<path d='m5 12 5 5 9-10'/>",
    x: "<path d='M18 6 6 18M6 6l12 12'/>"
  };
  var ic = function (n, w, sw) { return "<svg width='" + w + "' height='" + w + "' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='" + (sw || 2) + "' stroke-linecap='round' stroke-linejoin='round'>" + IC[n] + '</svg>'; };
  var at = function (cls, l, t, inner, extra) { return "<div class='at-a " + cls + "' style='left:" + l + 'px;top:' + t + 'px;' + (extra || '') + "'>" + inner + '</div>'; };
  var wrap = document.createElement('div'); wrap.id = 'atc'; stage.appendChild(wrap);
  // Session 23: the register, leave list and payroll sync persist in this browser (own key; delete to reset).
  var KEY = 'mh_attendance_state';
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        emps: A.emps.map(function (e) { return { id: e.id, tin: e.tin, tout: e.tout, status: e.status, reviewed: !!e.reviewed }; }),
        leaves: A.leaves, synced: A.synced,
        syncedCount: A.syncedCount == null ? null : A.syncedCount,
        dirty: !!A.dirty
      }));
    } catch (e) { /* storage blocked: memory only */ }
  }
  function loadSaved() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!s) return;
      if (Array.isArray(s.leaves)) A.leaves = s.leaves;
      if (s.synced) A.synced = s.synced;
      if (s.syncedCount != null) A.syncedCount = s.syncedCount;
      if (s.dirty != null) A.dirty = s.dirty;
      (s.emps || []).forEach(function (r) {
        var e = A.emps.filter(function (x) { return x.id === r.id; })[0];
        if (e) { e.tin = r.tin || ''; e.tout = r.tout || ''; e.status = r.status || e.status; e.reviewed = !!r.reviewed; }
      });
    } catch (e) { /* bad data: ignore */ }
  }
  function nowTime() {
    var d = new Date(), h = d.getHours(), ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + ('0' + d.getMinutes()).slice(-2) + ' ' + ap;
  }

  function tmin(s) { var m = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(s || ''); if (!m) return null; var h = +m[1] % 12; if (m[3] === 'PM') h += 12; return h * 60 + (+m[2]); }
  function startMin(shift) { var m = /^(\d{1,2}) (AM|PM)/.exec(shift); var h = +m[1] % 12; if (m[2] === 'PM') h += 12; return h * 60; }
  function dur(e) { var a = tmin(e.tin), b = tmin(e.tout); return (a == null || b == null || b < a) ? null : b - a; }
  function fdur(n) { return Math.floor(n / 60) + 'h ' + ('0' + (n % 60)).slice(-2) + 'm'; }
  function cnt(s) { return A.emps.filter(function (e) { return e.status === s; }).length; }
  function pcls(s) { return s === 'On leave' ? 'On' : s; }
  function find(id) { return A.emps.filter(function (e) { return e.id === id; })[0]; }
  function pill(e) { return "<span class='at-p " + pcls(e.status) + "'>" + (e.status === 'Present' ? '<i></i>' : '') + e.status + '</span>'; }
  function visible() {
    return A.emps.filter(function (e) {
      return (st.dept === ALL_D || e.dept === st.dept) && (st.status === ALL_S || e.status === st.status) &&
        (!st.q || (e.name + ' ' + e.id + ' ' + e.role + ' ' + e.dept).toLowerCase().indexOf(st.q) > -1);
    });
  }
  var pending = function () { return A.leaves.filter(function (l) { return l.status === 'Pending'; }); };

  function top() {
    var N = A.emps.length, inn = A.emps.filter(function (e) { return e.tin; }).length, lv = cnt('On leave'), ab = cnt('Absent');
    var h = "<h1 class='at-a at-t' style='left:68px;top:115px'>Attendance</h1>" + at('at-d', 68, 166, 'Track daily clock-in, clock-out and leave for hospital personnel.');
    h += at('at-card', 68, 207, '', 'width:1304px;height:100px');
    h += at('at-lbl', 88, 227, 'ATTENDANCE DATE');
    h += at('at-sel', 88, 247, ic('calendar', 18, 1.8).replace('<svg', "<svg style='position:absolute;left:12px;top:11px;color:#1b4e6b'") + "<span class='v'>" + A.date + '</span>' + ic('chevron', 16, 2).replace('<svg', "<svg style='position:absolute;left:135px;top:12px;color:#1b4e6b'"));
    h += at('at-div', 271, 233, '');
    h += at('at-lbl', 292, 228.5, 'PAYROLL PERIOD') + at('at-pd', 292, 248.5, A.period) + at('at-meth', 292, 272.5, 'Feeds Payroll \u00b7 Semi-monthly');
    h += "<button class='at-btn' data-act='export' style='left:817px;width:175px'>" + ic('download', 18, 1.8) + '<span>Export attendance</span></button>';
    h += "<button class='at-btn' data-act='approve' style='left:1004px;width:185px'>" + ic('file', 18, 1.8) + '<span>Approve timesheets</span></button>';
    h += "<button class='at-btn pri' data-act='sync' style='left:1201px;width:151px'>" + ic('send', 18, 1.8) + '<span>Sync to payroll</span></button>';
    var M = [['users', 'Total personnel', String(N), inn + ' clocked in \u00b7 ' + (N - inn) + ' not in'], ['usercheck', 'Present', String(cnt('Present')), 'On time, within 15-minute grace'],
      ['clock', 'Late', String(cnt('Late')), 'Clocked in after grace period'], ['calendarx', 'On leave / absent', String(lv + ab), lv + ' approved leave \u00b7 ' + ab + ' absent']];
    M.forEach(function (m, i) { h += "<div class='at-a at-card at-m' style='left:" + (68 + 331 * i) + "px;top:331px'><span class='ic'>" + ic(m[0], 24, 1.8) + "</span><span class='l'>" + m[1] + "</span><span class='n'>" + m[2] + "</span><span class='s'>" + m[3] + '</span></div>'; });
    return h;
  }

  var cb = function (on, l, t, d) { return "<button class='at-cb" + (on ? ' on' : '') + "' data-cb='" + d + "' style='left:" + l + 'px;top:' + t + "px' aria-label='Select'>" + (on ? ic('check', 12, 3).replace('<svg', "<svg style='color:#fff'") : '') + '</button>'; };
  var COLS = [['SHIFT', 560, 112, 'sh'], ['TIME IN', 680, 110, 'ti'], ['TIME OUT', 798, 112, 'to'], ['HOURS', 918, 126, 'hr']];

  function register() {
    var v = visible(), E = A.emps;
    var allSel = v.length > 0 && v.every(function (e) { return st.sel[e.id]; });
    var tm = 0, nin = 0, nout = 0;
    v.forEach(function (e) { var d = dur(e); if (d != null) tm += d; if (e.tin) nin++; if (e.tout) nout++; });
    var h = "<section class='at-a at-card at-reg'>";
    h += at('at-st', 24, 24, 'Daily attendance') + at('at-ex', 24, 53, 'Clock-in is on time within 15 minutes of shift start. Hours run from time in to time out.');
    h += at('at-ex', 1160, 38, ic('clock', 16, 1.8).replace('<svg', "<svg style='color:#6f8890'")) + at('at-ex', 1184, 38.5, cnt('Present') + ' present \u00b7 ' + cnt('Late') + ' late');
    h += "<div class='at-a at-search' style='left:24px;top:86px'>" + ic('search', 18, 1.8) + "<input id='atq' placeholder='Search employee name or ID' aria-label='Search employee' value='" + esc(st.q) + "'></div>";
    h += "<button class='at-flt" + (st.menu === 'dept' ? ' open' : '') + "' id='atd' style='left:444px;width:148px'><span class='v'>" + esc(st.dept) + '</span>' + ic('chevron', 16, 2) + '</button>';
    h += "<button class='at-flt" + (st.menu === 'status' ? ' open' : '') + "' id='ats' style='left:604px;width:192px'><span class='v'>" + esc(st.status) + '</span>' + ic('chevron', 16, 2) + '</button>';
    h += "<div class='at-a at-ex' style='right:24px;top:98.5px'>" + v.length + ' employee' + (v.length === 1 ? '' : 's') + '</div>';
    h += "<div class='at-a at-th'>" + cb(allSel, 24, 15, 'all') + at('at-h', 52, 16.5, 'EMPLOYEE') + at('at-h', 410, 16.5, 'DEPARTMENT');
    COLS.forEach(function (c) { h += at('at-h', c[1], 16.5, c[0], 'width:' + c[2] + 'px;text-align:right'); });
    h += at('at-h', 1052, 16.5, 'STATUS') + at('at-h', 1186, 16.5, 'ACTION', 'width:94px;text-align:right') + '</div>';
    v.forEach(function (e, i) {
      var d = dur(e);
      h += "<div class='at-a at-r' style='top:" + (196 + 64 * i) + "px'>" + cb(!!st.sel[e.id], 24, 24, e.id);
      h += "<span class='nm'>" + esc(e.name) + "</span><span class='mt'>" + e.id + ' \u00b7 ' + esc(e.role) + "</span><span class='dp'>" + esc(e.dept) + '</span>';
      h += "<span class='c sh' style='left:560px;width:112px'>" + e.shift + "</span><span class='c ti' style='left:680px;width:110px'>" + (e.tin || '\u2014') + "</span><span class='c to' style='left:798px;width:112px'>" + (e.tout || '\u2014') + '</span>';
      h += "<span class='c hr' style='left:918px;width:126px'>" + (d != null ? fdur(d) : '\u2014') + '</span>' + pill(e);
      h += "<button class='at-ps' data-det='" + e.id + "'>" + ic('file', 15, 1.8) + '<span>Details</span></button></div>';
    });
    if (!v.length) h += "<div class='at-a at-none'>No employees match</div>";
    h += "<div class='at-a at-tot'><span class='tl'>Day total \u00b7 " + v.length + ' employee' + (v.length === 1 ? '' : 's') + '</span>';
    h += "<span class='c' style='left:560px;width:112px'>\u2014</span><span class='c' style='left:680px;width:110px'>" + nin + " in</span><span class='c' style='left:798px;width:112px'>" + nout + " out</span><span class='c' style='left:918px;width:126px'>" + fdur(tm) + '</span></div>';
    h += "<div class='at-a at-ft'>" + at('at-ex', 24, 25.5, 'Showing ' + (v.length ? '1\u2013' + v.length : '0') + ' of ' + E.length + ' employees');
    h += at('at-meth', 525, 25, ic('shield', 16, 1.8).replace('<svg', "<svg style='color:#6f8890'")) + at('at-meth', 548, 26.5, 'Absences without approved leave are deducted in Payroll.');
    h += "<div class='at-pg'>Page 1 of 1</div></div></section>";
    return h;
  }

  function field(k, l, t, w, label, ph, show) {
    var cls = 'at-fd' + (st.pick === k ? ' open' : '') + (st.bad[k] ? ' bad' : '');
    var ico = k === 'emp' ? ic('chevron', 16, 2).replace('<svg', "<svg style='left:346px'") : ic('clock', 16, 1.8).replace('<svg', "<svg style='left:151px'");
    return at('at-fl', l, t - 18, label) + "<button class='" + cls + "' data-pick='" + k + "' style='position:absolute;left:" + l + 'px;top:' + t + 'px;width:' + w + "px'><span class='v" + (show ? ' has' : '') + "'>" + esc(show || ph) + '</span>' + ico + '</button>';
  }

  function cards() {
    var f = st.f, e = f.emp ? find(f.emp) : null, L = A.leaves, pn = pending().length;
    var h = "<div class='at-a at-card at-ac' style='left:68px;width:422px'><div class='at-st'>Record attendance</div><div class='at-ds at-ex'>Log a clock-in, clock-out or leave when a terminal is missed.</div>";
    h += field('emp', 24, 98, 374, 'EMPLOYEE', 'Select employee', e ? e.name + ' \u00b7 ' + e.id : '').replace("top:80px", 'top:80px');
    h += field('tin', 24, 164, 179, 'TIME IN', '-- : -- AM', f.tin) + field('tout', 219, 164, 179, 'TIME OUT', '-- : -- PM', f.tout);
    h += "<button class='at-cbtn pri' data-act='clockin' style='left:24px;top:214px;width:150px'>Clock in</button><button class='at-cbtn' data-act='clockout' style='left:186px;top:214px;width:150px'>Clock out</button></div>";
    h += "<div class='at-a at-card at-ac' style='left:510px;width:422px'><div class='at-st'>Leave requests</div><div class='at-ds at-ex'>Settle these before syncing to payroll.</div>";
    h += "<button class='at-nr' data-act='newreq' style='left:278px;top:18px;width:120px'>+ New request</button><button class='at-va' data-act='viewall' style='left:330px;top:48px;width:68px'>View all \u2192</button>";
    [[86, 88, 0], [152, 154, 1]].forEach(function (p) {
      var l = L[p[2]]; if (!l) return;
      h += "<div class='ln' style='top:" + p[0] + "px;left:24px'>" + esc(l.name) + '</div>';
      h += "<div class='ld' style='top:" + (p[0] + 19) + "px;left:24px'>" + esc(l.type) + ' \u00b7 ' + l.range + ' \u00b7 ' + l.days + ' day' + (l.days === 1 ? '' : 's') + '</div>';
      h += "<div class='at-lp " + l.status + "' style='left:314px;top:" + p[1] + "px'>" + l.status + '</div>';
    });
    h += "<div class='at-hr' style='left:24px;top:134px;width:374px'></div>";
    h += "<button class='at-cbtn pri' data-act='lapprove' style='left:24px;top:214px;width:150px'>Approve</button><button class='at-cbtn' data-act='ldecline' style='left:186px;top:214px;width:150px'>Decline</button></div>";
    var N = A.emps.length, ready = A.emps.filter(function (x) { return x.status !== 'Absent'; }).length;
    var rev = A.emps.filter(function (x) { return x.status === 'Absent' && !x.reviewed; });
    var unpaid = A.emps.filter(function (x) { return x.status === 'Absent' && x.reviewed; });
    var syncedClean = A.syncedCount === ready && !A.dirty;
    h += "<div class='at-a at-card at-ac' style='left:952px;width:420px'><div class='at-st'>Payroll sync</div><div class='at-ds at-ex'>Feeds the " + A.period + ' pay period.</div>';
    var cap = syncedClean ? 'records synced for this period' : (A.syncedCount != null && A.dirty ? 'records ready to sync \u00b7 changes since last sync' : 'records ready to sync today');
    h += "<div class='at-sv' style='left:24px;top:80px'>" + ready + ' of ' + N + "</div><div class='at-ex' style='left:24px;top:116px'>" + cap + "</div>";
    h += "<div class='at-trk' style='left:24px;top:144px;width:372px'></div><div class='at-fill' style='left:24px;top:144px;width:" + Math.round(372 * ready / N) + "px'></div>";
    if (rev.length) {
      h += "<div class='at-ex at-el' style='left:24px;top:166px;width:286px;font:600 12px/14.52px Inter,sans-serif;color:#a6460a'>" + rev.length + " needs review</div>";
      h += "<div class='at-ex at-el' style='left:24px;top:186px;width:372px;font:400 12px/14.52px Inter,sans-serif;color:#1c2b30'>" + esc(rev[0].name) + ' \u00b7 absent, no approved leave</div>';
      h += "<button class='at-rv' data-act='review' style='left:318px;top:160px;width:78px'>Review</button>";
    } else if (unpaid.length) {
      h += "<div class='at-ex at-el' style='left:24px;top:166px;width:372px;font:600 12px/14.52px Inter,sans-serif;color:#1c2b30'>" + unpaid.length + ' unpaid absence' + (unpaid.length === 1 ? '' : 's') + " deducted</div>";
      h += "<div class='at-ex at-el' style='left:24px;top:186px;width:372px;font:400 12px/14.52px Inter,sans-serif;color:#6f8890'>" + esc(unpaid[0].name) + ' \u00b7 no paid leave on file</div>';
    }
    h += syncedClean
      ? "<button class='at-cbtn' disabled style='left:24px;top:214px;width:150px'>Synced</button>"
      : "<button class='at-cbtn pri' data-act='sync' style='left:24px;top:214px;width:150px'>Sync " + ready + ' records</button>';
    h += "<div class='at-ex at-el' style='left:190px;top:223px;width:206px'>Last synced " + A.synced + '</div></div>';
    return h.replace(/class='ex'/g, "class='at-ex'").replace(/class='ln'/g, "class='at-ln'").replace(/class='ld'/g, "class='at-ld'");
  }

  function menu() {
    var h = '';
    if (st.menu) {
      var isD = st.menu === 'dept', opts = isD ? [ALL_D].concat(A.depts) : [ALL_S].concat(A.statuses), cur = isD ? st.dept : st.status;
      h += "<div class='at-ml' data-close='1'></div><div class='at-menu' style='left:" + (isD ? 512 : 672) + 'px;height:' + (16 + 36 * opts.length) + "px'>";
      opts.forEach(function (o, i) { h += "<button class='at-o" + (o === cur ? ' on' : '') + "' data-opt='" + esc(o) + "' style='top:" + (8 + 36 * i) + "px'>" + esc(o) + (o === cur ? "<span class='ck'>\u2713</span>" : '') + '</button>'; });
      h += '</div>';
    }
    if (st.pick) {
      var k = st.pick, opts2 = k === 'emp' ? A.emps : (k === 'tin' ? A.timesIn : A.timesOut), pw = k === 'emp' ? 374 : 179, px = k === 'emp' ? 92 : (k === 'tin' ? 92 : 287);
      h += "<div class='at-ml' data-close='1'></div><div class='at-pk' style='left:" + px + 'px;top:' + (1337 + 140 - (k === 'emp' ? 0 : -66)) + 'px;width:' + pw + 'px;height:' + (16 + 34 * opts2.length) + "px'>";
      opts2.forEach(function (o, i) {
        var val = k === 'emp' ? o.id : o, lab = k === 'emp' ? o.name : o, on = st.f[k] === val;
        h += "<button class='at-po" + (on ? ' on' : '') + "' data-k='" + k + "' data-v='" + esc(val) + "' style='top:" + (8 + 34 * i) + "px'>" + esc(lab) + (k === 'emp' ? "<span class='id'>" + o.id + '</span>' : '') + (on ? "<span class='ck' style='right:" + (k === 'emp' ? 76 : 8) + "px'>\u2713</span>" : '') + '</button>';
      });
      h += '</div>';
    }
    return h;
  }

  function modal() {
    var m = st.modal; if (!m) return '';
    var scr = "<div class='at-scrim' data-close='1'></div>";
    var box = function (w, h, inner) { return "<div class='at-modal' role='dialog' aria-modal='true' style='width:" + w + 'px;height:' + h + 'px;margin-left:-' + (w / 2) + 'px;top:max(16px,calc(50% - ' + (h / 2) + "px))'>" + inner + '</div>'; };
    if (m === 'ok') return scr + box(520, st.ok.m.length > 70 ? 290 : 290, "<div class='at-ok-i'>" + ic('check', 28, 2.6) + "</div><div class='at-ok-t'>" + esc(st.ok.t) + "</div><div class='at-ok-m'>" + esc(st.ok.m) + "</div><button class='at-ok-b' data-close='1'>Back to attendance</button>");
    if (m === 'det') {
      var e = st.emp, d = dur(e), ini = e.name.replace('Dr. ', '').split(' ').map(function (s) { return s[0]; }).join('').slice(0, 2);
      var grace = e.status === 'Present' ? 'Within 15 min' : (e.status === 'Late' ? 'After 15 min grace' : '\u2014');
      var inner = "<div class='at-dr-t'>Attendance details</div><button class='at-dr-x' data-close='1' aria-label='Close'>" + ic('x', 14, 2) + "</button><div class='at-dr-hr'></div>";
      inner += "<div class='at-dr-av'>" + ini + "</div><div class='at-dr-n'>" + esc(e.name) + "</div><div class='at-dr-id'>" + e.id + "</div><span class='at-p at-dr-p " + pcls(e.status) + "'>" + (e.status === 'Present' ? '<i></i>' : '') + e.status + '</span>';
      inner += "<div class='at-dr-c' style='top:194px;height:112px'><div class='lb' style='top:14px'>Role\nDepartment\nShift</div><div class='vl' style='top:14px'>" + esc(e.role) + '\n' + esc(e.dept) + '\n' + e.shift + '</div></div>';
      inner += "<div class='at-dr-c' style='top:322px;height:168px'><div class='ct'>" + A.date + "</div><div class='lb' style='top:44px'>Time in\nTime out\nTotal hours\nGrace period</div><div class='vl' style='top:44px'>" + (e.tin || '\u2014') + '\n' + (e.tout || '\u2014') + '\n' + (d != null ? fdur(d) : '\u2014') + '\n' + grace + '</div></div>';
      inner += "<div class='at-dr-note'><span>Time in within 15 minutes of shift start is on time. Later entries are marked Late and flagged for payroll review.</span></div><button class='at-dr-b' data-close='1'>Back to attendance</button>";
      return scr + box(440, 672, inner);
    }
    var xb = "<button class='at-m-x' data-close='1' aria-label='Close'>\u00d7</button><div class='at-m-d'></div>";
    if (m === 'list') {
      var L = A.leaves, n = L.length;
      var mh = Math.min(600, 148 + 48 * n + 72);
      var bt = mh - 64;
      var inner2 = xb + "<div class='at-m-t'>Leave requests</div><div class='at-m-s'>" + A.period + ' pay period \u00b7 ' + n + ' requests \u00b7 ' + pending().length + ' pending</div>';
      inner2 += "<div class='at-lv-scroll' style='left:32px;top:100px;width:616px;height:" + (mh - 220) + "px'>";
      L.forEach(function (l, i) {
        inner2 += "<div class='at-m-i' style='top:" + (12 + 48 * i) + "px'>" + esc(l.name + ' \u00b7 ' + l.type + ' \u00b7 ' + l.range + ' \u00b7 ' + l.days + ' day' + (l.days === 1 ? '' : 's') + ' \u00b7 ' + l.status) + '</div>';
      });
      inner2 += '</div>';
      inner2 += "<button class='at-m-c' data-close='1' style='top:" + bt + "px'>Close</button><button class='at-m-ok' data-act='newreq' style='top:" + bt + "px'>New request</button>";
      return scr + box(680, mh, inner2);
    }
    // new leave request
    var lbl = function (t, l, tp) { return "<div class='at-m-l' style='left:" + l + 'px;top:' + tp + "px'>" + t + '</div>'; };
    var pos = function (l, t, w) { return 'left:' + l + 'px;top:' + t + 'px;width:' + w + 'px;position:absolute'; };
    if (m === 'review') {
      var rv = st.emp;
      var inner4 = xb + "<div class='at-m-t'>Review absence</div><div class='at-m-s'>" + esc(rv.name + ' \u00b7 ' + rv.id + ' \u00b7 ' + A.date) + '</div>';
      inner4 += lbl('Employee', 32, 120) + lbl('Shift', 348, 120) + lbl('Recorded', 32, 202) + lbl('Leave on file', 348, 202) + lbl('Payroll effect', 32, 284);
      inner4 += "<input class='at-m-i' readonly value='" + esc(rv.name + ' \u00b7 ' + rv.id) + "' style='" + pos(32, 142, 300) + "'>";
      inner4 += "<input class='at-m-i' readonly value='" + esc(rv.shift) + "' style='" + pos(348, 142, 300) + "'>";
      inner4 += "<input class='at-m-i' readonly value='No clock-in or clock-out' style='" + pos(32, 224, 300) + "'>";
      inner4 += "<input class='at-m-i' readonly value='Emergency leave \u00b7 Aug 18 \u00b7 declined' style='" + pos(348, 224, 300) + "'>";
      inner4 += "<input class='at-m-i' readonly value='1 day deducted if the absence stays unapproved' style='" + pos(32, 306, 616) + "'>";
      inner4 += "<button class='at-m-c' data-act='reviewclock' style='left:32px;top:504px;width:120px'>Add clock-in</button>";
      inner4 += "<button class='at-m-c' data-act='reviewunpaid' style='left:164px;top:504px;width:140px'>Mark unpaid</button>";
      inner4 += "<button class='at-m-ok' data-act='reviewleave' style='left:508px;top:504px'>Approve leave</button>";
      return scr + box(680, 568, inner4);
    }
    var opt = A.emps.map(function (x) { return "<option" + (x.id === 'EMP-005' ? ' selected' : '') + ">" + esc(x.name + ' \u00b7 ' + x.id) + '</option>'; }).join('');
    var typ = A.leaveTypes.map(function (x) { return '<option' + (x === 'Vacation leave' ? ' selected' : '') + '>' + x + '</option>'; }).join('');
    var inner3 = xb + "<div class='at-m-t'>New leave request</div><div class='at-m-s'>" + A.date + ' \u00b7 Reviewed before the payroll sync \u00b7 Unapproved absences are deducted</div>';
    inner3 += lbl('Employee', 32, 120) + lbl('Leave type', 348, 120) + lbl('Start date', 32, 202) + lbl('End date', 348, 202) + lbl('Reason', 32, 284) + lbl('Coverage and contact during leave', 32, 366);
    inner3 += "<select class='at-m-i' id='atn1' style='" + pos(32, 142, 300) + "'>" + opt + "</select><select class='at-m-i' id='atn2' style='" + pos(348, 142, 300) + "'>" + typ + '</select>';
    inner3 += "<input class='at-m-i' id='atn3' value='Sep 9, 2026' style='" + pos(32, 224, 300) + "'><input class='at-m-i' id='atn4' value='Sep 10, 2026 \u00b7 2 days' style='" + pos(348, 224, 300) + "'>";
    inner3 += "<input class='at-m-i' id='atn5' value='Family event in the province' style='" + pos(32, 306, 616) + "'><textarea class='at-m-i' id='atn6' style='" + pos(32, 388, 616) + "'>Shift swap agreed with the Nursing team. Contact: +63 9XX XXX XXXX.</textarea>";
    inner3 += "<button class='at-m-c' data-close='1' style='top:504px'>Cancel</button><button class='at-m-ok' data-act='submitnew' style='top:504px'>Submit request</button>";
    return scr + box(680, 568, inner3);
  }

  var tipT;
  function tip(t) { var o = document.querySelector('.at-tip'); if (o) o.remove(); var d = document.createElement('div'); d.className = 'at-tip'; d.textContent = t; document.body.appendChild(d); clearTimeout(tipT); tipT = setTimeout(function () { d.remove(); }, 2600); }

  function csv() {
    var rows = [['Employee', 'ID', 'Role', 'Department', 'Shift', 'Time in', 'Time out', 'Hours', 'Status']];
    A.emps.forEach(function (e) { var d = dur(e); rows.push([e.name, e.id, e.role, e.dept, e.shift, e.tin, e.tout, d != null ? fdur(d) : '', e.status]); });
    var t = rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/csv' })); a.download = 'attendance-aug-31-2026.csv';
    document.body.appendChild(a); a.click(); a.remove();
  }

  function render(keepFocus) {
    wrap.innerHTML = top() + register() + cards() + "<div id='atmenu'>" + menu() + '</div><div id="atmodal">' + modal() + '</div>';
    if (keepFocus) { var q = document.getElementById('atq'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  }
  loadSaved();
  render();

  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function rangeLabel(s, e) {
    if (s.getTime() === e.getTime()) return MON[s.getMonth()] + ' ' + s.getDate() + ', ' + s.getFullYear();
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) return MON[s.getMonth()] + ' ' + s.getDate() + '\u2013' + e.getDate() + ', ' + s.getFullYear();
    return MON[s.getMonth()] + ' ' + s.getDate() + ' \u2013 ' + MON[e.getMonth()] + ' ' + e.getDate() + ', ' + e.getFullYear();
  }
  function applyIn(e, t) { e.tin = t; e.status = tmin(t) > startMin(e.shift) + 15 ? 'Late' : 'Present'; }

  function clock(kind) {
    var f = st.f, bad = {}, e = f.emp ? find(f.emp) : null, msg = '';
    if (!e) { bad.emp = true; msg = 'Choose an employee'; }
    else if (kind === 'in' && !f.tin) { bad.tin = true; msg = 'Choose a time in'; }
    else if (kind === 'out' && !f.tout) { bad.tout = true; msg = 'Choose a time out'; }
    else if (kind === 'out' && !(f.tin || e.tin)) { bad.tin = true; msg = e.name + ' has no time in yet. Choose one first'; }
    else if (f.tout && tmin(f.tout) <= tmin(f.tin || e.tin || '12:00 AM')) { bad.tout = true; msg = 'Time out must be after time in'; }
    if (msg) { st.bad = bad; render(); tip(msg); return; }
    if (f.tin) applyIn(e, f.tin);
    if (kind === 'out' || f.tout) e.tout = f.tout;
    A.dirty = true; save();
    st.f = { emp: '', tin: '', tout: '' }; st.bad = {};
    st.ok = { t: 'Attendance recorded', m: "The clock entry was saved to today's register for " + A.date + '.' }; st.modal = 'ok'; render();
  }

  stage.addEventListener('click', function (ev) {
    var T = ev.target;
    if (T.closest('[data-close]')) { st.menu = ''; st.pick = ''; st.modal = ''; render(); return; }
    var o = T.closest('.at-o');
    if (o) { if (st.menu === 'dept') st.dept = o.dataset.opt; else st.status = o.dataset.opt; st.menu = ''; render(); return; }
    var po = T.closest('.at-po');
    if (po) { st.f[po.dataset.k] = po.dataset.v; st.bad[po.dataset.k] = false; st.pick = ''; render(); return; }
    if (T.closest('#atd')) { st.menu = st.menu === 'dept' ? '' : 'dept'; st.pick = ''; render(); return; }
    if (T.closest('#ats')) { st.menu = st.menu === 'status' ? '' : 'status'; st.pick = ''; render(); return; }
    var pk = T.closest('[data-pick]');
    if (pk) { st.pick = st.pick === pk.dataset.pick ? '' : pk.dataset.pick; st.menu = ''; render(); return; }
    var c = T.closest('[data-cb]');
    if (c) {
      var id = c.dataset.cb, v = visible();
      if (id === 'all') { var on = !v.every(function (x) { return st.sel[x.id]; }); v.forEach(function (x) { st.sel[x.id] = on; }); } else st.sel[id] = !st.sel[id];
      render(); return;
    }
    var dt = T.closest('[data-det]');
    if (dt) { st.emp = find(dt.dataset.det); st.modal = 'det'; render(); return; }
    var b = T.closest('[data-act]');
    if (!b) return;
    var a = b.dataset.act, N = A.emps.length, ready = A.emps.filter(function (x) { return x.status !== 'Absent'; }).length, rev = A.emps.filter(function (x) { return x.status === 'Absent' && !x.reviewed; });
    if (a === 'export') { csv(); st.ok = { t: 'Attendance exported', m: 'The ' + A.date + ' daily register for ' + N + ' employees was exported as a spreadsheet.' }; st.modal = 'ok'; render(); }
    else if (a === 'approve') { st.ok = { t: 'Timesheets approved', m: ready + ' of ' + N + ' timesheets for ' + A.date + ' are approved.' + (rev.length ? " " + rev[0].name + "'s absence stays flagged for review." : '') }; st.modal = 'ok'; render(); }
    else if (a === 'sync') {
      if (A.syncedCount === ready && !A.dirty) { tip('Already synced to payroll'); return; }
      A.synced = A.date + ' \u00b7 ' + nowTime();
      A.syncedCount = ready; A.dirty = false; save();
      st.ok = { t: 'Synced to payroll', m: ready + ' attendance records now feed the ' + A.period + ' pay period.' + (rev.length ? ' ' + rev.length + ' absence still needs review.' : ' All records are in payroll.') }; st.modal = 'ok'; render();
    }
    else if (a === 'review') { st.emp = rev[0]; st.modal = 'review'; render(); }
    else if (a === 'reviewleave') { var rl = st.emp; A.leaves.push({ name: rl.name, type: 'Emergency leave', range: A.date, days: 1, status: 'Approved' }); rl.status = 'On leave'; rl.reviewed = true; A.dirty = true; save(); st.modal = ''; render(); tip('Leave approved for ' + rl.name); }
    else if (a === 'reviewunpaid') { var ru = st.emp; ru.reviewed = true; A.dirty = true; save(); st.modal = ''; render(); tip(ru.name + ' marked as an unpaid absence'); }
    else if (a === 'reviewclock') { var rc = st.emp; st.f = { emp: rc.id, tin: '', tout: '' }; st.modal = ''; render(); tip('Choose the time in for ' + rc.name); }
    else if (a === 'clockin') clock('in');
    else if (a === 'clockout') clock('out');
    else if (a === 'lapprove' || a === 'ldecline') {
      var p = pending()[0];
      if (!p) { tip('No pending leave requests'); return; }
      p.status = a === 'lapprove' ? 'Approved' : 'Declined';
      A.dirty = true; save();
      st.ok = { t: 'Leave request updated', m: p.name + "'s " + p.type.toLowerCase() + ' (' + p.range + ') was updated. Payroll sync will reflect the change.' }; st.modal = 'ok'; render();
    }
    else if (a === 'newreq') { st.menu = ''; st.pick = ''; st.modal = 'new'; render(); }
    else if (a === 'viewall') { st.modal = 'list'; render(); }
    else if (a === 'submitnew') {
      var g = function (i) { return document.getElementById('atn' + i); }, sd = Date.parse(g(3).value.split('\u00b7')[0].trim()), ed = Date.parse(g(4).value.split('\u00b7')[0].trim());
      var okS = !isNaN(sd), okE = !isNaN(ed) && ed >= sd;
      g(3).classList.toggle('bad', !okS); g(4).classList.toggle('bad', !okE); g(5).classList.toggle('bad', !g(5).value.trim());
      if (!okS || !okE || !g(5).value.trim()) { tip(!okS ? 'Start date must look like Sep 9, 2026' : (!okE ? 'End date must be on or after the start date' : 'Add a reason')); return; }
      var s = new Date(sd), e2 = new Date(ed);
      A.leaves.push({ name: g(1).value.split(' \u00b7 ')[0], type: g(2).value, range: rangeLabel(s, e2), days: Math.round((ed - sd) / 86400000) + 1, status: 'Pending' });
      A.dirty = true; save();
      st.modal = ''; render(); tip('Leave request submitted for ' + g(1).value.split(' \u00b7 ')[0]);
    }
  });
  stage.addEventListener('input', function (ev) { if (ev.target.id === 'atq') { st.q = ev.target.value.trim().toLowerCase(); render(true); } });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && (st.menu || st.pick || st.modal)) { st.menu = ''; st.pick = ''; st.modal = ''; render(); } });
})();
