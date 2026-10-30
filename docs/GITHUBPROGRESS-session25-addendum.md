# Session 25 addendum — owner tidy pass (2026-10-30)

Additive log. Nothing in earlier addenda or in `GITHUBPROGRESS.md` was changed.

## Owner requests (both are deviations from the Figma match, rule 2 in START-HERE section 2)

1. "Remove the logo on the sidebar so the buttons there don't look so cramped, and adjust adaptively."
2. "Fix all inconsistencies in the design, e.g. this extra white space on the left. Tidy up the design."
   Sent with a screenshot of `index.html` showing a bare white gutter left of the blue sign-in panel.

## Turn 1 — start of turn log

Files touched: `assets/js/shell.js`, `assets/css/base.css`, `assets/css/signin.css`, `assets/js/fit.js`, `index.html`.
No page HTML other than `index.html`; the drawer lives in `shell.js`, so all 16 shell pages pick up request 1 automatically.

Measured before (viewport 1536x674, local):

- Drawer: `.dr-logo` watermark 634x441 at (-109, 19) overlapped the first nav rows; nav started at a hardcoded `top:400px`,
  12 rows of 42px ended at 904px inside a fixed 1024px `.dr-in`, while the viewport was 674px. Sign out sat at y915, contact at y982.
- Sign in: `.si` 1440x1024 centred; at 1536 wide the blue panel stopped at x761 and x0-40 was bare white.
  Frame height 1024 regardless of the window, so a 674px window scrolled 350px for content that ends at 759.
- Right column: `.si-t` / `.si-s` at x810 while every field was at x820 (10px rag). Checkbox at 828 (8px rag).
- Left column features: icon x 60/57/57, text x 114/112/110 (ragged by up to 4px).

Status: committed (`54efed1`) and verified live; see the results section below.

## Turn 1 — results

Commits: `9a2c636` (this log), `54efed1` (code), pushed `1424412..54efed1` to `main`.

What changed, and why:

- `shell.js`: the `.dr-logo` `<img>` is gone. The drawer keeps only the `MediHeal` wordmark + exit button.
- `base.css`: `.dr-in` is now a flex column filling the viewport (`min-height:100%`, padding 84/22) instead of a
  fixed 1024px box with a nav pinned at `top:400px`. The nav takes the free height and shares it equally across
  its links (`flex:1 1 auto`, 2px gap, `max-height:54px`), items below 34px go to the internal scroll, and the
  Sign out button + contact block are pinned to the bottom. Type and icons scale with `clamp()` between the Figma
  values (30px Lexend, 44px icon) and an 18px / 24px floor, so short windows stay readable without crowding.
- `signin.css`: `.si-bleed` (fixed, z-index -1) continues the panel's `#1b4e6b` to the viewport edge; the split is
  `calc(50% + 1px)` = `(100% - 1440) / 2 + 721`, i.e. exactly where the panel ends, so there is no seam and no
  overshoot at any width. `.si-panel` height is `100%` instead of 1024.
- `fit.js`: the sign-in frame height follows the window (`max(780, innerHeight) / zoom`, floor 780 = the lowest
  content at y759). Also fixed a class collision: `zoomAll` and the new height code select `body > .si` because the
  dashboard reuses `.si` for its schedule rows, which were being zoomed individually on narrow windows.
- `index.html`: the bleed layer; feature rows moved to one icon column (x57) and one text column (x114), previously
  60/57/57 and 114/112/110.

## Verified live (https://leequor.github.io/mediheal-his/, real browser, viewport 1536x674)

- `index.html`: `.si-bleed` present, panel spans x40-761 and the bleed covers 0-761.5 — no white gutter. Frame
  height 780 and `scrollHeight` 780 (was 1024 / 350px of empty scroll). `.si-t`, `.si-s`, `#sie` and the checkbox
  box all at x860; input, Sign in button and Forgot password share the right edge at x1282. No horizontal overflow.
- `dashboard.html`: drawer renders 12 links with no `.dr-logo`; 37px rows at 18px on a 674px-tall window (51px /
  22px when the window is taller), drawer does not scroll, Sign out and contact visible. The 4 schedule rows are
  untouched (63px, only their `top` inline style).
- `billing.html` (rebuilds its stage with innerHTML): drawer intact, 12 links, fits, no horizontal overflow.
- 0 console errors on both shell pages.

Deploy note: the first live load in the browser still ran the old `base.css`/`signin.css` from the HTTP cache
(42px rows). GitHub Pages itself was already serving the new files (curl check); `fetch(url,{cache:'reload'})` +
`location.reload()` applied them. Same behaviour the earlier addenda describe.

## NOT verified

- `scripts/smoke.mjs` and `scripts/buttons.mjs` — `playwright-core` is still not installed on this host.
- Widths below 430px: the automation browser refused `setViewportSize` on this host, so the drawer's fluid type
  and the sign-in bleed were verified by measurement and CSS math, not by screenshot at those widths.
- The remaining 15 shell pages were not opened individually (the drawer is shared code, verified on two pages).
- The sign-in page still scrolls ~106px at a 674px-tall window: 759px of content cannot fit without scaling the
  whole design down, which the owner has not asked for.

## Next

- Optional: the owner asked about running the same tidy audit over the other screens; nothing else changed in them.
- Phase 1 (payroll/HR correctness) is still the next planned phase in `docs/IMPROVEMENT-PLAN.md`.

## Turn 2 — full-site audit (owner: "check every function and design, make sure nothing is broken")

Method: the repo's own harnesses plus five read-only audit agents.
- `scripts/smoke.mjs` (playwright-core installed in a temp dir, headless Chrome on a private `--user-data-dir`, CDP 9333): 20 pages, 5 widths (1440/1200/1000/800/390), console errors + horizontal overflow. Local and live: all pages clean.
- `scripts/buttons.mjs`: 247 visible controls clicked from a clean reload, every `a[href]` fetched. 0 click errors, 0 broken links, 0 console errors. Single no-effect control = the appointments pager's current tab (by design).
- Five agents: four visual (20 full-page screenshots at 1440) + one JavaScript audit. Their findings were re-measured in a real browser before anything was changed.

### Fixed — functional

- `reg-form.js` / `reg-form-out.js`: new charts took `max(registry) + 1` = **PT-99214**, which already belongs to Jose Dela Cruz in `data-nursing.js`, and the next one **PT-99215** = Maria Santos in treatment/consultation/billing. New ids now start at **PT-100000**, a range no seeded dataset uses. Verified: computed next id is PT-100000, no collision.
- `treatment.js`: the "Nursing care" action navigated to `nursing.html` with no id, so it always opened PT-99213 (Isabel) whatever plan was selected. It now passes `?id=`. Verified: selecting PT-99208 lands on `nursing.html?id=PT-99208`.
  - STILL OPEN below: a patient with no nursing record still falls back to PT-99213 rather than a "no record" state.
- `consultation.js`: "Record diagnosis" wrote only the Next step and a memory-only `st.saved`; the diagnosis, ICD code, severity, findings and notes were dropped on reload although the modal said "Added to the record". They are now stored on the record (`rec(p).dx`), reopen the form prefilled and rebuild the saved dialog from storage. Verified through a real save + reload.
- Six search boxes (`attendance`, `payroll`, `personnel`, `treatment`, `nursing`, `consultation`): the handler stored `value.trim().toLowerCase()`, so a typed space was deleted and every keystroke re-rendered the field with the caret at the end ("Dr Smith" became "drsmith"). Raw text is now kept, normalisation happens only in the comparison, and the caret position is restored. Verified on all six.
- `billing.js`: the invoice ignored `b.paid` on non-itemised bills, so a recorded partial payment still printed "Paid ₱0.00" and the full balance.
- `appointments.html` / `registration.html`: patient and doctor names were interpolated into `value='...'` and `aria-label='...'` unescaped, so "Anne O'Brien" was truncated to "Anne O" on edit. Wrapped in `HIS.kit.esc`.

### Fixed — visual (each re-measured after the change)

- `registration-form`: the Emergency Contact subtitle used `#ffd9b2` on white (≈1.3:1, effectively invisible). Removed; it now uses the section body colour.
- `payroll` / `attendance`: the PAYMENT STATUS and STATUS headers sat 16px left of their pills and crowded the preceding column header. Both moved onto the pill column (1052 → 1068; the real offset was measured, not assumed).
- `attendance`: "Last synced Aug 30, 2026 · 6:00 PM" was ellipsised; box widened 206 → 218 so the whole timestamp shows.
- `appointments`: the last two KPI cards were 136px against 125px for the first three; all five now 125.
- `dashboard`: the two side-by-side card titles were 5px apart (20 vs 25) — now both 20 with subtitles at 62; the schedule timeline ran 10px past the last dot — now ends exactly on it.
- `personnel` / `treatment`: the full-bleed list header and rows painted over the card's inset 1px stroke, leaving a 642px gap in the outline. Rows and header now draw their own side strokes.
- `appointment-confirmed`: the check icon sat 12px left of the card centre and the title/button 4px right; icon, title and button are now on the card's centreline (724).
- `index.html`: the H1 ran 19px past the form column. Set to 36px (was 38) so its ink ends exactly on the column edge (1242).

### Found but NOT fixed (reported for the owner)

Functional:
- `nursing.js` / `treatment.js` / `consultation.js` fall back to PT-99213 when a supplied `?id=` has no record in that dataset (nursing lacks PT-99208/99211/99218), so a deep link can still show the wrong patient. Needs a "no record" state, which is a new screen state, not a tweak.
- `profile-modal.js` writes Transfer/Discharge to `mh_profile_edits`, but `registration.html` reads only `mh_regs_extra`, so profile changes never reach the registry; the Discharge date/follow-up/summary are not stored at all.
- `registration.html` "Find existing patient" promises phone/PhilHealth search but reads only name/id/phone, and seeded patients have no top-level `phone` (the forms store it under `details`).
- `nursing.js` validates the Progress note field then stores only the plan next shift; "Give medicine" increments the dose count even when no due row matched; `attendance.js` requires a leave reason then discards it; `profile.js` shows the appointment string in the Ward row for outpatients.
- `payroll.html` does not load `pdf.js`, so the payslip "Download PDF" is a toast only (already Phase 1.4 in the plan).
- Filter menus in `data-consultation.js` / `data-nursing.js` offer departments/wards with no patients and omit ones that exist (Dermatology vs Pediatrics, ICU/Isolation vs Neuro Ward).
- `billing.js` "Today" filter can never match a seeded bill (newest is Aug 29, 2026) while the stat card counts 12; `departments.js` search ignores `dname`, so "Orthopedics" finds nothing.

Visual (cosmetic, Figma-derived — left as drawn):
- `appointment-form`: sub-captions render under their inputs ("First Name" reads as the Last Name label) and the two section headings sit 53px and 25px under their rules; field rows have no shared top/bottom edge.
- `registration` / `outpatient-form`: select value text and chevron are ~12px out of line in every select; the registration filter bar mixes 38/45px heights and two border colours.
- `dashboard`: the DOCTOR header is centred in an 85px box while its column is left-aligned (21px off); schedule row rhythm is 107/99/103px.
- `departments`: search stops 53px short of the grid because the duplicate-bell slot is hidden.
- `profile`: the header meta wraps, leaving a dangling "·" and an orphan "Inpatient" (already listed as a known leftover in START-HERE); the three Treatment History buttons are 11px and 21px apart.
- `registration`: the rule above the table header is neutral grey while every other divider is pale blue.

### Verification after the edits

- smoke: 20 pages clean, local and live. buttons: 247 controls, 0 errors, 1 known pager tab.
- 12 targeted assertions pass (heading/column, KPI heights, both status headers, sync time, dashboard titles + timeline, personnel/treatment strokes, confirmed centreline, emergency colour, search caret).
- Functional: next MRN PT-100000; nursing deep link keeps the patient; diagnosis survives reload; six search boxes keep spaces and caret.
- NOT verified: browsers other than Chrome; real devices below 430px (the automation browser refuses `setViewportSize` on this host); the registration form's end-to-end submit was NOT automated this turn (its custom dropdowns need UI clicks) — the id change is the one-line floor and was verified by computing the value from the live data.

## Turn 2b — "Invoice downloaded" dialog (owner screenshot)

Owner sent the Download invoice → Invoice downloaded flow and asked whether it was fixed. Two separate things:

1. NOT a bug: the two-step flow is intended, and `Download PDF` really saves a file (`HIS.pdf.save`, assets/js/pdf.js).
   Verified in a browser: `BL-8801_invoice.pdf`, 1754 bytes, valid `%PDF-` header. The invoice also shows the
   recorded partial payment (Paid ₱10,000 / Balance ₱7,360), which is the billing fix from turn 2 working.
2. A REAL bug in the compact "Invoice downloaded" dialog (`billing-modal.js`, POS2), now fixed:
   - A 6th row ("Status notes") was positioned at y366/388 inside a 368px dialog. The dialog has `overflow:visible`,
     so its textarea rendered 107px BELOW the modal as a floating white box that looked like a toast, and the
     "Status notes" label was clipped at the dialog edge. The compact frame now renders five fields and the
     "status unchanged" fact moved into the dialog subtitle.
   - The "Previous status" field was 616px wide and ran underneath the Back to billing / Close buttons
     (buttons at x392-641, field ended at 648). Narrowed to 340px, which clears them by 24px.

Verified after the fix: 5 fields, zero elements outside the dialog bounds, field/button overlap false,
PDF still downloads (1754 bytes), billing smoke + control sweep clean (18 controls, 0 errors, 0 console errors).

Figma note: the compact state comment claimed "rows end at 388, buttons at 300", which cannot both be true in a
368px dialog; that contradiction is what produced the escaped row. If the Figma 2064:5782 frame really shows six
rows, the dialog needs to be ~490px tall — worth measuring in Figma before changing it back.
