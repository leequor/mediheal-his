# MediHeal HIS - improvement plan (from the 10-point-of-view brainstorm)

Owner decisions that shape everything below (2026-10-26):
- **Scope:** all POVs, phased.
- **Data:** client-only prototype - localStorage / JSON, no server. Every feature must work offline in the browser.
- **Figma:** additions ARE allowed where Figma has no frame, but every addition must follow the Figma design format (tokens, geometry, type scale) and be flagged in code + log.
- **Method:** measure from Figma when a frame exists; mark values `ESTIMATED` when it does not; log additively per turn; verify live with the Playwright extension; no leftover test keys; never click print/download/export in a sweep.

## Design format every phase must follow
- Tokens: title `#15405a` Lexend 22, muted `#6f8890` Inter 13, label `#1b4e6b` Inter 600 12, body `#1c2b30` Inter 13, input `#f6fafd` + `#c8dcea` 1px r8, card r12-16, scrim `#0b2a3d` @ .35, primary `#1c6d9c`.
- Action-modal shells: **664** with info banner (rows 142/224/306 + textarea 484, banner 366, buttons 600), **568** without banner (textarea 388, buttons 504), **368** compact (textarea 388, buttons 300). Buttons 100 @396 + 140 @508.
- Rows: label 120 / 202 / 284 / 366 - input 142 / 224 / 306 / 388. Two columns: 32 + 348, width 300 / 616.
- New states carry a comment: `// Addition (not in Figma) - <reason>` and use the same shells.

## Phase 0 - Foundations (must land first)
| # | Work | Why |
|---|---|---|
| 0.1 | Extract the shared UI kit: modal shell, table row, pill, toast, dropdown, PDF (`HIS.pdf` exists) | Stop duplicating modal/table code per page; makes every later addition consistent |
| 0.2 | `HIS.store`: one namespaced state layer + tiny pub/sub over the 8 `mh_*` keys, with backward-compatible reads and a "Reset demo data" control | Today each page owns its own key and re-renders by hand |
| 0.3 | Check the smoke harness into the repo (`scripts/smoke.mjs`): console + overflow + interaction sweep, excluding print/download/export | We have re-found the same regressions twice |
| 0.4 | Audit primitive: `HIS.audit.append({who, what, entity, before, after, at})` persisted in `mh_audit` | Payroll, clinical and compliance phases all depend on it |
Size M. Deliverable: substrate + a demo-data reset; no visible feature change.

**Phase 0 built (session 23):** `assets/js/kit.js` (modal, dropdown, pill, row, toast, esc, `GEOM`), `assets/js/store.js` (`HIS.store`), `assets/js/audit.js` (`HIS.audit`), `scripts/smoke.mjs`; `ui.js` is now a thin facade over the kit and the profile toast moved to the kit. Deliberate deferral: the Figma action-modal *builder* is not in the kit yet because it has no consumer until 1.1 - `HIS.kit.GEOM` carries the shell geometry until then. The visible "Reset demo data" control comes with 7.2; `HIS.store.reset()` exists now.

## Phase 1 - Payroll & HR correctness (HR officer, auditor, finance)
1.1 **Period lock + sync audit trail** - after sync the Aug 16-31 period locks; reopening needs a reason and writes an audit entry; every sync records who/when/count/skipped.
1.2 **Leave ledger semantics** - paid/unpaid per leave, per-row approve/decline (row selection, not `pending()[0]`), auto-resolve the absence review when leave is approved, paid/unpaid reflected in the ready count.
1.3 **Time math** - night shifts crossing midnight; worked vs shift = regular / undertime / overtime; overtime flagged for approval.
1.4 **Payslip PDF** - reuse `HIS.pdf`; earnings/deductions from the ledger; batch export for the period.
1.5 **Exceptions-first payroll card** - one list (absence, overtime, incomplete clock, pending leave) that the sync gates on.
Size L. This is the highest-risk module; does it before anything cosmetic.

## Phase 2 - Attendance & nursing (nurse, clerk, auditor)
2.1 Clock corrections require a reason and write an audit entry; corrected rows are marked.
2.2 Overtime/undertime shown in the register row and the details drawer.
2.3 Medication administration: 5-rights validation, witness signature for high-risk drugs, held/refused outcomes.
2.4 Vitals with ranges: out-of-range warns and flags for the doctor (the code already references a target BP).
2.5 Exceptions-first top card: "what needs attention today" with direct links.
Size L.

## Phase 3 - Clinical (doctor)
3.1 Order sets / favourites per diagnosis (one click).
3.2 Result inbox: ordered tests move pending -> resulted, unread badge, opens the existing "Test results" state.
3.3 Real allergy / interaction check on prescribe, using Figma's allergy-warning frame `2047:18913` as the warning state.
3.4 Copy-forward: prefill a new consultation from the last visit.
Size M-L. 3.3 is Figma-backed; 3.1/3.2/3.4 are additions in the design format.

## Phase 4 - Front desk & registration (clerk, patient, compliance)
4.1 Patient timeline drawer: registrations, appointments, bills, documents, notes in one read-only view.
4.2 Duplicate guard on new registration (name/DOB/phone fuzzy match + override reason, logged).
4.3 Appointment reminders and no-show marking; walk-in queue numbers.
4.4 Keyboard-first data entry across the forms (tab order, Enter to confirm, autofocus).
Size M.

## Phase 5 - Patient-facing artifacts (patient, family, compliance)
5.1 Appointment slip PDF.
5.2 Discharge summary / statement PDF + a per-patient "Documents" panel listing everything generated, re-downloadable.
5.3 Consent + typed e-signature blocks on registration and discharge, stored in the audit log.
Size M. All additions, all reusing `HIS.pdf`.

## Phase 6 - Admin & finance
6.1 One money chain: invoice -> payments -> statement, statuses derived (no independent per-page fields).
6.2 KPIs derived from data, with a period selector driving KPIs and tables together.
6.3 Departmental revenue and collection rate.
6.4 Reconciliation report PDF (billed vs collected vs outstanding).
Size M-L.

## Phase 7 - Compliance & privacy hardening (compliance, security)
7.1 RBAC simulation: role switcher (front desk / nurse / doctor / HR / admin / auditor) that gates actions and logs them; sign-in sets the role.
7.2 PHI hygiene: visible "demo data - synthetic records" banner; one-click wipe of every `mh_*` key.
7.3 Data portability: export all `mh_*` as JSON.
Out of scope by design (record as gaps, do not fake): real auth, encryption, server-side PHI, retention enforcement.
Size M.

## Phase 8 - Accessibility & responsive
8.1 Component-level narrow layout (stacked cards, larger targets) instead of pure scaling - **needs mobile Figma frames**; meanwhile cap the scale so effective text never drops below ~11px and allow scrolling under that.
8.2 Focus trap + keyboard navigation in modals, Escape everywhere, Enter to confirm.
8.3 `aria-live` for toasts, text + colour for status pills.
Size S-M + Figma-blocked.

## Phase 9 - Consolidation
9.1 Adopt the UI kit everywhere (delete per-page modal copies).
9.2 Document the localStorage schema + a version field / migration note.
9.3 Wire the smoke script into a GitHub Action (or a documented pre-push checklist).
Size M.

## Blocked on new Figma frames (ask the owner, do not invent)
- Mobile / phone layout (Phase 8.1).
- Patient portal and any patient-facing screen.
  - 2026-10-29 (session 24): the owner supplied a patient-portal design by email, so this is no
    longer blocked. Built as the `portal.html` addition (landing / signup / signin / 3-step
    reset) with client-side demo auth through `HIS.store`; see `docs/GITHUBPROGRESS-session24-addendum.md`.
- Dedicated screens for the audit log, result inbox, order sets, patient timeline (they can be built as additions in the design format if the owner prefers).

## Order of work
0 -> 1 -> 2 -> 3 -> 5 -> 6 -> 4 -> 7 -> 8 -> 9. Phases 4 and 5 can swap if the owner wants patient artifacts sooner. Every phase ends with a live Playwright verification pass and a smoke run.

## Definition of done (every phase)
- Feature works from a cold load with an empty localStorage, and survives a reload.
- No console errors/warnings; the smoke sweep is clean; no overflow at 1440 and at 1200/1000/800/390.
- Keyboard reachable; Escape closes; focus returns to the trigger.
- Additions flagged in code and in the addendum; test keys removed.