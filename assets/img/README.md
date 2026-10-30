# Images exported from Figma (upload these to replace the fallbacks)

The tools used to build this site cannot copy binary images out of Figma, so these are placeholders. Export each from Figma and drop it in this folder with the exact name. The pages already point at these names and fall back gracefully.

| File | Figma node | Notes |
|---|---|---|
| `logo.png` | `362:519` ("logo-removebg-preview 1") | PNG with transparent background, export at 2x. `logo.svg` is a rough stand-in. |
| `bg.jpg` | Dashboard frame `211:59`, the IMAGE fill (marble texture) | Shown at 20% opacity behind every page (see `base.css`). Export the texture only, no UI. |
| `avatar.jpg` | `2002:361` ("Avatar") | 42x42 shown at 2x, round. Falls back to initials. |

## Current logo files (2026-10-30)

In Figma each logo is a GROUP: a white `Ellipse 4` disc sits behind the transparent
`logo-removebg-preview 1` image rectangle. Export the group, not the rectangle, or the white disc is lost.

- `logo-large.png` — sidebar `Group 31` (`362:701`: disc `362:702` + logo `362:703`), 4x = 1720x1764. Used by the header logo on every shell page.
- `logo-removebg-preview 1.png` — sign-in `Group 30` (`362:508`: disc `269:1064` + logo `362:501`), 2x = 297x206. Used by the sign-in page and the favicon.

