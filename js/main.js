/* ==========================================================================
   Emmanuel Buhari — Portfolio
   main.js — loaded with `defer`, so the DOM is parsed before it runs.
   --------------------------------------------------------------------------
   1. Theme toggle
   2. Spanner cursor follower
   3. Preview modal
   4. Load sequence (typewriter hero + staggered reveal)

   Note: the saved theme is applied earlier, in js/preload.js, to avoid a
   flash of the wrong theme before this file executes.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Theme toggle
   -------------------------------------------------------------------------- */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeBtn');
  if (!btn) return;

  function currentIsDark() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  btn.addEventListener('click', function () {
    var next = currentIsDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('eb-theme', next); } catch (e) {}
  });
})();

/* --------------------------------------------------------------------------
   2. Spanner cursor follower
   -------------------------------------------------------------------------- */
(function () {
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine || !fine.matches) return;
  var el = document.getElementById('cursor');
  if (!el) return;
  document.documentElement.classList.add('has-spanner');

  window.addEventListener('mousemove', function (e) {
    el.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
    var t = e.target;
    var interactive = t && t.closest && t.closest('a, button, [role="button"], label, summary, input');
    el.classList.toggle('hot', !!interactive);
  }, { passive: true });

  window.addEventListener('mousedown', function () { el.classList.add('click'); });
  window.addEventListener('mouseup', function () { el.classList.remove('click'); });
  document.addEventListener('mouseleave', function () { el.style.transform = 'translate3d(-100px,-100px,0)'; });
})();

/* --------------------------------------------------------------------------
   3. Preview modal
   -------------------------------------------------------------------------- */
(function () {
  var overlay = document.getElementById('previewModal');
  if (!overlay) return;
  var root = document.documentElement;
  var titleEl = document.getElementById('modalTitle');
  var urlEl = document.getElementById('modalUrl');
  var extEl = document.getElementById('modalExt');
  var bodyEl = document.getElementById('modalBody');
  var closeBtn = document.getElementById('modalClose');
  var lastTrigger = null, spannerWasOn = false;

  var MONITOR_OFF =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="2.5" y="4" width="19" height="13" rx="1"/><path d="M8.5 21h7M12 17v4"/><path d="M3 4l18 12.5" opacity="0.65"/></svg>';

  function esc(s) { return (s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }

  function open(btn) {
    lastTrigger = btn;
    var type = btn.getAttribute('data-type');
    titleEl.textContent = btn.getAttribute('data-title') || 'Preview';
    bodyEl.innerHTML = '';

    if (type === 'embed') {
      var url = btn.getAttribute('data-url');
      urlEl.textContent = host(url);
      extEl.href = url; extEl.style.display = '';
      var f = document.createElement('iframe');
      f.src = url; f.title = (btn.getAttribute('data-title') || '') + ' live preview';
      f.setAttribute('loading', 'lazy');
      f.setAttribute('referrerpolicy', 'no-referrer');
      bodyEl.appendChild(f);
    } else {
      urlEl.textContent = 'local build';
      extEl.style.display = 'none';
      var src = btn.getAttribute('data-source') || '';
      var dev = btn.getAttribute('data-devpost') || '';
      var note = btn.getAttribute('data-note') || 'This project runs locally.';
      var links = '';
      if (src) links += '<a class="link" href="' + esc(src) + '" target="_blank" rel="noopener"><span class="a">&#8594;</span> Source Code</a>';
      if (dev) links += '<a class="link" href="' + esc(dev) + '" target="_blank" rel="noopener"><span class="a">&#8594;</span> Devpost</a>';
      bodyEl.innerHTML =
        '<div class="empty">'
        + '<div class="empty-ico">' + MONITOR_OFF + '</div>'
        + '<div class="empty-tag">Signal &middot; offline</div>'
        + '<p class="empty-h">No live deployment</p>'
        + '<p class="empty-p">' + esc(note) + ' Explore the code and write-up instead.</p>'
        + '<div class="empty-links">' + links + '</div>'
        + '</div>';
    }

    overlay.hidden = false;
    root.classList.add('modal-open');
    spannerWasOn = root.classList.contains('has-spanner');
    if (spannerWasOn) root.classList.remove('has-spanner');
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    overlay.hidden = true;
    bodyEl.innerHTML = '';
    root.classList.remove('modal-open');
    if (spannerWasOn) root.classList.add('has-spanner');
    document.removeEventListener('keydown', onKey);
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  Array.prototype.forEach.call(document.querySelectorAll('.preview-btn'), function (b) {
    b.addEventListener('click', function () { open(b); });
  });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
})();

/* --------------------------------------------------------------------------
   4. Load sequence
   -------------------------------------------------------------------------- */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('loading')) return;

  var TW_SEL = '.lede, .fig, .plate-id, .plate h3, .plate-role, .spec, .facets, .legend, .now, .contact h2, .contact p, .footblock';
  var twEls = Array.prototype.slice.call(document.querySelectorAll(TW_SEL));
  // persist hidden inline so removing .loading keeps them hidden until revealed
  twEls.forEach(function (el) { el.style.opacity = '0'; el.style.clipPath = 'inset(0 100% 0 0)'; });

  var h1 = document.querySelector('.hero h1');
  var mainTxt = 'I build software systems, end to end.';
  var dimTxt = ' Full-stack engineering, applied AI, security-first.';

  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function renderHero(mi, di) {
    var html = esc(mainTxt.slice(0, mi));
    if (di > 0) html += '<span class="dim">' + esc(dimTxt.slice(0, di)) + '</span>';
    html += '<span class="tw-caret"></span>';
    if (h1) h1.innerHTML = html;
  }
  if (h1) h1.innerHTML = '<span class="tw-caret"></span>';

  var mi = 0, di = 0, CH = 16;
  function typeStep() {
    if (mi < mainTxt.length) { mi++; renderHero(mi, di); setTimeout(typeStep, CH); }
    else if (di < dimTxt.length) { di++; renderHero(mi, di); setTimeout(typeStep, CH); }
    else { setTimeout(finish, 200); }
  }

  function finish() {
    if (h1) h1.innerHTML = esc(mainTxt) + '<span class="dim">' + esc(dimTxt) + '</span>';
    root.classList.remove('loading');
    twEls.forEach(function (el, i) {
      setTimeout(function () {
        el.style.transition = 'clip-path .5s cubic-bezier(.2,.7,.2,1), opacity .4s ease';
        el.style.clipPath = 'inset(0 0 0 0)';
        el.style.opacity = '1';
      }, i * 45);
    });
    setTimeout(cursorFinale, Math.min(twEls.length * 45 + 320, 1050));
  }

  function cursorFinale() {
    var ico = document.querySelector('#cursor .ico');
    if (!ico) return;
    ico.classList.add('finale');
    setTimeout(function () { ico.classList.remove('finale'); }, 700);
  }

  setTimeout(typeStep, 200);
})();
