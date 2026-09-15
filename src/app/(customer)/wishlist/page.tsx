'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Heart, Search, Scissors } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { studioPreviewHref } from '@/lib/design-studio';
import { favoritedDesigns, wishlistImageFor } from '@/lib/wishlist';
import { useAppearance } from '@/components/providers/AppearanceProvider';

const ghostBtn =
  'inline-flex items-center justify-center min-h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] border border-thy-burgundy/20 bg-thy-cream text-thy-ink transition-colors hover:border-thy-burgundy/40 hover:text-thy-burgundy cursor-pointer';

export default function WishlistPage() {
  const { session, updateSession } = useTailorSession();
  const { t } = useAppearance();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const wishlist = favoritedDesigns(session);
  const categories = useMemo(() => {
    const garments = Array.from(
      new Set(wishlist.map((item) => item.garment).filter((value): value is string => Boolean(value)))
    );
    return ['All', ...garments];
  }, [wishlist]);

  const filteredItems = wishlist.filter((item) => {
    const needle = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(needle) ||
      (item.garment || '').toLowerCase().includes(needle) ||
      (item.fabric || '').toLowerCase().includes(needle);
    const matchesCategory = activeCategory === 'All' || item.garment === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const removeFavorite = (id: string) => {
    updateSession({
      customerDesigns: session.customerDesigns.filter((design) => design.id !== id),
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">{t('wishlistKicker')}</p>
      <div className="mt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            {t('wishlistTitle')}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-thy-muted">
            {t('wishlistSub')}
          </p>
        </div>
        <p className="text-sm text-thy-muted shrink-0">
          {wishlist.length} {wishlist.length === 1 ? t('wishlistCountOne') : t('wishlistCountMany')}
        </p>
      </div>
      <div className="thy-divider-glow mt-4 max-w-md" />

      <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-thy-subtle" />
          <input
            type="text"
            placeholder={t('wishlistSearch')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="thy-input !pl-11"
          />
        </div>
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto thy-scroll-x">
            {categories.map((cat) => {
              const count = cat === 'All' ? wishlist.length : wishlist.filter((item) => item.garment === cat).length;
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap border transition-colors ${
                    active
                      ? 'bg-thy-burgundy text-white border-thy-burgundy'
                      : 'border-thy-burgundy/20 bg-thy-cream text-thy-ink hover:border-thy-burgundy/40'
                  }`}
                >
                  {cat} · {count}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {filteredItems.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const imageUrl = wishlistImageFor(item);
            return (
              <li key={item.id} className="thy-card overflow-hidden flex flex-col">
                <div className="relative h-56 thy-media bg-thy-mist">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="w-full h-full object-contain bg-thy-mist" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-thy-subtle text-xs uppercase tracking-[0.16em]">
                      Saved look
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-thy-surface/92 border border-thy-burgundy/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-semibold text-thy-ink">
                    {item.garment || 'Generated'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFavorite(item.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-thy-surface/92 border border-thy-burgundy/15 text-thy-burgundy flex items-center justify-center hover:border-thy-burgundy/40 cursor-pointer"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div>
                    <h2 className="text-xl leading-tight text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                      {item.title}
                    </h2>
                    {item.fabric && (
                      <p className="mt-2 text-xs text-thy-muted flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 shrink-0" />
                        {item.fabric}
                      </p>
                    )}
                  </div>

                  {item.treatments && item.treatments.length > 0 && (
                    <p className="text-xs text-thy-subtle pt-3 border-t border-thy-burgundy/10">
                      {item.treatments.join(' · ')}
                    </p>
                  )}

                  <div className="flex items-end justify-between gap-3 pt-1 mt-auto">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-thy-subtle">
                      {t('wishlistGenerated')}
                    </p>
                    <Link
                      href={item.categoryId ? studioPreviewHref(item.categoryId) : '/stitch-your-outfit'}
                      className={`${ghostBtn} shrink-0`}
                    >
                      {t('wishlistOpen')}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="thy-card mt-8 p-10 text-center max-w-lg mx-auto space-y-3">
          <Heart className="w-8 h-8 mx-auto text-thy-burgundy" />
          <h2 className="text-2xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {t('wishlistEmpty')}
          </h2>
          <p className="text-sm text-thy-muted">
            {t('wishlistEmptySub')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {(searchQuery || activeCategory !== 'All') && (
              <button
                type="button"
                className={ghostBtn}
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
              >
                Clear filters
              </button>
            )}
            <Link href="/stitch-your-outfit" className="hero-leather-btn inline-flex px-6 py-3 text-[11px] uppercase tracking-[0.16em]">
              {t('homeCta')}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
