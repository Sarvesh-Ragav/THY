'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import {
  C15_AUDIENCE_LABELS,
  C15_AUDIENCES,
  c13UploadHref,
  garmentsForAudience,
  searchC15Garments,
  type C15Audience,
  type C15Garment,
} from '@/lib/c15-catalog';

export default function StitchYourOutfitPage() {
  const [audience, setAudience] = useState<C15Audience | null>(null);
  const [garmentId, setGarmentId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const searching = query.trim().length > 0;
  const matches = useMemo(() => searchC15Garments(query), [query]);
  const audienceGarments = audience ? garmentsForAudience(audience) : [];
  const visible: C15Garment[] = searching ? matches : audienceGarments;
  const canContinue = Boolean(audience && garmentId);
  const selectedLabel = audienceGarments.find((item) => item.id === garmentId)?.label;

  const selectAudience = (next: C15Audience) => {
    if (audience && audience !== next && garmentId) {
      setGarmentId(null);
    }
    setAudience(next);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/" className="inline-flex text-sm text-thy-brand border-b border-thy-brand">
        Back
      </Link>
      <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">C15 · Category discovery</p>
      <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        What would you like to stitch?
      </h1>
      <p className="mt-3 max-w-xl text-sm text-thy-muted">
        Choose who the outfit is for and select a garment category.
      </p>

      <form
        className="mt-8 flex items-center gap-2 border border-thy-ink/15 bg-thy-surface/80 px-3 py-2 max-w-xl"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search size={16} className="text-thy-subtle shrink-0" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search categories"
          className="w-full bg-transparent text-sm outline-none placeholder:text-thy-subtle"
        />
        {searching && (
          <button type="button" onClick={clearSearch} className="text-xs text-thy-brand shrink-0">
            Clear search
          </button>
        )}
      </form>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle">Select audience</p>
          {searching && (
            <button type="button" onClick={clearSearch} className="text-xs text-thy-muted">
              Browse audiences
            </button>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {C15_AUDIENCES.map((item) => {
            const active = audience === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => selectAudience(item)}
                className={`min-h-12 px-3 text-sm border ${
                  active
                    ? 'border-thy-brand bg-thy-mist text-thy-brand'
                    : 'border-thy-ink/15 bg-thy-surface text-thy-ink'
                }`}
              >
                {C15_AUDIENCE_LABELS[item]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle">
          {searching ? 'Matching categories' : audience ? `${C15_AUDIENCE_LABELS[audience]}’s wear` : 'Garment category'}
        </p>

        {!searching && !audience && (
          <p className="mt-4 text-sm text-thy-muted">Select an audience to see garment categories.</p>
        )}

        {searching && matches.length === 0 && (
          <div className="mt-4 thy-card p-5 space-y-3 max-w-lg">
            <p className="text-sm text-thy-ink">No categories found. Try another category.</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={clearSearch} className="min-h-11 px-4 text-sm border border-thy-ink/15">
                Clear search
              </button>
              <button type="button" onClick={clearSearch} className="min-h-11 px-4 text-sm text-thy-brand">
                Browse audiences
              </button>
            </div>
          </div>
        )}

        {visible.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {visible.map((garment) => {
              const selected = garmentId === garment.id && (searching ? audience === garment.audience : true);
              return (
                <button
                  key={`${garment.audience}-${garment.id}`}
                  type="button"
                  onClick={() => {
                    setAudience(garment.audience);
                    setGarmentId(garment.id);
                  }}
                  className={`text-left overflow-hidden border ${
                    selected ? 'border-thy-brand' : 'border-thy-ink/10'
                  }`}
                >
                  <div className="relative min-h-[8.5rem]">
                    <img src={garment.fabricImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-thy-deep/40" />
                    <p
                      className="relative z-10 p-3 text-xl text-thy-canvas"
                      style={{ fontFamily: 'var(--font-cormorant), serif' }}
                    >
                      {garment.label}
                    </p>
                  </div>
                  <p className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-thy-subtle bg-thy-surface">
                    {C15_AUDIENCE_LABELS[garment.audience]}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {audience && garmentId && selectedLabel && (
        <p className="mt-6 text-sm text-thy-ink">
          Selected · {C15_AUDIENCE_LABELS[audience]} · {selectedLabel}
        </p>
      )}

      <div className="mt-8 max-w-md">
        {canContinue && audience && garmentId ? (
          <Link
            href={c13UploadHref(audience, garmentId)}
            className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em]"
          >
            Continue
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em] border border-thy-ink/10 text-thy-subtle bg-thy-mist cursor-not-allowed"
          >
            Continue
          </button>
        )}
        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-thy-subtle">
          Continue stays off until audience and garment are both selected
        </p>
      </div>
    </main>
  );
}
