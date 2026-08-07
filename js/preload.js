/* ==========================================================================
   preload.js
   Runs synchronously in <head>, before the page paints.
   Keep this file tiny — anything slow here delays first paint.

   1. Restores the saved theme so there is no light/dark flash.
   2. Flags the document as `loading` so the CSS skeletons apply pre-paint.
   ========================================================================== */
(function () {
  var root = document.documentElement;

  /* 1. saved theme — overrides the data-theme="dark" default in the markup */
  try {
    var saved = localStorage.getItem('eb-theme');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) {}

  /* 2. load sequence — skipped when the visitor prefers reduced motion */
  try {
    if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      root.classList.add('loading');
    }
  } catch (e) {}
})();
