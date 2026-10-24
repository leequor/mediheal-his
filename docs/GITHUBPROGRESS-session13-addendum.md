# Session 13 addendum (2026-10-24) - READ AFTER docs/GITHUBPROGRESS.md and the session 12 addendum

## Log
- Session 13 (owner uploaded the v169 handoff: "Connect to Figma, channel l4zneptm goto github", then "continue / also fix this" with a screenshot of the open sidebar, then "done, continue", then "i uploaded a bigger file. continue."): joined `l4zneptm` (OK); opened GITHUBPROGRESS.md, then the session 12 addendum, then `list_commits` (latest `41f5ec8`, no unlogged work). Start-of-turn log deferred (the main file is ~35k tokens); this small file is used instead.
- Owner request: (1) sidebar logo is pixelated, (2) remove the scrollbars in the sidebar.
- Fix 2, commit `607e391` (`assets/css/base.css`): `.drawer` is `overflow-x:hidden;overflow-y:auto` with `scrollbar-width:none`, `-ms-overflow-style:none`, `.drawer::-webkit-scrollbar{display:none}`. VERIFIED live: computed overflow-x hidden, scrollbar-width none, offsetWidth = clientWidth = 430, scrollHeight 1024 (still scrolls by wheel/touch).
- Fix 1: the old `logo-removebg-preview 1.png` was 222x154 drawn at 634x441. Owner uploaded `assets/img/logo-large.png` twice: 555x385, then 1110x770 (178 KB, same aspect ratio; VERIFIED fetched 1110x770). Commit `5e412a1` (`assets/js/shell.js`): header and sidebar logos use `logo-large.png`, old PNG as error fallback. Sidebar box is still 634x441, so the upscale is now below 1x (about 0.57 of the file). NOT verified: by-eye screenshot.
- Small fix 3(f) DONE, commit `9fc33ad` (`assets/js/profile.js`): `fallback(p)` now reads `p.details` (dob, gender, civil, blood, phone, email, address = street/city/province/zip, emergency first+last/relationship/phone, conditions, reason, notes, ward, bed, admitted, condition; Outpatient `details.appointment` type/date/time goes into the Ward row when there is no ward). VERIFIED live with a temporary record `PT-99999` in localStorage: all 23 rows showed the saved values (Registered By stays an em dash); the test record was removed again (owner's own record untouched, `mh_regs_extra` has 1 record left).
- NOT done: item 3(e) meta line trailing dot (Figma wraps "PT-99213 · 54 yrs" / "Inpatient" without the dot; needs the real `.pf-meta` width from `profile.css` and a decision on how to hide the dot at the wrap), `favicon.ico` 404, `personnel.css` `!important`, Attendance leftovers.

## Next steps
1. Owner: check the sidebar logo by eye.
2. Remaining small fixes: 3(e) meta wrap, 3(i) personnel menu height, favicon 404 (idea: `<link rel=icon>` injected from `shell.js`), 3(a) Outpatient check badge 1px, 3(d) stale comment in `registration.html`, 3(g) billing-modal subtitle name.
3. Attendance leftovers (`get_reactions` on Export / Approve timesheets / Sync / Decline / Clock in/out / Details, overlay screenshots vs exports).
4. Then the profile modals (Edit `2027:2458`, Transfer `2027:2643`, Discharge `2027:2828`, Pharmacy `2047:25913`, Discharge summary `2047:25314`) and Treatment Plan `2047:17739`.
