# Session 23 addendum (2026-10-26) - READ AFTER the session 21 addendum (session 22 logs live there)

## Log
- Turn 1 start (new chat; owner: "Connect to Figma, channel kg2chfrt, goto github"). This host has NO Figma MCP server registered. Joined channel `kg2chfrt` by attaching a small client (`figma.mjs`) to the already-running bridge `bun dist/socket.cjs` on ws://localhost:3055: send `{type:"join",channel}`, then `{type:"message",channel,message:{id,command,params}}`, match the reply by `message.id` + `result`. Confirmed live with `get_document_info` (page `0:1`, 15 top-level children returned).
- Two commits are NEWER than the newest log entry (session 22 turn 2, `c197a7d`) and are NOT logged or verified: `345c09a` Notifications panel on every page, Figma `2072:3499` (`assets/js/shell.js` +77); `61f3377` keep the panel open after Mark all / row click (`assets/js/shell.js` +6/-1). Plan: verify both live, then continue leftovers.
- Read order done: `AGENTS.md`, session 21 addendum (holds session 22), `docs/` listing (no session 22 addendum file), last 5 commits.

## Turn 1 results (verified live, Playwright on the owner's browser)
- NOTIFICATIONS (the two unlogged commits) VERIFIED on the live site, key `mh_notif_read` (did not exist before; removed after the test):
  - dashboard.html: bell opens `.nf-p` at frame-local (952,90) 420x492, 4 rows, badge "4", subtitle "4 unread · Attendance and payroll".
  - Mark all as read -> key `[0,1,2,3]`, 4 rows `.rd`, 0 dots, button disabled, subtitle "All caught up", badge hidden, and the panel STAYS OPEN (this is `61f3377`, verified).
  - Reload -> state re-applied (all rows read, badge hidden, aria-label "Notifications").
  - Esc closes; click outside closes; X closes (personnel.html). Row click marks one: key `[0]`, badge "3", subtitle "3 unread".
  - Panel present and working on dashboard.html, personnel.html, treatment.html; absent on index.html (Sign in), as expected.
- TREATMENT PLAN ACTIONS (session 21 item still untested) VERIFIED on treatment.html?id=PT-99213, key `mh_treatment_state` (absent before; removed after the test):
  - Order tests -> modal "Order lab / imaging test" (6/6 fields prefilled), saved `f.next` = "Awaiting result: Troponin I"; still shown on the page after reload.
  - Status -> `pstat` = "done", plan badge reads Completed.
  - Assign bed -> modal "Assign ward and bed", `type` = "Inpatient", `f.care` = "Inpatient · Ward 3, Bed 12".
  - Discharge summary (?modal=summary) -> modal "Discharge summary", button "Discharge"; `pstat` = done, `f.next` = "Discharged on Sep 7, 2026", modal closes.
- PHARMACY / STAFF: both stubs ALREADY redirect (`pharmacy.html` -> `treatment.html?modal=pharmacy`, `staff.html` -> `personnel.html`), matching the v171 default decision. Nothing to build there; the v171 "Next step" is closed.
- NOT verified: the discharged / next-step TEXT rendered after a reload (the key was cleared right after the assert; localStorage values were read instead), pixel comparison vs Figma, modals/menus at narrow widths.

## Next steps (open, all optional unless the owner says otherwise)
1. Treatment "Schedule procedure" (proc) persistence + nursing rendered counters after reload (session 21 turn 2 left them unchecked).
2. Modals/menus inside narrow windows with `fit.js` v3 (they scale with the stage, but were never opened at <800px); `?fit=0` path.
3. Owner-deferred: real phone layout (needs new Figma frames), sidebar CLOSE/dismiss animation comparison.

## Turn 1 results (continued, same session)
- TREATMENT "Schedule procedure" VERIFIED on treatment.html?id=PT-99213: modal prefilled 6/6 ("Coronary angiography", Dr. Laurice Laureta (Cardiology), Cath Lab 1, Sep 2 2026, 9:00 AM · about 60 minutes); saved `f.procs` = "Coronary angiography · Sep 2, 2026" and that text is on the page after a reload. Key `mh_treatment_state` removed (did not exist before).
- NURSING VERIFIED on nursing.html: Record vitals -> prefilled 6/6, saved `recs['PT-99213'].vit` with the 6:00 PM row now "BP 142/88 · HR 86 · 36.8 °C · SpO₂ 98%", and that row is RENDERED on the page after a reload (session 21 only checked localStorage). Give medicine -> "Give medicine" modal saved (`doses` = 6, `vitDue` = 2, `vitDone` = {PT-99213:true}). My regex did not match a rendered dose counter, so only the localStorage counter is verified.
- localStorage after the turn: only `mh_regs_extra` (the owner's) remains; `mh_notif_read`, `mh_treatment_state`, `mh_nursing_state` were all removed after their tests.
- Item 1 of "Next steps" above is now DONE. Items 2 and 3 stay open.

## Turn 1 results (continued 2) - narrow layout + sidebar close comparison
- fit.js v3 at narrow widths VERIFIED in hidden iframes (fresh page loads; transitions disabled for end-state reads): 1200 / 1000 / 800 / 390 -> stage zoom 0.823 / 0.694 / 0.556 / 0.271, stage width == viewport, scrollWidth == clientWidth (no sideways scroll) on treatment.html?id=PT-99213.
- Order-tests MODAL inside those iframes: fully inside the viewport at every width (1200: x 313-872; 1000: 264-736; 800: 211-589; 390: 103-287), no clipping.
- SIDEBAR at 390: `.fit-burger` visible, drawer zoom 0.907 -> width exactly 390, left 0, scrim opacity 1, no horizontal scroll. At 800: drawer 430, left 0, burger visible. (Measured with transitions off: see the throttling note below.)
- `?fit=0` at 800: zoom 1, stage 1440, horizontal scroll = true (opt-out works as documented).
- SIDEBAR CLOSE ANIMATION compared: Figma `211:1949` itself has 0 reactions. The OPEN comes from the original dashboard menu button `239:1422` -> OVERLAY `211:1949`, MOVE_IN RIGHT 0.3s EASE_OUT. Figma's overlay close (CLOSE action / click outside) has no exit transition, i.e. instant. The site animates BOTH ways: `.drawer{transition:transform .3s ease-out}` + `.scrim{transition:opacity .3s}` (base.css). So OPEN matches Figma; CLOSE is an extra 300ms reverse slide that Figma does not have. LEFT AS IS (nicer dismissal). If the owner wants it Figma-exact, the one-line change is `.drawer{transition:none}` + `body.menu-open .drawer{transition:transform .3s ease-out}` (same for `.scrim`).
- IMPORTANT for future Playwright animation tests: the owner's tab was `visibilityState: hidden` this turn, so CSS transitions never advanced (drawer left stayed -430 at 120ms and 350ms even with body.menu-open set). Read end states with `transition:'none'`, or bring the tab to the foreground.
- PHONE LAYOUT: still BLOCKED. No phone-width Figma frame exists; building one would invent design. fit.js v3 (width-only scale) is the approved substitute. Owner-deferred.
- Nothing was pushed to the site this turn (verification only). Items 2 of "Next steps" is now DONE; item 3 stays (phone layout blocked, close comparison done).

## Turn 2 (2026-10-26) - full sweep; notifications were missing on 3 pages (fixed)
- FULL SWEEP (Playwright, one fresh tab, 15 URLs including the two redirects): all 200, `HIS` loaded, 0 console errors / 0 warnings everywhere, pharmacy -> treatment.html?modal=pharmacy and staff -> personnel.html redirect correctly.
- The sweep found a real BUG the session-22 commits had missed: the notifications panel was MISSING on `billing.html`, `departments.html` and `profile.html` (bell present, `.nf-p` absent), so `345c09a` "on every page" was only true for 11 of 14. Cause: `billing.js:26`, `departments.js:38/68` and `profile.js:81` do `stage.innerHTML = ...`, which deletes the panel that shell.js had appended to the stage at load. The other pages render into child wrappers, which is why they were fine.
- FIX (commit `7fba064`, ONE file `assets/js/shell.js`, +4 lines): a `MutationObserver` on the stage re-appends the panel whenever a page wipes it, plus a `setOpen` guard `if (o && !panel.isConnected) stage.appendChild(panel)`.
- VERIFIED live after the Pages redeploy (shell.js forced with `fetch(..., {cache:'reload'})`): billing, departments and profile -> panel present on load, bell opens it (4 rows), and it SURVIVES `stage.innerHTML=''` (observer re-attaches it, still open). 0 console errors/warnings on all three.
- NOT verified: a real billing filter/action click that re-renders (the wipe test simulates the same innerHTML replacement), pixel comparison of the panel, owner acceptance.
- Tooling note: the GitHub MCP write tool returns a schema error ("data must have required property 'result'") even when the commit succeeds - always verify by reading the commit back. For whole-file edits it is easier to use a local `git clone` + `git push` (credentials are stored); that is how `7fba064` was pushed.
- localStorage: nothing written this turn.

