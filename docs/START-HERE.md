# START-HERE.md — MediHeal HIS agent bootstrap (v170, Oct 24 2026)

Project: convert the Figma file "Overview (Dashboard, Departments)" (page `0:1`) into a pixel-matched GitHub Pages site (plain HTML/CSS/JS, no build). The owner sends `FIGMAPROJECT.md` (same content as this file) plus a Figma channel ID as the "go" signal. Do the steps below in order, do not ask questions, then keep building.

## 1. CONNECT (first turn, parallel where possible)
1. FIGMA: `tool_search("join channel Figma")`, then `join_channel` with the pasted channel ID (seen: `l4zneptm`, `yzb0ayme`, `249g5nor`). It changes per session; re-join after long idle. NEVER `get_node_info` on page `0:1` (260 children, crashes the plugin). One frame at a time.
2. GITHUB: repo `leequor/mediheal-his`, branch `main`, live https://leequor.github.io/mediheal-his/. `tool_search("github get_file_contents")` and `tool_search("github list_commits")` load the tools (push_files and create_or_update_file come with them).
3. READ in this order, nothing else first (`docs/HANDOFF.md` is sessions 1-2 history and wasted three sessions):
   a. `AGENTS.md` (rules)
   b. the NEWEST `docs/GITHUBPROGRESS-sessionNN-addendum.md` (list `docs/` with `fields:["name","size"]`; sessions 12+ are logged ONLY in addenda; it holds log, status, next steps)
   c. `docs/GITHUBPROGRESS.md` (83 KB, stale at session 11) ONLY for measured tokens and rules of the screen you touch: sections 0 (rules), 2 (structure), 3 (Figma how-to), and the 9x section of the nearest finished screen as pattern.
4. `list_commits` (perPage 5, fields sha+commit): a commit newer than the newest log entry is unlogged work from an interrupted session; check and log it.
5. Commit a start-of-turn log line FIRST: create a new `docs/GITHUBPROGRESS-sessionNN-addendum.md` (small, no sha needed) instead of re-sending the 83 KB main file. Append results at the end of the turn (`create_or_update_file` needs the blob sha from `get_file_contents`). Never send these files in chat.
6. Continue at section 4 below / the newest addendum's Next steps.

## 2. Owner rules
- Match Figma exactly; measure real values, mark guesses `estimated`. Action over questions. Small steps. Short factual replies: say what is VERIFIED and NOT, list leftovers, end with "say continue".
- Never delete Figma frames or repo files without being asked. Do not modify Figma unless asked (never modified since session 3).
- Be fast: ONE template page per screen; Figma state frames (menus, modals, drawers, details, tabs) become JS states of that page; read Figma in bulk (`get_nodes_info` many ids, depth 2-3); the whole page (HTML+JS+CSS+data) in ONE `push_files` commit.
- Always log to GitHub (1.5). Notes are for the next agent, not the owner.

## 3. Repo pattern
- Fixed 1440px `.stage`; `.header` absolute so stage y=0 = Figma frame origin; coordinates are frame-local. Scripts: `data*.js`, `icons.js`, page script, `shell.js` last (sidebar + header, `HIS` global).
- Module pages (Payroll, Personnel, Attendance, Treatment, Nursing): content in a CHILD wrapper (`#prc`, `#pec`, `#tpc`), never overwrite `#stage`; Outfit 36 title at (68,115), Inter 14 description (68,166), white cards stroke `#c8dcea`, directory + profile layout, state in `HIS.xxState`, modals = JS states over a scrim. Clone `payroll.js`, `personnel.js`, `treatment.js`/`nursing.js` (shared `treatment.css`, classes `tp-*`).
- BUILT and verified live: Sign in (`index.html`), Dashboard, Registration, Appointments + form + confirmed, Inpatient/Outpatient forms, Patient profiles (5), Departments (list + 8 details + Add doctor), Billing (+3 modals, 2 menus), Payroll (+4 overlays, 2 menus), Personnel (+2 modals, menu), Attendance (+pickers, overlays), Treatment Plans, Nursing Care (`480678f`).
- STUBS: `consultation.html`, `pharmacy.html`, `staff.html` (~800 bytes). Also open: profile modals (Edit `2027:2458`, Transfer `2027:2643`, Discharge `2027:2828`; Pharmacy `2047:25913` and Discharge summary `2047:25314` live over the profile now, Figma draws them on Treatment Plan `2047:17739`); small fixes in the addenda (profile meta trailing dot, profile fallback should read `p.details`, `personnel.css` `!important` menu height, favicon 404).
- localStorage `mh_regs_extra`, `mh_appts_extra` belong to the OWNER; delete only your own test records.

## 4. NEXT STEP (as of session 16/17)
Build the stubs one at a time: Consultation (doctor consultation and diagnosis), Pharmacy, Staff. Find their Figma frames with the node map below plus `get_nodes_info` depth 1 near the Module 3 frames (canvas y 57800 to 60800 and below; Nursing `2047:20735` at (0,59500), Treatment Plan `2047:17739`). Per screen: `export_node_as_image` (0.5-1), `get_node_info` depth 2, `get_nodes_info` depth 3 on big sub-frames, `get_reactions` on every button/row/tab/filter, export each state frame; write the page, push once, verify with Playwright, log.

## 5. Verify (Playwright)
`tool_search("playwright-extension")`: `browser_navigate`, `browser_evaluate` (getBoundingClientRect vs Figma frame-local numbers), `browser_take_screenshot`. It drives the owner's REAL browser. Pages lags 10-30 s after a push and the browser caches HTML/JS/CSS: poll `fetch(url+'?x='+Date.now()).status===200`, then `fetch(url,{cache:'reload'})` for changed assets AND the page HTML, then `location.reload()`. Claude for Chrome is not connected: skip it.

## 6. Figma quirks
- Tools are deferred; load via `tool_search`. create_* need `parentId`. Colors RGBA 0-1.
- `get_node_info`/`get_nodes_info` skip VECTORs, truncate deep children, report text style from ONE range only (mixed text: `get_styled_text_segments`). No shadows/stroke weights: use `export_node_as_image`. `scan_text_nodes` times out on whole frames but works on a column or `page-content` frame.
- Modal/menu frames are usually full page clones with scrim + `Action modal`; `get_nodes_info` depth 2 gives all geometry. Menu frames can sit at far canvas origins: subtract the origin from `absoluteBoundingBox`. `localPosition` is parent-relative.
- Overlays centre on the viewport. Children of auto-layout ignore x/y.
- Image fills cannot be copied; images already uploaded (`assets/img/background.jpg`, `Avatar.png`, `logo-removebg-preview 1.png`).
- Figma defects NOT to copy: duplicate bell on Departments frames; 30% orange text fills on Payroll main frame; Leave-requests modal `2030:9330` is a Payroll payslip clone; Nursing state frames show different patient/captions than the main frame.

## 7. Design tokens
Page bg `#f6fafd` + marble image. Header 83px gradient `#dff9ff` -> `#3393c9` @.659 -> `#1b4e6b`. Card white, stroke `#c8dcea`, r12-16. Title `#15405a`; body `#1c2b30`; muted `#6f8890`/`#8a97a6`/`#aab4bf`; table-head blue `#5b8db8`. Primary `#1c6d9c`, dark `#1b4e6b`. Highlight `#e8f4fb`. Scrim `#0b2a3d`@.35. Modal shadow estimated `0 20px 50px rgba(15,30,46,.25)`. Fonts Inter, Lexend, Outfit.

## 8. Node map (page frames 1440 wide)
Sign in `211:34` | Dashboard `211:59` | Registration `23:2285` | Appointments `23:2289` | Appt form `248:821` | Confirmed `304:502` | Inpatient form `420:1147` | Outpatient form `420:1434` | Profiles `459:680`, `488:1955`, `488:2105`, `488:2255`, `488:2405` | Departments `351:501` + details `351:733`, `4001:5402`, `4001:5513`, `4001:5764`, `4030:8995`, `4030:9129`, `4030:9263`, `4030:9397`, modal `4001:5875` | Billing `351:847` + `2064:*` | Payroll `623:702` | Personnel `623:1805` | Attendance `2002:369` (+~25 states) | Treatment Plan `2047:17739` | Nursing Care `2047:20735` | Sidebar `211:1949` | Palette `217:1021` | Accessibility `248:456`. Frames for Consultation, Pharmacy, Staff: not yet located.

## 9. Optional Figma-side leftovers
Billing Outpatient root not located (apply panel `4035:9689`); hide duplicate bells and widen subtitles on Departments detail frames; board `2070:1712` rows.
