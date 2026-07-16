/**
 * motion.js
 * StoreForge Base Motion Layer
 * Handles Scroll Reveals, Staggering, Hover Effects, Sticky Headers
 */

(function() {
  // Opt-in to progressive enhancement motion layer if JS is enabled & running
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  try {
    document.documentElement.classList.add('js-motion-enabled');

    // 1. Scroll Reveal with Staggering
    const revealOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger slightly before entering view
      threshold: 0
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sf-revealed');
          // Unobserve after reveal (don't re-animate on scroll up)
          observer.unobserve(entry.target);
          
          // Handle staggering for children if requested or inside stagger-parent
          if (entry.target.hasAttribute('data-stagger') || entry.target.classList.contains('sf-stagger-parent')) {
            const children = entry.target.querySelectorAll('.sf-stagger-item');
            children.forEach((child, index) => {
              child.style.transitionDelay = `calc(var(--motion-stagger, 100ms) * ${index + 1})`;
              child.classList.add('sf-revealed');
            });
          }
        }
      });
    }, revealOptions);

    const observeElements = () => {
      document.querySelectorAll('.sf-reveal, .sf-stagger-parent, .sf-stagger-item').forEach(el => {
        if (!el.hasAttribute('data-sf-observed')) {
          el.setAttribute('data-sf-observed', 'true');
          revealObserver.observe(el);
        }
      });
    };

    observeElements();

    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(() => {
        observeElements();
      }).observe(document.body || document.documentElement, { childList: true, subtree: true });
    }

    // Safety fallback: ensure no element stays hidden indefinitely if observer misses or layout shifts
    setTimeout(() => {
      document.querySelectorAll('.js-motion-enabled .sf-reveal:not(.sf-revealed), .js-motion-enabled .sf-stagger-item:not(.sf-revealed)').forEach(el => {
        el.classList.add('sf-revealed');
      });
    }, 3500);

  } catch (err) {
    console.error('motion.js error, falling back to visible content:', err);
    document.documentElement.classList.remove('js-motion-enabled');
  }

  // 2. Sticky Header Scroll Effect
  const header = document.querySelector('.sf-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // If we scroll past 50px, add a background/shrink class
      if (currentScroll > 50) {
        header.classList.add('sf-header-scrolled');
      } else {
        header.classList.remove('sf-header-scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // 3. PDP Gallery Zoom on Hover
  document.querySelectorAll('.gallery-main').forEach(gallery => {
    const img = gallery.querySelector('img');
    if (!img) return;

    gallery.addEventListener('mousemove', e => {
      // Respect prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const rect = gallery.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = 'scale(var(--motion-zoom, 1.6))';
    });
    
    gallery.addEventListener('mouseleave', () => {
      img.style.transformOrigin = 'center';
      img.style.transform = 'scale(1)';
    });
  });

})();
