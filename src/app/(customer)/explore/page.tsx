'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Copy, Search, Sparkles, Truck } from 'lucide-react';
import { CategoryGrid } from '@/components/customer/CategoryGrid';
import { DESIGNS, GARMENT_CATEGORIES } from '@/lib/customer-home-data';
import { useAppearance } from '@/components/providers/AppearanceProvider';
import type { UiKey } from '@/lib/i18n';

const ghostBtn =
  'inline-flex items-center justify-center min-h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] border border-thy-burgundy/20 bg-thy-cream text-thy-ink transition-colors hover:border-thy-burgundy/40 hover:text-thy-burgundy cursor-pointer';

const FILTERS = [
  { id: 'All', key: 'filterAll' },
  { id: 'Trending', key: 'filterTrending' },
  { id: 'Festive', key: 'filterFestive' },
  { id: 'Combos', key: 'filterCombos' },
  { id: 'Budget', key: 'filterBudget' },
  { id: 'Artisans', key: 'filterArtisans' },
] as const;
type Filter = (typeof FILTERS)[number]['id'];

const COUPONS = [
  { code: 'THYFEST500', discountKey: 'couponFestiveOff', descKey: 'couponFestiveDesc', tagKey: 'couponFestive' },
  { code: 'ARTISAN20', discountKey: 'couponArtisanOff', descKey: 'couponArtisanDesc', tagKey: 'couponArtisan' },
  { code: 'EXPRESSFREE', discountKey: 'couponExpressOff', descKey: 'couponExpressDesc', tagKey: 'couponExpress' },
  { code: 'COMBO1000', discountKey: 'couponComboOff', descKey: 'couponComboDesc', tagKey: 'couponCombo' },
] as const;

const COMBOS = [
  {
    titleKey: 'exploreLehengaCombo' as const,
    descKey: 'exploreLehengaDesc' as const,
    price: '₹2,499',
    was: '₹3,699',
    image: '/hero/hero-couple.png',
  },
  {
    titleKey: 'exploreSuitCombo' as const,
    descKey: 'exploreSuitDesc' as const,
    price: '₹2,999',
    was: '₹4,200',
    image: '/hero/fabric-olive.png',
  },
] as const;

const BUDGET_FITS = [
  { titleKey: 'exploreBlouses' as const, price: '₹399', image: '/garment_categories/blouse.jpg', href: '/stitch-your-outfit' },
  { titleKey: 'exploreKurtis' as const, price: '₹449', image: '/garment_categories/kurti.jpg', href: '/stitch-your-outfit' },
] as const;

export default function ExplorePage() {
  const { t } = useAppearance();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [copiedCoupon, setCopiedCoupon] = useState('');

  const looks = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return DESIGNS.filter((design) => {
      const matchesQuery =
        !needle ||
        design.title.toLowerCase().includes(needle) ||
        design.categoryId.toLowerCase().includes(needle);
      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Trending' && design.trending) ||
        (activeFilter === 'Festive' && (design.categoryId === 'lehengas' || design.categoryId === 'sarees')) ||
        (activeFilter === 'Combos' && (design.categoryId === 'lehengas' || design.categoryId === 'sherwanis')) ||
        (activeFilter === 'Budget' && (design.categoryId === 'salwars' || design.categoryId === 'sarees')) ||
        (activeFilter === 'Artisans' && design.popular);
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query]);

  const showCoupons = activeFilter === 'All' || activeFilter === 'Festive' || activeFilter === 'Combos';
  const showBudget = activeFilter === 'All' || activeFilter === 'Budget';
  const showCombos = activeFilter === 'All' || activeFilter === 'Festive' || activeFilter === 'Combos';
  const showArtisans = activeFilter === 'All' || activeFilter === 'Artisans';
  const showExpress = activeFilter === 'All' || activeFilter === 'Festive';

  const claimCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard may be blocked; still show copied state.
    }
    setCopiedCoupon(code);
    window.setTimeout(() => setCopiedCoupon(''), 2500);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">{t('exploreKicker')}</p>
      <div className="mt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            {t('exploreTitle')}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-thy-muted">
            {t('exploreSub')}
          </p>
        </div>
        <Link href="/stitch-your-outfit" className="hero-leather-btn inline-flex px-6 py-3 text-[11px] uppercase tracking-[0.16em] shrink-0">
          {t('homeCta')}
        </Link>
      </div>
      <div className="thy-divider-glow mt-4 max-w-md" />

      <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-thy-subtle" />
          <input
            type="text"
            placeholder={t('exploreSearch')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="thy-input !pl-11"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto thy-scroll-x">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap border transition-colors ${
                  active
                    ? 'bg-thy-burgundy text-white border-thy-burgundy'
                    : 'border-thy-burgundy/20 bg-thy-cream text-thy-ink hover:border-thy-burgundy/40'
                }`}
              >
                {t(filter.key as UiKey)}
              </button>
            );
          })}
        </div>
      </div>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">{t('exploreLooks')}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          {activeFilter === 'All' ? t('exploreTrendingNow') : `${t(FILTERS.find((item) => item.id === activeFilter)?.key as UiKey)} ${t('exploreLooksFor')}`}
        </h2>
        {looks.length > 0 ? (
          <ul className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {looks.map((design) => {
              const category = GARMENT_CATEGORIES.find((item) => item.id === design.categoryId);
              return (
                <li key={design.id}>
                  <Link href={`/categories/${design.categoryId}`} className="thy-card overflow-hidden block hover:border-thy-burgundy/40 transition-colors">
                    <div className="relative h-32 sm:h-40 bg-thy-mist">
                      <img src={design.image} alt="" className="h-full w-full object-cover" />
                      {design.trending && (
                        <span className="absolute top-2 left-2 bg-thy-surface/92 border border-thy-burgundy/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-thy-ink">
                          {t('filterTrending')}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-thy-ink">{design.title}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-thy-subtle">
                        {category?.title || design.categoryId}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="thy-card mt-5 p-8 text-center space-y-2">
            <p className="text-lg text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {t('exploreNoLooks')}
            </p>
            <p className="text-sm text-thy-muted">{t('exploreNoLooksSub')}</p>
            <button
              type="button"
              className={`${ghostBtn} mt-2`}
              onClick={() => {
                setQuery('');
                setActiveFilter('All');
              }}
            >
              {t('exploreReset')}
            </button>
          </div>
        )}
      </section>

      {showCoupons && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">{t('exploreOffers')}</p>
          <h2 className="mt-2 text-2xl sm:text-3xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {t('exploreCoupons')}
          </h2>
          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COUPONS.map((coupon) => (
              <li key={coupon.code} className="thy-card p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-[0.16em] font-semibold border border-thy-burgundy/20 bg-thy-mist px-2 py-1 text-thy-ink">
                    {t(coupon.tagKey)}
                  </span>
                  <span className="text-xs font-semibold text-thy-burgundy">{t(coupon.discountKey)}</span>
                </div>
                <div>
                  <p className="text-lg text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {coupon.code}
                  </p>
                  <p className="mt-1 text-xs text-thy-muted">{t(coupon.descKey)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => claimCoupon(coupon.code)}
                  className={`${ghostBtn} w-full mt-auto`}
                >
                  {copiedCoupon === coupon.code ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t('exploreCopied')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5" />
                      {t('exploreCopy')}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(showBudget || showCombos || showArtisans || showExpress) && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">{t('exploreAtelier')}</p>
          <h2 className="mt-2 text-2xl sm:text-3xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {t('exploreSpecials')}
          </h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {showBudget && (
              <article className="thy-card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {t('exploreBudgetTitle')}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.14em] font-semibold border border-thy-burgundy/20 px-2 py-1 shrink-0">
                    {t('exploreBudgetTag')}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {BUDGET_FITS.map((item) => (
                    <Link key={item.titleKey} href={item.href} className="block">
                      <div className="h-24 bg-thy-mist overflow-hidden">
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-2 text-xs text-thy-ink">{t(item.titleKey)}</p>
                      <p className="text-[11px] font-semibold text-thy-burgundy">{t('exploreFrom')} {item.price}</p>
                    </Link>
                  ))}
                </div>
                <Link href="/stitch-your-outfit" className={`${ghostBtn} w-full mt-5`}>
                  {t('exploreBudgetCta')}
                </Link>
              </article>
            )}

            {showCombos && (
              <article className="thy-card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {t('exploreComboTitle')}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.14em] font-semibold border border-thy-burgundy/20 px-2 py-1 shrink-0">
                    {t('exploreComboTag')}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {COMBOS.map((item) => (
                    <div key={item.titleKey} className="flex items-center gap-3 border border-thy-burgundy/10 bg-thy-mist/60 p-2">
                      <img src={item.image} alt="" className="h-14 w-14 object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-thy-ink truncate">{t(item.titleKey)}</p>
                        <p className="text-[11px] text-thy-muted">{t(item.descKey)}</p>
                        <p className="text-xs text-thy-burgundy font-semibold">
                          {item.price}{' '}
                          <span className="line-through text-thy-subtle font-normal">{item.was}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/stitch-your-outfit" className={`${ghostBtn} w-full mt-5`}>
                  {t('exploreComboCta')}
                </Link>
              </article>
            )}

            {showArtisans && (
              <article className="thy-card overflow-hidden flex flex-col">
                <div className="relative h-36 bg-thy-mist">
                  <img src="/hero/hero-street.png" alt="" className="h-full w-full object-cover" />
                  <span className="absolute top-3 left-3 bg-thy-surface/92 border border-thy-burgundy/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-semibold text-thy-ink">
                    Handwork
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {t('exploreArtisanTitle')}
                  </h3>
                  <p className="mt-2 text-sm text-thy-muted">
                    {t('exploreArtisanBody')}
                  </p>
                  <p className="mt-3 text-xs text-thy-subtle">{t('exploreArtisanRating')}</p>
                  <Link href="/tailors" className={`${ghostBtn} w-full mt-5`}>
                    {t('exploreArtisanCta')}
                  </Link>
                </div>
              </article>
            )}

            {showExpress && (
              <article className="thy-card p-5 flex flex-col bg-thy-burgundy text-thy-cream">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {t('exploreExpressTitle')}
                  </h3>
                  <Sparkles className="w-4 h-4 shrink-0" />
                </div>
                <div className="mt-4 space-y-3 text-sm text-thy-cream/85">
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    {t('exploreExpressDoor')}
                  </p>
                  <p>
                    {t('exploreExpressBody')}
                  </p>
                  <p className="inline-flex items-center gap-1.5 border border-white/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]">
                    <Truck className="w-3.5 h-3.5" />
                    {t('exploreExpressSlot')}
                  </p>
                </div>
                <Link
                  href="/stitch-your-outfit"
                  className="mt-auto inline-flex items-center justify-center min-h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] bg-thy-cream text-thy-burgundy hover:bg-white transition-colors"
                >
                  {t('exploreExpressCta')}
                </Link>
              </article>
            )}
          </div>
        </section>
      )}

      <section className="mt-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">{t('homeCollections')}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          {t('exploreFindStyle')}
        </h2>
        <div className="mt-5">
          <CategoryGrid />
        </div>
      </section>

      <section className="thy-card mt-12 p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">{t('exploreStudio')}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          {t('exploreReadyTitle')}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-thy-muted">
          {t('exploreReadySub')}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/stitch-your-outfit" className="hero-leather-btn inline-flex px-6 py-3 text-[11px] uppercase tracking-[0.16em]">
            {t('homeCta')}
          </Link>
          <Link href="/tailors" className={ghostBtn}>
            {t('exploreFindTailor')}
          </Link>
        </div>
      </section>
    </main>
  );
}
