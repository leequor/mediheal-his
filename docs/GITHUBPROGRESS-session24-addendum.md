# Session 24 addendum — patient portal (addition)

2026-10-29. Additive log; nothing above this file was rewritten.

## Turn 1 — start

Owner supplied a patient-portal design by email (three files: landing, sign up, sign in, 3-step
forgot-password) and asked to add it to this repo and make it work. That design answers the
"Blocked on new Figma frames: Patient portal and any patient-facing screen" item in
`docs/IMPROVEMENT-PLAN.md`.

Owner decisions this turn (asked before writing, because the repo is public):

1. Placement: a NEW `portal.html` carrying the emailed design as four hash views. `index.html`
   and every Figma-matched screen stay untouched apart from one flagged link.
2. Wiring: working client-side demo auth (accounts, OTP, reset, session), not the emailed
   `alert()` stubs. Still client-only, per the owner's "no server" decision.

## What was built

Files added:

- `portal.html` — landing / signup / signin / forgot as `.pt-view` sections driven by `location.hash`.
- `assets/css/portal.css` — the emailed layout and palette (Inter/Lexend/Outfit, navy sign-in
  panel), scoped under `.pt`. `base.css` is NOT loaded here on purpose: it pins the 1440px stage
  and this public page is responsive.
- `assets/js/portal.js` — router, validation, demo auth, OTP issue/verify, session.

Files changed:

- `assets/js/store.js` — three new keys: `mh_portal_accounts`, `mh_portal_reset`, `mh_portal_session`.
- `index.html` + `assets/css/signin.css` — one line link under the sign-in button
  ("New patient? Open the patient portal →"), flagged `Addition (not in Figma)`.

Behaviour (all client-side, nothing leaves the browser):

- Sign-up validates required fields, email format, mobile (>= 10 digits), password (12+ with a
  letter and a digit), both consents, and rejects a duplicate email. The account stores a
  SHA-256 of `email:password` (never the raw password) plus name/mobile/DOB/patient ID/facility.
- Sign-in requires a created account and the matching password; wrong password and unknown email
  get distinct messages. "Keep me signed in" decides localStorage vs tab-only sessionStorage.
- Forgot password: code is generated (6 digits), expires in 5 minutes, and is actually verified;
  a wrong code is rejected, an expired code is rejected, the new password must pass the same
  rules, and the account hash is replaced. The old password then fails and the new one works.
- Every action appends to `HIS.audit` (`portal.signup`, `portal.signin`, `portal.signout`,
  `portal.reset_request`, `portal.password_reset`).
- Addition flagged in code: the demo code is shown on screen (`Demo code: ######`) because there
  is no mail server behind this build.

## Verified (local, http://127.0.0.1:8789)

- Flows driven in a real browser: signup -> signin -> signout, wrong password, unknown account,
  duplicate email, reset request -> wrong code -> correct code -> weak password -> save ->
  old password rejected -> new password signs in, session survives reload, tab-only session
  when "keep me signed in" is unchecked, pending reset reopens step 2 with the remaining time.
- Audit trail contains the expected six entries for the run.
- Overflow: 0 at 1440 / 1200 / 1000 / 800 / 390 across all four views (20 checks, isolated
  headless Chrome over CDP), 0 console errors.
- `index.html` unchanged in layout; the new link sits at (820, 744) under the sign-in button.

## NOT verified

- The live GitHub Pages copy — checked only after this commit is pushed.
- `scripts/smoke.mjs` — `playwright-core` is not installed on this host.
- Browsers other than Chrome.

## Next

- Run `scripts/smoke.mjs` with `playwright-core` available and add `portal.html` expectations if
  the harness needs them (it sweeps root HTML files automatically).
- Phase 7.1 (RBAC) can later read `mh_portal_session` instead of hardcoding `HIS.user`.
