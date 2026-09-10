import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Saved GSAP / Lenis scroll settings from the first luxury hero pass.
 * The landing page is currently a fixed, non-scrolling screen.
 * Set HERO_SCROLL_ENABLED to true and call applyHeroScrollEffects() to restore.
 */
export const HERO_SCROLL_ENABLED = false;

export const HERO_LENIS_OPTIONS = {
  duration: 1.25,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.1,
};

export const HERO_SECTION_HEIGHT = '240vh';

export const HERO_SCRUB = {
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1.15,
};

export const HERO_PARALLAX = {
  street: { yPercent: 18 },
  couple: { yPercent: -12 },
  headline: { y: -36 },
  copy: { y: -88 },
  thumb1: { y: -28 },
  thumb2: { y: -54 },
  thumb3: { y: -16 },
  progress: { scrub: 0.35 },
};

export const HERO_INTRO = {
  headline: { y: 56, opacity: 0, duration: 1.35, ease: 'power3.out', delay: 0.15 },
  cta: { y: 28, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.45 },
  nav: { y: -16, opacity: 0, duration: 0.9, ease: 'power2.out' },
  thumbs: { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'power2.out', delay: 0.6 },
};

export const HERO_THUMB_FLOAT = {
  thumb1: { y: -10, duration: 2.6, delay: 0 },
  thumb2: { y: -16, duration: 3.2, delay: 0.4 },
  thumb3: { y: -8, duration: 2.9, delay: 0.2 },
};

export function applyHeroScrollEffects(root: HTMLElement, hero: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis(HERO_LENIS_OPTIONS);
  const onLenisScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onLenisScroll);

  const ticker = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  const ctx = gsap.context(() => {
    const scrub = {
      trigger: hero,
      ...HERO_SCRUB,
    };

    gsap.from('.hero-headline', HERO_INTRO.headline);
    gsap.from('.hero-cta-row', HERO_INTRO.cta);
    gsap.from('.hero-nav', HERO_INTRO.nav);
    gsap.from('.hero-thumbs img', HERO_INTRO.thumbs);

    gsap.to('.hero-street', { ...HERO_PARALLAX.street, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.to('.hero-couple', { ...HERO_PARALLAX.couple, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.to('.hero-headline-shift', { ...HERO_PARALLAX.headline, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.to('.hero-copy', { ...HERO_PARALLAX.copy, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.to('.hero-thumb-1', { ...HERO_PARALLAX.thumb1, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.to('.hero-thumb-2', { ...HERO_PARALLAX.thumb2, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.to('.hero-thumb-3', { ...HERO_PARALLAX.thumb3, ease: 'none', scrollTrigger: { ...scrub } });

    gsap.fromTo(
      '.hero-progress-fill',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: hero,
          start: HERO_SCRUB.start,
          end: HERO_SCRUB.end,
          scrub: HERO_PARALLAX.progress.scrub,
        },
      }
    );

    gsap.to('.hero-thumb-1-float', {
      ...HERO_THUMB_FLOAT.thumb1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to('.hero-thumb-2-float', {
      ...HERO_THUMB_FLOAT.thumb2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to('.hero-thumb-3-float', {
      ...HERO_THUMB_FLOAT.thumb3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, root);

  return () => {
    ctx.revert();
    gsap.ticker.remove(ticker);
    lenis.off('scroll', onLenisScroll);
    lenis.destroy();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}
