# Session 23 addendum (2026-10-26) - READ AFTER the session 21 addendum (session 22 logs live there)

## Log
- Turn 1 start (new chat; owner: "Connect to Figma, channel kg2chfrt, goto github"). This host has NO Figma MCP server registered. Joined channel `kg2chfrt` by attaching a small client (`figma.mjs`) to the already-running bridge `bun dist/socket.cjs` on ws://localhost:3055: send `{type:"join",channel}`, then `{type:"message",channel,message:{id,command,params}}`, match the reply by `message.id` + `result`. Confirmed live with `get_document_info` (page `0:1`, 15 top-level children returned).
- Two commits are NEWER than the newest log entry (session 22 turn 2, `c197a7d`) and are NOT logged or verified: `345c09a` Notifications panel on every page, Figma `2072:3499` (`assets/js/shell.js` +77); `61f3377` keep the panel open after Mark all / row click (`assets/js/shell.js` +6/-1). Plan: verify both live, then continue leftovers.
- Read order done: `AGENTS.md`, session 21 addendum (holds session 22), `docs/` listing (no session 22 addendum file), last 5 commits.

## Turn 1 results (verified live, Playwright on the owner's browser)
- NOTIFICATIONS (the two unlogged commits) VERIFIED on the live site, key `mh_notif_read` (did not exist before; removed after the test):
  - dashboard.html: bell opens `.nf-p` at frame-local (952,90) 420x492, 4 rows, badge "4", subtitle "4 unread \u00b7 Attendance and payroll".
  - Mark all as read -> key `[0,1,2,3]`, 4 rows `.rd`, 0 dots, button disabled, subtitle "All caught up", badge hidden, and the panel STAYS OPEN (this is `61f3377`, verified).
  - Reload -> state re-applied (all rows read, badge hidden, aria-label "Notifications").
  - Esc closes; click outside closes; X closes (personnel.html). Row click marks one: key `[0]`, badge "3", subtitle "3 unread".
  - Panel present and working on dashboard.html, personnel.html, treatment.html; absent on index.html (Sign in), as expected.
- TREATMENT PLAN ACTIONS (session 21 item still untested) VERIFIED on treatment.html?id=PT-99213, key `mh_treatment_state` (absent before; removed after the test):
  - Order tests -> modal "Order lab / imaging test" (6/6 fields prefilled), saved `f.next` = "Awaiting result: Troponin I"; still shown on the page after reload.
  - Status -> `pstat` = "done", plan badge reads Completed.
  - Assign bed -> modal "Assign ward and bed", `type` = "Inpatient", `f.care` = "Inpatient \u00b7 Ward 3, Bed 12".
  - Discharge summary (?modal=summary) -> modal "Discharge summary", button "Discharge"; `pstat` = done, `f.next` = "Discharged on Sep 7, 2026", modal closes.
- PHARMACY / STAFF: both stubs ALREADY redirect (`pharmacy.html` -> `treatment.html?modal=pharmacy`, `staff.html` -> `personnel.html`), matching the v171 default decision. Nothing to build there; the v171 "Next step" is closed.
- NOT verified: the discharged / next-step TEXT rendered after a reload (the key was cleared right after the assert; localStorage values were read instead), pixel comparison vs Figma, modals/menus at narrow widths.

## Next steps (open, all optional unless the owner says otherwise)
1. Treatment "Schedule procedure" (proc) persistence + nursing rendered counters after reload (session 21 turn 2 left them unchecked).
2. Modals/menus inside narrow windows with `fit.js` v3 (they scale with the stage, but were never opened at <800px); `?fit=0` path.
3. Owner-deferred: real phone layout (needs new Figma frames), sidebar CLOSE/dismiss animation comparison.
