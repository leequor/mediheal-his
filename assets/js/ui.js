// Shared UI helpers: modal (temporary), custom dropdown, small formatters.
function openModal({ title, sub = '', body, saveLabel = 'Save', onSave }) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = "<form class='modal' role='dialog' aria-modal='true'><h3>" + title + '</h3><p>' + sub + '</p>' + body +
    "<div class='actions'><button type='button' class='mbtn out' data-x>Cancel</button><button class='mbtn'>" + saveLabel + '</button></div></form>';
  const close = () => { bg.remove(); document.removeEventListener('keydown', esc); };
  const esc = e => e.key === 'Escape' && close();
  bg.addEventListener('mousedown', e => e.target === bg && close());
  bg.querySelector('[data-x]').onclick = close;
  bg.querySelector('form').onsubmit = e => { e.preventDefault(); onSave(Object.fromEntries(new FormData(e.target))); close(); };
  document.addEventListener('keydown', esc);
  document.body.appendChild(bg);
  const first = bg.querySelector('input,select');
  if (first) first.focus();
}
function opts(list, sel) { return list.map(o => '<option' + (o === sel ? ' selected' : '') + '>' + o + '</option>').join(''); }
function initialsOf(n) { return n.split(' ').filter(w => /^[A-Za-z]/.test(w)).slice(0, 3).map(w => w[0]).join('').toUpperCase(); }

// Custom dropdown that looks like the Figma dropdown frames. el must be an empty positioned element.
function makeDropdown(el, { options, value, onChange }) {
  el.classList.add('dd');
  el.innerHTML = "<button type='button' class='dd-btn'><span class='dd-val'></span>" + svg('chevron', 16) + "</button><div class='dd-panel'>" +
    options.map((o, i) => "<button type='button' data-i='" + i + "'>" + o + '</button>').join('') + '</div>';
  const val = el.querySelector('.dd-val');
  val.textContent = value || options[0];
  el.querySelector('.dd-btn').onclick = e => {
    e.stopPropagation();
    document.querySelectorAll('.dd.open').forEach(d => d !== el && d.classList.remove('open'));
    el.classList.toggle('open');
  };
  el.querySelector('.dd-panel').onclick = e => {
    const b = e.target.closest('button');
    if (!b) return;
    const v = options[+b.dataset.i];
    val.textContent = v;
    el.classList.remove('open');
    onChange(v);
  };
}
document.addEventListener('click', () => document.querySelectorAll('.dd.open').forEach(d => d.classList.remove('open')));
