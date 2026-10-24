// Departments: ONE template. List (Figma 351:501) and the 8 detail frames are JS states (URL hash #cardiology, #neurology ...).
// List card -> detail links read in session 7 (get_reactions): Cardiology 351:565 -> 351:733, Neurology 351:607 -> 4001:5402, Orthopaedics 351:649 -> 4001:5513, OB-GYN 351:691 -> 4001:5764,
// General Medicine 4028:8827 -> 4030:8995, Nursing 4028:8869 -> 4030:9129, Laboratory 4028:8911 -> 4030:9263, Pharmacy 4028:8953 -> 4030:9397. Search box 351:537 -> 4005:3317 ("Cardio" search state, NOT read yet;
// the search box here is a live filter instead, an addition). Add doctor 4001:5875 (state frame, NOT read yet; button shows a tooltip). Detail back button goes to the list.
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stage = document.getElementById('stage');
  const D = HIS.departments;
  const S = (inner, w, h, c, sw) => "<svg width='" + w + "' height='" + h + "' viewBox='0 0 24 24' fill='none' stroke='" + c + "' stroke-width='" + sw + "' stroke-linecap='round' stroke-linejoin='round'>" + inner + '</svg>';
  const ICO = {
    search: S("<circle cx='11' cy='11' r='7'/><path d='m20 20-3.5-3.5'/>", 15, 15, '#9aa6b3', 2),
    back: S("<path d='M19 12H5M12 19l-7-7 7-7'/>", 17, 17, '#152d47', 2),
    plus: (s, c) => S("<path d='M12 5v14M5 12h14'/>", s, s, c, 2.4)
  };
  const search = v => "<div class='dp-search'>" + ICO.search + "<input id='dpq' type='text' placeholder='Search records...' value='" + esc(v || '') + "' aria-label='Search'></div>";
  const tagHtml = a => a.map(t => "<span class='dp-tag'>" + esc(t) + '</span>').join('');
  const tip = 'Opens a state frame in Figma; not built yet';

  function renderList(q) {
    document.title = 'Departments \u00b7 MediHeal';
    stage.className = 'stage dp';
    const tot = D.reduce((a, d) => ({ doc: a.doc + d.doctors, nur: a.nur + d.nurses, beds: a.beds + d.beds, occ: a.occ + d.occ }), { doc: 0, nur: 0, beds: 0, occ: 0 });
    const stats = [['Total departments', D.length, 'Departments listed'], ['Total doctors', tot.doc, 'Across ' + D.length + ' departments'], ['Nursing staff', tot.nur, 'Across ' + D.length + ' departments'], ['Total beds', tot.beds, tot.occ + ' occupied']];
    let h = "<h1 class='dp-title'>Departments</h1><div class='dp-sub'>Monday, August 31, 2026</div>" + search(q);
    stats.forEach((s, i) => { h += "<div class='dp-stat' style='left:" + [32, 380.5, 729, 1077.5][i] + "px'><span class='l'>" + s[0] + "</span><span class='n'>" + s[1] + "</span><span class='s'>" + s[2] + '</span></div>'; });
    D.forEach(d => {
      const minis = [[d.doctors, 'Doctors'], [d.nurses, 'Nurses'], [d.opd, 'OPD today'], [d.occ + '/' + d.beds, 'Beds']];
      h += "<section class='dp-card' data-slug='" + d.slug + "' data-t='" + esc((d.name + ' ' + d.head + ' ' + d.tags.join(' ')).toLowerCase()) + "' tabindex='0'>" +
        "<i class='dp-ic'>" + ICO.plus(17, '#1a5379') + '</i>' +
        "<b class='dp-name'>" + esc(d.name) + "</b><span class='dp-doc'>" + esc(d.head) + '</span>' +
        "<b class='dp-rev'>" + esc(d.rev) + "</b><span class='dp-revl'>Aug revenue</span>" +
        minis.map((m, i) => "<div class='dp-mini' style='left:" + (24 + i * 160) + "px'><b>" + m[0] + '</b><i>' + m[1] + '</i></div>').join('') +
        "<span class='dp-ol'>Bed occupancy</span><b class='dp-op'>" + d.pct + "%</b>" +
        "<div class='dp-track'><span class='dp-fill' style='width:" + (d.pct * 6.3).toFixed(1) + "px'></span></div>" +
        "<div class='dp-tags'>" + tagHtml(d.tags) + '</div></section>';
    });
    h += "<div class='dp-empty' hidden>No departments match your search</div>";
    stage.innerHTML = h;
    layoutList(q || '');
    const inp = document.getElementById('dpq');
    inp.addEventListener('input', () => layoutList(inp.value));
  }

  function layoutList(q) {
    q = q.trim().toLowerCase();
    let n = 0;
    stage.querySelectorAll('.dp-card').forEach(c => {
      const ok = !q || c.dataset.t.indexOf(q) > -1;
      c.hidden = !ok;
      if (ok) { c.style.left = (n % 2 ? 730 : 32) + 'px'; c.style.top = (335.8 + Math.floor(n / 2) * 255.8).toFixed(1) + 'px'; n++; }
    });
    stage.querySelector('.dp-empty').hidden = n > 0;
  }

  function renderDetail(d) {
    document.title = d.dname + ' \u00b7 Departments \u00b7 MediHeal';
    stage.className = 'stage dp dt';
    const stats = [[d.doctors, 'Doctors'], [d.nurses, 'Nurses'], [d.opd, 'OPD today'], [d.occ + '/' + d.beds, 'Beds']];
    let h = "<button class='dp-back' aria-label='Back to Departments' data-act='back'>" + ICO.back + '</button>' +
      "<h1 class='dp-title'>" + esc(d.dname) + "</h1><div class='dp-sub'>" + esc(d.head + ' \u00b7 ' + d.role) + '</div>' + search('');
    stats.forEach((s, i) => { h += "<div class='dp-card dd-stat' style='left:" + [32, 380.5, 729, 1077.5][i] + "px'><span class='n'>" + s[0] + "</span><span class='l'>" + s[1] + "</span><span class='p'>" + ICO.plus(12, '#1a5379') + '</span></div>'; });
    h += "<div class='dp-occ'><span class='ol'>Bed occupancy</span><b class='op'>" + d.pct + "%</b><div class='tr'><span class='dp-fill' style='width:" + (d.pct * 13.28).toFixed(1) + "px'></span></div><div class='tg'>" + tagHtml(d.dtags || d.tags) + '</div></div>';
    h += "<section class='dp-duty' style='height:" + (87 + 60 * d.rows.length) + "px'><span class='dp-dl'>" + esc(d.duty.toUpperCase()) + "</span><button class='dp-add' data-act='add' title='" + tip + "'>" + esc(d.add) + '</button>';
    d.rows.forEach((r, i) => {
      h += "<div class='dp-row' data-t='" + esc((r[1] + ' ' + r[2]).toLowerCase()) + "' style='top:" + (73.2 + 60 * i).toFixed(1) + "px'><div class='dp-av'><span>" + esc(r[0]) + "</span></div><b class='dp-dn'>" + esc(r[1]) + "</b><span class='dp-dm'>" + esc(r[2]) + "</span><span class='dp-badge'>On duty</span></div>";
    });
    h += '</section>';
    stage.innerHTML = h;
    const inp = document.getElementById('dpq');
    inp.addEventListener('input', () => {
      const q = inp.value.trim().toLowerCase();
      let n = 0;
      stage.querySelectorAll('.dp-row').forEach(r => { const ok = !q || r.dataset.t.indexOf(q) > -1; r.hidden = !ok; if (ok) { r.style.top = (73.2 + 60 * n).toFixed(1) + 'px'; n++; } });
      stage.querySelector('.dp-duty').style.height = (87 + 60 * Math.max(n, 1)) + 'px';
    });
  }

  function route() {
    const slug = decodeURIComponent(location.hash.replace(/^#/, ''));
    const d = D.find(x => x.slug === slug);
    if (d) renderDetail(d); else renderList('');
    window.scrollTo(0, 0);
  }
  stage.addEventListener('click', e => {
    const card = e.target.closest('.dp-card[data-slug]');
    if (card) { location.hash = card.dataset.slug; return; }
    if (e.target.closest('[data-act=back]')) { history.length > 1 && location.hash ? history.back() : (location.hash = ''); }
  });
  stage.addEventListener('keydown', e => { const c = e.target.closest && e.target.closest('.dp-card[data-slug]'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); location.hash = c.dataset.slug; } });
  window.addEventListener('hashchange', route);
  route();
})();
