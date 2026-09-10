'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';
import { HERO_SCROLL_ENABLED, applyHeroScrollEffects } from '@/components/hero/heroScrollPreset';

const NAV_LINKS = [
  { label: 'Sarees' },
  { label: 'Salwars & Suits' },
  { label: 'Meet the Tailors' },
] as const;

export function HeroSection() {
  const { session, isReady } = useTailorSession();
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const loginHref = isReady && session.isAuthenticated ? getPostAuthPath(session) : '/login';
  const loginLabel = isReady && session.isAuthenticated ? 'Studio' : 'Log In';

  useEffect(() => {
    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    if (!HERO_SCROLL_ENABLED) {
      html.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    let restoreScroll: (() => void) | undefined;
    if (HERO_SCROLL_ENABLED && rootRef.current && heroRef.current) {
      restoreScroll = applyHeroScrollEffects(rootRef.current, heroRef.current);
    }

    return () => {
      restoreScroll?.();
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="hero-root relative h-dvh overflow-hidden bg-thy-bg text-thy-ink"
      style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
    >
      <section ref={heroRef} className="relative h-dvh overflow-hidden">
        <header className="hero-nav relative z-40 flex items-center justify-between gap-3 px-4 sm:px-6 md:px-12 lg:px-16 h-14 md:h-20 pt-[env(safe-area-inset-top)]">
          <div className="hidden md:block w-24" />
          <nav className="flex items-center gap-3 sm:gap-6 md:gap-10 mx-auto overflow-x-auto thy-scroll-x max-w-[65%] sm:max-w-none">
            {NAV_LINKS.map((item) => (
              <span
                key={item.label}
                className="text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.16em] sm:tracking-[0.28em] text-thy-muted whitespace-nowrap"
              >
                {item.label}
              </span>
            ))}
          </nav>
          <Link
            href={loginHref}
            className="text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.16em] sm:tracking-[0.28em] text-thy-muted hover:text-thy-ink transition-colors shrink-0 min-h-11 inline-flex items-center"
          >
            {loginLabel}
          </Link>
        </header>

        <div className="relative z-10 flex h-[calc(100dvh-3.5rem-env(safe-area-inset-top))] md:h-[calc(100dvh-5rem-env(safe-area-inset-top))] flex-col md:flex-row">
          <div className="relative h-[36vh] sm:h-[42vh] md:h-auto md:w-[52%] overflow-hidden bg-thy-mist">
            <img
              src="/hero/hero-couple.png"
              alt="Couple in bespoke Indian wear walking a sunlit street"
              className="hero-couple absolute inset-0 h-full w-full object-cover object-[center_20%]"
            />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-thy-bg/80 to-transparent pointer-events-none hidden md:block" />
          </div>

          <div className="relative flex-1 md:w-[48%] px-4 sm:px-6 md:px-10 lg:px-14 pt-5 md:pt-4 pb-28">
            <div className="hero-vellum pointer-events-none absolute inset-0 opacity-50" />
            <div className="hero-headline-shift relative max-w-xl">
              <h1
                className="hero-headline text-[clamp(2.5rem,5.8vw,6.1rem)] leading-[0.9] tracking-[-0.03em] text-thy-ink"
                style={{ fontFamily: 'var(--font-cormorant), serif' }}
              >
                BESPOKE
                <br />
                INDIAN WEAR.
                <br />
                TAILORED
                <br />
                LOCALLY.
              </h1>

              <div className="hero-progress absolute top-2 -right-2 md:-right-8 h-[58%] w-px bg-thy-brand">
                <div className="hero-progress-fill absolute inset-0 origin-top bg-thy-brand w-[2px] -ml-[0.5px]" />
              </div>
            </div>

            <div className="hero-cta-row mt-6 md:mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Link
                href="/signup"
                className="hero-leather-btn inline-flex items-center justify-center w-full sm:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
              >
                Design Your Perfect Fit
              </Link>
              <div className="hidden sm:block h-12 w-px bg-thy-ink/20" />
              <p className="hero-copy text-[11px] leading-relaxed uppercase tracking-[0.18em] text-thy-muted max-w-[13rem]">
                Connecting you
                <br />
                directly with Indian
                <br />
                artisans &amp; tailors
              </p>
            </div>
          </div>
        </div>

        <div className="hero-thumbs pointer-events-none absolute bottom-0 left-4 right-4 sm:left-[8%] sm:right-6 md:left-[42%] md:right-10 z-30 flex gap-2 sm:gap-3 md:gap-4 pb-[env(safe-area-inset-bottom)]">
          <div className="hero-thumb-1 w-[30%] md:w-[31%]">
            <img
              src="/hero/fabric-beige.png"
              alt="Indian silk brocade stack"
              className="hero-thumb-1-float h-20 sm:h-24 md:h-36 w-full object-cover"
            />
          </div>
          <div className="hero-thumb-2 w-[30%] md:w-[31%]">
            <img
              src="/hero/fabric-olive.png"
              alt="Olive bandhgala detail"
              className="hero-thumb-2-float h-20 sm:h-24 md:h-36 w-full object-cover"
            />
          </div>
          <div className="hero-thumb-3 w-[30%] md:w-[31%]">
            <img
              src="/hero/fabric-charcoal.png"
              alt="Gold zari saree border"
              className="hero-thumb-3-float h-20 sm:h-24 md:h-36 w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
