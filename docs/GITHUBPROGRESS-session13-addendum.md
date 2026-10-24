# Session 13 addendum (2026-10-24) - READ AFTER docs/GITHUBPROGRESS.md and the session 12 addendum

## Log
- Session 13 (owner uploaded the v169 handoff: "Connect to Figma, channel l4zneptm goto github", then "continue / also fix this" with a screenshot of the open sidebar, then "done, continue"): joined `l4zneptm` (OK); opened GITHUBPROGRESS.md, then the session 12 addendum, then `list_commits` (latest `41f5ec8`, no unlogged work). Start-of-turn log deferred (the main file is ~35k tokens); this small file is used instead.
- Owner request: (1) sidebar logo is pixelated, (2) remove the scrollbars in the sidebar (vertical and horizontal showed in the screenshot).
- Fix 2, commit `607e391` (`assets/css/base.css`): `.drawer` is `overflow-x:hidden;overflow-y:auto` with `scrollbar-width:none`, `-ms-overflow-style:none`, `.drawer::-webkit-scrollbar{display:none}`. VERIFIED live (Playwright, 674px-high window): computed overflow-x hidden, scrollbar-width none, offsetWidth = clientWidth = 430 (no scrollbar), scrollHeight 1024 so it still scrolls by wheel/touch. NOT verified: a screenshot.
- Fix 1: cause was `logo-removebg-preview 1.png` (222x154) drawn at 634x441. Owner uploaded `assets/img/logo-large.png` (555x385, same aspect ratio). Commit `5e412a1` (`assets/js/shell.js`): both the header logo and the sidebar logo use `logo-large.png`, with `logo-removebg-preview 1.png` as the error fallback (the old fallback `logo.svg` is no longer used by the shell). VERIFIED live: both images load `logo-large.png`, naturalWidth 555, sidebar box still 634x441 (upscale now about 1.14x instead of 2.9x). If it still looks soft, ask for a 1300px+ export (Figma PNG 6x). NOT verified: a screenshot by eye.

## Next steps
1. Owner: check the sidebar logo by eye; if still soft, export larger.
2. Attendance leftovers (`get_reactions` on Export / Approve timesheets / Sync / Decline / Clock in/out / Details, overlay screenshots vs exports) and the small fixes from the session 12 addendum (profile meta trailing dot, profile fallback reads `p.details`, `personnel.css` `!important` height, `favicon.ico` 404).
3. Then the profile modals (Edit `2027:2458`, Transfer `2027:2643`, Discharge `2027:2828`, Pharmacy `2047:25913`, Discharge summary `2047:25314`) and Treatment Plan `2047:17739`.
