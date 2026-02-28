/**
 * MullaeCompany - Shared Main JavaScript
 * Shared between Korean (/ko) and English (/en) site versions.
 * Vanilla JS -- no frameworks required.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================================
     1. Mobile Navigation Toggle
     ========================================================================== */

  const navToggle = document.querySelector('.nav-mobile-toggle');
  const navMobile = document.querySelector('.nav-mobile');

  if (navToggle && navMobile) {
    function toggleMobileNav() {
      var isOpen = navMobile.classList.toggle('active');
      navToggle.classList.toggle('active');
      document.body.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    }

    function closeMobileNav() {
      navMobile.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', toggleMobileNav);

    // Close mobile nav when any link inside it is clicked
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMobile.classList.contains('active')) {
        closeMobileNav();
      }
    });
  }

  /* ==========================================================================
     2. Header Scroll Effect
     ========================================================================== */

  const siteHeader = document.querySelector('.site-header');
  var SCROLL_THRESHOLD = 50; // px from top before the header style changes

  function handleHeaderScroll() {
    if (!siteHeader) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  // Run once on load (in case the page is already scrolled) then on every scroll
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ==========================================================================
     3. Smooth Scroll for Anchor Links
     ========================================================================== */

  var HEADER_OFFSET = 72; // px -- matches the fixed header height

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');

      // Ignore bare "#" links
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ==========================================================================
     4. Scroll Animations (Intersection Observer)
     ========================================================================== */

  if ('IntersectionObserver' in window) {
    var animationObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;

        // If the element lives inside a .stagger parent, apply an incremental
        // transition-delay so children appear one after another.
        var staggerParent = el.closest('.stagger');
        if (staggerParent) {
          var siblings = Array.from(
            staggerParent.querySelectorAll('.fade-up, .fade-in')
          );
          var index = siblings.indexOf(el);
          if (index > -1) {
            el.style.transitionDelay = (index * 0.1) + 's';
          }
        }

        el.classList.add('visible');

        // Stop observing once the element has been revealed
        animationObserver.unobserve(el);
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.fade-up, .fade-in').forEach(function (el) {
      animationObserver.observe(el);
    });
  }


  /* ==========================================================================
     6. Counter Animation for Stats
     ========================================================================== */

  /**
   * Animate a single .stat-number element from 0 to its data-count value.
   *
   * @param {HTMLElement} el  - The element whose textContent will be animated.
   */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;  // ms
    var startTime = null;

    /**
     * easeOutCubic gives a fast start that decelerates toward the end,
     * which feels natural for counting animations.
     */
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;

      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = Math.floor(easedProgress * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure the final value is exact
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // Use Intersection Observer to trigger counter animation when visible
  var statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.1
    });

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

}); // end DOMContentLoaded
