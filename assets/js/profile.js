// Patient profile page builder. Layout = Figma 459:680 measurements (frame-local coordinates, see assets/css/profile.css).
// URL: profile.html?id=PT-99213. Content: HIS.profiles (data-profiles.js). Patients without a Figma profile (saved from the registration forms) get a fallback built from their record, with "\u2014" for unknown fields.
(function () {
  const D = '\u2014';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stage = document.getElementById('stage');
  const id = new URLSearchParams(location.search).get('id') || 'PT-99213';
  const all = HIS.patients.slice();
  try { JSON.parse(localStorage.getItem('mh_regs_extra') || '[]').forEach(p => all.unshift(p)); } catch (e) { /* ignore bad data */ }
  const pat = all.find(p => p.id === id);
  const ini = n => String(n || '?').trim().split(/\s+/).filter(Boolean).map((w, i, a) => (i === 0 || i === a.length - 1) ? w[0] : '').join('').toUpperCase();

  function fallback(p) {
    return {
      name: p.name, ini: ini(p.name), meta: p.id + ' \u00b7 ' + (p.age ? p.age + ' yrs' : D) + ' \u00b7 ' + p.type,
      tags: [[p.type, p.type === 'Inpatient' ? 'o' : 'g2'], [p.status, 'g']],
      personal: [['Full Name', p.name], ['Date of Birth', D], ['Gender', D], ['Civil Status', D], ['Blood Type', D]],
      contact: [['Phone', D], ['Email', D], ['Address', D]],
      emergency: [['Name', D], ['Relationship', D], ['Contact Number', D]],
      health: [['Existing Conditions', D], ['Reason for Registration', D], ['Additional Notes', D]],
      registration: [['Registered By', D], ['Registered At', p.registered || D], ['Patient Type', p.type]],
      admission: [['Department', p.dept || D], ['Assigned Doctor', p.doctor || D], ['Ward', D], ['Bed Number', D], ['Admission Date', D], ['Condition', p.status || D]]
    };
  }

  let P = (HIS.profiles || {})[id];
  if (!P && pat) P = fallback(pat);
  if (!P) {
    stage.innerHTML = "<a class='pf-back' href='registration.html'>\u2190 Back to Registry</a><section class='pf-card' style='left:118.344px;top:123.133px;width:1202.4px;height:94.355px;padding:36px 26px;font:600 16px var(--font-inter)'>Patient not found</section>";
    document.title = 'Patient not found \u00b7 MediHeal';
    return;
  }
  document.title = P.name + ' \u00b7 Patient profile \u00b7 MediHeal';
  const hasTh = !!(P.treatment && P.treatment.length);
  if (hasTh) stage.classList.add('has-th');

  // rows: first row at 63.46, 35.07 high, last 34.235 (no border); pass heights to override (Figma gives taller rows for Address and Health History)
  function rows(list, hs) {
    let top = 63.46, out = '';
    list.forEach((r, i) => {
      const last = i === list.length - 1;
      const h = hs ? hs[i] : (last ? 34.235 : 35.07);
      out += "<div class='pf-row" + (last ? ' last' : '') + "' style='top:" + top.toFixed(3) + 'px;height:' + h + "px'><span class='pf-l'>" + esc(r[0]) + "</span><span class='pf-v'>" + esc(r[1]) + '</span></div>';
      top += h;
    });
    return out;
  }
  const card = (cls, l, t, w, h, ic, title, inner) =>
    "<section class='pf-card " + cls + "' style='left:" + l + 'px;top:' + t + 'px;width:' + w + 'px;height:' + h + "px'><div class='pf-ch'><i class='pf-ic'><span>" + ic + "</span></i><b class='pf-h3'>" + esc(title) + '</b></div>' + inner + '</section>';

  const TAG = { o: 'background:#fdeee0;color:#b6641b', g: 'background:#e6f6ec;color:#1a8a4a', g2: 'background:#d8ffd3;color:#084d02' };
  const tip = 'Opens a modal state frame in Figma; not built yet';
  // [label, left, width, text padding-left, action]
  const hb = [['Edit', 705.999, 64, 20, 'edit'], ['Transfer', 779.999, 88, 14.4, 'transfer'], ['Discharge', 877.999, 96, 14.4, 'discharge'], ['\u{1FAAA} ' + id, 983.615, 110.611, 14.4, 'id'], ['\u{1F5A8} Print', 1104.664, 71.849, 14.4, 'print']];

  let h = "<a class='pf-back' href='registration.html'>\u2190 Back to Registry</a>";
  h += "<section class='pf-card pf-head' style='left:118.344px;top:123.133px;width:1202.4px;height:94.355px'>" +
    "<div class='pf-av'>" + esc(P.ini) + '</div><h1 class=\'pf-name\'>' + esc(P.name) + '</h1>' +
    "<div class='pf-tags'>" + P.tags.map(t => "<span class='pf-tag' style='" + (TAG[t[1]] || TAG.g) + "'>" + esc(t[0]) + '</span>').join('') + "<span class='pf-meta'>" + esc(P.meta) + '</span></div>' +
    hb.map(b => "<button class='pf-btn' data-act='" + b[4] + "' style='left:" + b[1] + 'px;width:' + b[2] + 'px;padding-left:' + b[3] + "px'" + (['edit', 'transfer', 'discharge'].includes(b[4]) ? " title='" + tip + "'" : '') + '>' + esc(b[0]) + '</button>').join('') +
    '</section>';
  h += card('', 118.344, 236.277, 389.658, 257.5975, '\u{1F464}', 'Personal Information', rows(P.personal));
  h += card('', 524.7, 236.277, 389.658, 257.5975, '\u2709\uFE0F', 'Contact & Address', rows(P.contact, [35.07, 35.07, 51.77]));
  h += card('', 931.072, 236.277, 389.658, 257.5975, '\u{1F4C7}', 'Emergency Contact', rows(P.emergency));
  h += card('pf-w', 118.344, 510.574, 592.85, 240.0625, '\u{1F90D}', 'Health History & Reason', rows(P.health, [52.605, 52.605, 51.77]));
  h += card('pf-w', 118.344, 767.336, 592.85, 187.4575, '\u{1F6E1}\uFE0F', 'Registration Record', rows(P.registration));
  h += card('pf-w', 727.893, 510.574, 592.85, 444.22, '\u{1F6CF}\uFE0F', 'Admission Details', rows(P.admission));
  if (hasTh) {
    const tb = [['Pharmacy', 760, 90, 'pharmacy'], ['Discharge summary', 860, 150, 'summary'], ['View treatment plan', 1030, 150, 'plan']];
    const btns = tb.map(b => "<button class='pf-btn' data-act='" + b[3] + "' style='top:14px;left:" + b[1] + 'px;width:' + b[2] + "px'" + (b[3] === 'plan' ? '' : " title='" + tip + "'") + '>' + b[0] + '</button>').join('');
    h += card('pf-th', 118.345, 971.586, 1202.4, 300, '\u{1F4CB}', 'Treatment History', rows(P.treatment) + btns);
  }
  stage.innerHTML = h;

  // Prototype links read in session 6: back link 459:697 -> Registration 23:2285; View treatment plan 2047:24708 -> Treatment Plan 2047:17739 (treatment.html is still a stub).
  // Edit 2027:2439 -> 2027:2458, Transfer 2027:2441 -> 2027:2643, Discharge 2027:2443 -> 2027:2828, Pharmacy 2047:26511 -> 2047:25913, Discharge summary 2047:25312 -> 2047:25314 are modal/state frames NOT built yet.
  // Print has no Figma link read; window.print() is an addition.
  stage.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'print') window.print();
    else if (b.dataset.act === 'plan') location.href = 'treatment.html';
  });
})();
