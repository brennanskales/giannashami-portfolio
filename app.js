(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Autoplay muted videos only while on screen
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var v = en.target;
      if (en.isIntersecting && !reduce) {
        if (v.preload === 'none') v.preload = 'auto';
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      } else { v.pause(); }
    });
  }, { threshold: 0.25 }) : null;

  function watch(v) {
    v.muted = true; v.playsInline = true;
    if (io) io.observe(v);
    else if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  }
  document.querySelectorAll('video.auto').forEach(watch);

  // Photo / Video tabs
  var tabs = [document.getElementById('tab-photo'), document.getElementById('tab-video')];
  var panels = [document.getElementById('panel-photo'), document.getElementById('panel-video')];
  function select(i) {
    tabs.forEach(function (t, j) {
      var on = i === j;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var n = (i + 1) % 2; select(n); tabs[n].focus(); e.preventDefault();
      }
    });
  });

  // Featured reel sound toggle
  var reel = document.getElementById('reel');
  var btn = document.getElementById('sound');
  if (reel && btn) {
    btn.addEventListener('click', function () {
      var on = reel.muted;
      reel.muted = !on;
      if (on) { var p = reel.play(); if (p && p.catch) p.catch(function () {}); }
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      btn.querySelector('.ico-muted').hidden = on;
      btn.querySelector('.ico-sound').hidden = !on;
    });
  }
})();
