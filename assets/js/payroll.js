// Payroll: ONE template (Figma 623:702) + state frames as JS states: Department filter open (4001:4423), Status filter open (4001:4733),
// overlays Process payments (2030:8587), Generate payslips (4008:3316), Export payroll (4008:3345), Payslip per employee (2030:8350 = EMP-001).
// Additions (not in Figma): live search, row selection, Process payments marks the awaiting rows Paid (in memory), Export file downloads a CSV, payslip values for employees other than EMP-001 are derived.
(function () {
  var P = HIS.payroll, stage = document.getElementById('stage');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (n) { return '\u20b1' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var fmt0 = function (n) { return '\u20b1' + n.toLocaleString('en-US'); };
  var net = function (e) { return e.basic + e.allow - e.ded; };
  var sum = function (a, f) { return a.reduce(function (t, e) { return t + f(e); }, 0); };
  var ALL_D = 'All departments', ALL_S = 'All payment statuses';
  var st = { q: '', dept: ALL_D, status: ALL_S, menu: '', modal: '', emp: null, sel: {} };
  HIS.prState = st;
  var IC = {
    users: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'/>",
    wallet: "<path d='M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5'/><path d='M16 13h.01'/>",
    receipt: "<path d='M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM8 8h8M8 12h8M8 16h5'/>",
    banknote: "<rect x='2' y='6' width='20' height='12' rx='2'/><circle cx='12' cy='12' r='2'/><path d='M6 12h.01M18 12h.01'/>",
    download: "<path d='M12 3v12M7 10l5 5 5-5M5 21h14'/>",
    file: "<path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6'/>",
    send: "<path d='M22 2 11 13M22 2l-7 20-4-9-9-4z'/>",
    calendar: "<rect x='3' y='4' width='18' height='18' rx='2'/><path d='M16 2v4M8 2v4M3 10h18'/>",
    chevron: "<path d='M6 9l6 6 6-6'/>",
    search: "<circle cx='11' cy='11' r='7'/><path d='m21 21-4.3-4.3'/>",
    clock: "<circle cx='12' cy='12' r='9'/><path d='M12 7v5l3 2'/>",
    shield: "<path d='M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z'/><path d='m9 12 2 2 4-4'/>",
    check: "<path d='m5 12 5 5 9-10'/>"
  };
  var ic = function (n, w, sw) { return "<svg width='" + w + "' height='" + w + "' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='" + (sw || 2) + "' stroke-linecap='round' stroke-linejoin='round'>" + IC[n] + '</svg>'; };
  var at = function (cls, l, t, inner, extra) { return "<div class='pr-a " + cls + "' style='left:" + l + 'px;top:' + t + 'px;' + (extra || '') + "'>" + inner + '</div>'; };

  var wrap = document.createElement('div'); wrap.id = 'prc'; stage.appendChild(wrap);

  function visible() {
    return P.emps.filter(function (e) {
      return (st.dept === ALL_D || e.dept === st.dept) && (st.status === ALL_S || e.status === st.status) &&
        (!st.q || (e.name + ' ' + e.id + ' ' + e.role + ' ' + e.dept).toLowerCase().indexOf(st.q.trim().toLowerCase()) > -1);
    });
  }

  function top() {
    var E = P.emps, paid = E.filter(function (e) { return e.status === 'Paid'; });
    var h = "<h1 class='pr-a pr-t' style='left:68px;top:115px'>Payroll</h1>" + at('pr-d', 68, 166, 'Review salaries, deductions and payments for each pay period.');
    h += at('pr-card', 68, 207, '', 'width:1304px;height:100px');
    h += at('pr-lbl', 88, 227, 'PAY PERIOD');
    h += at('pr-sel', 88, 247, ic('calendar', 16, 1.8).replace('<svg', "<svg style='position:absolute;left:12px;top:12px;color:#1b4e6b'") + "<span class='v'>" + P.period + '</span>' + ic('chevron', 16, 2).replace('<svg', "<svg style='position:absolute;right:12px;top:12px;color:#1b4e6b'"));
    h += at('pr-div', 293, 233, '');
    h += at('pr-lbl', 314, 228.5, 'PAYMENT DATE') + at('pr-date', 314, 248.5, P.payDate) + at('pr-meth', 314, 272.5, 'Semi-monthly \u00b7 ' + P.method);
    h += "<div class='pr-a' style='left:68px;top:207px;width:1304px;height:100px'>";
    h += "<button class='pr-btn' data-modal='export' style='left:768px;width:146px'>" + ic('download', 18, 1.8) + '<span>Export payroll</span></button>';
    h += "<button class='pr-btn' data-modal='gen' style='left:926px;width:172px'>" + ic('file', 18, 1.8) + '<span>Generate payslips</span></button>';
    h += "<button class='pr-btn pri' data-modal='proc' style='left:1110px;width:174px'>" + ic('send', 18, 1.8) + '<span>Process payments</span></button></div>';
    var M = [['users', 'Employees in payroll', String(E.length), paid.length + ' paid \u00b7 ' + (E.length - paid.length) + ' awaiting settlement'],
      ['wallet', 'Total earnings', fmt0(sum(E, function (e) { return e.basic + e.allow; })), 'Basic salary + allowances'],
      ['receipt', 'Total deductions', fmt0(sum(E, function (e) { return e.ded; })), 'Tax + employee contributions'],
      ['banknote', 'Net payroll', fmt0(sum(E, net)), fmt0(sum(paid, net)) + ' paid this period']];
    M.forEach(function (m, i) { h += "<div class='pr-a pr-card pr-m' style='left:" + (68 + 331 * i) + "px;top:331px'><span class='ic'>" + ic(m[0], 24, 1.8) + "</span><span class='l'>" + m[1] + "</span><span class='n'>" + m[2] + "</span><span class='s'>" + m[3] + '</span></div>'; });
    return h;
  }

  var HCOL = [['EMPLOYEE', 52], ['DEPARTMENT', 290], ['DAYS \u00b7 HOURS', 440]];
  var RCOL = [['BASIC SALARY', 560, 112], ['ALLOWANCES', 680, 110], ['DEDUCTIONS', 798, 112], ['NET PAY', 918, 126]];
  var cb = function (on, l, t, d) { return "<button class='pr-cb" + (on ? ' on' : '') + "' data-cb='" + d + "' style='left:" + l + 'px;top:' + t + "px' aria-label='Select'>" + (on ? ic('check', 12, 3).replace('<svg', "<svg style='color:#fff'") : '') + '</button>'; };

  function register() {
    var v = visible(), E = P.emps;
    var pend = E.filter(function (e) { return e.status === 'Pending'; }).length, proc = E.filter(function (e) { return e.status === 'Processing'; }).length;
    var allSel = v.length > 0 && v.every(function (e) { return st.sel[e.id]; });
    var h = "<section class='pr-a pr-card pr-reg'>";
    h += at('pr-st', 24, 24, 'Employee salaries') + at('pr-ex', 24, 53, 'Earnings = basic salary + allowances. Hours from Attendance. Amounts in PHP.');
    h += at('pr-ex', 1116, 38, ic('clock', 16, 1.8).replace('<svg', "<svg style='color:#6f8890'")) + at('pr-ex', 1140, 38.5, pend + ' pending \u00b7 ' + proc + ' processing');
    h += "<div class='pr-a pr-search' style='left:24px;top:86px'>" + ic('search', 18, 1.8) + "<input id='prq' placeholder='Search employee name or ID' aria-label='Search employee' value='" + esc(st.q) + "'></div>";
    h += "<button class='pr-flt" + (st.menu === 'dept' ? ' open' : '') + "' id='prd' style='left:444px;width:148px'><span class='v'>" + esc(st.dept) + '</span>' + ic('chevron', 16, 2) + '</button>';
    h += "<button class='pr-flt" + (st.menu === 'status' ? ' open' : '') + "' id='prs' style='left:604px;width:177px'><span class='v'>" + esc(st.status) + '</span>' + ic('chevron', 16, 2) + '</button>';
    h += "<div class='pr-a pr-ex' style='right:24px;top:98.5px'>" + v.length + ' employee' + (v.length === 1 ? '' : 's') + '</div>';
    h += "<div class='pr-a pr-th'>" + cb(allSel, 24, 15, 'all');
    HCOL.forEach(function (c) { h += at('pr-h', c[1], 16.5, c[0]); });
    RCOL.forEach(function (c) { h += at('pr-h', c[1], 16.5, c[0], 'width:' + c[2] + 'px;text-align:right'); });
    h += at('pr-h', 1068, 16.5, 'PAYMENT STATUS') + at('pr-h', 1186, 16.5, 'ACTION', 'width:94px;text-align:right') + '</div>';
    v.forEach(function (e, i) {
      var cells = [[560, 112, e.basic, ''], [680, 110, e.allow, ''], [798, 112, e.ded, ''], [918, 126, net(e), 'net']];
      h += "<div class='pr-a pr-r' style='top:" + (196 + 64 * i) + "px'>" + cb(!!st.sel[e.id], 24, 24, e.id);
      h += "<span class='nm'>" + esc(e.name) + "</span><span class='mt'>" + e.id + ' \u00b7 ' + esc(e.role) + "</span><span class='dp'>" + esc(e.dept) + "</span><span class='dh'>" + e.days + ' days \u00b7 ' + e.hours + ' h</span>';
      cells.forEach(function (c) { h += "<span class='am " + c[3] + "' style='left:" + c[0] + 'px;width:' + c[1] + "px'>" + fmt(c[2]) + '</span>'; });
      h += "<span class='pr-p " + e.status + "'>" + (e.status === 'Paid' ? '<i></i>' : '') + "<span class='lb'>" + e.status + '</span></span>';
      h += "<button class='pr-ps' data-slip='" + e.id + "'>" + ic('file', 15, 1.8) + '<span>Payslip</span></button></div>';
    });
    if (!v.length) h += "<div class='pr-a pr-none'>No employees match</div>";
    h += "<div class='pr-a pr-tot'><span class='tl'>Pay period total \u00b7 " + v.length + ' employee' + (v.length === 1 ? '' : 's') + '</span>';
    h += "<span class='dd'>" + sum(v, function (e) { return e.days; }) + ' days \u00b7 ' + sum(v, function (e) { return e.hours; }) + ' h</span>';
    [[560, 112, function (e) { return e.basic; }], [680, 110, function (e) { return e.allow; }], [798, 112, function (e) { return e.ded; }], [918, 126, net]].forEach(function (c, i) {
      h += "<span class='am" + (i === 3 ? ' net' : '') + "' style='left:" + c[0] + 'px;width:' + c[1] + "px'>" + fmt(sum(v, c[2])) + '</span>';
    });
    h += '</div>';
    h += "<div class='pr-a pr-ft'>" + at('pr-ex', 24, 25.5, 'Showing ' + (v.length ? '1\u2013' + v.length : '0') + ' of ' + E.length + ' employees');
    h += at('pr-meth', 504, 25, ic('shield', 16, 1.8).replace('<svg', "<svg style='color:#6f8890'")) + at('pr-meth', 527, 26.5, 'Deductions include withholding tax, SSS, PhilHealth and Pag-IBIG.');
    h += "<div class='pr-pg'>Page 1 of 1</div></div></section>";
    return h;
  }

  function menu() {
    if (!st.menu) return '';
    var isD = st.menu === 'dept', opts = isD ? [ALL_D].concat(P.depts) : [ALL_S].concat(P.statuses), cur = isD ? st.dept : st.status;
    var h = "<div class='pr-ml' data-close='1'></div><div class='pr-menu' style='left:" + (isD ? 512 : 672) + 'px;height:' + (16 + 36 * opts.length) + "px'>";
    opts.forEach(function (o) { h += "<button class='pr-o" + (o === cur ? ' on' : '') + "' data-opt='" + esc(o) + "'>" + esc(o) + '</button>'; });
    return h + '</div>';
  }

  function breakdown(e) {
    var t, s, p, g;
    if (e.tax != null) { t = e.tax; s = e.sss; p = e.phil; g = e.pag; }
    else { p = Math.round(e.basic * 0.025); s = Math.min(1350, Math.round(e.basic * 0.0225)); g = 750; t = e.ded - p - s - g; }
    return 'Withholding tax ' + fmt0(t) + ' \u00b7 SSS ' + fmt0(s) + ' \u00b7 PhilHealth ' + fmt0(p) + ' \u00b7 Pag-IBIG ' + fmt0(g);
  }

  function modalDef() {
    var E = P.emps, unpaid = E.filter(function (e) { return e.status !== 'Paid'; }), per = 'Pay period ' + P.period + ' \u00b7 Semi-monthly';
    if (st.modal === 'proc') return { y: 453, h: 438, t: 'Process payments', s: per + ' \u00b7 Review before releasing funds', ok: 'Process payments', c: 'Cancel',
      f: [['Employees to pay', unpaid.length + ' awaiting settlement'], ['Amount to release', fmt(sum(unpaid, net))], ['Payment date', P.payDate], ['Method', P.method], ['Source account', 'MediHeal payroll account \u00b7 net pay after tax, SSS, PhilHealth and Pag-IBIG']] };
    if (st.modal === 'export') return { y: 453, h: 438, t: 'Export payroll', s: per + ' \u00b7 All employees', ok: 'Export file', c: 'Cancel',
      f: [['File format', 'Excel (.xlsx)'], ['Records', E.length + ' employees'], ['Pay period', P.period], ['Total net pay', fmt(sum(E, net))], ['Columns', 'Earnings, deductions, net pay and payment status per employee']] };
    if (st.modal === 'gen') return { y: 453, h: 438, t: 'Generate payslips', s: per + ' \u00b7 One payslip per employee', ok: 'Generate payslips', c: 'Cancel',
      f: [['Employees', E.length + ' payslips to generate'], ['Total net pay', fmt(sum(E, net))], ['Pay period', P.period], ['Delivery', 'Employee portal'], ['Includes', 'Basic pay, allowances, tax, SSS, PhilHealth and Pag-IBIG deductions']] };
    var e = st.emp;
    return { y: 388, h: 568, t: 'Payslip', s: e.name + ' \u00b7 ' + e.id + ' \u00b7 ' + e.role + ' \u00b7 ' + P.period, ok: 'Download PDF', c: 'Close', slip: 1,
      f: [['Basic salary', fmt(e.basic)], ['Allowances', fmt(e.allow)], ['Deductions', fmt(e.ded)], ['Net pay', fmt(net(e))], ['Payment', e.status + ' \u00b7 ' + P.method + ' \u00b7 ' + P.payDate], ['Deduction breakdown', breakdown(e)]] };
  }

  function modal() {
    if (!st.modal) return '';
    var d = modalDef(), pos = [[32, 120], [348, 120], [32, 202], [348, 202], [32, 284], [32, 366]], wid = [300, 300, 300, 300, 616, 616];
    var h = "<div class='pr-scrim' data-close='1'></div><div class='pr-modal' role='dialog' aria-modal='true' style='top:" + d.y + 'px;height:' + d.h + "px'>";
    h += "<button class='pr-m-x' data-close='1' aria-label='Close'>\u00d7</button><div class='pr-m-t'>" + esc(d.t) + "</div><div class='pr-m-s'>" + esc(d.s) + "</div><div class='pr-m-d'></div>";
    d.f.forEach(function (f, i) {
      h += "<div class='pr-m-l' style='left:" + pos[i][0] + 'px;top:' + pos[i][1] + "px'>" + esc(f[0]) + '</div>';
      h += "<div class='pr-m-i" + (i === 5 ? ' ta' : '') + "' style='left:" + pos[i][0] + 'px;top:' + (pos[i][1] + 22) + 'px;width:' + wid[i] + "px'>" + esc(f[1]) + '</div>';
    });
    var by = d.slip ? 504 : 374;
    h += "<button class='pr-m-c' data-close='1' style='top:" + by + "px'>" + d.c + "</button><button class='pr-m-ok' data-ok='1' style='top:" + by + "px'>" + esc(d.ok) + '</button></div>';
    return h;
  }

  var tipT;
  function tip(t) { var o = document.querySelector('.pr-tip'); if (o) o.remove(); var d = document.createElement('div'); d.className = 'pr-tip'; d.textContent = t; document.body.appendChild(d); clearTimeout(tipT); tipT = setTimeout(function () { d.remove(); }, 2400); }

  function csv() {
    var rows = [['Employee', 'ID', 'Role', 'Department', 'Days', 'Hours', 'Basic salary', 'Allowances', 'Deductions', 'Net pay', 'Status']];
    P.emps.forEach(function (e) { rows.push([e.name, e.id, e.role, e.dept, e.days, e.hours, e.basic, e.allow, e.ded, net(e), e.status]); });
    var t = rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/csv' })); a.download = 'payroll-aug-16-31-2026.csv';
    document.body.appendChild(a); a.click(); a.remove();
  }

  function render(keepFocus) {
    wrap.innerHTML = top() + register() + "<div id='prmenu'>" + menu() + '</div><div id="prmodal">' + modal() + '</div>';
    if (keepFocus) { var q = document.getElementById('prq'); q.focus(); var c = st.caret == null ? q.value.length : st.caret; q.setSelectionRange(c, c); }
  }
  render();

  stage.addEventListener('click', function (e) {
    var T = e.target;
    if (T.closest('[data-close]')) { st.menu = ''; st.modal = ''; render(); return; }
    var o = T.closest('.pr-o');
    if (o) { if (st.menu === 'dept') st.dept = o.dataset.opt; else st.status = o.dataset.opt; st.menu = ''; render(); return; }
    if (T.closest('#prd')) { st.menu = st.menu === 'dept' ? '' : 'dept'; render(); return; }
    if (T.closest('#prs')) { st.menu = st.menu === 'status' ? '' : 'status'; render(); return; }
    var c = T.closest('[data-cb]');
    if (c) {
      var id = c.dataset.cb, v = visible();
      if (id === 'all') { var on = !v.every(function (x) { return st.sel[x.id]; }); v.forEach(function (x) { st.sel[x.id] = on; }); } else st.sel[id] = !st.sel[id];
      render(); return;
    }
    var sl = T.closest('[data-slip]');
    if (sl) { st.emp = P.emps.filter(function (x) { return x.id === sl.dataset.slip; })[0]; st.modal = 'slip'; render(); return; }
    var m = T.closest('[data-modal]'); if (m) { st.modal = m.dataset.modal; render(); return; }
    if (T.closest('[data-ok]')) {
      var k = st.modal;
      if (k === 'proc') {
        var n = P.emps.filter(function (x) { return x.status !== 'Paid'; });
        if (!n.length) tip('Nothing to process: all 8 employees are paid');
        else { n.forEach(function (x) { x.status = 'Paid'; }); tip(n.length + ' payments processed (' + fmt(sum(n, net)) + ')'); }
      } else if (k === 'gen') tip(P.emps.length + ' payslips generated and sent to the employee portal');
      else if (k === 'export') { csv(); tip('Payroll exported as CSV (Excel format is a Figma label)'); }
      else tip('Payslip PDF prepared for ' + st.emp.name);
      st.modal = ''; render();
    }
  });
  stage.addEventListener('input', function (e) { if (e.target.id === 'prq') { st.q = e.target.value; st.caret = e.target.selectionStart; render(true); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && (st.menu || st.modal)) { st.menu = ''; st.modal = ''; render(); } });
})();
