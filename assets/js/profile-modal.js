// Patient profile action modals as JS states of profile.html (loaded after profile.js; hooks the header and Treatment History buttons by event delegation).
// Figma: Edit patient details 2027:2458 (modal 2027:2615), Transfer patient 2027:2643 (2027:2800), Discharge patient 2027:2828 (2027:2985): modal 680x568 at frame-local (380,192);
// Dispense medication 2047:25913 (2047:26162) and Discharge summary 2047:25314 (2047:25563): modal 680x664 at (380,120) with a banner. Same child layout as the Billing/Personnel action modals.
// Texts are the Figma texts for Isabel Geliz V. Ramos (PT-99213). For other patients the fields are prefilled from the profile on screen (Edit) or left blank (Transfer/Discharge notes). Changes are in memory only (reload resets).
(function () {
  var stage = document.getElementById('stage');
  if (!stage || !stage.querySelector('.pf-name')) return;
  var D = '\u2014';
  var id = new URLSearchParams(location.search).get('id') || 'PT-99213';
  var isG = id === 'PT-99213';
  var cur = null, stock = 240;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  // The buttons carried a "not built yet" tooltip from profile.js; these modals replace it.
  Array.prototype.forEach.call(stage.querySelectorAll('[data-act="edit"],[data-act="transfer"],[data-act="discharge"],[data-act="pharmacy"],[data-act="summary"]'), function (b) { b.removeAttribute('title'); });

  function card(t) { return Array.prototype.filter.call(stage.querySelectorAll('.pf-card'), function (c) { var h = c.querySelector('.pf-h3'); return h && h.textContent.trim() === t; })[0]; }
  function rowEl(t, i) { var c = card(t); return c ? c.querySelectorAll('.pf-row')[i] : null; }
  function getV(t, i) { var r = rowEl(t, i), v = r ? r.querySelector('.pf-v').textContent.trim() : ''; return v === D ? '' : v; }
  function setV(t, i, v) { var r = rowEl(t, i); if (r) r.querySelector('.pf-v').textContent = v === '' ? D : v; }
  function sub() { return stage.querySelector('.pf-name').textContent.trim() + ' \u00b7 ' + id + ' \u00b7 ' + ((stage.querySelector('.pf-tag') || {}).textContent || '').trim(); }

  // [label top, input top, left, width]; 568-high modals end with a textarea at 388, 664-high ones carry a banner at 366 and the textarea at 484
  var POS4 = [[120, 142, 32, 300], [120, 142, 348, 300], [202, 224, 32, 300], [202, 224, 348, 300], [284, 306, 32, 616], [366, 388, 32, 616]];
  var POS6 = [[120, 142, 32, 300], [120, 142, 348, 300], [202, 224, 32, 300], [202, 224, 348, 300], [284, 306, 32, 616], [462, 484, 32, 616]];

  function spec(kind) {
    if (kind === 'edit') return { top: 192, h: 568, title: 'Edit patient details', sub: sub(), ok: 'Save changes', f: [
      ['Phone number', getV('Contact & Address', 0)], ['Email address', getV('Contact & Address', 1)],
      ['Emergency contact', getV('Emergency Contact', 0)], ['Emergency contact number', getV('Emergency Contact', 2)],
      ['Street address', getV('Contact & Address', 2)], ['Existing conditions / allergies', getV('Health History & Reason', 0)]] };
    if (kind === 'transfer') return { top: 192, h: 568, title: 'Transfer patient', sub: sub(), ok: 'Confirm transfer', f: [
      ['Transfer to department', 'General Medicine'], ['Receiving doctor', 'Dr. Yumie Pasiol'], ['Ward', 'General Medicine Ward'], ['Bed number', isG ? 'G-14' : ''],
      ['Reason for transfer', isG ? 'Cardiac work-up complete; continue care in General Medicine' : ''],
      ['Notes for the receiving team', isG ? 'Diabetic and hypertensive. Monitor BP and glucose every 4 hours.' : '']] };
    if (kind === 'discharge') return { top: 192, h: 568, title: 'Discharge patient', sub: sub(), ok: 'Confirm discharge', f: [
      ['Discharge date', 'Aug 31, 2026'], ['Condition at discharge', 'Stable'],
      ['Follow-up date', isG ? 'Sep 14, 2026' : ''], ['Follow-up doctor', isG ? 'Dr. Laurice Laureta' : ''],
      ['Discharge diagnosis', isG ? 'Angina pectoris, controlled' : ''],
      ['Discharge summary and instructions', isG ? 'Continue medication. Low-salt diet. Return if chest pain recurs.' : '']] };
    if (kind === 'pharmacy') return { top: 120, h: 664, title: 'Dispense medication', sub: 'Isabel Geliz \u00b7 Cardiology \u00b7 Ward 3, Bed 12', ok: 'Dispense', ro: [1], f: [
      ['Medication', 'Atorvastatin 40 mg tablet'], ['Stock check', 'In stock \u00b7 ' + stock + ' tablets'],
      ['Quantity to dispense', '30 tablets (30 days)'], ['Dispensed by', 'Pharmacist on duty'],
      ['Prescription', 'Atorvastatin 40 mg once daily at night \u00b7 Dr. Laurice Laureta'],
      ['Pharmacist notes', 'Counsel the patient: take at night, report muscle pain. Stock is updated after dispensing.']],
      bt: '\u2713 Stock available', bx: stock + ' tablets on hand. After dispensing, ' + (stock - 30) + ' tablets remain in the Pharmacy stock.' };
    return { top: 120, h: 664, title: 'Discharge summary', sub: 'Isabel Geliz V. Ramos \u00b7 Cardiology \u00b7 Ward 3, Bed 12', ok: 'Discharge', f: [
      ['Final diagnosis', 'Acute coronary syndrome (I24.9)'], ['Condition at discharge', 'Stable'],
      ['Discharge date', 'Sep 7, 2026'], ['Discharged by', 'Dr. Laurice Laureta'],
      ['Medications to continue', 'Atorvastatin 40 mg once daily at night'],
      ['Follow-up instructions', 'Cardiology clinic visit in 2 weeks. Return to the ER for chest pain.']],
      bt: 'Ready to discharge', bx: 'Follow-up instructions are given to the patient and saved in the treatment history.' };
  }

  function open(kind) {
    close();
    var s = spec(kind), pos = s.bt ? POS6 : POS4;
    var h = "<div class='pm-scrim' data-pclose='1'></div><div class='pm-modal' role='dialog' aria-modal='true' aria-label='" + esc(s.title) + "' style='top:" + s.top + 'px;height:' + s.h + "px'>";
    h += "<button class='pm-x' data-pclose='1' aria-label='Close'>\u00d7</button><div class='pm-t'>" + esc(s.title) + "</div><div class='pm-s'>" + esc(s.sub) + "</div><div class='pm-d'></div>";
    pos.forEach(function (p, i) {
      h += "<div class='pm-l' style='top:" + p[0] + 'px;left:' + p[2] + "px'>" + esc(s.f[i][0]) + '</div>';
      var ro = (s.ro || []).indexOf(i) > -1 ? ' readonly' : '';
      if (i === 5) h += "<textarea class='pm-i pm-ta' data-i='5' style='top:" + p[1] + 'px;left:' + p[2] + 'px;width:' + p[3] + "px'>" + esc(s.f[i][1]) + '</textarea>';
      else h += "<input class='pm-i' data-i='" + i + "' value='" + esc(s.f[i][1]) + "'" + ro + " style='top:" + p[1] + 'px;left:' + p[2] + 'px;width:' + p[3] + "px'>";
    });
    if (s.bt) h += "<div class='pm-b' id='pmb'><b id='pmbt'>" + esc(s.bt) + "</b><span id='pmbx'>" + esc(s.bx) + '</span></div>';
    h += "<button class='pm-c' data-pclose='1' style='top:" + (s.h - 64) + "px'>Cancel</button><button class='pm-ok' id='pmok' style='top:" + (s.h - 64) + "px'>" + esc(s.ok) + '</button>';
    h += '</div>';
    var w = document.createElement('div'); w.id = 'pmodal'; w.innerHTML = h; stage.appendChild(w);
    cur = { kind: kind, el: w };
    var f = w.querySelector('.pm-i:not([readonly])'); if (f) f.focus({ preventScroll: true });
    // keep the modal at its Figma position and bring it into view when the page is scrolled
    var m = w.querySelector('.pm-modal'), r = m.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) window.scrollTo(0, Math.max(0, window.scrollY + r.top - Math.max(16, (window.innerHeight - r.height) / 2)));
  }
  function close() { if (cur) { cur.el.remove(); cur = null; } }

  function toast(t) {
    var el = document.getElementById('pmtoast');
    if (!el) { el = document.createElement('div'); el.id = 'pmtoast'; el.className = 'pm-toast'; document.body.appendChild(el); }
    el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 3200);
  }
  function val(i) { return cur.el.querySelector('[data-i="' + i + '"]').value.trim(); }
  function flag(i, bad) { cur.el.querySelector('[data-i="' + i + '"]').classList.toggle('err', !!bad); return !!bad; }
  function markDischarged(cond) {
    var t = stage.querySelectorAll('.pf-tag')[1];
    if (t) { t.textContent = 'Discharged'; t.style.cssText = 'background:#e9ecef;color:#1a1a1a'; } // grey pill (ESTIMATED, Figma has no discharged state)
    if (cond) setV('Admission Details', 5, cond);
  }
  function qty() { return parseInt(String(cur.el.querySelector('[data-i="2"]').value).replace(/[^0-9]/g, ' ').trim().split(' ')[0], 10) || 0; }

  function confirm() {
    var k = cur.kind, bad;
    if (k === 'edit') {
      bad = [flag(0, !val(0)), flag(1, val(1) && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val(1)))];
      if (bad[0] || bad[1]) { toast(bad[0] ? 'Phone number is required' : 'Enter a valid email address'); return; }
      setV('Contact & Address', 0, val(0)); setV('Contact & Address', 1, val(1)); setV('Contact & Address', 2, val(4));
      setV('Emergency Contact', 0, val(2)); setV('Emergency Contact', 2, val(3)); setV('Health History & Reason', 0, val(5));
      close(); toast('Patient details saved (in memory only)');
    } else if (k === 'transfer') {
      bad = [0, 1, 2, 3].map(function (i) { return flag(i, !val(i)); });
      if (bad.indexOf(true) > -1) { toast('Fill in the department, doctor, ward and bed'); return; }
      setV('Admission Details', 0, val(0)); setV('Admission Details', 1, val(1)); setV('Admission Details', 2, val(2)); setV('Admission Details', 3, val(3));
      close(); toast('Patient transferred to ' + val.call ? 'Patient transferred (in memory only)' : '');
    } else if (k === 'discharge') {
      bad = [flag(0, !val(0)), flag(1, !val(1))];
      if (bad[0] || bad[1]) { toast('Discharge date and condition are required'); return; }
      var c = val(1); markDischarged(c); close(); toast('Patient discharged (in memory only)');
    } else if (k === 'pharmacy') {
      var n = qty(), okq = n > 0 && n <= stock;
      flag(2, !okq);
      if (!okq) { toast(n > stock ? 'Only ' + stock + ' tablets in stock' : 'Enter a quantity to dispense'); return; }
      stock -= n; close(); toast('Dispensed ' + n + ' tablets \u00b7 ' + stock + ' remain in stock (in memory only)');
    } else {
      bad = [flag(0, !val(0)), flag(2, !val(2))];
      if (bad[0] || bad[1]) { toast('Final diagnosis and discharge date are required'); return; }
      var c2 = val(1); markDischarged(c2); close(); toast('Discharge summary saved (in memory only)');
    }
  }

  stage.addEventListener('click', function (e) {
    if (e.target.closest('[data-pclose]')) { close(); return; }
    if (e.target.closest('#pmok')) { confirm(); return; }
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var a = b.dataset.act;
    if (a === 'edit' || a === 'transfer' || a === 'discharge' || a === 'pharmacy' || a === 'summary') open(a);
  });
  stage.addEventListener('input', function (e) {
    if (!cur || cur.kind !== 'pharmacy' || e.target.getAttribute('data-i') !== '2') return;
    var n = qty(), bx = document.getElementById('pmbx'), bt = document.getElementById('pmbt'), b = document.getElementById('pmb');
    var over = n > stock;
    b.classList.toggle('err', over);
    bt.textContent = over ? '\u2715 Not enough stock' : '\u2713 Stock available';
    bx.textContent = over ? 'Only ' + stock + ' tablets are on hand.' : stock + ' tablets on hand. After dispensing, ' + (stock - n) + ' tablets remain in the Pharmacy stock.';
  });
  stage.addEventListener('keydown', function (e) {
    if (cur && e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); confirm(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cur) close(); });
})();
