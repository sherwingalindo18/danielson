/* =========================================================================
   Danielson Land Co. — app.js
   Core interactions: sticky nav, mobile menu, ripple, FAQ accordion,
   property filters, contact form validation, lazy images, footer year.
   Vanilla JS only.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Sticky navigation — solid on scroll
     --------------------------------------------------------------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     Mobile slide-out menu
     --------------------------------------------------------------- */
  var toggle = document.querySelector('.nav__toggle');
  var overlay = document.querySelector('.nav__overlay');

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openMenu() {
    nav.classList.add('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
  }
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav__panel a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------------------------------------------------------------
     Button ripple effect
     --------------------------------------------------------------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 680);
    });
  });

  /* ---------------------------------------------------------------
     Card glow — track pointer for radial highlight on dark cards
     --------------------------------------------------------------- */
  document.querySelectorAll('.card.on-dark').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------------- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    if (!q || !a) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      // Close siblings within same FAQ group
      var group = item.closest('.faq');
      if (group) {
        group.querySelectorAll('.faq__item.is-open').forEach(function (sib) {
          if (sib !== item) {
            sib.classList.remove('is-open');
            sib.querySelector('.faq__a').style.maxHeight = null;
            sib.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
          }
        });
      }
      if (open) {
        item.classList.remove('is-open');
        a.style.maxHeight = null;
        q.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------------------------------------------------------
     Property filters (properties.html)
     --------------------------------------------------------------- */
  var filterBar = document.querySelector('[data-filter-bar]');
  if (filterBar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-property]'));
    var emptyMsg = document.querySelector('[data-empty]');
    filterBar.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBar.querySelectorAll('[data-filter]').forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        var f = btn.getAttribute('data-filter');
        var shown = 0;
        cards.forEach(function (card) {
          var match = f === 'all' || card.getAttribute('data-status') === f;
          card.style.display = match ? '' : 'none';
          if (match) shown++;
        });
        if (emptyMsg) emptyMsg.style.display = shown ? 'none' : 'block';
      });
    });
  }

  /* ---------------------------------------------------------------
     Interest chips (contact form)
     --------------------------------------------------------------- */
  document.querySelectorAll('.chip').forEach(function (chip) {
    var input = chip.querySelector('input');
    chip.addEventListener('click', function (e) {
      if (e.target.tagName !== 'INPUT') {
        if (input) input.checked = !input.checked;
      }
      chip.classList.toggle('is-active', input ? input.checked : chip.classList.toggle('is-active'));
    });
  });

  /* ---------------------------------------------------------------
     Contact form validation (client-side, no backend)
     --------------------------------------------------------------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var ok = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';
        if (ok && input.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        if (field) field.classList.toggle('has-error', !ok);
        if (!ok) valid = false;
      });
      if (valid) {
        var success = form.querySelector('.form__success');
        if (success) success.classList.add('is-visible');
        form.reset();
        document.querySelectorAll('.chip.is-active').forEach(function (c) { c.classList.remove('is-active'); });
        setTimeout(function () { if (success) success.classList.remove('is-visible'); }, 6000);
      }
    });
    form.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('has-error');
      });
    });
  }

  /* ---------------------------------------------------------------
     Lazy image loading (fade-in) + native lazy fallback
     --------------------------------------------------------------- */
  document.querySelectorAll('img.lazy').forEach(function (img) {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function () { img.classList.add('loaded'); });
      img.addEventListener('error', function () { img.classList.add('loaded'); });
    }
  });

  /* ---------------------------------------------------------------
     Footer year
     --------------------------------------------------------------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
