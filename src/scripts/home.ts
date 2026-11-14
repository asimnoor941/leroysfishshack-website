/**
 * Home page scroll scenes. Nothing moves on load; every scene is scrubbed to
 * the scroll position of its own section. Reduced motion: nothing runs, the
 * page keeps its static layout (the dish ring stays a swipeable row).
 *
 *   hero    video card straightens and comes forward, headline recedes
 *   ticker  facts strip slides sideways with the scroll
 *   ring    dishes stand in a 3D ring that turns while the section is pinned
 *   split   [data-split] headlines hinge up word by word
 */
import { gsap, ScrollTrigger } from './motion';
import { prefersReducedMotion } from './lenis';

const reduced = prefersReducedMotion();
const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
if (reduced && video) {
  video.removeAttribute('autoplay');
  video.pause();
}

/** Wrap each word (and each inline element, e.g. <em>) of a heading in a span. */
function splitWords(el: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];
  const nodes = Array.from(el.childNodes);
  el.textContent = '';
  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? '').split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          el.append(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'split-w';
          span.textContent = part;
          el.append(span);
          words.push(span);
        }
      }
    } else if (node instanceof HTMLElement && node.tagName !== 'BR') {
      // Split inside the inline element too, keeping the element itself.
      const inner = splitWords(node);
      el.append(node);
      words.push(...inner);
    } else {
      el.append(node);
    }
  }
  return words;
}

function initSplit(): void {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    // Headings already on screen at load stay as they are.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
    const words = splitWords(el);
    gsap.set(el, { perspective: 900 });
    gsap.fromTo(
      words,
      { rotateX: -85, yPercent: 40, opacity: 0 },
      {
        rotateX: 0,
        yPercent: 0,
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 58%', scrub: 0.6 },
      },
    );
  });
}

function initHero(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const card = document.querySelector<HTMLElement>('[data-hero-card]');
  const copy = document.querySelector<HTMLElement>('[data-hero-copy]');
  if (!hero || !card || !copy) return;
  const mm = gsap.matchMedia();

  mm.add('(min-width: 60em)', () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    tl.fromTo(
      card,
      { rotateY: -16, rotateX: 6, rotateZ: 1.5, scale: 1, y: 0 },
      { rotateY: 4, rotateX: -10, rotateZ: 0, scale: 1.1, y: 120, ease: 'none' },
      0,
    ).fromTo(
      copy,
      { rotateX: 0, y: 0, opacity: 1, transformPerspective: 1200, transformOrigin: '50% 100%' },
      { rotateX: 22, y: -90, opacity: 0.25, ease: 'none' },
      0,
    );
  });

  mm.add('(max-width: 59.99em)', () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5 },
    });
    tl.fromTo(
      card,
      { scale: 1, rotateX: 0, borderRadius: 0, transformOrigin: '50% 0%' },
      { scale: 0.86, rotateX: 14, borderRadius: 32, ease: 'none' },
      0,
    ).fromTo(copy, { y: 0, opacity: 1 }, { y: -70, opacity: 0.2, ease: 'none' }, 0);
  });
}

function initTicker(): void {
  const track = document.querySelector<HTMLElement>('[data-ticker]');
  if (!track) return;
  gsap.fromTo(
    track,
    { xPercent: 0 },
    {
      xPercent: -22,
      ease: 'none',
      scrollTrigger: { trigger: track, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
    },
  );
}

function initRing(): void {
  const section = document.querySelector<HTMLElement>('[data-ring-section]');
  const pin = document.querySelector<HTMLElement>('[data-ring-pin]');
  const track = document.querySelector<HTMLElement>('[data-ring-track]');
  if (!section || !pin || !track) return;
  const cards = Array.from(track.children) as HTMLElement[];
  const n = cards.length;
  if (n < 3) return;

  section.classList.add('is-3d');
  const step = 360 / n;
  let radius = 0;

  // A big, tilted "crown": cards ride a wave around a ring wider than the screen,
  // the front plate comes toward the viewer and the side plates sweep off the edges.
  let lift = 0;
  let wave = 0;
  const layout = () => {
    const narrow = window.innerWidth < 760;
    const w = narrow ? Math.min(window.innerWidth * 0.5, 210) : Math.min(Math.max(window.innerWidth * 0.18, 240), 290);
    const h = Math.min(w * 1.38, window.innerHeight * (narrow ? 0.42 : 0.44));
    section.style.setProperty('--card-w', `${w}px`);
    section.style.setProperty('--card-h', `${h}px`);
    radius = (w / 2 / Math.tan(Math.PI / n)) * 1.3;
    lift = Math.min(radius * 0.26, 320); // how far the front plate leans out of the screen
    wave = h * 0.09;
    // CSS order matters: turn first, then push out along the turned axis, then ride the wave.
    cards.forEach((card, i) => {
      const y = Math.sin(((i * step * 3) * Math.PI) / 180) * wave;
      card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px) translateY(${y}px)`;
    });
  };
  layout();

  const state = { turn: 0 };
  const paint = () => {
    const tilt = -3 + Math.sin((state.turn * Math.PI) / 90) * 1.5; // the wheel rocks a little as it turns
    track.style.transform = `translateZ(${lift - radius}px) rotateX(${tilt}deg) rotateY(${state.turn}deg)`;
    cards.forEach((card, i) => {
      const angle = ((((i * step + state.turn) % 360) + 540) % 360) - 180; // -180..180, 0 = facing us
      const facing = Math.max(Math.cos((angle * Math.PI) / 180), 0); // 1 front, 0 side and back
      const front = Math.max(0, 1 - Math.abs(angle) / (step * 0.9)); // only the plate facing us lights up
      card.style.filter = `brightness(${0.4 + 0.6 * facing})`;
      card.style.setProperty('--glow', front.toFixed(3));
    });
  };
  paint();

  gsap.to(state, {
    turn: -(n / 2 - 1) * step, // one lap of the 11 dishes
    ease: 'none',
    onUpdate: paint,
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * 2.6}`,
      pin,
      scrub: 0.8,
      anticipatePin: 1,
      refreshPriority: 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        layout();
        paint();
      },
    },
  });
}

if (!reduced) {
  initHero();
  initTicker();
  initRing();
  initSplit();
  // Pinning adds space: re-measure every trigger on the page in order.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
