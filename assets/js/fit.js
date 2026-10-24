// Fit-to-screen (session 18, owner: site broke on mobile and did not fit on PC).
// The site is a pixel-matched 1440px Figma layout, so on narrower screens the whole page (.stage / .si sign-in / .header) is scaled with CSS zoom instead of overflowing sideways.
// >= 1400px wide: no change (1:1, so Figma measurements stay exact). Below that: scale = width / 1440. The drawer is scaled to fit phones (430px design width).
// Small screens also get a fixed 44px menu button (the header burger becomes a few px). Add ?fit=0 to the URL to turn all of this off (for pixel measuring).
(function () {
  if (/[?&]fit=0/.test(location.search)) return;
  var BASE = 1440, SNAP = 1400;
  var css = document.createElement('style');
  css.textContent = 'html{overflow-x:hidden}body{min-width:0!important}' +
    '.fit-burger{display:none;position:fixed;left:8px;top:8px;width:44px;height:44px;border:0;border-radius:10px;background:#15405a;box-shadow:0 2px 8px rgba(15,30,46,.35);z-index:25;padding:0}' +
    '.fit-burger i{position:absolute;left:11px;width:22px;height:3px;border-radius:2px;background:#fff}' +
    '.fit-burger i:nth-child(1){top:14px}.fit-burger i:nth-child(2){top:20.5px}.fit-burger i:nth-child(3){top:27px}';
  document.head.appendChild(css);
  var btn = null;
  function apply() {
    var w = document.documentElement.clientWidth || window.innerWidth;
    var s = w >= SNAP ? 1 : w / BASE, z = s === 1 ? '' : String(s);
    [].forEach.call(document.querySelectorAll('.stage,.si,.header'), function (e) { e.style.zoom = z; });
    var d = document.querySelector('.drawer');
    if (d) d.style.zoom = w < 430 ? String(w / 430) : '';
    if (d && !btn) {
      btn = document.createElement('button'); btn.className = 'fit-burger'; btn.setAttribute('aria-label', 'Open menu'); btn.innerHTML = '<i></i><i></i><i></i>';
      btn.onclick = function () { document.body.classList.add('menu-open'); };
      document.body.appendChild(btn);
    }
    if (btn) btn.style.display = w < 900 ? 'block' : 'none';
    document.documentElement.style.setProperty('--fit', String(s));
  }
  apply();
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', apply);
  window.addEventListener('load', apply);
  document.addEventListener('DOMContentLoaded', apply);
})();
