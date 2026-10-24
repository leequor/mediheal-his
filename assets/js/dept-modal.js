// Departments: Add doctor / Add staff modal (Figma 4001:5875 'Departments Plus - Add doctor', read session 8).
// Frame-local geometry: scrim = whole frame, #0f1e2e @ .451; modal (480,190) 480x470 r16 white; padding 24.
// Title Inter Bold 20 #152d47 at (24,24); subtitle Inter 13 #8a97a6 at (24,54); labels Inter SemiBold 12 #152d47 at y 92/166/240/314;
// inputs 432x40 r10 fill #f5f8fb stroke #d9e2ea at y 112/186/260/334, text Inter 13 at x+14, placeholder #9aa6b3, value #1c2b30;
// Cancel 112x40 r10 white stroke #d9e2ea at (206,406) Inter Bold 13 #152d47; Save 126x40 r10 #152d47 at (330,406) Inter Bold 13 white.
// Figma has no prototype link on this frame (reactions 0). The Add button opens it here; Save appends a row in memory (addition, not persisted).
(function () {
  var css = document.createElement('style');
  css.textContent = '.dm-scrim{position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(15,30,46,.451);z-index:900}' +
    '.dm{position:absolute;left:480px;top:190px;width:480px;height:470px;background:#fff;border-radius:16px;box-shadow:0 20px 50px rgba(15,30,46,.25);font-family:Inter,sans-serif}' +
    '.dm *{box-sizing:border-box}.dm .t{position:absolute;left:24px;top:24px;margin:0;font:700 20px/24.2px Inter,sans-serif;color:#152d47}' +
    '.dm .s{position:absolute;left:24px;top:54px;font:400 13px/15.7px Inter,sans-serif;color:#8a97a6}' +
    '.dm label{position:absolute;left:24px;font:600 12px/14.5px Inter,sans-serif;color:#152d47}' +
    '.dm input{position:absolute;left:24px;width:432px;height:40px;border-radius:10px;background:#f5f8fb;border:1px solid #d9e2ea;padding:0 14px;font:400 13px Inter,sans-serif;color:#1c2b30;outline:none}' +
    '.dm input::placeholder{color:#9aa6b3}.dm input:focus{border-color:#1c6d9c}.dm input.bad{border-color:#e05252}' +
    '.dm button{position:absolute;top:406px;height:40px;border-radius:10px;font:700 13px Inter,sans-serif;cursor:pointer}' +
    '.dm .c{left:206px;width:112px;background:#fff;border:1px solid #d9e2ea;color:#152d47}.dm .v{left:330px;width:126px;background:#152d47;border:0;color:#fff}';
  document.head.appendChild(css);

  function close() { var s = document.querySelector('.dm-scrim'); if (s) s.remove(); }
  function open(d) {
    close();
    var staff = /staff/i.test(d.add);
    var kind = staff ? 'staff' : 'doctor';
    var f = [['name', 'Full name', 'e.g. Dr. Maria Reyes', '', 112], ['spec', 'Specialty', '', d.dname, 186], ['fee', 'Consultation fee', '\u20b11,800', '', 260], ['phone', 'Contact number', '+63 9XX XXX XXXX', '', 334]];
    var h = "<div class='dm-scrim'><div class='dm' role='dialog' aria-modal='true'><h2 class='t'>" + (staff ? 'Add staff' : 'Add doctor') + "</h2><div class='s'>" + d.dname + ' department</div>';
    f.forEach(function (x) { h += "<label style='top:" + (x[4] - 20) + "px'>" + x[1] + "</label><input data-k='" + x[0] + "' style='top:" + x[4] + "px' placeholder='" + x[2] + "' value='" + x[3] + "'>"; });
    h += "<button class='c' data-m='x'>Cancel</button><button class='v' data-m='s'>Save " + kind + '</button></div></div>';
    document.getElementById('stage').insertAdjacentHTML('beforeend', h);
    document.querySelector('.dm input').focus();
  }
  function save(d) {
    var v = {};
    document.querySelectorAll('.dm input').forEach(function (i) { v[i.dataset.k] = i.value.trim(); i.classList.remove('bad'); });
    if (!v.name) { var n = document.querySelector(".dm input[data-k='name']"); n.classList.add('bad'); n.focus(); return; }
    var w = v.name.replace(/^Dr\.?\s*/i, '').split(/\s+/);
    var ini = ((w[0] || '')[0] || '').toUpperCase() + ((w.length > 1 ? w[w.length - 1] : '')[0] || '').toUpperCase();
    d.rows.push([ini, v.name, (v.spec || d.dname) + (v.fee ? ', ' + (/^\u20b1/.test(v.fee) ? v.fee : '\u20b1' + v.fee) + '/consult' : '')]);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
  document.addEventListener('click', function (e) {
    var slug = decodeURIComponent(location.hash.replace(/^#/, ''));
    var d = HIS.departments.filter(function (x) { return x.slug === slug; })[0];
    if (!d) return;
    if (e.target.closest('[data-act=add]')) { open(d); return; }
    if (e.target.closest('[data-m=x]') || e.target.classList.contains('dm-scrim')) close();
    else if (e.target.closest('[data-m=s]')) save(d);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
