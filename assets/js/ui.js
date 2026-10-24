// Shared UI helpers
function openModal({ title, sub = '', body, saveLabel = 'Save', onSave }) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<form class="modal" role="dialog" aria-modal="true"><h3>${title}</h3><p class="desc" style="margin:0">${sub}</p>${body}
    <div class="actions"><button type="button" class="btn outline" data-x>Cancel</button><button class="btn">${saveLabel}</button></div></form>`;
  const close = () => { bg.remove(); document.removeEventListener('keydown', esc); };
  const esc = e => e.key === 'Escape' && close();
  bg.addEventListener('mousedown', e => e.target === bg && close());
  bg.querySelector('[data-x]').onclick = close;
  bg.querySelector('form').onsubmit = e => { e.preventDefault(); onSave(Object.fromEntries(new FormData(e.target))); close(); };
  document.addEventListener('keydown', esc);
  document.body.appendChild(bg);
  bg.querySelector('input,select')?.focus();
}
const opts = (list, sel) => list.map(o => `<option${o === sel ? ' selected' : ''}>${o}</option>`).join('');
const initialsOf = n => n.split(' ').filter(w => /^[A-Za-z]/.test(w)).slice(0, 3).map(w => w[0]).join('').toUpperCase();
const pillOf = s => `<span class="pill ${HIS.statusClass[s] || 'off'}">${s}</span>`;
