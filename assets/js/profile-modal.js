// Patient profile action modals as JS states of profile.html (loaded after profile.js; hooks the header buttons by event delegation).
// Figma: Edit patient details 2027:2458 (modal 2027:2615), Transfer patient 2027:2643 (2027:2800), Discharge patient 2027:2828 (2027:2985): modal 680x568 at frame-local (380,192).
// Pharmacy dispense and Discharge summary moved to the Treatment Plan page (treatment.js, session 19); the old code here was deleted in session 20.
// Texts are the Figma texts for Isabel Geliz V. Ramos (PT-99213). For other patients the fields are prefilled from the profile on screen (Edit) or left blank (Transfer/Discharge notes).
// Session 20: saved changes persist in this browser under localStorage key `mh_profile_edits` ({ <patient id>: { v: [[card title, row, value], ...], dis: condition } }) and are re-applied on load.
(function () {
  var stage = document.getElementById('stage');
  if (!stage || !stage.querySelector('.pf-name')) return;
  var D = '\u2014';
  var KEY = 'mh_profile_edits';
  var id = new URLSearchParams(location.search).get('id') || 'PT-99213';
  var isG = id === 'PT-99213';
  var cur = null;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  // The buttons carried a "not built yet" tooltip from profile.js; these modals replace it.
  Array.prototype.forEach.call(stage.querySelectorAll('[data-act="edit"],[data-act="transfer"],[data-act="discharge"],[data-act="print"]'), function (b) { b.removeAttribute('title'); });

  function card(t) { return Array.prototype.filter.call(stage.querySelectorAll('.pf-card'), function (c) { var h = c.querySelector('.pf-h3'); return h && h.textContent.trim() === t; })[0]; }
  function rowEl(t, i) { var c = card(t); return c ? c.querySelectorAll('.pf-row')[i] : null; }
  function getV(t, i) { var r = rowEl(t, i), v = r ? r.querySelector('.pf-v').textContent.trim() : ''; return v === D ? '' : v; }
  function setV(t, i, v) { var r = rowEl(t, i); if (r) r.querySelector('.pf-v').textContent = v === '' ? D : v; }
  function sub() { return stage.querySelector('.pf-name').textContent.trim() + ' \u00b7 ' + id + ' \u00b7 ' + ((stage.querySelector('.pf-tag') || {}).textContent || '').trim(); }

  // Print profile (Figma 4011:3773) writes the record as it is on screen, so saved edits are included.
  function profileRows() {
    var rows = [[stage.querySelector('.pf-name').textContent.trim(), 15, 22], [((stage.querySelector('.pf-meta') || {}).textContent || '').trim(), 10, 15], ['', 10, 12]];
    Array.prototype.forEach.call(stage.querySelectorAll('.pf-card'), function (c) {
      var h = c.querySelector('.pf-h3');
      if (h) rows.push([h.textContent.trim().toUpperCase(), 11, 16]);
      Array.prototype.forEach.call(c.querySelectorAll('.pf-row'), function (r) {
        var l = r.querySelector('.pf-l'), v = r.querySelector('.pf-v');
        if (v) rows.push([(l ? l.textContent.trim() + ': ' : '') + v.textContent.trim(), 10, 14]);
      });
      rows.push(['', 10, 10]);
    });
    rows.push(['Printed Aug 31, 2026 by the front desk.', 9, 13]);
    return rows;
  }

  // ---- persistence (localStorage, own key; never touches mh_regs_extra / mh_appts_extra) ----
  function loadAll() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function persist(fn) { try { var all = loadAll(), r = all[id] || (all[id] = {}); fn(r); localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* storage blocked: keep the change in memory only */ } }
  function sv(t, i, v) {
    setV(t, i, v);
    persist(function (r) { r.v = (r.v || []).filter(function (x) { return !(x[0] === t && x[1] === i); }); r.v.push([t, i, v]); });
  }
  function markDischarged(cond) {
    var t = stage.querySelectorAll('.pf-tag')[1];
    if (t) { t.textContent = 'Discharged'; t.style.cssText = 'background:#e9ecef;color:#1a1a1a'; } // grey pill (ESTIMATED, Figma has no discharged state)
    if (cond) setV('Admission Details', 5, cond);
  }
  (function applySaved() {
    var r = loadAll()[id];
    if (!r) return;
    (r.v || []).forEach(function (x) { setV(x[0], x[1], x[2]); });
    if (r.dis) markDischarged(r.dis.cond);
  })();

  // [label top, input top, left, width]; the modals end with a textarea at 388
  var POS = [[120, 142, 32, 300], [120, 142, 348, 300], [202, 224, 32, 300], [202, 224, 348, 300], [284, 306, 32, 616], [366, 388, 32, 616]];

  function spec(kind) {
    if (kind === 'print') return { title: 'Print profile', sub: 'Patient record \u00b7 Demographics, contact and registration', ok: 'Print', f: [
      ['Printer', 'Front desk printer'], ['Copies', '1'], ['Paper size', 'A4'], ['Orientation', 'Portrait'],
      ['Include', 'Demographics, contact, registration and medical history'],
      ["Doctor's notes and plan", isG ? 'Order troponin and 2D echo. Avoid penicillin.' : 'Follow the recorded treatment plan.']
    ] };
    if (kind === 'edit') return { title: 'Edit patient details', sub: sub(), ok: 'Save changes', f: [
      ['Phone number', getV('Contact & Address', 0)], ['Email address', getV('Contact & Address', 1)],
      ['Emergency contact', getV('Emergency Contact', 0)], ['Emergency contact number', getV('Emergency Contact', 2)],
      ['Street address', getV('Contact & Address', 2)], ['Existing conditions / allergies', getV('Health History & Reason', 0)]] };
    if (kind === 'transfer') return { title: 'Transfer patient', sub: sub(), ok: 'Confirm transfer', f: [
      ['Transfer to department', 'General Medicine'], ['Receiving doctor', 'Dr. Yumie Pasiol'], ['Ward', 'General Medicine Ward'], ['Bed number', isG ? 'G-14' : ''],
      ['Reason for transfer', isG ? 'Cardiac work-up complete; continue care in General Medicine' : ''],
      ['Notes for the receiving team', isG ? 'Diabetic and hypertensive. Monitor BP and glucose every 4 hours.' : '']] };
    return { title: 'Discharge patient', sub: sub(), ok: 'Confirm discharge', f: [
      ['Discharge date', 'Aug 31, 2026'], ['Condition at discharge', 'Stable'],
      ['Follow-up date', isG ? 'Sep 14, 2026' : ''], ['Follow-up doctor', isG ? 'Dr. Laurice Laureta' : ''],
      ['Discharge diagnosis', isG ? 'Angina pectoris, controlled' : ''],
      ['Discharge summary and instructions', isG ? 'Continue medication. Low-salt diet. Return if chest pain recurs.' : '']] };
  }

  function open(kind) {
    close();
    var s = spec(kind);
    var h = "<div class='pm-scrim' data-pclose='1'></div><div class='pm-modal' role='dialog' aria-modal='true' aria-label='" + esc(s.title) + "' style='top:192px;height:568px'>";
    h += "<button class='pm-x' data-pclose='1' aria-label='Close'>\u00d7</button><div class='pm-t'>" + esc(s.title) + "</div><div class='pm-s'>" + esc(s.sub) + "</div><div class='pm-d'></div>";
    POS.forEach(function (p, i) {
      h += "<div class='pm-l' style='top:" + p[0] + 'px;left:' + p[2] + "px'>" + esc(s.f[i][0]) + '</div>';
      if (i === 5) h += "<textarea class='pm-i pm-ta' data-i='5' style='top:" + p[1] + 'px;left:' + p[2] + 'px;width:' + p[3] + "px'>" + esc(s.f[i][1]) + '</textarea>';
      else h += "<input class='pm-i' data-i='" + i + "' value='" + esc(s.f[i][1]) + "' style='top:" + p[1] + 'px;left:' + p[2] + 'px;width:' + p[3] + "px'>";
    });
    h += "<button class='pm-c' data-pclose='1' style='top:504px'>Cancel</button><button class='pm-ok' id='pmok' style='top:504px'>" + esc(s.ok) + '</button>';
    h += '</div>';
    var w = document.createElement('div'); w.id = 'pmodal'; w.innerHTML = h; stage.appendChild(w);
    cur = { kind: kind, el: w };
    var f = w.querySelector('.pm-i'); if (f) f.focus({ preventScroll: true });
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

  function confirm() {
    var k = cur.kind, bad;
    if (k === 'print') { HIS.pdf.save(profileRows(), id + '_profile.pdf'); close(); toast('Profile saved as ' + id + '_profile.pdf'); return; }
    if (k === 'edit') {
      bad = [flag(0, !val(0)), flag(1, val(1) && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val(1)))];
      if (bad[0] || bad[1]) { toast(bad[0] ? 'Phone number is required' : 'Enter a valid email address'); return; }
      sv('Contact & Address', 0, val(0)); sv('Contact & Address', 1, val(1)); sv('Contact & Address', 2, val(4));
      sv('Emergency Contact', 0, val(2)); sv('Emergency Contact', 2, val(3)); sv('Health History & Reason', 0, val(5));
      close(); toast('Patient details saved');
    } else if (k === 'transfer') {
      bad = [0, 1, 2, 3].map(function (i) { return flag(i, !val(i)); });
      if (bad.indexOf(true) > -1) { toast('Fill in the department, doctor, ward and bed'); return; }
      var dep = val(0);
      sv('Admission Details', 0, dep); sv('Admission Details', 1, val(1)); sv('Admission Details', 2, val(2)); sv('Admission Details', 3, val(3));
      close(); toast('Patient transferred to ' + dep);
    } else {
      bad = [flag(0, !val(0)), flag(1, !val(1))];
      if (bad[0] || bad[1]) { toast('Discharge date and condition are required'); return; }
      var c = val(1); markDischarged(c); persist(function (r) { r.dis = { cond: c }; }); close(); toast('Patient discharged');
    }
  }

  stage.addEventListener('click', function (e) {
    if (e.target.closest('[data-pclose]')) { close(); return; }
    if (e.target.closest('#pmok')) { confirm(); return; }
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var a = b.dataset.act;
    if (a === 'edit' || a === 'transfer' || a === 'discharge' || a === 'print') open(a);
  });
  stage.addEventListener('keydown', function (e) {
    if (cur && e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); confirm(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cur) close(); });
})();
