'use client';

import React from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { HeroCarousel } from '@/components/customer/HeroCarousel';
import { CategoryGrid } from '@/components/customer/CategoryGrid';
import { DESIGNS, TAILORS } from '@/lib/customer-home-data';
import { hasCustomerActivity, isCustomerOnboardingComplete } from '@/lib/tailor-session';

export function CustomerHome() {
  const { session, isReady } = useTailorSession();
  const loggedIn = isReady && session.isAuthenticated && isCustomerOnboardingComplete(session);
  const activity = loggedIn && hasCustomerActivity(session);
  const picked = DESIGNS.filter((design) => design.popular);
  const trending = DESIGNS.filter((design) => design.trending);

  return (
    <>
      <section className="relative min-h-[78vh] overflow-hidden">
        <HeroCarousel />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[78vh] flex items-end pb-16 pointer-events-none">
          <div className="max-w-xl text-thy-canvas pointer-events-auto">
            <h1 className="text-[clamp(3rem,6.5vw,6.4rem)] leading-[0.9]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              Stitch Your Desire
            </h1>
            <p className="mt-4 text-sm md:text-base tracking-[0.04em] text-thy-canvas/90">
              Your Fabric. Your Style. Your Tailor.
            </p>
            <Link
              href="/stitch-your-outfit"
              className="hero-leather-btn inline-flex mt-8 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
            >
              Stitch Your Outfit
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        <div>
          <h2 className="text-3xl md:text-4xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Find Your Perfect Tailor
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TAILORS.map((tailor) => (
              <Link key={tailor.id} href={`/tailors/${tailor.id}`} className="thy-card overflow-hidden hover:border-thy-brand/40 transition-colors">
                <img src={tailor.image} alt="" className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{tailor.name}</h3>
                  <p className="text-sm text-thy-muted">{tailor.specialty}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Picked Just for You
          </h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {picked.map((design) => (
              <Link key={design.id} href={`/categories/${design.categoryId}`} className="thy-card overflow-hidden hover:border-thy-brand/40 transition-colors">
                <img src={design.image} alt="" className="h-40 w-full object-cover" />
                <p className="p-3 text-sm">{design.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Find Your Style
          </h2>
          <div className="mt-6">
            <CategoryGrid />
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Trending Now
          </h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {trending.map((design) => (
              <Link key={design.id} href="/explore" className="thy-card overflow-hidden hover:border-thy-brand/40 transition-colors">
                <img src={design.image} alt="" className="h-40 w-full object-cover" />
                <p className="p-3 text-sm">{design.title}</p>
              </Link>
            ))}
          </div>
          <Link href="/explore" className="inline-block mt-4 text-[11px] uppercase tracking-[0.18em] text-thy-brand border-b border-thy-brand">
            Explore Relevant Trending Designs
          </Link>
        </div>

        <div className="thy-card p-6">
          <h2 className="text-3xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Continue Your Style Journey
          </h2>
          {activity ? (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link href="/my-designs" className="border-b border-thy-brand text-thy-brand">My Designs</Link>
              <Link href="/my-orders" className="border-b border-thy-brand text-thy-brand">My Orders</Link>
              <Link href="/my-measurements" className="border-b border-thy-brand text-thy-brand">My Measurements</Link>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-thy-muted">Ready to Stitch Something You Love?</p>
              <p className="text-sm text-thy-subtle mt-1">Start your style journey with THY.</p>
              <Link
                href="/stitch-your-outfit"
                className="hero-leather-btn inline-flex mt-5 px-6 py-3 text-[11px] uppercase tracking-[0.18em]"
              >
                Stitch Your Outfit
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
