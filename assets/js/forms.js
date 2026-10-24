// Custom select for the form screens. Looks like the Figma select frames (white, r10, shadow, chevron) and opens a list below.
// Usage: const s = fSelect(el, { options: [...], placeholder: 'Month', onChange }); s.value -> selected text or ''; s.setError(true|false)
const F_CHEV = "<svg viewBox='0 0 24 24' fill='none' stroke='#000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='m6 9 6 6 6-6'/></svg>";
function fSelect(el, { options, placeholder, onChange }) {
  el.classList.add('f-sel');
  el.innerHTML = "<button type='button' class='b' aria-haspopup='listbox' aria-expanded='false'><span class='v'></span>" + F_CHEV + "</button><div class='p' role='listbox'>" +
    options.map((o, i) => "<button type='button' role='option' data-i='" + i + "'>" + o + '</button>').join('') + '</div>';
  const b = el.querySelector('.b');
  const v = el.querySelector('.v');
  let value = '';
  v.textContent = placeholder;
  const setOpen = open => { el.classList.toggle('open', open); b.setAttribute('aria-expanded', open ? 'true' : 'false'); };
  b.onclick = e => {
    e.stopPropagation();
    document.querySelectorAll('.f-sel.open').forEach(d => d !== el && d.classList.remove('open'));
    setOpen(!el.classList.contains('open'));
  };
  el.querySelector('.p').onclick = e => {
    const o = e.target.closest('button');
    if (!o) return;
    value = options[+o.dataset.i];
    v.textContent = value;
    el.classList.remove('err');
    setOpen(false);
    if (onChange) onChange(value);
  };
  el.addEventListener('keydown', e => { if (e.key === 'Escape') { setOpen(false); b.focus(); } });
  return {
    get value() { return value; },
    el,
    focus: () => b.focus(),
    setError: on => el.classList.toggle('err', on)
  };
}
document.addEventListener('click', () => document.querySelectorAll('.f-sel.open').forEach(d => d.classList.remove('open')));
