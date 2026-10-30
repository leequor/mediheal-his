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

Status at time of writing: code written and verified locally; not yet committed or pushed.
