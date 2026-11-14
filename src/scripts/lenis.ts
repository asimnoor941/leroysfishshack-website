/**
 * Smooth scrolling (Lenis). One instance per page, kept on window.__lenis so
 * dialogs can pause it and scroll-driven scenes can subscribe to it.
 *
 * Skipped entirely when the visitor prefers reduced motion: the page then
 * scrolls natively.
 */
import Lenis from 'lenis';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Options {
  /**
   * true: Lenis runs its own animation frame loop (normal pages).
   * false: the caller drives lenis.raf(), e.g. from the GSAP ticker, so scroll
   * and scrubbed animation update in the same frame.
   */
  autoRaf?: boolean;
}

export function createLenis({ autoRaf = true }: Options = {}): Lenis | undefined {
  if (window.__lenis) return window.__lenis;
  if (prefersReducedMotion()) return undefined;

  const header = document.querySelector<HTMLElement>('[data-header]');
  const lenis = new Lenis({
    autoRaf,
    lerp: 0.11,
    wheelMultiplier: 1,
    // In-page links (#order, #main) scroll smoothly and stop below the sticky header.
    anchors: { offset: -((header?.offsetHeight ?? 76) + 12) },
  });
  window.__lenis = lenis;
  return lenis;
}
