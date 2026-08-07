/* ==========================================================================
   BMATS — Project Showcase
   main.js — loaded with `defer`, so the DOM is parsed before it runs.
   --------------------------------------------------------------------------
   1. Mobile navigation
   2. Section highlighting (scroll spy)
   3. Anonymizer demo
   4. App replica — screen switch
   5. Reveal on scroll
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Mobile navigation
   -------------------------------------------------------------------------- */
(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* --------------------------------------------------------------------------
   2. Section highlighting
   -------------------------------------------------------------------------- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  if (!links.length) return;

  var byId = {}, sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) { byId[id] = a; sections.push(section); }
  });

  var visible = {};
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
    for (var i = 0; i < sections.length; i++) {
      var id = sections[i].id;
      if (visible[id]) {
        links.forEach(function (a) { a.classList.remove('is-current'); });
        byId[id].classList.add('is-current');
        return;
      }
    }
    links.forEach(function (a) { a.classList.remove('is-current'); });
  }, { rootMargin: '-74px 0px -55% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();

/* --------------------------------------------------------------------------
   3. Anonymizer demo

   Each PII span carries its replacement token in data-token, matching the
   strings the service actually writes ([NAME REDACTED] and friends). The
   original text is stashed on first run so the toggle is reversible.
   -------------------------------------------------------------------------- */
(function () {
  var btn = document.getElementById('redactBtn');
  var doc = document.getElementById('doc');
  var label = document.getElementById('redactLabel');
  var count = document.getElementById('redactCount');
  if (!btn || !doc) return;

  var spans = Array.prototype.slice.call(doc.querySelectorAll('.pii'));
  var redacted = false;

  /* stash originals once, so toggling back is exact */
  spans.forEach(function (s) { s.setAttribute('data-original', s.textContent); });

  function apply(on) {
    spans.forEach(function (s) {
      s.textContent = on ? s.getAttribute('data-token') : s.getAttribute('data-original');
      s.classList.toggle('is-redacted', on);
    });

    if (label) label.textContent = on ? 'Show original' : 'Anonymize';
    if (count) {
      count.textContent = on
        ? spans.length + ' identifier' + (spans.length === 1 ? '' : 's') + ' removed'
        : '0 identifiers removed';
      count.classList.toggle('is-on', on);
    }
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  btn.addEventListener('click', function () {
    redacted = !redacted;
    apply(redacted);
  });

  apply(false);
})();

/* --------------------------------------------------------------------------
   4. App replica — screen switch
   -------------------------------------------------------------------------- */
(function () {
  var app = document.getElementById('app');
  if (!app) return;

  var screens = app.querySelectorAll('.screen');
  var items = app.querySelectorAll('.app-item');

  app.addEventListener('click', function (e) {
    var item = e.target.closest ? e.target.closest('.app-item') : null;
    if (!item) return;
    var name = item.getAttribute('data-screen');
    if (!name) return;

    Array.prototype.forEach.call(screens, function (s) {
      s.classList.toggle('is-active', s.getAttribute('data-screen') === name);
    });
    Array.prototype.forEach.call(items, function (b) {
      b.classList.toggle('is-active', b === item);
    });
  });
})();

/* --------------------------------------------------------------------------
   5. Reveal on scroll
   -------------------------------------------------------------------------- */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.sec-head, .prob, .pipe-step, .card, .redact, .app, .stack-col, .cta, .guard, .note');
  if (!targets.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
    return;
  }

  Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      setTimeout(function () { el.classList.add('is-in'); }, i * 55);
      observer.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });
})();
