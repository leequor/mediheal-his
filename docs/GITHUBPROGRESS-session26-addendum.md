# Session 26 addendum — Figma logo with the white disc (2026-10-30)

Additive log. Nothing in earlier addenda or `GITHUBPROGRESS.md` was changed.

## Owner request

"Get the logo of the system, the logo only, and if it's different than the one in GitHub replace the website's logo on `mediheal-his` with that original Figma logo." Sent with a reference screenshot of the sidebar logo: the mark sits on a **white disc** with a soft edge.

## Turn 1 — start of turn log

Files touched: `assets/img/logo-large.png`, `assets/img/logo-removebg-preview 1.png`, `assets/img/README.md`.

Finding: the GitHub assets were exports of the transparent image rectangle only. In Figma every logo instance is a GROUP with a white `Ellipse 4` behind that rectangle (hidden from `get_node_info`'s simplified child list; visible in the raw plugin payload):

- Sidebar `Group 31` `362:701` = `Ellipse 4` `362:702` (white, 235.6x235.6) + `logo-removebg-preview 1` `362:703`.
- Sign-in `Group 30` `362:508` = `Ellipse 4` `269:1064` (white, 56.18x56.18) + `logo-removebg-preview 1` `362:501`.

So the site logo *was* different: same flame artwork, missing the white disc. Exported both groups with the Figma MCP (`export_node_as_image`): sidebar group at 4x (1720x1764), sign-in group at 2x (297x206), then dropped them in as `logo-large.png` and `logo-removebg-preview 1.png`. No HTML/CSS changed; the existing boxes are unchanged (`.hd .logo` 111x77, `.si-logo` 148.3x103).

Measured in the existing boxes: header mark 43.4px with a 37.8px white disc (Figma header: 43px mark, 37px disc); sign-in disc 56.2px (Figma: 56.18px). Favicon uses the sign-in asset.

Status: local change verified; see results below.

## Turn 1 — results

Commits: see the commits on `main` for this addendum plus the asset change.

Verified locally (`http://127.0.0.1:8789`, Playwright, cache-busted with `fetch(...,{cache:'reload'})`):

- `index.html`: `.si-logo` loads 297x206 at (148.3x103); canvas sampling shows opaque white at the disc (255,255,255,255) and transparent corners; the white disc is visible on the gradient; 0 console errors.
- `dashboard.html`: `.hd .logo` loads 1720x1764 in the unchanged 111x77 box; white disc visible inside the blue ring on the light header; 0 console errors.
- `assets/img/README.md` now documents the group nodes and why the rectangle export loses the disc.

Verified live (pushed `af36a49..c8c1618`, GitHub Pages served the new files on 2026-10-31 ~00:00):

- `https://leequor.github.io/mediheal-his/assets/img/logo-large.png` = 1720x1764 (203528 bytes) and `logo-removebg-preview 1.png` = 297x206 (18089 bytes); both fetched with a cache-buster after the deploy.
- `index.html`: `.si-logo` still 148.3x103 at (40.4, 31), natural 297x206, disc pixel opaque white, corner transparent; white disc visible; 0 console errors.
- `dashboard.html`: `.hd .logo` still 111x77 at (101.4, 9), natural 1720x1764, disc pixel opaque white, corner transparent; white disc visible in the header; 0 console errors.

NOT verified in this turn: every other shell page (they share `shell.js`/`base.css`, so the header asset change applies globally) and a live favicon render at 16/32px. Browser cache still needs a `fetch(...,{cache:'reload'})` + reload on the owner's machine.

Host note: this session installed `claude-talk-to-figma-mcp` (local clone, built, socket on `ws://localhost:3055`) and joined via the plugin UI channel, so future agents can use the MCP tools instead of a hand-rolled WebSocket client.
