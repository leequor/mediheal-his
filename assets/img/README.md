# Images exported from Figma (upload these to replace the fallbacks)

The tools used to build this site cannot copy binary images out of Figma, so these are placeholders. Export each from Figma and drop it in this folder with the exact name. The pages already point at these names and fall back gracefully.

| File | Figma node | Notes |
|---|---|---|
| `logo.png` | `362:519` ("logo-removebg-preview 1") | PNG with transparent background, export at 2x. `logo.svg` is a rough stand-in. |
| `bg.jpg` | Dashboard frame `211:59`, the IMAGE fill (marble texture) | Shown at 20% opacity behind every page (see `base.css`). Export the texture only, no UI. |
| `avatar.jpg` | `2002:361` ("Avatar") | 42x42 shown at 2x, round. Falls back to initials. |
