// Audit trail (session 23, Phase 0 of docs/IMPROVEMENT-PLAN.md). Every change that matters -
// payroll sync and period reopen (Phase 1), clock corrections and medication events (Phase 2),
// clinical orders (Phase 3), registrations (Phase 4), documents and consents (Phase 5),
// money movements (Phase 6), role switches (Phase 7) - appends ONE immutable entry here.
// Persisted in `mh_audit` through HIS.store; load store.js first.
// Entry shape: { seq, at, who, role, what, entity, before, after }.
(function () {
  var KEY = 'mh_audit';
  function list() { var rows = HIS.store.get(KEY, []); return Array.isArray(rows) ? rows : []; }
  // seq continues past whatever is already stored, so a foreign or truncated entry cannot make it NaN.
  function nextSeq(rows) {
    return rows.reduce(function (m, r) { return Math.max(m, r && typeof r.seq === 'number' ? r.seq : 0); }, 0) + 1;
  }
  function append(e) {
    e = e || {};
    var rows = list();
    var row = {
      seq: nextSeq(rows),
      at: e.at || new Date().toISOString(),
      who: e.who || (window.HIS && HIS.user ? HIS.user.name : 'unknown'),
      role: e.role || (window.HIS && HIS.user ? HIS.user.role : ''),
      what: e.what || '',
      entity: e.entity || '',
      before: e.before === undefined ? null : e.before,
      after: e.after === undefined ? null : e.after
    };
    rows.push(row);
    HIS.store.set(KEY, rows);
    return row;
  }
  function clear() { HIS.store.remove(KEY); }
  HIS.audit = { append: append, list: list, clear: clear, KEY: KEY };
})();