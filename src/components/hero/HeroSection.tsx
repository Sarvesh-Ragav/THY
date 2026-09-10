'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';

const NAV_LINKS = [
  { label: 'Collections', href: '#collections' },
  { label: 'Meet the Tailors', href: '#meet-the-tailors' },
  { label: 'How It Works', href: '#how-it-works' },
] as const;

export function HeroSection() {
  const { session, isReady } = useTailorSession();
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const loginHref = isReady && session.isAuthenticated ? getPostAuthPath(session) : '/login';
  const loginLabel = isReady && session.isAuthenticated ? 'Studio' : 'Log In';

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    if (!root || !hero) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

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
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.15,
      };

      gsap.from('.hero-headline', {
        y: 56,
        opacity: 0,
        duration: 1.35,
        ease: 'power3.out',
        delay: 0.15,
      });

      gsap.from('.hero-cta-row', {
        y: 28,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.45,
      });

      gsap.from('.hero-nav', {
        y: -16,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
      });

      gsap.from('.hero-thumbs img', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.6,
      });

      gsap.to('.hero-street', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { ...scrub },
      });

      gsap.to('.hero-couple', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { ...scrub },
      });

      gsap.to('.hero-headline-shift', {
        y: -36,
        ease: 'none',
        scrollTrigger: { ...scrub },
      });

      gsap.to('.hero-copy', {
        y: -88,
        ease: 'none',
        scrollTrigger: { ...scrub },
      });

      gsap.to('.hero-thumb-1', {
        y: -28,
        ease: 'none',
        scrollTrigger: { ...scrub },
      });

      gsap.to('.hero-thumb-2', {
        y: -54,
        ease: 'none',
        scrollTrigger: { ...scrub },
      });

      gsap.to('.hero-thumb-3', {
        y: -16,
        ease: 'none',
        scrollTrigger: { ...scrub },
      });

      gsap.fromTo(
        '.hero-progress-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.35,
          },
        }
      );

      gsap.to('.hero-thumb-1-float', {
        y: -10,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.hero-thumb-2-float', {
        y: -16,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.4,
      });

      gsap.to('.hero-thumb-3-float', {
        y: -8,
        duration: 2.9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.2,
      });
    }, root);

    const onNavClick = (event: Event) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const hash = target.getAttribute('href');
      if (!hash?.startsWith('#')) return;
      event.preventDefault();
      const marker = root.querySelector(hash);
      if (marker) {
        lenis.scrollTo(marker as HTMLElement, { offset: 0, duration: 1.4 });
      }
    };

    const navLinks = root.querySelectorAll<HTMLAnchorElement>('a[data-lenis-scroll]');
    navLinks.forEach((link) => link.addEventListener('click', onNavClick));

    return () => {
      navLinks.forEach((link) => link.removeEventListener('click', onNavClick));
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="hero-root relative bg-[#F3EEE4] text-[#2C2418]"
      style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
    >
      <section ref={heroRef} className="relative h-[240vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <header className="hero-nav relative z-40 flex items-center justify-between px-6 md:px-12 lg:px-16 h-16 md:h-20">
            <div className="hidden md:block w-24" />
            <nav className="flex items-center gap-6 md:gap-10 mx-auto">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  data-lenis-scroll
                  className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-[#5C5146] hover:text-[#2C2418] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <Link
              href={loginHref}
              className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-[#5C5146] hover:text-[#2C2418] transition-colors shrink-0"
            >
              {loginLabel}
            </Link>
          </header>

          <div className="relative z-10 flex h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex-col md:flex-row">
            <div className="relative h-[42vh] md:h-auto md:w-[52%] overflow-hidden bg-[#d9cbb8]">
              <img
                src="/hero/hero-street.png"
                alt=""
                className="hero-street absolute inset-[-12%] h-[124%] w-[124%] max-w-none object-cover scale-110"
              />
              <img
                src="/hero/hero-couple.png"
                alt="Couple in bespoke tailored suits walking a sunlit city street"
                className="hero-couple absolute inset-[-8%] h-[116%] w-[116%] max-w-none object-cover object-[center_20%]"
              />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F3EEE4]/80 to-transparent pointer-events-none hidden md:block" />

              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10">
                <div className="border border-[#c4a15a]/70 bg-[#2C2418]/80 px-4 py-2.5 backdrop-blur-[2px] shadow-[0_8px_30px_rgba(44,36,24,0.28)]">
                  <p className="text-[9px] uppercase tracking-[0.32em] text-[#E8D7B0]">Private Atelier</p>
                  <p
                    className="text-[#F3EEE4] text-sm tracking-[0.12em]"
                    style={{ fontFamily: 'var(--font-cormorant), serif' }}
                  >
                    THY · Established locally
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex-1 md:w-[48%] px-6 md:px-10 lg:px-14 pt-6 md:pt-4 pb-28">
              <div className="hero-vellum pointer-events-none absolute inset-0 opacity-50" />
              <div className="hero-headline-shift relative max-w-xl">
                <h1
                  className="hero-headline text-[clamp(2.6rem,6.2vw,6.4rem)] leading-[0.9] tracking-[-0.03em] text-[#2C2418]"
                  style={{ fontFamily: 'var(--font-cormorant), serif' }}
                >
                  BESPOKE
                  <br />
                  LUXURY.
                  <br />
                  TAILORED
                  <br />
                  LOCALLY.
                </h1>

                <div className="hero-progress absolute top-2 -right-2 md:-right-8 h-[58%] w-px bg-[#d7c4a0]">
                  <div className="hero-progress-fill absolute inset-0 origin-top bg-[#C4A15A] w-[2px] -ml-[0.5px]" />
                </div>
              </div>

              <div className="hero-cta-row mt-8 md:mt-12 flex flex-col sm:flex-row sm:items-center gap-6">
                <Link
                  href="/signup"
                  className="hero-leather-btn inline-flex items-center justify-center px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2C2418] shadow-[0_10px_24px_rgba(90,70,32,0.22)]"
                >
                  Design Your Perfect Fit
                </Link>
                <div className="hidden sm:block h-12 w-px bg-[#2C2418]/25" />
                <p className="hero-copy text-[11px] leading-relaxed uppercase tracking-[0.18em] text-[#5C5146] max-w-[11rem]">
                  Connecting you
                  <br />
                  directly with
                  <br />
                  artisan tailors
                </p>
              </div>
            </div>
          </div>

          <div className="hero-thumbs pointer-events-none absolute bottom-0 left-[8%] right-6 md:left-[42%] md:right-10 z-30 flex gap-3 md:gap-4">
            <div className="hero-thumb-1 w-[30%] md:w-[31%]">
              <img
                src="/hero/fabric-beige.png"
                alt="Camel wool suiting"
                className="hero-thumb-1-float h-24 md:h-36 w-full object-cover shadow-[0_12px_30px_rgba(44,36,24,0.18)]"
              />
            </div>
            <div className="hero-thumb-2 w-[30%] md:w-[31%]">
              <img
                src="/hero/fabric-charcoal.png"
                alt="Charcoal wool suiting"
                className="hero-thumb-2-float h-24 md:h-36 w-full object-cover shadow-[0_12px_30px_rgba(44,36,24,0.18)]"
              />
            </div>
            <div className="hero-thumb-3 w-[30%] md:w-[31%]">
              <img
                src="/hero/fabric-olive.png"
                alt="Olive jacket and brown tie"
                className="hero-thumb-3-float h-24 md:h-36 w-full object-cover shadow-[0_12px_30px_rgba(44,36,24,0.18)]"
              />
            </div>
          </div>
        </div>

        <div id="collections" className="absolute top-[8%] h-px w-px" />
        <div id="meet-the-tailors" className="absolute top-[48%] h-px w-px" />
        <div id="how-it-works" className="absolute top-[88%] h-px w-px" />
      </section>
    </div>
  );
}
