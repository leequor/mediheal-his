# MediHeal HIS: GITHUBPROGRESS.md

Last updated: Oct 24, 2026 (session 3). Additive: append to the log, update the status table, never delete history.
Earlier history (sessions 1 and 2, full text with all measured tokens for Dashboard, Registration, Appointments, Appointment Form, Appointment confirmed) is kept UNCHANGED in `docs/HANDOFF.md`. Read it for those tokens. This file carries the current rules, state and next steps.

## 0. Rules (owner)
1. Match the Figma designs exactly. Measure real values; mark guesses `estimated`.
2. This file is additive. ALWAYS commit it to the repo (`docs/GITHUBPROGRESS.md`) at the end of every turn, and make that the FIRST priority: other agents read it from GitHub. Do NOT send the file to the owner in chat (owner rule, session 3).
3. Short factual replies. Say what was verified and what was NOT. List leftovers. End with "say continue".
4. Work in small steps. Never delete Figma frames or repo files without being asked.
5. `FIGMAPROJECT.md` (about 4,100 lines, Figma side) is REFERENCE ONLY. Do not ask for it unless Figma history is needed.
6. Figma channel for session 3: `l4zneptm` (joined fine). IDs seen: `yzb0ayme`, `l4zneptm`.

## 1. Goal
Convert the Figma file "Overview (Dashboard, Departments)" (page `0:1`) into a GitHub Pages site. Repo https://github.com/leequor/mediheal-his, live https://leequor.github.io/mediheal-his/ (Pages from `main`, root). Original assignment: HIS UI with Registration (inpatient/outpatient), Doctor Consultation and diagnosis (Payroll, Personnel Details, Attendance), Treatment, Billing (inpatient/outpatient).

## 2. Tech and structure
Plain HTML, CSS, vanilla JS, no build. Fixed 1440px `.stage`; `.header` is absolute so stage y=0 equals the Figma frame origin (all coordinates frame-local). Script order: `data.js`, `data-records.js`, `icons.js`, (`ui.js` / `forms.js` / `reg-form.js`), `shell.js` last.
New in session 3:
- `registration-form.html` Inpatient form (Figma `420:1147`), styles `assets/css/reg-forms.css`, logic `assets/js/reg-form.js` (builds 6 sections from a config, live summary card, validation, save).
- `outpatient-form.html` stub for Figma `420:1434`.
- `registration.html`: New Registration now goes to `registration-form.html` (temporary modal removed); registrations saved by the form are read from localStorage key `mh_regs_extra` (array, oldest first, newest shown on top).
Other localStorage: `mh_appts_extra` (appointments).

## 3. Figma how-to (unchanged, short)
Join with the pasted channel ID (`tool_search`, then `join_channel`). Never `get_node_info` on page `0:1`. Use depth 2 to 5 on one frame; `get_nodes_info` for lists; `export_node_as_image` (0.5 to 2) to see effects; `get_reactions` for prototype links. Frame origins: Dashboard (1600,34000); Registration (3200,34000); Appointments (4800,34000); Appointment Form (6400,34000); Appointment confirmed (8000,34000); **Inpatient form `420:1147` (0,39600), 1440x2789**; Sidebar (0,51000). A headless browser (obscura `browser_navigate`, `browser_evaluate`, `browser_screenshot`) can open the live site and read `getBoundingClientRect()`. Its fonts are fallbacks, so text widths and wrapping in screenshots are NOT reliable.

## 4. Inpatient form measurements (session 3, from Figma `420:1147`)
Back link `420:1173` (40,108), icon 15, text Inter Medium 13.5 `#4d6a80` at x63. Title Lexend Bold 26, letter-spacing -0.26, `#0e2a3f`, at (40,160). Date chip 174.25x38 at (1225.75,147.6) r10 white, stroke `#e1ebf3`, Inter Medium 13 `#4d6a80`. Type cards 670x77.6 r14 at (40,227.6) active fill `#dcf0ff` and (730,228) white, stroke `#1d4179`; icon box 40 r10 `#1d4179`; title Inter Bold 15; desc Inter 12.5 `#4d6a80`; check badge 16 `#1f9d6b`.
Sections (x40, w1000, r16, white, stroke `#e1ebf3`, padding 26.8/28.8): tops 327.2, 913, 1458, 1807, 2155, 2452; heights 565.8, 525, 329, 328, 277, 277. Head: icon 38 r10 `#1d4179`, gap 14, title Inter Bold 16.5 `#0e2a3f`, sub Inter 13 `#4d6a80` (Emergency Contact sub is `#ff8000` at 30% opacity). Head 42.2 high, 24 gap, rows 20 gap. Fields: 3 columns 300.8 or 2 columns 461.2 (gap 20). Label box 18 high; required label (asterisk) is Inter Regular 12 black, optional label is Inter SemiBold 13 `#0e2a3f`. Control at +25.6, 42 high, r9, stroke `#e1ebf3`, text Inter 13.5 at the TOP of the box (+0.8), x +14.8; placeholder `#b9c8d3`; select value `#0e2a3f`, chevron 12px at x+274.8. Hint at +77.6, Inter 11.5 `#8aa4b6`. Textarea 120 high; count at +149.6 right aligned; hint at +175.6; textarea placeholder at +12.8, line height 20.25.
Summary card (1060,327.2) 340x531.2 r16: title Inter Bold 16.5; sub Inter 12.5; patient box 290.4x66 r12 `#dcf0ff`, avatar 38 `#1d4179`, name Inter Bold 14, meta Inter 12 `#8aa4b6`; rows 42.4 high at +173.2, +215.6, +258, +300.4, last at +342.8 (no border); label Inter 13.5 `#4d6a80`; value `#8aa4b6` (or `#0e2a3f` SemiBold for Registered by); Confirm 290.4x48 r11 `#1d4179` Inter Bold 14.5 white at +400.4; Cancel at +458.4 white, stroke `#e1ebf3`, Inter SemiBold 14.5.
Prototype links read: Back to Registry `420:1173`, Confirm `420:1427`, Cancel `420:1432` all go to Registration `23:2285`; Outpatient type card `488:1803` goes to `420:1434`.
Section content (labels, placeholders, hints) is in `assets/js/reg-form.js` (`SECS`).

## 5. Status
| Screen | Figma node | Status |
|---|---|---|
| Sidebar + header | `211:1949`, `239:2978` | Rebuilt. Icons stand-ins. Logo/avatar images missing. |
| Dashboard | `211:59` | Rebuilt. Not visually diffed. |
| Registration | `23:2285` | Rebuilt. New Registration opens the Inpatient form. Saved registrations appear on top. |
| Appointments | `23:2289` | Rebuilt. New opens the form. Edit still a TEMPORARY modal (not in Figma). |
| Appointment Form / confirmed | `248:821`, `304:502` | Built session 2. Session 3: form page loads, stage at y=0, card at (116,144) matches Figma. Not checked against an export visually. |
| **Inpatient form** | `420:1147` | **BUILT session 3.** Verified on the live site: all 6 sections, summary card, both type cards, first input, selects, textarea and both buttons sit within 1px of the Figma coordinates; empty Confirm flags the 12 required fields; filling updates the summary live; Confirm saves, goes to `registration.html`, shows the new row on top, KPI total 5 to 6. NOT verified: pixel match of fonts/shadows, mobile, real-browser font wrapping (see section 6). |
| Outpatient form | `420:1434` | Stub only. |
| Sign in | `211:34` | Basic placeholder. |
| Everything else | see node map in `docs/HANDOFF.md` section 5 | Stubs. |

## 6. Deviations and estimates (Inpatient form)
- Estimated (not readable from Figma): card and summary shadows `0 4px 4px rgba(0,0,0,.25)`; green glow under Confirm `0 6px 16px rgba(31,157,107,.28)`; type card stroke 1px; select chevron colour `#8aa4b6`; dropdown list look (Figma has no open-list frame); icon glyphs (lucide stand-ins for the vector icons).
- Option lists are my choices, Figma shows only "Please select": Blood Type A+ to O-; Civil Status Single, Married, Widowed, Separated, Divorced; Ward General Ward, Semi-Private, Private Room, ICU, Pediatric Ward, Maternity Ward; Patient Condition Stable, Fair, Serious, Critical; Gender Female, Male; Department and Doctor from `HIS` lists. Assigned Doctor is NOT narrowed by Department (no mapping exists).
- Figma places the calendar icon at the top-left corner of the Date of Birth input, on top of the placeholder. I kept that position but hide the icon once a value is typed (my addition).
- Added, not in Figma: red-border validation (required fields, dd/mm/yyyy dates, DOB not in the future, email format), live summary, saving to localStorage, Critical condition saves status Critical and counts as Needs Attention, avatar initials from first and last typed words.
- Headless screenshot showed the Personal Information subtitle on one line; Figma wraps it to two lines (width 276.8). The width is set, wrapping with the real Inter font NOT confirmed.
- Figma frames were NOT modified this session.

## 7. Next steps
1. Owner: hard refresh the live site (`registration-form.html`), compare with Figma, report differences (fonts, wrapping, shadows). Fix those first.
2. Outpatient form `420:1434`: measure and build (reuse `reg-forms.css` and the `SECS` approach); wire the type cards both ways.
3. Row arrow on Registration to the patient profile screens `459:680` (Geliz), `488:1955` (Marie), `488:2105` (Tobias), `488:2255` (Eleanor), `488:2405` (Hana).
4. Departments `351:501`, Departments Plus `351:733`, detail frames. Then Billing `351:847` + states, Payroll `623:702`, Personnel `623:1805`, Attendance `2002:369`, Sign in `211:34`.
5. Replace the temporary Edit Appointment modal when a Figma screen exists. Persist more data.

## 8. Log
- 2026-10-24 session 1 and 2: see `docs/HANDOFF.md`.
- 2026-10-24 session 3 (Figma channel `l4zneptm`): read repo handoff. Verified live Appointment Form positions (stage y=0, card (116,144)). Measured Figma `420:1147` (6 sections, summary card, type cards, header bits, prototype links). Commit `192705f`: added `registration-form.html`, `assets/css/reg-forms.css`, `assets/js/reg-form.js`, `outpatient-form.html`. Commit `e65bbdf`: `registration.html` New Registration goes to the form, shows saved registrations. Tested on the live site with a headless browser (coordinates, validation, summary, save and redirect). Created this file (the repo had `docs/HANDOFF.md`, not `GITHUBPROGRESS.md`; HANDOFF.md left untouched). Owner rule added: commit this file to GitHub first every turn, do not send it in chat.
