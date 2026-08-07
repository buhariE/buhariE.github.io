/* ==========================================================================
   Inventory Assist — Project Showcase
   main.js — loaded with `defer`, so the DOM is parsed before it runs.
   --------------------------------------------------------------------------
   1. Mobile navigation
   2. Section highlighting (scroll spy)
   3. App replica — role switch + screen switch
   4. Reveal on scroll
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

  /* close after picking a destination */
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* --------------------------------------------------------------------------
   2. Section highlighting

   Marks the nav link whose section currently occupies the upper band of the
   viewport. Uses IntersectionObserver rather than a scroll handler so nothing
   runs between intersections.
   -------------------------------------------------------------------------- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  if (!links.length) return;

  var byId = {};
  var sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) { byId[id] = a; sections.push(section); }
  });

  var visible = {};
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      visible[entry.target.id] = entry.isIntersecting;
    });
    /* the topmost intersecting section wins */
    for (var i = 0; i < sections.length; i++) {
      var id = sections[i].id;
      if (visible[id]) {
        links.forEach(function (a) { a.classList.remove('is-current'); });
        byId[id].classList.add('is-current');
        return;
      }
    }
    links.forEach(function (a) { a.classList.remove('is-current'); });
  }, { rootMargin: '-72px 0px -55% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();

/* --------------------------------------------------------------------------
   3. App replica — role switch + screen switch

   Mirrors how the real app behaves: role decides which navigation exists at
   all, not merely which items are enabled. Switching role swaps the menu and
   lands on that role's first screen, the same way DashboardLayout redirects.
   -------------------------------------------------------------------------- */
(function () {
  var app = document.getElementById('app');
  if (!app) return;

  var title = document.getElementById('appTitle');
  var avatar = document.getElementById('appAvatar');
  var menus = app.querySelectorAll('.app-menu');
  var screens = app.querySelectorAll('.screen');
  var roleBtns = app.querySelectorAll('[data-role-btn]');

  /* avatars match the seed data: an admin and a clerk from mockData.ts */
  var PROFILE = {
    admin: { initials: 'JW', first: 'dashboard' },
    clerk: { initials: 'MS', first: 'inventory' }
  };

  function showScreen(name) {
    var found = false;
    Array.prototype.forEach.call(screens, function (s) {
      var on = s.getAttribute('data-screen') === name;
      s.classList.toggle('is-active', on);
      if (on) found = true;
    });
    if (!found) return;

    /* keep the sidebar selection and the top bar label in sync */
    Array.prototype.forEach.call(app.querySelectorAll('.app-item'), function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-screen') === name);
    });
    var active = app.querySelector('.app-item.is-active');
    if (active && title) title.textContent = active.textContent.replace(/\s*\d+\s*$/, '').trim();
  }

  function setRole(role) {
    Array.prototype.forEach.call(menus, function (m) {
      m.hidden = m.getAttribute('data-role') !== role;
    });
    Array.prototype.forEach.call(roleBtns, function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-role-btn') === role);
    });
    if (avatar) avatar.textContent = PROFILE[role].initials;
    showScreen(PROFILE[role].first);
  }

  Array.prototype.forEach.call(roleBtns, function (b) {
    b.addEventListener('click', function () { setRole(b.getAttribute('data-role-btn')); });
  });

  app.addEventListener('click', function (e) {
    var item = e.target.closest ? e.target.closest('.app-item') : null;
    if (!item) return;
    var screen = item.getAttribute('data-screen');
    if (screen) showScreen(screen);
  });
})();

/* --------------------------------------------------------------------------
   4. Reveal on scroll
   -------------------------------------------------------------------------- */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.sec-head, .role-card, .feat, .logic, .stack-col, .cta, .app, .code-block');
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
      setTimeout(function () { el.classList.add('is-in'); }, i * 60);
      observer.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });
})();
