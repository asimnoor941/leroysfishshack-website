/**
 * Runs on every page: scroll reveals, scroll-driven 3D motion, smooth scrolling
 * and analytics (contact clicks).
 *
 * Nothing animates when the page first loads: anything already on screen is shown
 * in its final state, and only content the visitor scrolls to animates in.
 */
import { createLenis, prefersReducedMotion } from './lenis';
import { loadAnalytics, track } from './track';
import { autoAssign3D, initFloat, initHoverTilt, initMotion, ScrollTrigger } from './motion';

// ----- scroll reveals -----
function initReveals(): void {
  const root = document.documentElement;
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  window.__revealReady = true;

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
      if (!el.style.getPropertyValue('--reveal-i')) el.style.setProperty('--reveal-i', String(Math.min(i, 6)));
    });
  });

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  // Anything visible at load is shown as-is, with no entrance animation.
  const fold = window.innerHeight;
  for (const el of targets) {
    if (el.getBoundingClientRect().top < fold) el.classList.add('is-in');
  }
  // Only now may below-the-fold content start hidden (see global.css).
  root.classList.add('reveal-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );
  targets.filter((el) => !el.classList.contains('is-in')).forEach((el) => observer.observe(el));
}

// ----- smooth scrolling, driven together with the 3D scroll effects -----
function initSmoothScroll(): void {
  const lenis = createLenis({ autoRaf: true });
  if (lenis) lenis.on('scroll', ScrollTrigger.update);
}

// ----- analytics -----
function initAnalytics(): void {
  const start = () => loadAnalytics();
  if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 4000 });
  else setTimeout(start, 2500);

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href^="tel:"], a[href^="sms:"], a[href^="mailto:"]');
    if (link) track('contact_click', { method: link.protocol.replace(':', '') });
  });
}

autoAssign3D();
initReveals();
initMotion();
initFloat();
initHoverTilt();
initSmoothScroll();
initAnalytics();
