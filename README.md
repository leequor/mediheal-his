# MediHeal HIS

Hospital Information System UI, converted from the Figma file "Overview (Dashboard, Departments)".

Live site: https://leequor.github.io/mediheal-his/

Plain HTML, CSS and vanilla JS. No build step, so it runs on GitHub Pages as-is.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Structure

```
index.html                 Sign in
dashboard.html             Dashboard
registration.html          Registration (filters, search, new registration)
appointments.html          Appointments (filters, search, new/edit)
<module>.html              Other modules (stubs, see Figma node IDs in each file)
assets/css/tokens.css      Design tokens from Figma
assets/css/base.css        Layout, header, drawer, cards, tables, pills, buttons
assets/css/components.css  Toolbar, tabs, modal, extra pill colors
assets/js/data.js          Core mock data (user, dashboard)
assets/js/data-records.js  Patients, appointments, doctors, departments
assets/js/shell.js         Shared header + slide-in menu
assets/js/ui.js            Modal and small helpers
```

## Adding a feature

1. Put new mock records in `assets/js/data-records.js` so every page stays consistent.
2. Copy `dashboard.html` or any stub, set `data-page` on `<body>`, write the page into `<main id="app">`.
3. Add a link in the `NAV` list in `shell.js` if it is a new module.

## Conversion status

| Screen | Figma node | Status |
|---|---|---|
| Sign in | 211:34 | basic |
| Dashboard | 211:59 | done |
| Registration | 23:2285 | done (inpatient/outpatient forms still to do) |
| Appointments | 23:2289 | done |
| Billing | 351:847 | stub |
| Departments | 351:501 | stub |
| Payroll | 623:702 | stub |
| Personnel | 623:1805 | stub |
| Attendance | 2002:369 | stub |
| Patient profiles | 459:680 | stub |

Data lives in memory, so it resets on refresh.
