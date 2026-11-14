/**
 * Scroll-driven 3D motion for foreground content.
 *
 * Nothing animates on page load. Every effect is tied to the scroll position of
 * its own section, so a part of the page moves only while the visitor scrolls
 * through it. Elements already on screen at load start in their resting state.
 * Visitors who prefer reduced motion get no motion at all.
 *
 * Add to any element:
 *   data-3d="tilt"     lies back (rotateX) and straightens up as it scrolls into view
 *   data-3d="swing"    turns in from the side (rotateY) as it scrolls into view
 *   data-3d="flip"     on a container: each direct child hinges up from its bottom edge, in turn
 *   data-3d="table"    on a container: lies flat like photos on a table, stands up while scrolling past
 *   data-3d="turn"     keeps turning slowly (rotateY) the whole time it is on screen (trucks, phones)
 *   data-3d="depth"    parallax: moves at a different speed; set data-depth="-0.15" (negative = slower)
 *   data-3d="draw"     on an SVG path: the line draws itself across its section
 *   data-3d="stage"    the hero media: starts tilted back, flattens and grows as the page scrolls
 *   data-3d="pop"      plays once when it first comes into view (not tied to the scroll position)
 *   data-3d="pop-group" on a container: its children pop in once, one after another
 *
 * Optional: data-3d-strength="0.5" scales the angle/distance of any effect.
 *
 * Not scroll-driven (combine freely with the above, they use separate CSS properties):
 *   data-float         gentle idle bob while on screen; starts after the visitor first scrolls.
 *                      data-float="slow" for a longer, softer cycle.
 *   data-hover-tilt    static, but leans toward the mouse pointer on desktop.
 *
 * Mix them so the page has rhythm: scroll-driven 3D for the big set pieces,
 * pop for lists and figures, float for phones and badges, static for reading.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './lenis';

gsap.registerPlugin(ScrollTrigger);

const strength = (el: Element, fallback = 1) => Number((el as HTMLElement).dataset['3dStrength'] ?? fallback) || fallback;

/** Section-local scrub: the effect follows the scroll with a short ease. */
const SCRUB = 0.6;

function tilt(el: HTMLElement): void {
  const s = strength(el);
  gsap.fromTo(
    el,
    { rotateX: 26 * s, y: 70 * s, scale: 0.94, transformPerspective: 1400, transformOrigin: '50% 100%' },
    {
      rotateX: 0,
      y: 0,
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: SCRUB },
    },
  );
}

function swing(el: HTMLElement): void {
  const s = strength(el);
  const fromLeft = el.dataset['3dFrom'] === 'left';
  gsap.fromTo(
    el,
    { rotateY: (fromLeft ? 32 : -32) * s, x: (fromLeft ? -60 : 60) * s, transformPerspective: 1600, transformOrigin: fromLeft ? '0% 50%' : '100% 50%' },
    {
      rotateY: 0,
      x: 0,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 40%', scrub: SCRUB },
    },
  );
}

function flip(el: HTMLElement): void {
  const s = strength(el);
  const items = Array.from(el.children) as HTMLElement[];
  gsap.set(el, { perspective: 1600 });
  items.forEach((item, i) => {
    gsap.fromTo(
      item,
      { rotateX: -78 * s, y: 40, transformOrigin: '50% 100%' },
      {
        rotateX: 0,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: `top+=${i * 40} 88%`,
          end: `top+=${i * 40} 40%`,
          scrub: SCRUB,
        },
      },
    );
  });
}

function table(el: HTMLElement): void {
  const s = strength(el);
  gsap.fromTo(
    el,
    { rotateX: 48 * s, rotateZ: -7 * s, scale: 0.86, y: 60, transformPerspective: 1800, transformOrigin: '50% 30%' },
    {
      rotateX: 0,
      rotateZ: 0,
      scale: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'center 55%', scrub: SCRUB },
    },
  );
}

function turn(el: HTMLElement): void {
  const s = strength(el);
  gsap.fromTo(
    el,
    { rotateY: -24 * s, transformPerspective: 1500 },
    {
      rotateY: 18 * s,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: SCRUB },
    },
  );
}

function depth(el: HTMLElement): void {
  const d = Number(el.dataset.depth ?? -0.12);
  gsap.fromTo(
    el,
    { yPercent: -d * 100 },
    {
      yPercent: d * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
}

function draw(el: SVGGeometryElement): void {
  const length = el.getTotalLength();
  gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
  const section = el.closest('section') ?? el;
  gsap.to(el, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top 70%', end: 'bottom 70%', scrub: SCRUB },
  });
}

function stage(el: HTMLElement): void {
  // Resting state on load is the tilted pose; it only changes once the visitor scrolls.
  gsap.fromTo(
    el,
    { rotateX: 22, scale: 0.88, y: 0, transformPerspective: 1600, transformOrigin: '50% 0%' },
    {
      rotateX: 0,
      scale: 1,
      ease: 'none',
      immediateRender: true,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 15%', scrub: SCRUB },
    },
  );
}

/** Below the fold at load? Elements already on screen are never hidden or animated. */
const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.95;

function popItems(el: HTMLElement, items: HTMLElement[]): void {
  if (!items.length || !belowFold(el)) return;
  const s = strength(el);
  gsap.set(items, { autoAlpha: 0, y: 46 * s, scale: 0.86, rotateX: -24 * s, transformPerspective: 1200, transformOrigin: '50% 100%' });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () =>
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.75,
        ease: 'back.out(1.5)',
        stagger: 0.09,
        clearProps: 'transform,opacity,visibility',
      }),
  });
}

const handlers: Record<string, (el: HTMLElement) => void> = {
  pop: (el) => popItems(el, [el]),
  'pop-group': (el) => popItems(el, Array.from(el.children) as HTMLElement[]),
  tilt,
  swing,
  flip,
  table,
  turn,
  depth,
  stage,
  draw: (el) => draw(el as unknown as SVGGeometryElement),
};

/**
 * Gives inner pages the same scroll-driven 3D without per-page markup:
 * hero photos swing in, framed photos and videos straighten up, card grids
 * hinge up one by one, phones turn. Explicit data-3d always wins. Runs before
 * the scroll reveals so the two never fight over the same element.
 */
export function autoAssign3D(): void {
  const main = document.querySelector('main');
  if (!main) return;
  const assign = (el: Element, kind: string, power?: string) => {
    if (el.closest('[data-3d]')) return;
    el.setAttribute('data-3d', kind);
    if (power) el.setAttribute('data-3d-strength', power);
    el.removeAttribute('data-reveal');
  };
  main.querySelectorAll('.page-hero__figure').forEach((el) => assign(el, 'swing', '0.7'));
  // Card grids pop in once; numbered steps keep the scroll-driven hinge; FAQs stay calm (simple fade).
  main.querySelectorAll('.grid[data-reveal-group], .steps[data-reveal-group]').forEach((el) => {
    if (el.closest('[data-3d]')) return;
    assign(el, el.matches('.steps') ? 'flip' : 'pop-group', el.matches('.steps') ? '0.5' : undefined);
    el.querySelectorAll(':scope > [data-reveal]').forEach((child) => child.removeAttribute('data-reveal'));
  });
  main.querySelectorAll('.frame').forEach((el) => {
    if (!el.closest('.page-hero')) assign(el, 'tilt', '0.55');
  });
  // Phones float instead of turning with the scroll.
  main.querySelectorAll('.phone').forEach((el) => {
    if (!el.closest('[data-float], .get-app__visual, .app-hero__stage')) el.setAttribute('data-float', '');
  });
  main.querySelectorAll('.feature').forEach((el) => el.setAttribute('data-hover-tilt', ''));
}

export function initMotion(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-3d]'));
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    // Static resting state: draw lines fully, nothing moves.
    return;
  }

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    for (const el of targets) {
      const kind = el.dataset['3d'] ?? '';
      const narrow = window.innerWidth < 760;
      // On phones keep the effects but soften the big ones.
      if (narrow && !el.dataset['3dStrength'] && kind !== 'draw') el.dataset['3dStrength'] = '0.6';
      handlers[kind]?.(el);
    }
  });

  // Re-measure once fonts and lazy images settle.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

/**
 * Idle float. The bob itself is CSS (global.css, using the translate/rotate
 * properties so it stacks with any GSAP transform). This only switches it on:
 * after the first scroll, and only while the element is on screen.
 */
export function initFloat(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-float]'));
  if (!items.length || prefersReducedMotion()) return;
  items.forEach((el, i) => el.style.setProperty('--float-delay', `${-(i * 1.3) % 5}s`));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.target.classList.toggle('is-floating', entry.isIntersecting)),
    { rootMargin: '10% 0px' },
  );
  const start = () => items.forEach((el) => io.observe(el));
  // Nothing moves on load: floats start once the visitor scrolls (or opens a pop-up that floats).
  window.addEventListener('scroll', start, { once: true, passive: true });
  document.addEventListener('site:float-now', start, { once: true });
}

/** Static cards that lean toward the pointer on desktop. */
export function initHoverTilt(): void {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-hover-tilt]').forEach((el) => {
    const max = Number(el.dataset.hoverTilt) || 7;
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const lift = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 1000 });
    el.addEventListener('pointermove', (event) => {
      const box = el.getBoundingClientRect();
      const px = (event.clientX - box.left) / box.width - 0.5;
      const py = (event.clientY - box.top) / box.height - 0.5;
      rx(-py * max);
      ry(px * max);
      lift(-4);
    });
    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
      lift(0);
    });
  });
}

export { gsap, ScrollTrigger };
