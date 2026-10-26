# START-HERE.md — MediHeal HIS agent bootstrap (v172, Oct 26 2026; v171 Oct 24 2026)

Project: convert the Figma file "Overview (Dashboard, Departments)" (page `0:1`) into a pixel-matched GitHub Pages site (plain HTML/CSS/JS, no build). The owner sends `FIGMAPROJECT.md` (same content as this file) plus a Figma channel ID as the "go" signal. Do the steps below in order, do not ask questions, then keep building.

## 1. CONNECT (first turn, parallel where possible)
1. FIGMA: `tool_search("join channel Figma")`, then `join_channel` with the pasted channel ID (seen: `l4zneptm`, `yzb0ayme`, `249g5nor`). It changes per session; re-join after long idle. NEVER `get_node_info` on page `0:1` (260 children, crashes the plugin). One frame at a time. `get_document_info` is SAFE: it lists every top-level frame id + name in one call.
2. GITHUB: repo `leequor/mediheal-his`, branch `main`, live https://leequor.github.io/mediheal-his/. `tool_search("github get_file_contents")` and `tool_search("github list_commits")` load the tools (push_files and create_or_update_file come with them).
3. READ in this order, nothing else first (`docs/HANDOFF.md` is sessions 1-2 history and wasted three sessions):
   a. `AGENTS.md` (rules)
   b. the NEWEST `docs/GITHUBPROGRESS-sessionNN-addendum.md` (list `docs/` with `fields:["name","size"]`; sessions 12+ are logged ONLY in addenda; it holds log, status, next steps)
   c. `docs/GITHUBPROGRESS.md` (83 KB, stale at session 11) ONLY for measured tokens and rules of the screen you touch: sections 0 (rules), 2 (structure), 3 (Figma how-to), and the 9x section of the nearest finished screen as pattern.
   d. (v172) `docs/IMPROVEMENT-PLAN.md` (the phased plan now driving the work; see section 10)
4. `list_commits` (perPage 5, fields sha+commit): a commit newer than the newest log entry is unlogged work from an interrupted session; check and log it.
5. Commit a start-of-turn log line FIRST: create a new `docs/GITHUBPROGRESS-sessionNN-addendum.md` (small, no sha needed) instead of re-sending the 83 KB main file. Append results at the end of the turn (`push_files` overwrites without a sha). Never send these files in chat.
6. Continue at section 4 below / the newest addendum's Next steps.

## 2. Owner rules
- Match Figma exactly; measure real values, mark guesses `estimated`. Action over questions. Small steps. Short factual replies: say what is VERIFIED and NOT, list leftovers, end with "say continue".
- Never delete Figma frames or repo files without being asked. Do not modify Figma unless asked (never modified since session 3).
- Tip: `scan_text_nodes` works on an `Action modal` node (modal id = state frame id + 249 in the `2047:*` series, +269 in `2030:*`).
- Be fast: ONE template page per screen; Figma state frames (menus, modals, drawers, details, tabs) become JS states of that page; read Figma in bulk (`get_nodes_info` many ids, depth 2-3); the whole page (HTML+JS+CSS+data) in ONE `push_files` commit.
- Always log to GitHub (1.5). Notes are for the next agent, not the owner.

## 3. Repo pattern
- Fixed 1440px `.stage`; `.header` absolute so stage y=0 = Figma frame origin; coordinates are frame-local. Scripts: `data*.js`, `icons.js`, page script, `shell.js` last (sidebar + header, `HIS` global).
- Module pages (Payroll, Personnel, Attendance, Treatment, Nursing, Consultation): content in a CHILD wrapper (`#prc`, `#pec`, `#tpc`), never overwrite `#stage`; Outfit 36 title at (68,115), Inter 14 description (68,166), white cards stroke `#c8dcea`, directory + profile layout, state in `HIS.xxState`, modals = JS states over a scrim. Clone `consultation.js` / `nursing.js` (shared `treatment.css`, classes `tp-*`) or `payroll.js`, `personnel.js`.
- BUILT and verified live: Sign in (`index.html`), Dashboard, Registration, Appointments + form + confirmed, Inpatient/Outpatient forms, Patient profiles (5), Departments (list + 8 details + Add doctor), Billing (+3 modals, 2 menus), Payroll (+4 overlays, 2 menus), Personnel (+2 modals, menu), Attendance (+pickers, overlays), Treatment Plans, Nursing Care (`480678f`), Doctor Consultation (`064c731`, session 17).
- STUBS still: `pharmacy.html`, `staff.html` (~800 bytes each). Neither has its own Figma page frame (checked with `get_document_info`, session 17): Pharmacy exists only as the Treatment Plan modals `2047:25913` / `2047:26213` (dispense / dispensed), Staff only as `Staff Attendance` `192:541` and the Personnel/Attendance pages. Also open: profile modals (Edit `2027:2458`, Transfer `2027:2643`, Discharge `2027:2828`; Pharmacy `2047:25913` and Discharge summary `2047:25314` live over the profile now, Figma draws them on Treatment Plan `2047:17739`); small fixes in the addenda (profile meta trailing dot, profile fallback should read `p.details`, `personnel.css` `!important` menu height, favicon 404).
- localStorage `mh_regs_extra`, `mh_appts_extra` belong to the OWNER; delete only your own test records.

## 4. NEXT STEP (as of session 17)
> v172: SUPERSEDED, this step is done (session 23). Current state and next step: section 10.
Consultation is DONE (`consultation.html`, geometry and states verified live). Decide Pharmacy and Staff: they have no page frames in Figma. Default (no question to the owner): make `pharmacy.html` a page that shows the Treatment Plan Pharmacy dispense flow (reuse the modals already built over the profile, Figma `2047:25913` / `2047:26213`) and `staff.html` redirect to `personnel.html`; log the choice. Then the leftovers in section 3 (move Pharmacy dispense and Discharge summary modals to the Treatment Plan page, profile Edit/Transfer/Discharge modals, small fixes).

## 5. Verify (Playwright)
`tool_search("playwright-extension")`: `browser_navigate`, `browser_evaluate` (getBoundingClientRect vs Figma frame-local numbers), `browser_take_screenshot`. It drives the owner's REAL browser. Pages lags 10-30 s after a push and the browser caches HTML/JS/CSS: poll `fetch(url+'?x='+Date.now()).status===200`, then `fetch(url,{cache:'reload'})` for changed assets AND the page HTML, then `location.reload()`. Claude for Chrome is not connected: skip it.

## 6. Figma quirks
- Tools are deferred; load via `tool_search`. create_* need `parentId`. Colors RGBA 0-1.
- `get_node_info`/`get_nodes_info` skip VECTORs, truncate deep children, report text style from ONE range only (mixed text: `get_styled_text_segments`). No shadows/stroke weights: use `export_node_as_image`. `scan_text_nodes` times out on whole frames but works on a column or `page-content` frame.
- Modal/menu frames are usually full page clones with scrim + `Action modal`; `get_nodes_info` depth 2 gives all geometry (verbose: prefer `scan_text_nodes` on the modal for texts). Menu frames can sit at far canvas origins: subtract the origin from `absoluteBoundingBox`. `localPosition` is parent-relative.
- Overlays centre on the viewport. Children of auto-layout ignore x/y.
- Image fills cannot be copied; images already uploaded (`assets/img/background.jpg`, `Avatar.png`, `logo-removebg-preview 1.png`).
- Figma defects NOT to copy: duplicate bell on Departments frames; 30% orange text fills on Payroll main frame; Leave-requests modal `2030:9330` is a Payroll payslip clone; Nursing and Consultation state frames show different patients/captions than their main frames.

## 7. Design tokens
Page bg `#f6fafd` + marble image. Header 83px gradient `#dff9ff` -> `#3393c9` @.659 -> `#1b4e6b`. Card white, stroke `#c8dcea`, r12-16. Title `#15405a`; body `#1c2b30`; muted `#6f8890`/`#8a97a6`/`#aab4bf`; table-head blue `#5b8db8`. Primary `#1c6d9c`, dark `#1b4e6b`. Highlight `#e8f4fb`. Scrim `#0b2a3d`@.35. Modal shadow estimated `0 20px 50px rgba(15,30,46,.25)`. Fonts Inter, Lexend, Outfit.

## 8. Node map (page frames 1440 wide)
Sign in `211:34` | Dashboard `211:59` | Registration `23:2285` | Appointments `23:2289` | Appt form `248:821` | Confirmed `304:502` | Inpatient form `420:1147` | Outpatient form `420:1434` | Profiles `459:680`, `488:1955`, `488:2105`, `488:2255`, `488:2405` | Departments `351:501` + details `351:733`, `4001:5402`, `4001:5513`, `4001:5764`, `4030:8995`, `4030:9129`, `4030:9263`, `4030:9397`, modal `4001:5875` | Billing `351:847` + `2064:*` | Payroll `623:702` | Personnel `623:1805` | Attendance `2002:369` (+~25 states) | Treatment Plan `2047:17739` | Nursing Care `2047:20735` | Doctor Consultation `2030:3609` (modal `2030:3877`, saved `2030:4174`, outcome list `2047:17647`, dept filter `4001:3818`) | Sidebar `211:1949` | Palette `217:1021` | Accessibility `248:456`. Pharmacy and Staff have no page frames.

## 9. Optional Figma-side leftovers
Billing Outpatient root not located (apply panel `4035:9689`); hide duplicate bells and widen subtitles on Departments detail frames; board `2070:1712` rows.

## 10. SESSION 23 STATE (v172, Oct 26 2026) — supersedes section 4; ADDITIVE, nothing above was removed
**Where things stand.** Every screen in sections 3/8 is built and verified live. Pharmacy/Staff are closed (`pharmacy.html` -> `treatment.html?modal=pharmacy`, `staff.html` -> `personnel.html`, verified session 23 turn 1). Notifications panel (Figma `2072:3499`, key `mh_notif_read`), treatment actions (Order tests, Status, Assign bed, Schedule procedure, Discharge summary) and nursing vitals/medicine were verified live with reloads. Newest log: `docs/GITHUBPROGRESS-session23-addendum.md` (turns 1-12).

**The plan now driving the work: `docs/IMPROVEMENT-PLAN.md`** (read it right after the newest addendum). Owner decisions: all POVs, phased; data stays client-only (localStorage/JSON, no server); additions allowed where Figma has no frame, but they must use the Figma design format (tokens in section 7; modal shells 664/568/368, label rows 120/202/284/366, inputs 142/224/306/388, columns 32/348 width 300/616, buttons Cancel 100 @396 + OK 140 @508) and be flagged "Addition (not in Figma)". Phase order: 0 -> 1 -> 2 -> 3 -> 5 -> 6 -> 4 -> 7 -> 8 -> 9.

**Phase 0 is DONE and live (`719da63`, `253dda7`), no visible change.** Use these shared layers; do not write `localStorage` directly any more:
- `assets/js/store.js` = `HIS.store` (`get/set/remove/update/on/names/list/snapshot/reset`, `version` 1) over 9 keys: `mh_regs_extra` + `mh_appts_extra` (OWNER, `reset()` skips them unless `{includeOwner:true}`), `mh_profile_edits`, `mh_treatment_state`, `mh_nursing_state`, `mh_consult_state`, `mh_notif_read`, `mh_attendance_state`, `mh_audit`. Same key names/shapes as before; corrupt or missing values return the fallback.
- `assets/js/audit.js` = `HIS.audit.append/list/clear` (rows `{seq, at, who, role, what, entity, before, after}`; seq = highest numeric seq + 1).
- `assets/js/kit.js` = `HIS.kit` (`modal`, `dropdown`, `pill`, `row`, `toast` (aria-live), `esc`, `GEOM` = the Figma modal geometry). `assets/js/ui.js` is a facade over it. All 16 shell pages load `store.js`, `audit.js`, `kit.js` right after `data.js`.

**Verification harnesses (in the repo, run before saying "verified").** Serve the repo locally (any static server) or point at the live site:
- `BASE=http://127.0.0.1:8789 node scripts/smoke.mjs` — 19 pages: console errors, overflow at 1440/1200/1000/800/390, safe click sweep.
- `BASE=... CDP=http://127.0.0.1:9333 node scripts/buttons.mjs` (`FRESH=1` cache-busts on the live site, `ONLY=<page>` for one page, JSON report to `%TEMP%/button-sweep.json` or `OUT`) — clicks EVERY visible control from a clean reload, requires an effect (navigation / DOM change / download / print / toggle), fetches every link (must be 200), restores localStorage byte-for-byte. Needs `playwright-core` and a Chromium with remote debugging on a SEPARATE profile (never the owner's live Chrome when bots run in parallel).
- Both never click print/download/export/sync/approve/decline/sign out/reset/delete for real (`window.print` spoofed, downloads cancelled): a native print dialog once froze automation.

**Last full check (session 23 turn 11, local + live):** 19 pages, 647 controls, 243 visible clicked, 260 links: 0 console errors, 0 click errors, 0 broken/dead links. Only inert control: appointments pager `1` (current page, by design). One bug found and fixed (`7a83e05`): the profile patient-ID chip had no handler; it now copies the ID + toast (addition). 10 semantic flows pass (sign-in invalid/forgot/valid, notifications persist, appointment cancel (two-step confirm) + edit, attendance sync (card locks; toolbar then says "Already synced to payroll"), billing download, profile print = PDF with 0 `window.print` calls, treatment Order tests). Forms end-to-end: inpatient (34 fields), outpatient (33; date `dd/mm/yyyy` >= today, time `10:30 AM`), appointment (20; date `MM/DD/YYYY`, custom `.f-sel` dropdowns) all save and navigate. NOT covered by the sweep: controls that exist only inside an opened overlay ("modal drill" = next harness extension).

**Owner question answered: "does each login have its own POV (user/admin)?" — NO, not yet.** Sign-in accepts any valid email -> `dashboard.html`, `HIS.user` is one hardcoded record (Dr. Elsie Chen), the sidebar NAV is one flat list, every page is URL-reachable. Role logins = Phase 7.1 (RBAC simulation); the owner said to finish the current line first, so it stays in plan order.

**NEXT STEP:** Phase 1 (payroll/HR correctness) — logged as started in turn 10 but NO code written yet: 1.1 period lock + sync audit trail (`HIS.audit`), 1.2 leave ledger semantics, 1.3 night shifts/overtime, 1.4 payslip PDF (`HIS.pdf`), 1.5 exceptions-first payroll card. Touches `assets/js/attendance.js` (sync/review/leave) and the payroll page. First action-modal consumer: build the Figma action-modal builder into `HIS.kit` from `GEOM` then. Run `scripts/buttons.mjs` + `scripts/smoke.mjs` after each phase.

**Host notes (Qoder Desktop, Windows):** no Figma MCP server on this host; join the channel by attaching a small WebSocket client to the running bridge `ws://localhost:3055` (`{type:"join",channel}`, then `{type:"message",channel,message:{id,command,params}}`, match replies by `id`). The repo is a local git clone pushed with plain `git push` to `main`.
