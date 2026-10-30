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
