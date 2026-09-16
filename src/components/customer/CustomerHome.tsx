'use client';

import React from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useAppearance } from '@/components/providers/AppearanceProvider';
import { HeroCarousel } from '@/components/customer/HeroCarousel';
import { CategoryGrid } from '@/components/customer/CategoryGrid';
import { DESIGNS } from '@/lib/customer-home-data';
import { useDirectoryTailors } from '@/hooks/useDirectoryTailors';
import { hasCustomerActivity, isCustomerOnboardingComplete } from '@/lib/tailor-session';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';
import { NEAR_ME_RADIUS_KM, distanceToCity, nearestCity } from '@/lib/geo';

export function CustomerHome() {
  const { session, isReady } = useTailorSession();
  const { t } = useAppearance();
  const { coords, label } = useCustomerLocation();
  const loggedIn = isReady && session.isAuthenticated && isCustomerOnboardingComplete(session);
  const activity = loggedIn && hasCustomerActivity(session);
  const picked = DESIGNS.filter((design) => design.popular);
  const trending = DESIGNS.filter((design) => design.trending);
  const { tailors } = useDirectoryTailors();
  const nearbyTailors = React.useMemo(() => {
    if (tailors.length === 0) return [];
    if (!coords) return tailors.slice(0, 4);
    const ranked = [...tailors]
      .map((tailor) => ({ tailor, km: distanceToCity(coords, tailor.city) ?? Number.POSITIVE_INFINITY }))
      .sort((a, b) => a.km - b.km);
    const nearby = ranked.filter((item) => item.km <= NEAR_ME_RADIUS_KM);
    const source = nearby.length > 0 ? nearby : ranked.filter((item) => item.tailor.city === nearestCity(coords).city);
    return (source.length > 0 ? source : ranked).slice(0, 4).map((item) => item.tailor);
  }, [coords, tailors]);

  return (
    <>
      <section className="relative min-h-[68dvh] sm:min-h-[74dvh] md:min-h-[78vh] overflow-hidden">
        <HeroCarousel />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[68dvh] sm:min-h-[74dvh] md:min-h-[78vh] flex items-end pb-14 sm:pb-16 pointer-events-none">
          <div className="max-w-xl text-thy-canvas pointer-events-auto">
            <h1 className="text-[clamp(2.4rem,12vw,6.4rem)] leading-[0.9] drop-shadow-[0_2px_18px_rgba(0,0,0,0.28)]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {t('homeHeroTitle')}
            </h1>
            <p className="mt-3 sm:mt-4 text-sm md:text-base tracking-[0.04em] text-thy-canvas/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
              {t('homeHeroSub')}
            </p>
            <Link
              href="/stitch-your-outfit"
              className="hero-leather-btn inline-flex items-center justify-center mt-6 sm:mt-8 w-full sm:w-auto px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
            >
              {t('homeCta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-14 md:space-y-20">
        <div>
          <p className="thy-section-kicker">{t('homeArtisans')}</p>
          <h2 className="thy-section-title text-2xl sm:text-3xl md:text-4xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {t('homeFindTailor')}
          </h2>
          {label && <p className="mt-1 text-sm text-thy-muted">{t('homeNear')} {label}</p>}
          {nearbyTailors.length > 0 ? (
          <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {nearbyTailors.map((tailor) => {
              const samples = tailor.portfolio.slice(0, 3);
              return (
                <Link key={tailor.id} href={`/tailors/${tailor.id}`} className="thy-card overflow-hidden hover:border-black transition-colors">
                  <img src={tailor.image} alt="" className="h-36 sm:h-40 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{tailor.studio}</h3>
                    <p className="text-sm text-thy-muted">
                      {tailor.specialty} · {tailor.city}
                      {tailor.acceptingOrders === false ? ' · Booked' : ' · Available'}
                    </p>
                    {samples.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {samples.map((item) => (
                          <img
                            key={item.id}
                            src={item.image}
                            alt=""
                            className="h-12 w-full object-cover border border-black"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          ) : (
            <p className="mt-5 text-sm text-thy-muted">Signed-up tailors and their public portfolios will appear here.</p>
          )}
        </div>

        <div>
          <p className="thy-section-kicker">{t('homeForYou')}</p>
          <h2 className="thy-section-title text-2xl sm:text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {t('homePicked')}
          </h2>
          <div className="mt-5 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {picked.map((design) => (
              <Link key={design.id} href={`/categories/${design.categoryId}`} className="thy-card overflow-hidden hover:border-black transition-colors">
                <img src={design.image} alt="" className="h-32 sm:h-40 w-full object-cover" />
                <p className="p-3 text-sm">{design.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="thy-section-kicker">{t('homeCollections')}</p>
          <h2 className="thy-section-title text-2xl sm:text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {t('homeFindStyle')}
          </h2>
          <div className="mt-5 sm:mt-6">
            <CategoryGrid />
          </div>
        </div>

        <div>
          <p className="thy-section-kicker">{t('homeNow')}</p>
          <h2 className="thy-section-title text-2xl sm:text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {t('homeTrending')}
          </h2>
          <div className="mt-5 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {trending.map((design) => (
              <Link key={design.id} href="/explore" className="thy-card overflow-hidden hover:border-black transition-colors">
                <img src={design.image} alt="" className="h-32 sm:h-40 w-full object-cover" />
                <p className="p-3 text-sm">{design.title}</p>
              </Link>
            ))}
          </div>
          <Link href="/explore" className="inline-block mt-4 text-[11px] uppercase tracking-[0.18em] text-thy-burgundy border-b border-thy-burgundy/40">
            {t('homeExploreTrending')}
          </Link>
        </div>

        <div className="thy-card p-5 sm:p-6">
          <p className="thy-section-kicker">{t('homeContinue')}</p>
          <h2 className="thy-section-title text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {t('homeContinueTitle')}
          </h2>
          {activity ? (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link href="/my-orders" className="border-b border-thy-burgundy/40 text-thy-burgundy">{t('homeMyOrders')}</Link>
              <Link href="/my-measurements" className="border-b border-thy-burgundy/40 text-thy-burgundy">{t('homeMyMeasurements')}</Link>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-thy-muted">{t('homeReady')}</p>
              <p className="text-sm text-thy-subtle mt-1">{t('homeStart')}</p>
              <Link
                href="/stitch-your-outfit"
                className="inline-flex items-center justify-center mt-5 w-full sm:w-auto px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold bg-thy-burgundy text-thy-cream hover:bg-[#4A1520]"
              >
                {t('homeCta')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
