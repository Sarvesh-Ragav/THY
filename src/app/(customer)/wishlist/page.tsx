'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Search, MapPin, Star, Scissors } from 'lucide-react';

interface WishlistItem {
  id: string;
  title: string;
  category: string;
  boutiqueName: string;
  rating: number;
  location: string;
  price: number;
  fabric: string;
  imageUrl: string;
  deliveryEstimate: string;
}

const initialWishlist: WishlistItem[] = [
  {
    id: 'THY-W01',
    title: 'Silk Embroidered Anarkali Kurti',
    category: 'Ethnic',
    boutiqueName: 'Vogue Custom Design Studio',
    rating: 4.8,
    location: 'Nungambakkam, Chennai',
    price: 4200,
    fabric: 'Pure Kanchipuram Silk with Zari',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
    deliveryEstimate: '5–7 days',
  },
  {
    id: 'THY-W02',
    title: 'Custom 3-Piece Tuxedo Blazer',
    category: 'Formal',
    boutiqueName: 'Royal Stitch Atelier',
    rating: 4.9,
    location: 'T. Nagar, Chennai',
    price: 8500,
    fabric: 'Italian Navy Wool Blend',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600',
    deliveryEstimate: '8–10 days',
  },
  {
    id: 'THY-W03',
    title: 'Handcrafted Bridal Lehenga Set',
    category: 'Bridal',
    boutiqueName: 'Heritage Threads Couture',
    rating: 4.9,
    location: 'Mylapore, Chennai',
    price: 24500,
    fabric: 'Raw Silk with Hand-Done Zardozi',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
    deliveryEstimate: '12–15 days',
  },
  {
    id: 'THY-W04',
    title: 'Designer Linen Casual Nehru Jacket',
    category: 'Ethnic',
    boutiqueName: 'Thread & Tailor Co.',
    rating: 4.7,
    location: 'Adyar, Chennai',
    price: 2800,
    fabric: 'Breathable Pure Linen',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    deliveryEstimate: '4–5 days',
  },
];

const ghostBtn =
  'inline-flex items-center justify-center min-h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] border border-thy-burgundy/20 bg-thy-cream text-thy-ink transition-colors hover:border-thy-burgundy/40 hover:text-thy-burgundy cursor-pointer';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Ethnic', 'Formal', 'Bridal'];

  const filteredItems = wishlist.filter((item) => {
    const needle = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(needle) ||
      item.boutiqueName.toLowerCase().includes(needle) ||
      item.fabric.toLowerCase().includes(needle);
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">Saved</p>
      <div className="mt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            Wishlist
          </h1>
          <p className="mt-3 max-w-xl text-sm text-thy-muted">
            Looks and fabrics you want to stitch next. Open a piece to customize, or keep browsing the atelier.
          </p>
        </div>
        <p className="text-sm text-thy-muted shrink-0">
          {wishlist.length} {wishlist.length === 1 ? 'saved look' : 'saved looks'}
        </p>
      </div>
      <div className="thy-divider-glow mt-4 max-w-md" />

      <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-thy-subtle" />
          <input
            type="text"
            placeholder="Search styles, ateliers, fabrics"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="thy-input !pl-11"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto thy-scroll-x">
          {categories.map((cat) => {
            const count = cat === 'All' ? wishlist.length : wishlist.filter((i) => i.category === cat).length;
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
      </div>

      {filteredItems.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <li key={item.id} className="thy-card overflow-hidden flex flex-col">
              <div className="relative h-56 thy-media bg-thy-mist">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-thy-surface/92 border border-thy-burgundy/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-semibold text-thy-ink">
                  {item.category}
                </span>
                <button
                  type="button"
                  onClick={() => setWishlist((prev) => prev.filter((entry) => entry.id !== item.id))}
                  className="absolute top-3 right-3 w-10 h-10 bg-thy-surface/92 border border-thy-burgundy/15 text-thy-burgundy flex items-center justify-center hover:border-thy-burgundy/40"
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
                  <p className="mt-2 text-xs text-thy-muted flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 shrink-0" />
                    {item.fabric}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-3 text-xs text-thy-muted pt-3 border-t border-thy-burgundy/10">
                  <div>
                    <p className="font-semibold text-thy-ink">{item.boutiqueName}</p>
                    <p className="mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {item.location}
                    </p>
                  </div>
                  <p className="flex items-center gap-1 text-thy-ink font-semibold shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    {item.rating}
                  </p>
                </div>

                <div className="flex items-end justify-between gap-3 pt-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle">From</p>
                    <p className="text-lg text-thy-burgundy" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-thy-muted">{item.deliveryEstimate}</p>
                  </div>
                  <Link href="/stitch-your-outfit" className={`${ghostBtn} shrink-0`}>
                    Customize
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="thy-card mt-8 p-10 text-center max-w-lg mx-auto space-y-3">
          <Heart className="w-8 h-8 mx-auto text-thy-burgundy" />
          <h2 className="text-2xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Nothing saved yet
          </h2>
          <p className="text-sm text-thy-muted">
            Save a look while browsing, then come back here when you are ready to stitch.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button type="button" className={ghostBtn} onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
              Clear filters
            </button>
            <Link href="/explore" className="hero-leather-btn inline-flex px-6 py-3 text-[11px] uppercase tracking-[0.16em]">
              Explore looks
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
