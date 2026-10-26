// Shared UI kit (session 23, Phase 0 of docs/IMPROVEMENT-PLAN.md). The pieces every page was
// copying, in one place: the generic modal, the Figma-style dropdown, a status pill, a table row,
// a toast, `esc()` for markup, and the GEOM constants of the Figma action-modal design format
// (docs/IMPROVEMENT-PLAN.md "Design format every phase must follow"). All geometry is Figure
// frame-local px. Later phases build their action modals from GEOM so additions stay consistent.
(function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var GEOM = {
    w: 680, x: 380,                       // action modal is 680 wide, left edge at 380
    shell: {                              // three validated shells
      664: { h: 664, banner: 366, textarea: 484, buttons: 600 },
      568: { h: 568, textarea: 388, buttons: 504 },
      368: { h: 368, textarea: 388, buttons: 300 }
    },
    rowLabel: [120, 202, 284, 366],       // label y  ->  input y
    rowInput: [142, 224, 306, 388],
    col: { left: 32, right: 348, narrow: 300, wide: 616 },
    btn: { cancel: { x: 396, w: 100 }, ok: { x: 508, w: 140 } }
  };

  // Generic modal (NOT a Figma screen: the temporary form shell used where Figma has no form yet).
  function modal(spec) {
    spec = spec || {};
    var bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = "<form class='modal' role='dialog' aria-modal='true'><h3>" + spec.title + '</h3><p>' + (spec.sub || '') + '</p>' + spec.body +
      "<div class='actions'><button type='button' class='mbtn out' data-x>Cancel</button><button class='mbtn'>" + (spec.saveLabel || 'Save') + '</button></div></form>';
    var close = function () { bg.remove(); document.removeEventListener('keydown', escKey); };
    var escKey = function (e) { if (e.key === 'Escape') close(); };
    bg.addEventListener('mousedown', function (e) { if (e.target === bg) close(); });
    bg.querySelector('[data-x]').onclick = close;
    bg.querySelector('form').onsubmit = function (e) {
      e.preventDefault();
      spec.onSave(Object.fromEntries(new FormData(e.target)));
      close();
    };
    document.addEventListener('keydown', escKey);
    document.body.appendChild(bg);
    var first = bg.querySelector('input,select');
    if (first) first.focus();
    return { close: close };
  }

  // Figma dropdown frames: 236x45, items 38 high.
  function dropdown(el, spec) {
    var options = spec.options;
    el.classList.add('dd');
    el.innerHTML = "<button type='button' class='dd-btn'><span class='dd-val'></span>" + svg('chevron', 16) + "</button><div class='dd-panel'>" +
      options.map(function (o, i) { return "<button type='button' data-i='" + i + "'>" + o + '</button>'; }).join('') + '</div>';
    var val = el.querySelector('.dd-val');
    val.textContent = spec.value || options[0];
    el.querySelector('.dd-btn').onclick = function (e) {
      e.stopPropagation();
      document.querySelectorAll('.dd.open').forEach(function (d) { if (d !== el) d.classList.remove('open'); });
      el.classList.toggle('open');
    };
    el.querySelector('.dd-panel').onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var v = options[+b.dataset.i];
      val.textContent = v;
      el.classList.remove('open');
      spec.onChange(v);
    };
    return { value: function () { return val.textContent; }, set: function (v) { val.textContent = v; } };
  }
  document.addEventListener('click', function () {
    document.querySelectorAll('.dd.open').forEach(function (d) { d.classList.remove('open'); });
  });

  // Status pill: the shared `.badge` look (components.css); `kind` is the status colour class.
  function pill(text, kind) { return "<span class='badge " + (kind || '') + "'>" + esc(text) + '</span>'; }

  // Table row: `cols` is a CSS grid-template-columns value; the header uses the same helper.
  function row(cells, cols) {
    return "<div class='kit-row'" + (cols ? " style='grid-template-columns:" + cols + "'" : '') + '>' +
      cells.map(function (c) { return "<span class='kit-td'>" + c + '</span>'; }).join('') + '</div>';
  }

  // Toast: one shared node, announced to screen readers, auto-hides after 3.2s.
  function toast(msg) {
    var el = document.getElementById('kit-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'kit-toast';
      el.className = 'kit-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { el.classList.remove('on'); }, 3200);
  }

  HIS.kit = { esc: esc, GEOM: GEOM, modal: modal, dropdown: dropdown, pill: pill, row: row, toast: toast };
})();