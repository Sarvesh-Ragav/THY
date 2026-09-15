'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, BadgeCheck, MapPin, MessageSquare, Star } from 'lucide-react';
import { getTailorById, TAILOR_AVAILABILITY_LABELS } from '@/lib/customer-home-data';
import { chatHref } from '@/lib/c31';

export default function TailorProfilePage() {
  const params = useParams<{ id: string }>();
  const tailor = getTailorById(params.id);
  const [portfolioFilter, setPortfolioFilter] = useState('All');

  const categories = useMemo(() => {
    if (!tailor) return ['All'];
    return ['All', ...Array.from(new Set(tailor.portfolio.map((item) => item.category)))];
  }, [tailor]);

  const featured = useMemo(
    () => (tailor?.portfolio.filter((item) => item.featured) ?? []).slice(0, 3),
    [tailor]
  );

  const filteredPortfolio = useMemo(() => {
    if (!tailor) return [];
    if (portfolioFilter === 'All') return tailor.portfolio;
    return tailor.portfolio.filter((item) => item.category === portfolioFilter);
  }, [tailor, portfolioFilter]);

  if (!tailor) notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/tailors" className="inline-flex items-center gap-2 text-sm text-thy-brand">
        <ArrowLeft size={16} />
        Back to tailors
      </Link>

      <section className="mt-6 thy-card overflow-hidden">
        <div className="relative h-36 sm:h-48">
          <img src={tailor.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-thy-deep/25" />
        </div>
        <div className="px-5 sm:px-7 pb-6">
          <img
            src={tailor.image}
            alt={tailor.name}
            className="relative -mt-12 h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-4 border-thy-surface"
          />
          <div className="mt-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl sm:text-4xl leading-tight" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                  {tailor.name}
                </h1>
                {tailor.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-thy-brand font-semibold">
                    <BadgeCheck size={16} />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm sm:text-base text-thy-ink">{tailor.headline}</p>
              <p className="mt-2 text-sm text-thy-muted inline-flex items-center gap-1">
                <MapPin size={14} />
                {tailor.studio} · {tailor.city}, {tailor.state}
              </p>
              <p className="mt-2 text-sm text-thy-muted">
                {tailor.specialty} · {TAILOR_AVAILABILITY_LABELS[tailor.availability]} · {tailor.yearsExperience}+ years ·{' '}
                {tailor.ordersCompleted} orders
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-sm">
                <Star size={15} className="text-thy-brand fill-thy-brand" />
                {tailor.rating.toFixed(1)}
                <span className="text-thy-muted">({tailor.reviewCount} reviews)</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link
                href={chatHref(tailor.id, 'profile')}
                className="hero-leather-btn inline-flex items-center justify-center gap-2 min-h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-center leading-none"
              >
                <MessageSquare size={14} />
                Message
              </Link>
              <Link
                href={`/request-estimate?tailor=${encodeURIComponent(tailor.id)}`}
                className="inline-flex items-center justify-center min-h-11 px-4 text-sm text-center leading-none border border-thy-ink/15 hover:border-thy-brand/40"
              >
                Request estimate
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 thy-card p-5 sm:p-7">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle font-semibold">About</h2>
        <p className="mt-3 text-sm leading-relaxed text-thy-ink">{tailor.about}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tailor.languages.map((language) => (
            <span key={language} className="px-3 min-h-8 inline-flex items-center text-xs border border-thy-brand/20 bg-thy-mist text-thy-ink">
              {language}
            </span>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mt-4 thy-card p-5 sm:p-7">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle font-semibold">Featured work</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featured.map((item) => (
              <article key={item.id} className="overflow-hidden border border-thy-ink/10 bg-thy-surface">
                <div className="h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-thy-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs text-thy-muted">{item.category}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mt-4 thy-card p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle font-semibold">Portfolio</h2>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setPortfolioFilter(category)}
                className={`px-3 min-h-8 text-xs transition-colors ${
                  portfolioFilter === category
                    ? 'bg-thy-brand text-thy-deep'
                    : 'border border-thy-brand/25 bg-thy-mist text-thy-ink hover:border-thy-brand/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filteredPortfolio.map((item) => (
            <article key={item.id} className="overflow-hidden border border-thy-ink/10 bg-thy-mist/40">
              <img src={item.image} alt={item.title} className="h-36 w-full object-cover" />
              <div className="p-2.5">
                <p className="text-xs font-medium text-thy-ink truncate">{item.title}</p>
                <p className="text-[11px] text-thy-muted">{item.category}</p>
              </div>
            </article>
          ))}
        </div>
        {filteredPortfolio.length === 0 && (
          <p className="mt-4 text-sm text-thy-muted">No portfolio pieces in this category yet.</p>
        )}
      </section>

      <section className="mt-4 thy-card p-5 sm:p-7">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle font-semibold">Experience</h2>
        <ul className="mt-4 space-y-4">
          {tailor.experience.map((item) => (
            <li key={`${item.title}-${item.years}`} className="border-b border-thy-ink/10 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-thy-ink">{item.title}</p>
              <p className="text-sm text-thy-muted">
                {item.studio} · {item.years}
              </p>
              <p className="mt-1 text-sm text-thy-ink">{item.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 thy-card p-5 sm:p-7">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle font-semibold">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tailor.skills.map((skill) => (
            <span key={skill} className="px-3 min-h-9 inline-flex items-center text-sm border border-thy-brand/30 bg-thy-mist text-thy-ink">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-4 thy-card p-5 sm:p-7">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle font-semibold">Reviews</h2>
        <ul className="mt-4 space-y-4">
          {tailor.reviews.map((review) => (
            <li key={`${review.author}-${review.date}`} className="border-b border-thy-ink/10 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-thy-ink">{review.author}</p>
                <p className="text-xs text-thy-subtle">{review.date}</p>
              </div>
              <p className="mt-1 inline-flex items-center gap-1 text-sm">
                <Star size={13} className="text-thy-brand fill-thy-brand" />
                {review.rating.toFixed(1)}
              </p>
              <p className="mt-1 text-sm text-thy-muted">{review.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
