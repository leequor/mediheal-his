// Billing: ONE template (Figma 351:847). State frames 2064:* are NOT read yet (Record payment, Coverage and discounts, Final statement, Status/Date dropdowns, type tabs):
// those buttons show a tooltip. Additions (not in Figma): bill selection, live search, Inpatient/Outpatient tabs, Status filter cycles All>Paid>Partial>Pending, Download = window.print().
(function () {
  var B = HIS.billing, stage = document.getElementById('stage');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var peso = function (n) { return '\u20b1' + n.toLocaleString('en-US'); };
  var num = function (n) { return n.toLocaleString('en-US'); };
  var st = { tab: 'All', status: 'All', q: '', sel: B.bills[0].id };
  var STATUSES = ['All', 'Paid', 'Partial', 'Pending'];
  var svg = function (p, w) { return "<svg width='" + w + "' height='" + w + "' viewBox='0 0 24 24' fill='none' stroke='#152d47' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>" + p + '</svg>'; };
  var SEARCH = "<svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='#9aa6b3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='7'/><path d='m20 20-3.5-3.5'/></svg>";
  var DL = svg("<path d='M12 3v12M7 10l5 5 5-5M5 21h14'/>", 15);
  var pill = function (s) { return "<span class='bl-pill " + s + "'>" + s + '</span>'; };

  function shell() {
    var h = "<h1 class='bl-title'>Billing</h1><div class='bl-sub'>Monday, August 31, 2026</div><div class='bl-search'>" + SEARCH + "<input id='blq' placeholder='Search records...' aria-label='Search'></div>";
    B.stats.forEach(function (s, i) { h += "<div class='bl-stat' style='left:" + [32, 380.5, 729, 1077.5][i] + "px'><span class='l'>" + s[0] + "</span><span class='n " + s[2] + "'>" + s[1] + '</span></div>'; });
    h += "<div class='bl-lab'>RECENT BILLS</div>";
    [['All', 32, 56], ['Inpatient', 96, 92], ['Outpatient', 196, 100]].forEach(function (t) { h += "<button class='bl-tab' data-tab='" + t[0] + "' style='left:" + t[1] + 'px;width:' + t[2] + "px'>" + t[0] + '</button>'; });
    h += "<button class='bl-flt' id='blst' style='left:32px;width:150px'></button><button class='bl-flt' data-tip='Date filter state frame not read yet' style='left:190px;width:190px'>Date: Any time  \u25be</button>";
    h += "<div id='bllist'></div><div id='blinv'></div>";
    stage.innerHTML = h;
  }

  function visible() {
    return B.bills.filter(function (b) {
      return (st.tab === 'All' || b.type === st.tab) && (st.status === 'All' || b.status === st.status) &&
        (!st.q || (b.name + ' ' + b.full + ' ' + b.id + ' ' + b.pt + ' ' + b.dept).toLowerCase().indexOf(st.q) > -1);
    });
  }

  function list() {
    var v = visible();
    if (v.length && !v.some(function (b) { return b.id === st.sel; })) st.sel = v[0].id;
    stage.querySelectorAll('.bl-tab').forEach(function (t) { t.classList.toggle('on', t.dataset.tab === st.tab); });
    document.getElementById('blst').textContent = 'Status: ' + st.status + '  \u25be';
    var h = '';
    v.forEach(function (b, i) {
      h += "<div class='bl-row" + (b.id === st.sel ? ' on' : '') + "' data-id='" + b.id + "' style='top:" + (430 + 93.6 * i).toFixed(1) + "px' tabindex='0'><span class='nm'>" + esc(b.name) + "</span><span class='m1'>" + b.id + ' \u00b7 ' + b.pt + "</span><span class='m2'>" + esc(b.dept) + ' \u00b7 ' + b.date + "</span><span class='bp'>" + pill(b.status) + "</span><span class='am'>" + peso(b.amount) + '</span></div>';
    });
    if (!v.length) h = "<div class='bl-none'>No bills match</div>";
    document.getElementById('bllist').innerHTML = h;
    invoice(v.length ? B.bills.filter(function (b) { return b.id === st.sel; })[0] : null);
  }

  function invoice(b) {
    var el = document.getElementById('blinv');
    if (!b) { el.innerHTML = ''; return; }
    var items = b.items, sub, vat, total = b.amount, paid;
    if (items) { sub = b.subtotal; vat = b.vat; paid = b.paid; } else { sub = Math.round(total / 1.12); vat = total - sub; paid = b.status === 'Paid' ? total : 0; }
    var h = "<section class='bl-inv'><div class='bl-ih'><span class='t'>Invoice " + b.id + "</span><span class='m'>" + esc(b.full) + ' \u00b7 ' + b.pt + ' \u00b7 ' + esc(b.dept) + "</span><span class='d'>" + b.date + "</span><span class='bp'>" + pill(b.status) + '</span></div>';
    h += "<div class='bl-tb'><div class='bl-tr h'><span class='c1'>Description \u00b7 charge source</span><span class='c2'>Qty</span><span class='c3'>Rate (\u20b1)</span><span class='c4'>Amount</span></div>";
    if (items) items.forEach(function (r) { h += "<div class='bl-tr'><span class='c1'>" + esc(r[0]) + "</span><span class='c2'>" + r[1] + "</span><span class='c3'>" + num(r[2]) + "</span><span class='c4'>" + num(r[3]) + '</span></div>'; });
    else h += "<div class='bl-tr'><span class='c1' style='color:#8a97a6'>Line items for this bill are not in the main Figma frame (estimated summary)</span><span class='c2'>1</span><span class='c3'>" + num(sub) + "</span><span class='c4'>" + num(sub) + '</span></div>';
    h += "</div><div class='bl-tot'><div><span>Subtotal</span><b>" + peso(sub) + "</b></div><div><span>VAT (12%)</span><b>" + peso(vat) + "</b></div><div class='gt'><span>Grand total</span><b>" + peso(total) + "</b></div><div class='pd'><span>Paid</span><b>" + peso(paid) + "</b></div><div class='bd'><span>Balance due</span><b>" + peso(total - paid) + '</b></div></div>';
    h += "<div class='bl-act'><button class='bl-btn' data-act='dl' style='left:0'>" + DL + 'Download</button><button class="bl-btn" data-tip="Record payment state frame not read yet" style="left:228px">Record payment</button><button class="bl-btn" data-tip="Coverage and discounts state frame not read yet" style="left:456px">Coverage and discounts</button><button class="bl-btn" data-tip="Final statement state frame not read yet" style="left:684px">Final statement</button></div></section>';
    el.innerHTML = h;
  }

  var tipT;
  function tip(t) { var o = document.querySelector('.bl-tip'); if (o) o.remove(); var d = document.createElement('div'); d.className = 'bl-tip'; d.textContent = t; document.body.appendChild(d); clearTimeout(tipT); tipT = setTimeout(function () { d.remove(); }, 2200); }

  shell(); list();
  stage.addEventListener('click', function (e) {
    var r = e.target.closest('.bl-row'); if (r) { st.sel = r.dataset.id; list(); return; }
    var t = e.target.closest('.bl-tab'); if (t) { st.tab = t.dataset.tab; list(); return; }
    if (e.target.closest('#blst')) { st.status = STATUSES[(STATUSES.indexOf(st.status) + 1) % STATUSES.length]; list(); return; }
    if (e.target.closest('[data-act=dl]')) { window.print(); return; }
    var p = e.target.closest('[data-tip]'); if (p) tip(p.dataset.tip);
  });
  stage.addEventListener('keydown', function (e) { var r = e.target.closest && e.target.closest('.bl-row'); if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); st.sel = r.dataset.id; list(); } });
  document.getElementById('blq').addEventListener('input', function (e) { st.q = e.target.value.trim().toLowerCase(); list(); });
})();
