// Outpatient registration form (Figma 420:1434, frame origin 1600,39600, 1440x2676). Same engine as reg-form.js (Inpatient); sections, summary and saved record differ.
// Dropdown option lists are NOT in Figma (it only shows "Please select"); see GITHUBPROGRESS.md. Engine is duplicated from reg-form.js on purpose (refactor into one shared engine later).
(function () {
  const $ = id => document.getElementById(id);
  const CH = "<svg viewBox='0 0 24 24' fill='none' stroke='#8aa4b6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='m6 9 6 6 6-6'/></svg>"; // est: chevron colour
  const IC = {
    user: "<path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/>",
    heart: "<path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/>",
    bed: "<path d='M2 4v16'/><path d='M2 8h18a2 2 0 0 1 2 2v10'/><path d='M2 17h20'/><path d='M6 8v9'/>",
    phone: "<path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/>",
    shield: "<path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/>",
    walk: "<circle cx='12' cy='5' r='2'/><path d='M12 7v8M9 22l3-7 3 7M8 11h8'/>",
    cal: "<rect x='3' y='4' width='18' height='18' rx='2'/><path d='M16 2v4M8 2v4M3 10h18'/>",
    calcheck: "<rect x='3' y='4' width='18' height='18' rx='2'/><path d='M16 2v4M8 2v4M3 10h18'/><path d='m9 16 2 2 4-4'/>",
    back: "<path d='m12 19-7-7 7-7'/><path d='M19 12H5'/>",
    check: "<path d='M20 6 9 17l-5-5'/>"
  };
  const ico = (n, s, c, w) => "<svg width='" + s + "' height='" + s + "' viewBox='0 0 24 24' fill='none' stroke='" + c + "' stroke-width='" + (w || 2) + "' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>" + IC[n] + '</svg>';

  const GENDER = ['Female', 'Male'];
  const CIVIL = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'];
  const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const KINDS = HIS.apptKinds.filter(k => k !== 'Inpatient Admission'); // est: Figma shows only "Please select"
  // est: department -> doctor pairs taken from HIS.patients; Dr. Elsie Chen (Chief Physician) can attend any department; unmapped departments list every doctor
  const DEPT_DOC = { Cardiology: 'Dr. Laurice Laureta', Orthopedics: 'Dr. Marc Laureta', Pediatrics: 'Dr. Paolo Tipay', Neurology: 'Dr. Jeremias Esperanza', 'General Medicine': 'Dr. Yumie Pasiol' };
  const doctorsFor = d => DEPT_DOC[d] ? [DEPT_DOC[d], 'Dr. Elsie Chen'] : HIS.doctors;
  const TIME = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;

  // r = required: red asterisk (#e05252) after the label. Every label is Inter SemiBold 13 #0e2a3f (get_styled_text_segments on 420:1624).
  const SECS = [
    { top: 334.2, h: 565.8, icon: 'user', title: 'Personal Information', sub: 'Basic identity and contact details of the patient', sw: 276.8, rows: [
      { c: 3, h: 93.6, f: [{ k: 'first', l: 'First Name', r: 1, ph: 'Enter first name' }, { k: 'mi', l: 'Middle Initial', ph: 'e.g. R', hint: 'Optional' }, { k: 'last', l: 'Last Name', r: 1, ph: 'Enter last name' }] },
      { c: 3, h: 67.6, f: [{ k: 'gender', l: 'Gender', r: 1, sel: GENDER }, { k: 'dob', l: 'Date of Birth', r: 1, ph: 'dd/mm/yyyy' }, { k: 'civil', l: 'Civil Status', sel: CIVIL }] },
      { c: 3, h: 67.6, f: [{ k: 'blood', l: 'Blood Type', sel: BLOOD }, { k: 'phone', l: 'Phone Number', r: 1, ph: '+63 9XX XXX XXXX' }, { k: 'email', l: 'Email Address', ph: 'example@example.com' }] },
      { c: 2, h: 67.6, f: [{ k: 'street', l: 'Street Address', ph: 'House no., street, barangay' }, { k: 'city', l: 'City', ph: 'Enter city' }] },
      { c: 2, h: 67.6, f: [{ k: 'prov', l: 'Province', ph: 'Enter province' }, { k: 'zip', l: 'ZIP Code', ph: 'Enter ZIP code' }] }
    ] },
    { top: 920, h: 525, icon: 'heart', title: 'Health History & Reason', sub: 'Medical background and the reason for this registration', sw: 327.8, rows: [
      { c: 2, h: 191.6, f: [{ k: 'cond', l: 'Existing Conditions / Allergies', ta: 1, ph: 'e.g. Hypertension, diabetic, penicillin allergy...', hint: 'Past illnesses, chronic conditions, known allergies' }, { k: 'reason', l: 'Reason for Registration', r: 1, ta: 1, ph: 'Describe the main complaint or purpose of visit' }] },
      { c: 1, h: 191.6, f: [{ k: 'notes', l: 'Additional Notes', ta: 1, ph: 'Any other information the doctor or nurse should know', hint: 'Optional remarks for the care team' }] }
    ] },
    { top: 1465, h: 556.2, icon: 'calcheck', title: 'Appointment & Vitals', sub: 'Clinic schedule plus the vital signs recorded at the front desk', sw: 355.6, rows: [
      { c: 3, h: 93.6, f: [{ k: 'dept', l: 'Department', r: 1, sel: HIS.departments }, { k: 'doctor', l: 'Attending Doctor', r: 1, sel: HIS.doctors, hint: 'Select a department first to narrow options' }, { k: 'atype', l: 'Appointment Type', r: 1, sel: KINDS }] },
      { c: 3, h: 93.6, f: [{ k: 'adate', l: 'Appointment Date', r: 1, ph: 'dd/mm/yyyy' }, { k: 'atime', l: 'Time Slot', r: 1, ph: '--:-- --', hint: 'e.g. 10:30 AM' }] },
      { c: 3, h: 93.6, f: [{ k: 'bp', l: 'Blood Pressure', ph: 'e.g. 120/80', hint: 'mmHg' }, { k: 'temp', l: 'Temperature', ph: 'e.g. 36.8', hint: '\u00b0C' }, { k: 'wt', l: 'Weight', ph: 'e.g. 64', hint: 'kg' }] },
      { c: 3, h: 93.6, f: [{ k: 'ht', l: 'Height', ph: 'e.g. 168', hint: 'cm' }] }
    ] },
    { top: 2041.2, h: 277, icon: 'phone', title: 'Emergency Contact', sub: 'Person to notify in case of an emergency', sw: 241, rows: [
      { c: 3, h: 67.6, f: [{ k: 'efirst', l: 'First Name', ph: 'Enter first name' }, { k: 'elast', l: 'Last Name', ph: 'Enter last name' }, { k: 'erel', l: 'Relationship', ph: 'e.g. Spouse, Parent' }] },
      { c: 3, h: 67.6, f: [{ k: 'ephone', l: 'Contact Number', ph: '+63 9XX XXX XXXX' }] }
    ] },
    { top: 2338.2, h: 277, icon: 'shield', title: 'PhilHealth & Insurance', sub: 'Coverage details used when billing this patient', sw: 241, rows: [
      { c: 3, h: 67.6, f: [{ k: 'phid', l: 'PhilHealth ID Number', ph: 'XX-XXXXXXXXX-X' }, { k: 'mtype', l: 'Member Type', ph: 'Member, Dependent, Senior, PWD' }, { k: 'hmo', l: 'HMO / Insurance Provider', ph: 'e.g. Maxicare (optional)' }] },
      { c: 3, h: 67.6, f: [{ k: 'policy', l: 'Policy / Card Number', ph: 'Enter policy or card number (optional)' }] }
    ] }
  ];
  const ALL = SECS.flatMap(s => s.rows.flatMap(r => r.f));

  const fld = f => {
    let h = "<div class='rf-f'><span class='rf-l'>" + f.l + (f.r ? '<i>*</i>' : '') + '</span>';
    if (f.sel) h += "<div class='rf-ctl rf-sel' id='f-" + f.k + "' data-k='" + f.k + "'></div>";
    else if (f.ta) h += "<textarea class='rf-ctl' id='f-" + f.k + "' maxlength='500' aria-label='" + f.l + "' placeholder=\"" + f.ph + "\"></textarea><div class='rf-cc' id='cc-" + f.k + "'>0/500</div>";
    else h += "<input class='rf-ctl' id='f-" + f.k + "' aria-label='" + f.l + "' placeholder='" + f.ph + "' autocomplete='off'>";
    if (f.hint) h += "<div class='rf-hint" + (f.ta ? ' t' : '') + "'>" + f.hint + '</div>';
    return h + '</div>';
  };
  $('secs').innerHTML = SECS.map(s =>
    "<section class='rf-sec' style='top:" + s.top + 'px;height:' + s.h + "px'><div class='rf-h'><div class='rf-hi'>" + ico('' + s.icon, 18, '#fff') + "</div><div><h2 class='rf-ht'>" + s.title + "</h2><p class='rf-hs' style='width:" + s.sw + "px'>" + s.sub + '</p></div></div>' +
    s.rows.map(r => "<div class='rf-row c" + r.c + "' style='height:" + r.h + "px'>" + r.f.map(fld).join('') + '</div>').join('') + '</section>').join('');

  // selects (the doctor list is re-rendered when the department changes)
  const sels = {};
  document.querySelectorAll('.rf-sel').forEach(el => {
    const f = ALL.find(x => x.k === el.dataset.k);
    const o = { value: '', el, opts: f.sel };
    el.innerHTML = "<button type='button' class='rf-sb' aria-haspopup='listbox' aria-expanded='false' aria-label='" + f.l + "'><span class='v'>Please select</span>" + CH + "</button><div class='rf-p' role='listbox'></div>";
    const b = el.querySelector('.rf-sb');
    const p = el.querySelector('.rf-p');
    o.render = list => { o.opts = list; p.innerHTML = list.map((x, i) => "<button type='button' role='option' data-i='" + i + "'>" + x + '</button>').join(''); };
    o.set = v => { o.value = v; el.querySelector('.v').textContent = v || 'Please select'; };
    o.render(f.sel);
    const setOpen = on => { el.classList.toggle('open', on); b.setAttribute('aria-expanded', on ? 'true' : 'false'); };
    b.onclick = e => { e.stopPropagation(); document.querySelectorAll('.rf-sel.open').forEach(d => d !== el && d.classList.remove('open')); setOpen(!el.classList.contains('open')); };
    p.onclick = e => {
      const t = e.target.closest('button'); if (!t) return;
      o.set(o.opts[+t.dataset.i]); el.classList.remove('err'); setOpen(false);
      if (f.k === 'dept') narrow();
      sum();
    };
    el.addEventListener('keydown', e => { if (e.key === 'Escape') { setOpen(false); b.focus(); } });
    sels[f.k] = o;
  });
  document.addEventListener('click', () => document.querySelectorAll('.rf-sel.open').forEach(d => d.classList.remove('open')));
  function narrow() {
    const list = doctorsFor(sels.dept.value);
    sels.doctor.render(list);
    if (sels.doctor.value && list.indexOf(sels.doctor.value) < 0) sels.doctor.set('');
  }

  const val = k => sels[k] ? sels[k].value : $('f-' + k).value.trim();
  const initials = n => n.split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join('');
  const patientName = () => {
    const mi = val('mi').replace(/\./g, '').slice(0, 1).toUpperCase();
    return [val('first'), mi ? mi + '.' : '', val('last')].filter(Boolean).join(' ');
  };
  const fmtTime = s => { const m = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec(s); return m ? (+m[1]) + ':' + m[2] + ' ' + m[3].toUpperCase() : s; };
  function sum() {
    const n = patientName();
    $('s-av').textContent = n ? initials(n) : '?';
    $('s-name').textContent = n || 'New patient';
    $('s-meta').textContent = 'Outpatient \u00b7 Gender ' + (val('gender') || '\u2014');
    const set = (id, v) => { const e = $(id); e.textContent = v || '\u2014'; e.classList.toggle('v', !!v); };
    set('s-dept', val('dept')); set('s-doc', val('doctor')); set('s-appt', val('atype'));
    set('s-sched', [val('adate'), val('atime')].filter(Boolean).join(' \u00b7 '));
  }
  document.querySelectorAll('input.rf-ctl,textarea.rf-ctl').forEach(el => el.addEventListener('input', () => {
    el.classList.remove('err');
    const cc = $('cc-' + el.id.slice(2)); if (cc) cc.textContent = el.value.length + '/500';
    sum();
  }));

  const parseDMY = s => {
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s); if (!m) return null;
    const d = new Date(+m[3], +m[2] - 1, +m[1]);
    return d.getFullYear() === +m[3] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[1] ? d : null;
  };
  const today = HIS.today instanceof Date ? HIS.today : new Date(2026, 7, 31);
  $('chip').textContent = 'Today \u00b7 ' + HIS.fmtShort(today);

  $('confirm').onclick = () => {
    let first = null;
    const bad = el => { el.classList.add('err'); if (!first) first = el; };
    ALL.forEach(f => {
      if (!f.r) return;
      const el = $('f-' + f.k), v = val(f.k);
      if (!v) bad(el);
      else if (f.k === 'dob' && (!parseDMY(v) || parseDMY(v) > today)) bad(el); // added rule: not in the future
      else if (f.k === 'adate' && (!parseDMY(v) || parseDMY(v) < today)) bad(el); // added rule: today or later
      else if (f.k === 'atime' && !TIME.test(v)) bad(el); // added rule: h:mm AM/PM
    });
    if (val('email') && !/^\S+@\S+\.\S+$/.test(val('email'))) bad($('f-email'));
    if (first) { (first.querySelector ? (first.querySelector('button') || first) : first).focus(); first.scrollIntoView({ block: 'center' }); return; }
    const dob = parseDMY(val('dob'));
    let age = today.getFullYear() - dob.getFullYear();
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;
    let extra = [];
    try { extra = JSON.parse(localStorage.getItem('mh_regs_extra') || '[]'); } catch (e) { extra = []; }
    const maxId = Math.max.apply(null, HIS.patients.map(p => +p.id.slice(3)).concat(extra.map(p => +p.id.slice(3))));
    const rec = {
      name: patientName(), id: 'PT-' + (maxId + 1), age, type: 'Outpatient', dept: val('dept'), doctor: val('doctor'),
      registered: HIS.fmtShort(today) + ' \u00b7 ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Waiting', attention: true, // waiting patients count as Needs Attention (same as the seeded Waiting row)
      details: { gender: val('gender'), dob: val('dob'), civil: val('civil'), blood: val('blood'), phone: val('phone'), email: val('email'), street: val('street'), city: val('city'), province: val('prov'), zip: val('zip'),
        conditions: val('cond'), reason: val('reason'), notes: val('notes'),
        appointment: { type: val('atype'), date: val('adate'), time: fmtTime(val('atime')) },
        vitals: { bp: val('bp'), temp: val('temp'), weight: val('wt'), height: val('ht') },
        emergency: { first: val('efirst'), last: val('elast'), relationship: val('erel'), phone: val('ephone') },
        insurance: { philhealth: val('phid'), memberType: val('mtype'), hmo: val('hmo'), policy: val('policy') } }
    };
    extra.push(rec);
    try { localStorage.setItem('mh_regs_extra', JSON.stringify(extra)); } catch (e) { /* storage blocked: record is lost on navigation */ }
    location.href = 'registration.html'; // Figma 420:1728 -> 23:2285
  };

  $('back').innerHTML = ico('back', 15, '#4d6a80', 1.8) + 'Back to Registry';
  $('chipi').innerHTML = ico('cal', 14, '#4d6a80', 1.8);
  $('ti1').innerHTML = ico('bed', 18, '#fff'); $('ti2').innerHTML = ico('walk', 18, '#fff');
  $('ck').innerHTML = ico('check', 10, '#fff', 3);
  sum();
})();
