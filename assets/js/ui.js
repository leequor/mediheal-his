// Shared UI helpers. Session 23 (Phase 0): the modal, the dropdown and the markup helpers now live
// in the UI kit (assets/js/kit.js); these names are kept so existing pages do not change.
// kit.js must be loaded first (it is, on every shell page).
function openModal(spec) { return HIS.kit.modal(spec); }
function opts(list, sel) { return list.map(o => '<option' + (o === sel ? ' selected' : '') + '>' + o + '</option>').join(''); }
function initialsOf(n) { return n.split(' ').filter(w => /^[A-Za-z]/.test(w)).slice(0, 3).map(w => w[0]).join('').toUpperCase(); }
// Custom dropdown that looks like the Figma dropdown frames. el must be an empty positioned element.
function makeDropdown(el, spec) { return HIS.kit.dropdown(el, spec); }