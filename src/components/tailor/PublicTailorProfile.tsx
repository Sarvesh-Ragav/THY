'use client';

import React, { useMemo, useState } from 'react';
import {
  DEFAULT_TAILOR_SERVICES,
  PORTFOLIO_CATEGORIES,
  featuredPortfolio,
  type PublicDirectoryTailor,
} from '@/lib/directory';

export function PublicTailorProfile({
  tailor,
  actions,
}: {
  tailor: PublicDirectoryTailor;
  actions?: React.ReactNode;
}) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const featured = featuredPortfolio(tailor);
  const categories = useMemo(() => {
    const fromWork = Array.from(new Set(tailor.portfolio.map((item) => item.category).filter(Boolean)));
    return fromWork.length > 0 ? ['All', ...fromWork] : [...PORTFOLIO_CATEGORIES];
  }, [tailor.portfolio]);
  const filteredItems =
    activeFilter === 'All'
      ? tailor.portfolio
      : tailor.portfolio.filter((item) => item.category === activeFilter);
  const location = tailor.shopAddress || tailor.city;
  const experience = tailor.yearsExperience > 0 ? `${tailor.yearsExperience}+ Years` : 'Experience on file';
  const accepting = tailor.acceptingOrders !== false;
  const openDays = (tailor.schedule ?? []).filter((day) => day.isOpen);

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-thy-ink">
      <div className="thy-card p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={tailor.image}
          alt={tailor.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-thy-mist shadow-sm"
        />
        <div className="space-y-1.5 text-center md:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-extrabold text-thy-ink">{tailor.studio}</h2>
            {tailor.verified && (
              <span className="bg-thy-mist text-thy-ink text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                ✓ THY Verified
              </span>
            )}
          </div>
          <p className="text-sm text-thy-ink font-medium">{tailor.name}</p>
          <p className="text-xs text-thy-muted font-medium">{tailor.bio}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-thy-muted font-semibold pt-1">
            <span>📍 {location}</span>
            <span>•</span>
            <span>✂️ {experience}</span>
            <span>•</span>
            <span className={accepting ? 'text-thy-burgundy' : 'text-amber-700'}>
              {accepting ? 'Accepting orders' : 'Temporarily booked'}
            </span>
            {tailor.reviewCount > 0 && (
              <>
                <span>•</span>
                <span className="text-amber-500">
                  ⭐ {tailor.rating.toFixed(1)} ({tailor.reviewCount} Reviews)
                </span>
              </>
            )}
          </div>
          {actions ? <div className="pt-3 flex flex-wrap justify-center md:justify-start gap-2">{actions}</div> : null}
        </div>
      </div>

      {openDays.length > 0 ? (
        <div className="thy-card p-6 space-y-3">
          <h3 className="text-sm font-bold text-thy-ink border-b border-thy-burgundy/10 pb-3">Studio hours</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(tailor.schedule ?? []).map((day) => (
              <div key={day.day} className="flex items-center justify-between text-xs bg-thy-mist/70 rounded-xl px-3 py-2">
                <span className="font-bold text-thy-ink">{day.day}</span>
                <span className={day.isOpen ? 'text-thy-muted font-semibold' : 'text-amber-700 font-semibold'}>
                  {day.isOpen ? `${day.openTime} – ${day.closeTime}` : 'Closed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="thy-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-thy-ink border-b border-thy-burgundy/10 pb-3">
          Services Offered & Indicative Pricing
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {DEFAULT_TAILOR_SERVICES.map((service) => (
            <div key={service.id} className="p-3 bg-thy-mist rounded-2xl border border-thy-burgundy/10 flex justify-between items-center">
              <span className="text-xs font-bold text-thy-ink">{service.name}</span>
              <span className="text-xs font-extrabold text-thy-burgundy">
                ₹{service.minPrice} - ₹{service.maxPrice}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-thy-subtle italic">
          Note: Final price may vary by design, fabric, customization, and specific measurements.
        </p>
      </div>

      <div className="thy-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-thy-ink border-b border-thy-burgundy/10 pb-3">⭐ Featured Work</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featured.length === 0 ? (
            <p className="text-sm text-thy-muted col-span-full">Featured work will appear here once portfolio pieces are added.</p>
          ) : (
            featured.map((item) => (
              <div key={item.id} className="rounded-2xl overflow-hidden border border-thy-burgundy/15 group">
                <div className="h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3 bg-thy-surface">
                  <p className="text-xs font-bold text-thy-ink">{item.title}</p>
                  <p className="text-[10px] text-thy-muted font-medium">{item.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="thy-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-thy-burgundy/10 pb-3">
          <h3 className="text-sm font-bold text-thy-ink">Portfolio Gallery</h3>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                  activeFilter === cat ? 'bg-thy-burgundy text-white' : 'bg-thy-mist text-thy-muted hover:bg-thy-mist'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filteredItems.length === 0 ? (
            <p className="text-sm text-thy-muted col-span-full">No portfolio pieces yet.</p>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-thy-burgundy/10 shadow-2xs">
                <img src={item.image} alt={item.title} className="w-full h-36 object-cover" />
                <div className="p-2 bg-thy-mist">
                  <p className="text-[11px] font-bold text-thy-ink truncate">{item.title}</p>
                  <p className="text-[10px] text-thy-subtle">{item.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-thy-brand to-thy-brand-active text-white p-6 rounded-3xl shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-thy-canvas">Why Customers Choose {tailor.name}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center pt-2">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <p className="text-lg font-black text-white">{experience}</p>
            <p className="text-[10px] text-thy-cream/80">Experience</p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <p className="text-lg font-black text-white">{tailor.portfolio.length}</p>
            <p className="text-[10px] text-thy-cream/80">Portfolio pieces</p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <p className="text-lg font-black text-thy-cream">{tailor.verified ? 'Verified' : 'On THY'}</p>
            <p className="text-[10px] text-thy-cream/80">Directory status</p>
          </div>
        </div>
      </div>
    </div>
  );
}
