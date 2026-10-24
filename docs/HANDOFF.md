# MediHeal HIS: handoff notes for the next agent

Last updated: Oct 24, 2026 (session 1). Keep this file additive: append to the log, update the status table, do not delete history.

## 1. Goal

Convert the Figma file ("Overview (Dashboard, Departments)", page `0:1`) into a GitHub Pages website so features are easy to add. Owner: GitHub user `leequor`. Repo: https://github.com/leequor/mediheal-his. Live: https://leequor.github.io/mediheal-his/ (Pages builds from `main`, root; the owner confirmed it works).

The original assignment is a Hospital Information System UI with 4 modules: Registration (inpatient/outpatient), Doctor Consultation and diagnosis (Payroll, Personnel Details, Attendance), Treatment, Billing (inpatient/outpatient). The owner's Figma handoff file `FIGMAPROJECT.md` (about 4,100 lines, not in this repo) holds the full Figma history. Ask the owner to re-upload it if you need it.

## 2. User rules (strongest first)

1. **Match the Figma designs exactly.** The owner noticed the first version drifted. Measure real values from Figma (see section 4). Where a value is a guess, mark it `estimated` in the status table and verify later.
2. Handoff notes are additive (this file).
3. Work in small steps, say plainly what is verified and what is not. Do not claim a page works unless it was tested.
4. Never delete Figma frames or repo files without being asked.

## 3. Tech and structure

Plain HTML, CSS and vanilla JS. No build step. Fixed 1440px stage like the Figma frames (`.stage`, `min-width:1440px`). Blocks are absolutely positioned with Figma coordinates (child abs position minus frame origin); tables use CSS grid with column x positions taken from Figma.

```
index.html               Sign in (basic placeholder, not matched to Figma 211:34)
dashboard.html           Dashboard
registration.html        Registration
appointments.html        Appointments
<module>.html            Stubs: consultation, treatment, nursing, pharmacy, staff, personnel, payroll, departments, billing
assets/css/tokens.css    Colors, fonts, shadow
assets/css/base.css      Stage, header, sidebar drawer, stub, login
assets/css/components.css  Badges, custom dropdown, temporary modal
assets/css/pages.css     Page specific styles (dashboard, registration, appointments)
assets/js/data.js        Core mock data (user, dashboard)
assets/js/data-records.js  Patients, appointments, doctors, departments, status lists
assets/js/icons.js       Inline SVG icon set: svg(name,size)
assets/js/ui.js          openModal, makeDropdown, helpers
assets/js/shell.js       Shared header + sidebar (edit NAV here)
assets/img/              logo.svg fallback; see assets/img/README.md for images to upload
```

Script order on every page: `data.js`, `data-records.js` (if needed), `icons.js`, `ui.js` (if needed), `shell.js`. `shell.js` calls `svg()` from `icons.js`, so `icons.js` must load first. A page without it will throw.

Adding a page: copy a stub or `dashboard.html`, set `data-page` on `<body>`, build inside `.stage`, add the nav entry in `shell.js` if new.

Data is in memory only and resets on refresh.

## 4. How to work with Figma (MCP: Claude Talk to Figma)

- The owner pastes a channel ID from the Figma plugin. Tools are deferred: `tool_search` to load, then `join_channel`. IDs seen: `yzb0ayme`, `l4zneptm`. If a join fails, ask for a new ID. The plugin can disconnect; re-join with a fresh ID.
- **Never** `get_node_info` on page `0:1` (260 top-level children): it disconnected the plugin. Use one frame at a time, `depth` 2 to 4.
- `get_node_info` truncates deeper children (`_childrenTruncated`); call it again on the child id, or use `get_nodes_info` with a list of ids. It gives `absoluteBoundingBox`, fills, strokes, radius, and text style (font, size, weight, color, letter spacing).
- `export_node_as_image` (PNG, scale 0.5) lets you see the design. Image fills (logo, marble background, avatar) cannot be copied as files by these tools. They must be exported by the owner (see `assets/img/README.md`).
- Frame origins (for converting abs coords to page coords): Dashboard `211:59` at (1600,34000); Registration `23:2285` at (3200,34000); Appointments `23:2289` at (4800,34000); Sidebar `211:1949` at (0,51000). All page frames are 1440x1120.

## 5. Figma node map

Sign in `211:34` | Dashboard `211:59` | Registration `23:2285` | Appointments `23:2289` | Appointment Form `248:821` | Appointment confirmed `304:502` | Inpatient form `420:1147` | Outpatient form `420:1434` | Patient profile Geliz `459:680`, Marie `488:1955`, Tobias `488:2105`, Eleanor `488:2255`, Hana `488:2405` | Departments `351:501` | Departments Plus `351:733` | Department detail frames `4001:5402`, `4001:5513`, `4001:5764`, `4030:8995`, `4030:9129`, `4030:9263`, `4030:9397` | Billing `351:847` and about 14 state frames `2064:*` | Payroll `623:702` | Personnel `623:1805` | Attendance `2002:369` (plus about 25 state frames: dropdowns, bell, profile, modals, drawers) | Sidebar `211:1949` | Color Palette `217:1021` | Accessibility `248:456`.

Registration dropdown frames: departments `480:1360`, statuses `482:1631`.

## 6. Design tokens (measured from Figma)

Header 83px, gradient `#dff9ff` to `#3393c9` (65.9%) to `#1b4e6b`. Page bg `#f6faff` plus a marble image at 20% opacity. Brand text Lexend SemiBold 19 `#194182`. Date Inter SemiBold 14 `#eef2f7`. Bell 40px `#15405a`.

Sidebar 430x1024, gradient `#1c506e` (57%) to `#5b8db8`; items Lexend Medium 30 `#e4f2f6`, 42px pitch starting y=400, icon at x=58, text at x=130; Sign out `#15254c` 151x57 r10.

Badges (mh-badge): 93x30 r999, Lexend Bold 12. Inpatient `#ffcba3`/`#a6460a`; Outpatient/Admitted/Waiting/Confirmed `#d8ffd3`/`#084d02`; In Consultation/In Progress orange; Completed/Pending grey `rgba(28,43,48,.16)`.

Dashboard: title Outfit Bold 45 `#15405a`; KPI 336x160 r12 stroke `#c8dcea`, icon box 80x72 r24 `#dff0f8`, label Inter Medium 16 `#5b8db8`, value Inter Bold 30 `#1b4e6b`, delta Inter SemiBold 15. Card titles Lexend Medium 20, subtitles Lexend Medium 18 `#8a8a85`.

Registration: stat cards 267x165 r14 stroke `#e1ebf3`, value Inter Bold 32 `#0e2a3f`; table card 1350x638 r10 white; tabs 96x38 r10 `#4c659f`; dropdowns 236x45 r10, border black 30%; table header Inter Bold 15 `#8aa4b6` letter-spacing .44; rows 94px.

Appointments: KPI cards widths 224/197/232/194/183, heights 126/126/126/136/136 (that is how Figma has them), stroke `#e2e8f0` r12; title Inter Bold 25 `#1e293b`; table 1202 wide r12, header 40px `#f8fafc`, rows 64px, text Inter 15, header Inter SemiBold 13 `#64748b`; New button `#1b4e6b` 245x35 r8.

## 7. Status

| Screen | Figma node | Status |
|---|---|---|
| Sidebar + header | `211:1949`, `239:2978` | Rebuilt from measurements. Icons are stand-ins. Logo/avatar images missing (fallbacks). |
| Dashboard | `211:59` | Rebuilt from measurements. Not visually diffed against Figma. |
| Registration | `23:2285` | Rebuilt from measurements. Filters, search, tabs work. New Registration uses a TEMPORARY modal. |
| Appointments | `23:2289` | Rebuilt from measurements. Filters, search, edit, row menu work. New/Edit uses a TEMPORARY modal. |
| Sign in | `211:34` | Basic placeholder, not matched. |
| Everything else | see section 5 | Stubs naming their Figma nodes. |

## 8. Known deviations from Figma (fix or confirm with owner)

- **Estimated, not measured:** appointment status pill colors for Completed/Cancelled/Pending and KPI icon box colors (only Confirmed pill `#e6fdf4`/`#10b981` and Total icon `#dbeafe` were read); badge colors for Critical/Discharged; sidebar "Sign out" font size; hamburger bar widths; schedule timeline dot/line.
- **Images missing:** logo, marble background, avatar. Pages work without them. The Dashboard header in Figma uses a different logo image (`239:3453`, 154x42) than the other pages (`362:*`, 111x77); the site uses one header everywhere.
- Dashboard header-right sits about 44px further right in Figma than on Registration/Appointments. The site uses the Registration/Appointments positions.
- Registration tabs are all the same color in Figma; the site adds a 2px outline on the active tab.
- Modals for New Registration and New/Edit Appointment are NOT in Figma. They must be replaced by the real form screens (below). The row menu (Mark completed / Cancel) on Appointments is also not in Figma.
- Appointments pagination 2 and 3 are disabled (only one page of sample data).
- Data inconsistencies in the Figma file itself: Registration shows Eleanor/Hana registered Aug 30, Dashboard shows them as 8:31 AM/8:12 AM today.
- Nothing has been viewed in a browser by the agent that wrote it. The owner confirmed the earlier (first) version loaded and worked on Pages; the rebuilt version has not been confirmed yet.

## 9. Next steps (in order)

1. Ask the owner to hard refresh the live site and report what looks different from Figma, then fix those first.
2. Convert the form screens and replace the temporary modals: Appointment Form `248:821`, Appointment confirmed `304:502`, Inpatient form `420:1147`, Outpatient form `420:1434`. Wire: New Registration to the right form, row arrow on Registration to the patient profile, New Appointment to the form then the confirmed screen.
3. Patient profile screens `459:680` (+ Marie, Tobias, Eleanor, Hana share the layout).
4. Departments `351:501`, Departments Plus `351:733`, detail frames.
5. Billing `351:847` and its state frames.
6. Payroll `623:702`, Personnel `623:1805`, Attendance `2002:369`.
7. Sign in `211:34` match.
8. Persist data (localStorage) once screens are done.

## 10. Log

- 2026-10-24, session 1: created repo; first version of Dashboard, Registration, Appointments with guessed layout (owner reported frames differed). Then measured Figma and rebuilt Dashboard, Registration, Appointments and sidebar/header with exact positions, fonts and colors; added custom Figma-style dropdowns; added this handoff. Fixed stub pages that would have thrown because they did not load `icons.js`.

# MediHeal HIS: GITHUBPROGRESS.md (formerly docs/HANDOFF.md)

Last updated: Oct 24, 2026 (session 2). Keep this file additive: append to the log, update the status table, do not delete history.

## 0. Rules added in session 2 (owner)

- This file was called `docs/HANDOFF.md`; the owner renamed it to **GITHUBPROGRESS.md** (now `docs/GITHUBPROGRESS.md`).
- **Upload it every turn**: commit it to the repo AND give it to the owner as a file at the end of every turn. Same rules as `FIGMAPROJECT.md`: additive updates, short factual replies, say what was verified and what was not, list leftover items, end with "say continue".
- **`FIGMAPROJECT.md` is now REFERENCE ONLY.** The owner does not need to paste or upload it every session. It is the Figma-side history (about 4,100 lines, not in this repo). Ask for it only if you need Figma history.
- Figma channel used in session 2: `l4zneptm` (joined fine).

## 1. Goal

Convert the Figma file ("Overview (Dashboard, Departments)", page `0:1`) into a GitHub Pages website so features are easy to add. Owner: GitHub user `leequor`. Repo: https://github.com/leequor/mediheal-his. Live: https://leequor.github.io/mediheal-his/ (Pages builds from `main`, root; the owner confirmed it works).

The original assignment is a Hospital Information System UI with 4 modules: Registration (inpatient/outpatient), Doctor Consultation and diagnosis (Payroll, Personnel Details, Attendance), Treatment, Billing (inpatient/outpatient). The owner's Figma handoff file `FIGMAPROJECT.md` (reference only, see section 0) holds the full Figma history.

## 2. User rules (strongest first)

1. **Match the Figma designs exactly.** The owner noticed the first version drifted. Measure real values from Figma (see section 4). Where a value is a guess, mark it `estimated` in the status table and verify later.
2. Handoff notes are additive (this file).
3. Work in small steps, say plainly what is verified and what is not. Do not claim a page works unless it was tested.
4. Never delete Figma frames or repo files without being asked.

## 3. Tech and structure

Plain HTML, CSS and vanilla JS. No build step. Fixed 1440px stage like the Figma frames (`.stage`, `min-width:1440px`). Blocks are absolutely positioned with Figma coordinates (child abs position minus frame origin); tables use CSS grid with column x positions taken from Figma.

```
index.html               Sign in (basic placeholder, not matched to Figma 211:34)
dashboard.html           Dashboard
registration.html        Registration
appointments.html        Appointments
appointment-form.html    Appointment Form (Figma 248:821)              [session 2]
appointment-confirmed.html  Appointment confirmed (Figma 304:502)       [session 2]
<module>.html            Stubs: consultation, treatment, nursing, pharmacy, staff, personnel, payroll, departments, billing
assets/css/tokens.css    Colors, fonts, shadow
assets/css/base.css      Stage, header, sidebar drawer, stub, login
assets/css/components.css  Badges, custom dropdown, temporary modal
assets/css/pages.css     Page specific styles (dashboard, registration, appointments)
assets/css/forms.css     Form screens + confirmed screen              [session 2]
assets/js/data.js        Core mock data (user, dashboard)
assets/js/data-records.js  Patients, appointments, doctors, departments, status lists
assets/js/icons.js       Inline SVG icon set: svg(name,size)
assets/js/ui.js          openModal, makeDropdown, helpers
assets/js/forms.js       fSelect(): Figma-style select for form screens [session 2]
assets/js/shell.js       Shared header + sidebar (edit NAV here)
assets/img/              logo.svg fallback; see assets/img/README.md for images to upload
```

Script order on every page: `data.js`, `data-records.js` (if needed), `icons.js`, `ui.js` or `forms.js` (if needed), `shell.js`. `shell.js` calls `svg()` from `icons.js`, so `icons.js` must load first. A page without it will throw.

Adding a page: copy a stub or `dashboard.html`, set `data-page` on `<body>`, build inside `.stage`, add the nav entry in `shell.js` if new.

Data is in memory only and resets on refresh, EXCEPT appointments saved from the form: they go to localStorage key `mh_appts_extra` and `appointments.html` appends them on load [session 2].

**Stage rule [session 2]:** `.header` is now `position:absolute` over the top 83px, so `.stage` starts at y=0 = the Figma frame origin. All stage coordinates are frame-local. Before this fix every page rendered 83px too low.

## 4. How to work with Figma (MCP: Claude Talk to Figma)

- The owner pastes a channel ID from the Figma plugin. Tools are deferred: `tool_search` to load, then `join_channel`. IDs seen: `yzb0ayme`, `l4zneptm`. If a join fails, ask for a new ID. The plugin can disconnect; re-join with a fresh ID.
- **Never** `get_node_info` on page `0:1` (260 top-level children): it disconnected the plugin. Use one frame at a time, `depth` 2 to 4.
- `get_node_info` truncates deeper children (`_childrenTruncated`); call it again on the child id, or use `get_nodes_info` with a list of ids. It gives `absoluteBoundingBox`, fills, strokes, radius, and text style (font, size, weight, color, letter spacing). It does NOT give effects (shadows), stroke weight, or vectors; use `export_node_as_image` (scale 1.5 to 3 on a small node) to see those.
- `export_node_as_image` (PNG, scale 0.5) lets you see the design. Image fills (logo, marble background, avatar) cannot be copied as files by these tools. They must be exported by the owner (see `assets/img/README.md`).
- `get_reactions` on a button gives its prototype link (used to wire navigation). `get_svg` on an icon gives exact paths and colors.
- Frame origins (abs to page coords): Dashboard `211:59` (1600,34000); Registration `23:2285` (3200,34000); Appointments `23:2289` (4800,34000); Appointment Form `248:821` (6400,34000); Appointment confirmed `304:502` (8000,34000); Sidebar `211:1949` (0,51000). All page frames are 1440x1120.
- A headless browser tool (obscura: `browser_navigate`, `browser_evaluate`) can open the live site and read `getBoundingClientRect()` values to compare against Figma. Used in session 2 to find the 83px bug.

## 5. Figma node map

Sign in `211:34` | Dashboard `211:59` | Registration `23:2285` | Appointments `23:2289` | Appointment Form `248:821` | Appointment confirmed `304:502` | Inpatient form `420:1147` | Outpatient form `420:1434` | Patient profile Geliz `459:680`, Marie `488:1955`, Tobias `488:2105`, Eleanor `488:2255`, Hana `488:2405` | Departments `351:501` | Departments Plus `351:733` | Department detail frames `4001:5402`, `4001:5513`, `4001:5764`, `4030:8995`, `4030:9129`, `4030:9263`, `4030:9397` | Billing `351:847` and about 14 state frames `2064:*` | Payroll `623:702` | Personnel `623:1805` | Attendance `2002:369` (plus about 25 state frames: dropdowns, bell, profile, modals, drawers) | Sidebar `211:1949` | Color Palette `217:1021` | Accessibility `248:456`.

Registration dropdown frames: departments `480:1360`, statuses `482:1631`.

Figma prototype links read in session 2: Appointments "New Appointment / Walk-In" `196:118` -> `248:821`; Form Confirm `276:534` -> `304:502`; Form Cancel `276:531` -> `23:2289`; Confirmed Go back `304:508` -> `23:2289`.

## 6. Design tokens (measured from Figma)

Header 83px, gradient `#dff9ff` to `#3393c9` (65.9%) to `#1b4e6b`. Page bg `#f6faff` plus a marble image at 20% opacity. Brand text Lexend SemiBold 19 `#194182`. Date Inter SemiBold 14 `#eef2f7`. Bell 40px `#15405a`.

Sidebar 430x1024, gradient `#1c506e` (57%) to `#5b8db8`; items Lexend Medium 30 `#e4f2f6`, 42px pitch starting y=400, icon at x=58, text at x=130; Sign out `#15254c` 151x57 r10.

Badges (mh-badge): 93x30 r999, Lexend Bold 12. Inpatient `#ffcba3`/`#a6460a`; Outpatient/Admitted/Waiting/Confirmed `#d8ffd3`/`#084d02`; In Consultation/In Progress orange; Completed/Pending grey `rgba(28,43,48,.16)`.

Dashboard: title Outfit Bold 45 `#15405a`; KPI 336x160 r12 stroke `#c8dcea`, icon box 80x72 r24 `#dff0f8`, label Inter Medium 16 `#5b8db8`, value Inter Bold 30 `#1b4e6b`, delta Inter SemiBold 15. Card titles Lexend Medium 20, subtitles Lexend Medium 18 `#8a8a85`.

Registration: stat cards 267x165 r14 stroke `#e1ebf3`, value Inter Bold 32 `#0e2a3f`; table card 1350x638 r10 white; tabs 96x38 r10 `#4c659f`; dropdowns 236x45 r10, border black 30%; table header Inter Bold 15 `#8aa4b6` letter-spacing .44; rows 94px.

Appointments: KPI cards widths 224/197/232/194/183, heights 126/126/126/136/136 (that is how Figma has them), stroke `#e2e8f0` r12; title Inter Bold 25 `#1e293b`; table 1202 wide r12, header 40px `#f8fafc`, rows 64px, text Inter 15, header Inter SemiBold 13 `#64748b`; New button `#1b4e6b` 245x35 r8.

Appointment Form [session 2, measured]: card local (116,144) 1207x739; title Outfit Bold 37 black at (566,195); section headings Inter Bold 17; labels Inter Bold 11; info text Inter 11; inputs white, stroke `#8e8e8e` 1px, r10, placeholder Inter 11 black at 20%; selects white r10 with drop shadow, Inter 12 text at +10, 24px chevron 10px from right; Cancel `#2975a0` and Confirm `#1b4e6b`, 208x47 r30, Inter SemiBold 16 `#d6f4fc`, at (877,948) and (1108,948). Divider lines `#b3b3b3` at y 283 and 711, x 155, width 1130.
Appointment confirmed [session 2, measured]: card (415,375) 633x307 r30 white; check icon `#34C759` 94x95 at (673,419); title Outfit Bold 37 `#15405a` centered, box (430,528) 611.5 wide, two lines; Go back button (632,754) 208x47 r30, gradient right `#1b4e6b` to left `#3598d1`, Outfit Bold 24 `#d6f4fc`.

## 7. Status

| Screen | Figma node | Status |
|---|---|---|
| Sidebar + header | `211:1949`, `239:2978` | Rebuilt from measurements. Icons are stand-ins. Logo/avatar images missing (fallbacks). |
| Dashboard | `211:59` | Rebuilt from measurements. Not visually diffed against Figma. Stage offset fixed in session 2 (not re-checked). |
| Registration | `23:2285` | Rebuilt from measurements. Filters, search, tabs work. New Registration uses a TEMPORARY modal. |
| Appointments | `23:2289` | Rebuilt. Filters, search, row menu work. New button now opens the real form. Edit still uses a TEMPORARY modal (Figma has no edit screen). Pagination text bug fixed. |
| Appointment Form | `248:821` | BUILT session 2 from measurements. NOT checked in a browser. See estimates in section 8. |
| Appointment confirmed | `304:502` | BUILT session 2 from measurements. NOT checked in a browser. |
| Sign in | `211:34` | Basic placeholder, not matched. |
| Everything else | see section 5 | Stubs naming their Figma nodes. |

## 8. Known deviations from Figma (fix or confirm with owner)

- **Estimated, not measured:** appointment status pill colors for Completed/Cancelled/Pending and KPI icon box colors (only Confirmed pill `#e6fdf4`/`#10b981` and Total icon `#dbeafe` were read); badge colors for Critical/Discharged; sidebar "Sign out" font size; hamburger bar widths; schedule timeline dot/line.
- **Estimated in session 2 (form screens):** form card radius (30) and shadow (the card is a vector, not readable); drop shadows on selects, buttons and the confirmed card (`0 4px 4px rgba(0,0,0,.25)` and similar); divider line thickness (1px; Figma boxes are 4px and 2px tall); gap between a select and its open list (6px); Doctors select height (39, it is clipped in Figma); chevron glyph (lucide chevron-down, stroke 2).
- **Form content choices (Figma has only placeholders):** Date list 1-31 (Figma shows 1-12), Year list 111 years back, Civil Status = Single/Married/Widowed/Separated/Divorced, Gender = Female/Male (from Figma), Doctors and Appointment type from `HIS` data.
- **Added, not in Figma:** red-border validation on the form (required: first name, last name, doctor, type, valid MM/DD/YYYY date, valid time); localStorage save of new appointments; stored patient details object on the record.
- **Left out:** Figma footer-bar `304:532` on the confirmed frame (contact line) does not show in the Figma export, so it is not drawn. Sub-labels of Middle Initial/Phone/Email/vitals are hidden behind fields in Figma and not drawn.
- **Images missing:** logo, marble background, avatar. Pages work without them. The Dashboard header in Figma uses a different logo image (`239:3453`, 154x42) than the other pages (`362:*`, 111x77); the site uses one header everywhere.
- Dashboard header-right sits about 44px further right in Figma than on Registration/Appointments. The site uses the Registration/Appointments positions.
- Registration tabs are all the same color in Figma; the site adds a 2px outline on the active tab.
- Modals for New Registration and Edit Appointment are NOT in Figma. New Registration must be replaced by the real form screens (below). The row menu (Mark completed / Cancel) on Appointments is also not in Figma.
- Appointments pagination 2 and 3 are disabled (only one page of sample data).
- Data inconsistencies in the Figma file itself: Registration shows Eleanor/Hana registered Aug 30, Dashboard shows them as 8:31 AM/8:12 AM today.
- Nothing has been viewed in a browser by the agent that wrote it, except the live Appointments page measurements below (session 2).

## 9. Next steps (in order)

1. [session 2: partly done] Check the live site against Figma: compare element positions with `getBoundingClientRect` (obscura) and export-compare the Appointment Form and confirmed screens; fix estimates. Ask the owner to hard refresh and report differences.
2. Convert the remaining form screens: Inpatient form `420:1147`, Outpatient form `420:1434` (Appointment Form `248:821` and Appointment confirmed `304:502` are DONE in session 2, unverified). Wire: New Registration to the right form, row arrow on Registration to the patient profile.
3. Patient profile screens `459:680` (+ Marie, Tobias, Eleanor, Hana share the layout).
4. Departments `351:501`, Departments Plus `351:733`, detail frames.
5. Billing `351:847` and its state frames.
6. Payroll `623:702`, Personnel `623:1805`, Attendance `2002:369`.
7. Sign in `211:34` match.
8. Persist data (localStorage) once screens are done (started for new appointments only).

## 10. Log

- 2026-10-24, session 1: created repo; first version of Dashboard, Registration, Appointments with guessed layout (owner reported frames differed). Then measured Figma and rebuilt Dashboard, Registration, Appointments and sidebar/header with exact positions, fonts and colors; added custom Figma-style dropdowns; added this handoff. Fixed stub pages that would have thrown because they did not load `icons.js`.
- 2026-10-24, session 2 (Figma channel `l4zneptm`): renamed this file to GITHUBPROGRESS.md; FIGMAPROJECT.md is reference only. VERIFIED on the live site before the fix: `.stage` started at y=83 (KPI at 236 vs Figma 153) and pagination buttons showed literal `\u2039`. Commit `5df3ba9`: `.header` made absolute (stage offset fix), added `forms.css`, `forms.js`, `appointment-form.html`, `appointment-confirmed.html` from Figma measurements. Commit `5cf86fa`: `appointments.html` New button goes to the form, appends saved appointments from localStorage, pagination uses `&lsaquo;`/`&rsaquo;`. NOT verified after the fixes: no browser check of the new pages, offset fix, confirm flow, or visual match. Opened the live form URL only (title loaded). Figma file not modified.
