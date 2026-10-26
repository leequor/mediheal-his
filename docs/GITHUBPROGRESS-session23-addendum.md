# Session 23 addendum (2026-10-26) - READ AFTER the session 21 addendum (session 22 logs live there)

## Log
- Turn 1 start (new chat; owner: "Connect to Figma, channel kg2chfrt, goto github"). This host has NO Figma MCP server registered. Joined channel `kg2chfrt` by attaching a small client (`figma.mjs`) to the already-running bridge `bun dist/socket.cjs` on ws://localhost:3055: send `{type:"join",channel}`, then `{type:"message",channel,message:{id,command,params}}`, match the reply by `message.id` + `result`. Confirmed live with `get_document_info` (page `0:1`, 15 top-level children returned).
- Two commits are NEWER than the newest log entry (session 22 turn 2, `c197a7d`) and are NOT logged or verified: `345c09a` Notifications panel on every page, Figma `2072:3499` (`assets/js/shell.js` +77); `61f3377` keep the panel open after Mark all / row click (`assets/js/shell.js` +6/-1). Plan: verify both live, then continue leftovers.
- Read order done: `AGENTS.md`, session 21 addendum (holds session 22), `docs/` listing (no session 22 addendum file), last 5 commits.
