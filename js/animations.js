/* =========================================================================
   Danielson Land Co. — animations.js
   Scroll reveal (IntersectionObserver), staggering, parallax, hero zoom.
   ========================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     Scroll reveal — adds .is-visible when element enters viewport
     --------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     Auto-stagger — apply incremental delay to children of [data-stagger]
     --------------------------------------------------------------- */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var kids = group.querySelectorAll('.reveal');
    kids.forEach(function (kid, i) {
      kid.style.setProperty('--i', i);
    });
  });

  if (reduceMotion) return;

  /* ---------------------------------------------------------------
     Hero parallax + subtle zoom on scroll
     --------------------------------------------------------------- */
  var heroMedia = document.querySelector('.hero__media img');
  var parallaxEls = document.querySelectorAll('.parallax[data-speed]');

  var ticking = false;
  function updateParallax() {
    var y = window.scrollY;
    if (heroMedia) {
      var scale = 1.08 + Math.min(y / 4200, 0.12);
      heroMedia.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(' + scale + ')';
    }
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
      var rect = el.getBoundingClientRect();
      var offset = (rect.top - window.innerHeight / 2) * speed * -0.15;
      el.style.transform = 'translateY(' + offset + 'px)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  updateParallax();

})();
