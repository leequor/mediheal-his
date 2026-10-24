// Fit-to-width (session 22, v3). Owner asked to finish the layout item after fit v2 was undone (404de77).
// v3 ONLY reacts to the window WIDTH: at 1440px and wider the page is pixel-identical to the Figma layout (no zoom, no changes).
// Narrower windows (laptops, tablets, phones) scale the fixed 1440px page (.stage / .si sign-in / .header) with CSS zoom = width/1440, so nothing scrolls sideways.
// Differences from v2: NO height-based shrinking, the sidebar drawer keeps its design height and its own scrolling (zoomed only when the window is narrower than 430px).
// Under scale .7 a fixed 44px menu button appears (the header burger is too small to tap).
// Add ?fit=0 to the URL to turn it off (zoom changes getBoundingClientRect, so use it when measuring against Figma).
// To remove the feature: delete the loader line in shell.js and the script tag in index.html.
(function () {
  if (/[?&]fit=0/.test(location.search)) return;
  var BASE = 1440, DR = 430;
  var css = document.createElement('style');
  css.textContent = 'html{overflow-x:hidden}body{min-width:0!important}' +
    '.fit-burger{display:none;position:fixed;left:8px;top:8px;width:44px;height:44px;border:0;border-radius:10px;background:#15405a;box-shadow:0 2px 8px rgba(15,30,46,.35);z-index:25;padding:0}' +
    '.fit-burger i{position:absolute;left:11px;width:22px;height:3px;border-radius:2px;background:#fff}' +
    '.fit-burger i:nth-child(1){top:14px}.fit-burger i:nth-child(2){top:20.5px}.fit-burger i:nth-child(3){top:27px}';
  document.head.appendChild(css);
  var btn = null;
  function zoomAll(z) { [].forEach.call(document.querySelectorAll('.stage,.si,.header'), function (e) { e.style.zoom = z; }); }
  function apply() {
    var de = document.documentElement, w = de.clientWidth || window.innerWidth;
    var s = Math.min(1, w / BASE);
    if (s > 0.995) s = 1;
    zoomAll(s === 1 ? '' : String(s));
    var d = document.querySelector('.drawer');
    if (d) { var ds = Math.min(1, w / DR); d.style.zoom = ds > 0.995 ? '' : String(ds); }
    if (d && !btn) {
      btn = document.createElement('button'); btn.className = 'fit-burger'; btn.setAttribute('aria-label', 'Open menu'); btn.innerHTML = '<i></i><i></i><i></i>';
      btn.onclick = function () { document.body.classList.add('menu-open'); };
      document.body.appendChild(btn);
    }
    if (btn) btn.style.display = s < 0.7 ? 'block' : 'none';
    de.style.setProperty('--fit', String(s));
  }
  apply();
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', apply);
  window.addEventListener('load', function () { apply(); setTimeout(apply, 400); });
  document.addEventListener('DOMContentLoaded', apply);
})();
