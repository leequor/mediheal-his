# MediHeal HIS

Hospital Information System UI, converted from the Figma file "Overview (Dashboard, Departments)".

Live site: https://leequor.github.io/mediheal-his/

**AI agents: read [`AGENTS.md`](AGENTS.md) and [`docs/HANDOFF.md`](docs/HANDOFF.md) first.**

Plain HTML, CSS and vanilla JS. No build step, so it runs on GitHub Pages as-is. Layout is a fixed 1440px stage that mirrors the Figma frames.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Images

Logo, background texture and avatar must be exported from Figma and added to `assets/img/`. See `assets/img/README.md`.

## Conversion status

See the table in `docs/HANDOFF.md`. Done (rebuilt from Figma measurements): sidebar and header, Dashboard, Registration, Appointments. Everything else is a stub that names its Figma node.

Data lives in memory, so it resets on refresh.
