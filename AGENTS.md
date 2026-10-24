# Instructions for any AI agent working in this repo

Read `docs/START-HERE.md` FIRST (connect steps, read order, current next step). Then the newest `docs/GITHUBPROGRESS-sessionNN-addendum.md` files (sessions 12 and later are logged only in the addenda; `docs/GITHUBPROGRESS.md` stops at session 11 and is only for measured tokens of a screen you touch). `docs/HANDOFF.md` is OLD history (sessions 1 and 2) and is not the place to start.

Short version of the rules:

1. The site must match the Figma designs exactly. Measure in Figma, do not guess.
2. Keep handoff notes additive. Never delete earlier sections; append a dated entry to the newest addendum (or create the next one) and update the status notes. Commit a log line FIRST in every turn and the results at the end.
3. Never run `get_node_info` on the whole page `0:1` (260 children, it crashes the Figma plugin). Query single frames.
4. After every push, say what was verified and what was not. Verify on the live site with the Playwright tools (they drive the owner's real browser: remove any test records you save).
5. Put a whole page (HTML + JS + CSS) in ONE commit (`push_files`); GitHub Pages lags 10 to 30 s and caches HTML/JS/CSS in the browser (`fetch(url,{cache:'reload'})`, then `location.reload()`).
