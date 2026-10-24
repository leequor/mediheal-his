// Fit-to-screen (session 18, v2). Owner: site broke on mobile, "too big", and every screen should fit; the sidebar must not scroll.
// The site is a pixel-matched 1440px Figma layout, so the page (.stage / .si sign-in / .header) is scaled with CSS zoom so the WHOLE page fits the window:
//   scale = min(1, width/1440, max(height/pageHeight, 0.5)). Pages taller than 1400px count as 1400 (they scroll a little). Never scales up.
// The drawer (sidebar, 430x1024 design) is zoomed to fit the window height and width and never scrolls.
// Under scale .7 (phones, small windows) a fixed 44px menu button appears (the header burger is too small to tap).
// Add ?fit=0 to the URL to turn all of this off (for pixel measuring: zoom changes getBoundingClientRect).
(function () {
  if (/[?&]fit=0/.test(location.search)) return;
  var BASE = 1440, MAXH = 1400, MINH = 0.5;
  var css = document.createElement('style');
  css.textContent = 'html{overflow-x:hidden}body{min-width:0!important}' +
    '.drawer{overflow:hidden!important}' +
    '.fit-burger{display:none;position:fixed;left:8px;top:8px;width:44px;height:44px;border:0;border-radius:10px;background:#15405a;box-shadow:0 2px 8px rgba(15,30,46,.35);z-index:25;padding:0}' +
    '.fit-burger i{position:absolute;left:11px;width:22px;height:3px;border-radius:2px;background:#fff}' +
    '.fit-burger i:nth-child(1){top:14px}.fit-burger i:nth-child(2){top:20.5px}.fit-burger i:nth-child(3){top:27px}';
  document.head.appendChild(css);
  var btn = null;
  function zoomAll(z) { [].forEach.call(document.querySelectorAll('.stage,.si,.header'), function (e) { e.style.zoom = z; }); }
  function apply() {
    var de = document.documentElement, w = de.clientWidth || window.innerWidth, h = de.clientHeight || window.innerHeight;
    var main = document.querySelector('.stage,.si');
    zoomAll('');
    var H = main ? Math.min(MAXH, Math.max(main.offsetHeight, main.scrollHeight)) : 1262;
    var s = Math.min(1, w / BASE, Math.max(h / H, MINH));
    if (s > 0.985) s = 1;
    zoomAll(s === 1 ? '' : String(s));
    var d = document.querySelector('.drawer');
    if (d) { var ds = Math.min(1, w / 430, h / 1024); d.style.zoom = ds > 0.985 ? '' : String(ds); }
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
