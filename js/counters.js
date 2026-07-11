/* =========================================================================
   Danielson Land Co. — counters.js
   Animated statistic counters. Trigger once when scrolled into view.
   Markup: <span class="stat__num" data-count="12" data-suffix="+">0</span>
           Optional: data-decimals, data-prefix, data-duration
   ========================================================================= */
(function () {
  'use strict';

  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function formatNumber(value, decimals) {
    var fixed = value.toFixed(decimals);
    var parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = parseInt(el.getAttribute('data-duration') || '1900', 10);

    if (reduceMotion) {
      el.innerHTML = prefix + formatNumber(target, decimals) + '<span class="suffix">' + suffix + '</span>';
      return;
    }

    var start = null;
    el.classList.add('counting');

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // easeOutExpo
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      var current = target * eased;
      el.innerHTML = prefix + formatNumber(current, decimals) + '<span class="suffix">' + suffix + '</span>';
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.innerHTML = prefix + formatNumber(target, decimals) + '<span class="suffix">' + suffix + '</span>';
        el.classList.remove('counting');
      }
    }
    window.requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(runCounter);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { observer.observe(c); });

})();
