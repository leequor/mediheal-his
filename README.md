# MediHeal HIS

Hospital Information System UI, converted from the Figma file "Overview (Dashboard, Departments)".

Plain HTML, CSS and vanilla JS. No build step, so it runs on GitHub Pages as-is.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Structure

```
index.html            Sign in
dashboard.html        Dashboard (done)
<module>.html         Other modules (stubs, see Figma node IDs in each file)
assets/css/tokens.css Design tokens from Figma (colors, radii, fonts)
assets/css/base.css   Layout, header, drawer, cards, tables, pills, buttons
assets/js/data.js     Single source of mock data (doctors, patients, dates)
assets/js/shell.js    Shared header + slide-in menu, injected on every page
```

## Adding a feature

1. Put new mock records in `assets/js/data.js` so every page stays consistent.
2. Copy `dashboard.html` or any stub, set `data-page` on `<body>`, write the page into `<main id="app">`.
3. Add a link in the `NAV` list in `shell.js` if it is a new module.

## Conversion status

| Screen | Figma node | Status |
|---|---|---|
| Sign in | 211:34 | basic |
| Dashboard | 211:59 | done |
| Registration | 23:2285 | stub |
| Appointments | 23:2289 | stub |
| Billing | 351:847 | stub |
| Departments | 351:501 | stub |
| Payroll | 623:702 | stub |
| Personnel | 623:1805 | stub |
| Attendance | 2002:369 | stub |
| Patient profiles | 459:680 | stub |
