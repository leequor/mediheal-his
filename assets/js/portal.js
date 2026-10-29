// Patient portal demo auth (Addition - not in Figma; the owner supplied this design by email).
// Everything stays in the browser: accounts, the pending reset code and the session go through
// HIS.store (localStorage); real auth is out of scope by design (docs/IMPROVEMENT-PLAN.md Phase 7).
// "Keep me signed in" decides whether the session survives the browser (localStorage) or only
// the tab (sessionStorage, not an mh_* key so it is never part of a demo-data reset).
(function () {
  var S = HIS.store, K = S.KEY, A = HIS.audit, toast = HIS.kit.toast;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var VIEWS = ['landing', 'signup', 'signin', 'forgot'];
  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  var TMP = 'mh_portal_session_tmp';

  // ---- helpers ------------------------------------------------------------
  var strong = function (v) { return v.length >= 12 && /[A-Za-z]/.test(v) && /\d/.test(v); };
  var digits = function (v) { return v.replace(/\D/g, ''); };

  function accounts() { var m = S.get(K.portalAccounts, {}); return m && typeof m === 'object' ? m : {}; }
  function findAccount(email) { return accounts()[email] || null; }

  // SHA-256 over "email:password" so the demo never keeps a plain password. crypto.subtle needs a
  // secure context (https / localhost); on file:// it is absent and the demo falls back to a
  // tagged plain value - never shipped, local preview only.
  function hashPw(email, pw) {
    var text = email + ':' + pw;
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) {
          return ('0' + b.toString(16)).slice(-2);
        }).join('');
      });
    }
    return Promise.resolve('plain:' + text);
  }

  function readTmp() {
    try { var raw = sessionStorage.getItem(TMP); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function readSession() { return S.get(K.portalSession, null) || readTmp(); }
  function setSession(acc, persist) {
    var s = { email: acc.email, name: acc.name, at: new Date().toISOString() };
    if (persist) {
      S.set(K.portalSession, s);
      try { sessionStorage.removeItem(TMP); } catch (e) { /* private mode */ }
    } else {
      try { sessionStorage.setItem(TMP, JSON.stringify(s)); } catch (e) { /* private mode */ }
      S.remove(K.portalSession);
    }
  }
  function clearSession() {
    S.remove(K.portalSession);
    try { sessionStorage.removeItem(TMP); } catch (e) { /* private mode */ }
  }

  // ---- router -------------------------------------------------------------
  function route() {
    var id = location.hash.slice(1);
    if (VIEWS.indexOf(id) < 0) id = 'landing';
    $$('.pt-view').forEach(function (v) { v.classList.toggle('on', v.id === id); });
    if (id === 'signin') {
      renderSession();
      var email = $('#pt-si-email', $('#pt-signin'));
      if (email && !readSession()) email.focus();
    }
    if (id === 'forgot') resetFlow();
    window.scrollTo(0, 0);
  }
  addEventListener('hashchange', route);

  // ---- landing / sign-up --------------------------------------------------
  $('#pt-hasid').addEventListener('change', function () {
    $('#pt-idfields').hidden = !this.checked;
  });

  var pw = $('#pt-pw');
  pw.addEventListener('input', function () {
    var hint = $('#pt-pw-hint');
    hint.textContent = (strong(pw.value) ? 'Password strength: strong. ' : '') + 'Use at least 12 characters, including letters and numbers.';
    hint.className = 'pt-hint ' + (pw.value ? (strong(pw.value) ? 'strong' : 'weak') : '');
  });

  $('#pt-signup').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, err = $('#pt-signup-error');
    var email = f.email.value.trim().toLowerCase();
    var fail = function (msg, el) { err.textContent = msg; if (el) el.focus(); };

    if (!f.first.value.trim() || !f.last.value.trim() || !f.dob.value || !f.mobile.value.trim() || !email) {
      return fail('Please fill in all required fields.');
    }
    if (!EMAIL.test(email)) return fail('Enter a valid email address.', f.email);
    if (digits(f.mobile.value).length < 10) return fail('Enter a valid mobile number.', f.mobile);
    if (!strong(f.password.value)) return fail('Password needs at least 12 characters with letters and numbers.', f.password);
    if (!$('#pt-privacy').checked) return fail('Please accept the Privacy Notice to continue.');
    if (!$('#pt-terms').checked) return fail('Please accept the Terms of Use to continue.');
    if (findAccount(email)) return fail('An account with this email already exists. Sign in instead.', f.email);

    var name = [f.first.value, f.middle.value, f.last.value, f.suffix.value]
      .map(function (v) { return v.trim(); }).filter(Boolean).join(' ');
    err.textContent = '';
    hashPw(email, f.password.value).then(function (hash) {
      S.update(K.portalAccounts, {}, function (map) {
        map[email] = {
          email: email, name: name, hash: hash, mobile: f.mobile.value.trim(), dob: f.dob.value,
          pid: f.pid.value.trim(), facility: f.facility.value, at: new Date().toISOString()
        };
        return map;
      });
      A.append({ who: email, role: 'patient', what: 'portal.signup', entity: 'portal-account', after: { email: email, name: name } });
      f.reset();
      $('#pt-idfields').hidden = false;
      $('#pt-pw-hint').textContent = 'Use at least 12 characters, including letters and numbers.';
      $('#pt-pw-hint').className = 'pt-hint';
      toast('Account created. Sign in to continue.');
      $('#pt-si-email').value = email;
      location.hash = '#signin';
    });
  });

  // ---- sign in / session --------------------------------------------------
  function renderSession() {
    var s = readSession(), form = $('#pt-signin'), card = $('#pt-session');
    form.hidden = !!s;
    card.hidden = !s;
    if (s) {
      $('#pt-session-name').textContent = s.name || s.email;
      $('#pt-session-email').textContent = s.email;
    }
  }

  $('#pt-signin').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, err = $('#pt-signin-error');
    var email = f.email.value.trim().toLowerCase(), password = f.password.value;
    if (!email || !password) { err.textContent = 'Enter your email and password.'; return; }
    if (!EMAIL.test(email)) { err.textContent = 'Enter a valid email address.'; return; }

    var acc = findAccount(email);
    if (!acc) { err.textContent = 'No patient account for this email. Create one first.'; return; }

    hashPw(email, password).then(function (hash) {
      if (hash !== acc.hash) { err.textContent = 'Incorrect password.'; return; }
      err.textContent = '';
      var persist = $('#pt-keep').checked;
      setSession(acc, persist);
      A.append({ who: email, role: 'patient', what: 'portal.signin', entity: 'portal-session', after: { persist: !!persist } });
      f.reset();
      renderSession();
      toast('Signed in as ' + acc.name);
    });
  });

  $('#pt-signout').addEventListener('click', function () {
    var s = readSession();
    if (s) A.append({ who: s.email, role: 'patient', what: 'portal.signout', entity: 'portal-session' });
    clearSession();
    renderSession();
    toast('Signed out.');
    $('#pt-si-email').focus();
  });

  // ---- forgot password (3 steps) -----------------------------------------
  var timerId = null;

  function goStep(n) {
    $$('.pt-step').forEach(function (s, i) {
      s.classList.toggle('on', i === n);
      s.classList.toggle('done', i < n);
      if (i === n) s.removeAttribute('inert'); else s.setAttribute('inert', '');
    });
  }
  function mmss(sec) {
    return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  }
  function startTimer(sec) {
    clearInterval(timerId);
    var t = $('#pt-timer');
    var paint = function () {
      t.textContent = sec > 0 ? 'Code expires in ' + mmss(sec) : 'Code expired. Request a new one.';
    };
    paint();
    timerId = setInterval(function () {
      sec--;
      paint();
      if (sec <= 0) clearInterval(timerId);
    }, 1000);
  }
  function resetFlow() {
    var r = S.get(K.portalReset, null);
    if (r) { // a request is still pending: reopen step 2 with the time that is left
      var left = Math.max(0, Math.ceil((r.exp - Date.now()) / 1000));
      $('#pt-otp-demo').innerHTML = 'Demo code: <b>' + r.code + '</b>';
      $('#pt-otp-demo').hidden = false;
      goStep(1);
      startTimer(left);
      return;
    }
    clearInterval(timerId);
    goStep(0);
    $('#pt-recv').value = '';
    $('#pt-f1err').textContent = '';
    $('#pt-f2err').textContent = '';
    $('#pt-f3err').textContent = '';
    $('#pt-otp-demo').hidden = true;
    $('#pt-done').hidden = true;
  }

  $('#pt-forgot').addEventListener('click', function () { location.hash = '#forgot'; });

  $('#pt-send').addEventListener('click', function () {
    var email = $('#pt-recv').value.trim().toLowerCase(), err = $('#pt-f1err');
    if (!EMAIL.test(email)) { err.textContent = 'Enter a valid email address.'; return; }
    if (!findAccount(email)) { err.textContent = 'No patient account for this email.'; return; }
    err.textContent = '';

    var code = String(Math.floor(100000 + Math.random() * 900000));
    S.set(K.portalReset, { email: email, code: code, exp: Date.now() + 5 * 60 * 1000 });
    A.append({ who: email, role: 'patient', what: 'portal.reset_request', entity: 'portal-account' });

    // Addition: there is no mail server behind this demo, so the code is shown instead of sent.
    $('#pt-otp-demo').innerHTML = 'Demo code: <b>' + code + '</b>';
    $('#pt-otp-demo').hidden = false;
    $('#pt-f2err').textContent = '';
    goStep(1);
    startTimer(300);
    $('#pt-otp input').focus();
  });

  // OTP boxes: digits only, auto-advance, backspace, paste.
  var boxes = $$('#pt-otp input');
  boxes.forEach(function (b, i) {
    b.addEventListener('input', function () {
      b.value = b.value.replace(/\D/g, '').slice(-1);
      if (b.value && boxes[i + 1]) boxes[i + 1].focus();
    });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && !b.value && boxes[i - 1]) boxes[i - 1].focus();
      if (e.key === 'Backspace' && b.value) { b.value = ''; e.preventDefault(); }
    });
    b.addEventListener('paste', function (e) {
      e.preventDefault();
      var d = digits(e.clipboardData.getData('text')).slice(0, 6);
      boxes.forEach(function (x, k) { x.value = d[k] || ''; });
      boxes[Math.min(Math.max(d.length, 1), 6) - 1].focus();
    });
  });

  $('#pt-verify').addEventListener('click', function () {
    var err = $('#pt-f2err'), r = S.get(K.portalReset, null);
    var code = boxes.map(function (b) { return b.value; }).join('');
    if (!r) { err.textContent = 'Request a new code first.'; return; }
    if (Date.now() > r.exp) { err.textContent = 'That code has expired. Request a new one.'; return; }
    if (code !== r.code) { err.textContent = 'That code does not match.'; return; }
    err.textContent = '';
    clearInterval(timerId);
    goStep(2);
    $('#pt-np').focus();
  });

  function checkRules() {
    var np = $('#pt-np').value, cp = $('#pt-cp').value;
    var rules = [np.length >= 12, /[A-Za-z]/.test(np) && /\d/.test(np), !!np && np === cp];
    rules.forEach(function (ok, i) { $('#pt-r' + (i + 1)).classList.toggle('ok', ok); });
    return rules.every(Boolean);
  }
  $('#pt-np').addEventListener('input', checkRules);
  $('#pt-cp').addEventListener('input', checkRules);

  $('#pt-save').addEventListener('click', function () {
    var err = $('#pt-f3err'), r = S.get(K.portalReset, null);
    if (!checkRules()) { err.textContent = 'Check the password rules first.'; return; }
    if (!r || Date.now() > r.exp) { err.textContent = 'Start the reset again.'; return; }
    err.textContent = '';
    hashPw(r.email, $('#pt-np').value).then(function (hash) {
      S.update(K.portalAccounts, {}, function (map) {
        if (map[r.email]) { map[r.email].hash = hash; map[r.email].updatedAt = new Date().toISOString(); }
        return map;
      });
      S.remove(K.portalReset);
      A.append({ who: r.email, role: 'patient', what: 'portal.password_reset', entity: 'portal-account' });
      $('#pt-done').hidden = false;
      toast('Password updated.');
    });
  });

  $('#pt-back-signin').addEventListener('click', function () {
    S.remove(K.portalReset);
    clearInterval(timerId);
    location.hash = '#signin';
  });

  goStep(0);
  route();
})();
