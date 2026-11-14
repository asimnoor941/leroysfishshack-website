/// <reference types="astro/client" />

interface Window {
  /** The page's Lenis smooth-scroll instance, when smooth scrolling is active. */
  __lenis?: import('lenis').default;
  /** Set by the main script once scroll reveals are wired up. */
  __revealReady?: boolean;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
