# Instructions for any AI agent working in this repo

Read `docs/HANDOFF.md` first. It is the single source of truth for what this project is, how to work on it, what is done, and what to do next.

Short version of the rules:

1. The site must match the Figma designs exactly. Measure in Figma, do not guess.
2. Keep handoff notes additive. Never delete earlier sections of `docs/HANDOFF.md`; append a dated entry in the log and update the status table.
3. Never run `get_node_info` on the whole page `0:1` (260 children, it crashes the Figma plugin). Query single frames.
4. After every push, say what was verified and what was not. Nothing here has been checked in a browser by the agent.
