'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BadgeCheck, MapPin, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { CITIES, specialtyForCategory } from '@/lib/customer-home-data';
import { chatHref } from '@/lib/c31';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';
import { useDirectoryTailors } from '@/hooks/useDirectoryTailors';
import type { PublicDirectoryTailor } from '@/lib/directory';
import {
  NEAR_ME_RADIUS_KM,
  distanceToCity,
  formatDistanceKm,
  nearestCity,
} from '@/lib/geo';

const ghostBtn =
  'inline-flex items-center justify-center min-h-10 px-3 text-sm text-center leading-none border border-thy-burgundy/20 bg-thy-cream text-thy-ink transition-colors hover:border-thy-burgundy/40 hover:text-thy-burgundy cursor-pointer';

export default function TailorsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading tailors...</p>}>
      <TailorDirectory />
    </Suspense>
  );
}

function TailorDirectory() {
  const searchParams = useSearchParams();
  const presetSpecialty = specialtyForCategory(searchParams.get('category'));
  const { tailors, loading, error: loadError } = useDirectoryTailors();
  const { label, coords, detecting, error, detect } = useCustomerLocation();
  const [query, setQuery] = useState('');
  const [nearMe, setNearMe] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>(presetSpecialty ? [presetSpecialty] : []);
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const directoryCities = useMemo(() => {
    const live = Array.from(new Set(tailors.map((tailor) => tailor.city).filter(Boolean)));
    return live.length > 0 ? live : [...CITIES];
  }, [tailors]);
  const directorySpecialties = useMemo(
    () => Array.from(new Set(tailors.flatMap((tailor) => tailor.specialties.length ? tailor.specialties : [tailor.specialty]))),
    [tailors]
  );

  const toggleNearMe = () => {
    const next = !nearMe;
    setNearMe(next);
    if (next) {
      setCities([]);
      if (!coords) void detect();
    }
  };

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const ranked = tailors.map((tailor) => ({
      tailor,
      distanceKm: coords ? distanceToCity(coords, tailor.city) : null,
    })).filter(({ tailor }) => {
      const matchesQuery =
        !needle ||
        tailor.name.toLowerCase().includes(needle) ||
        tailor.studio.toLowerCase().includes(needle) ||
        tailor.bio.toLowerCase().includes(needle) ||
        tailor.specialty.toLowerCase().includes(needle) ||
        tailor.specialties.some((item) => item.toLowerCase().includes(needle)) ||
        tailor.city.toLowerCase().includes(needle);
      const matchesSpecialty =
        specialties.length === 0 ||
        specialties.some((item) => tailor.specialty === item || tailor.specialties.includes(item));
      const matchesRating = tailor.rating >= minRating;
      const matchesExperience = tailor.yearsExperience >= minExperience;
      const matchesVerified = !verifiedOnly || tailor.verified;
      return matchesQuery && matchesSpecialty && matchesRating && matchesExperience && matchesVerified;
    });

    if (nearMe && coords) {
      const nearby = ranked.filter(
        (item) => item.distanceKm != null && item.distanceKm <= NEAR_ME_RADIUS_KM
      );
      const next =
        nearby.length > 0 ? nearby : ranked.filter((item) => item.tailor.city === nearestCity(coords).city);
      return [...next].sort(
        (a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY)
      );
    }

    if (cities.length > 0) {
      return ranked.filter((item) => cities.includes(item.tailor.city));
    }

    return ranked;
  }, [tailors, query, cities, specialties, minRating, minExperience, verifiedOnly, nearMe, coords]);

  const clearFilters = () => {
    setQuery('');
    setNearMe(false);
    setCities([]);
    setSpecialties([]);
    setMinRating(0);
    setMinExperience(0);
    setVerifiedOnly(false);
  };

  const activeCount =
    (nearMe ? 1 : 0) +
    cities.length +
    specialties.length +
    (minRating > 0 ? 1 : 0) +
    (minExperience > 0 ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const filterPanel = (
    <Filters
      query={query}
      onQuery={setQuery}
      nearMe={nearMe}
      onToggleNearMe={toggleNearMe}
      cities={cities}
      cityOptions={directoryCities}
      onToggleCity={(city) => {
        setNearMe(false);
        toggleValue(cities, city, setCities);
      }}
      specialties={specialties}
      specialtyOptions={directorySpecialties}
      onToggleSpecialty={(item) => toggleValue(specialties, item, setSpecialties)}
      minRating={minRating}
      onMinRating={setMinRating}
      minExperience={minExperience}
      onMinExperience={setMinExperience}
      verifiedOnly={verifiedOnly}
      onVerifiedOnly={setVerifiedOnly}
      onClear={clearFilters}
    />
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">Network</p>
      <h1
        className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95]"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        Tailors
      </h1>
      <p className="mt-3 max-w-xl text-sm text-thy-muted">
        Browse signed-up ateliers and the same public portfolio they publish from their dashboard.
        {label ? ` Your location: ${label}.` : detecting ? ' Detecting your location…' : ''}
      </p>

      <div className="mt-6 lg:hidden">
        <button type="button" className={`${ghostBtn} gap-2`} onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal size={15} />
          Filters{activeCount > 0 ? ` · ${activeCount}` : ''}
        </button>
      </div>

      <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-[17.5rem_minmax(0,1fr)] gap-6 items-start">
        <aside className="hidden lg:block sticky top-24">{filterPanel}</aside>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-sm text-thy-muted">
              {loading ? 'Loading profiles…' : `${results.length} ${results.length === 1 ? 'profile' : 'profiles'}`}
              {presetSpecialty && specialties.includes(presetSpecialty) ? ` · ${presetSpecialty}` : ''}
              {nearMe ? ' · Near me' : ''}
            </p>
          </div>

          {nearMe && detecting && (
            <p className="mt-3 text-sm text-thy-muted">Finding tailors near your location…</p>
          )}
          {nearMe && error && (
            <p className="mt-3 text-sm text-rose-700">
              {error}{' '}
              <button type="button" className="underline text-thy-burgundy cursor-pointer" onClick={() => void detect()}>
                Try again
              </button>
            </p>
          )}
          {loadError && (
            <p className="mt-3 text-sm text-rose-700">{loadError}</p>
          )}

          <ul className="mt-4 space-y-3">
            {results.map(({ tailor, distanceKm }) => (
              <li key={tailor.id}>
                <TailorResultCard tailor={tailor} distanceKm={nearMe ? distanceKm : null} />
              </li>
            ))}
          </ul>

          {!loading && results.length === 0 && !loadError && (
            <div className="thy-card p-6 text-sm text-thy-muted">
              {tailors.length === 0
                ? 'No signed-up tailors are in the directory yet.'
                : nearMe
                  ? 'No tailors found near your location yet. Try another city filter, or clear Near me.'
                  : 'No tailors match these filters.'}
              {tailors.length > 0 && (
                <button type="button" className="ml-2 text-thy-burgundy underline cursor-pointer" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-thy-deep/40" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />
          <div className="absolute inset-y-0 left-0 w-[min(100%,20rem)] bg-thy-cream p-4 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Filters</p>
              <button type="button" onClick={() => setFiltersOpen(false)} className="p-2 cursor-pointer" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}
    </main>
  );
}

function TailorResultCard({
  tailor,
  distanceKm,
}: {
  tailor: PublicDirectoryTailor;
  distanceKm?: number | null;
}) {
  const portfolioPreview = tailor.portfolio.slice(0, 4);

  return (
    <article className="thy-card p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/tailors/${tailor.id}`} className="shrink-0 self-start">
          <img
            src={tailor.image}
            alt=""
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border border-thy-ink/10"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/tailors/${tailor.id}`}
              className="text-xl leading-tight hover:text-thy-burgundy"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              {tailor.studio}
            </Link>
            {tailor.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-thy-burgundy font-semibold">
                <BadgeCheck size={14} />
                Verified
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-thy-ink">{tailor.name}</p>
          <p className="mt-1 text-sm text-thy-muted">{tailor.bio}</p>
          <p className="mt-1 text-sm text-thy-muted inline-flex items-center gap-1">
            <MapPin size={13} />
            {tailor.studio} · {tailor.city}
            {distanceKm != null ? ` · ${formatDistanceKm(distanceKm)} away` : ''}
          </p>
          <p className="mt-2 text-xs text-thy-subtle">
            {tailor.specialty}
            {tailor.yearsExperience > 0 ? ` · ${tailor.yearsExperience}+ yrs` : ''}
            {` · ${tailor.acceptingOrders === false ? 'Temporarily booked' : 'Accepting orders'}`}
          </p>
          {tailor.reviewCount > 0 && (
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-thy-ink">
              <Star size={14} className="text-thy-burgundy fill-thy-burgundy" />
              {tailor.rating.toFixed(1)}
              <span className="text-thy-muted">({tailor.reviewCount})</span>
            </p>
          )}
        </div>
        <div className="flex sm:flex-col gap-2 sm:w-40 shrink-0">
          <Link
            href={`/tailors/${tailor.id}`}
            className="hero-leather-btn inline-flex flex-1 items-center justify-center min-h-10 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-center leading-none"
          >
            View profile
          </Link>
          <Link href={chatHref(tailor.id, 'profile')} className={`${ghostBtn} flex-1`}>
            Message
          </Link>
        </div>
      </div>

      {portfolioPreview.length > 0 && (
        <div className="mt-4 pt-4 border-t border-thy-ink/10">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle font-semibold">Portfolio</p>
            <Link href={`/tailors/${tailor.id}`} className="text-xs text-thy-burgundy hover:underline">
              See all work
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {portfolioPreview.map((item) => (
              <Link
                key={item.id}
                href={`/tailors/${tailor.id}`}
                className="group overflow-hidden border border-thy-ink/10 bg-thy-mist/40"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 sm:h-20 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function Filters({
  query,
  onQuery,
  nearMe,
  onToggleNearMe,
  cities,
  cityOptions,
  onToggleCity,
  specialties,
  specialtyOptions,
  onToggleSpecialty,
  minRating,
  onMinRating,
  minExperience,
  onMinExperience,
  verifiedOnly,
  onVerifiedOnly,
  onClear,
}: {
  query: string;
  onQuery: (value: string) => void;
  nearMe: boolean;
  onToggleNearMe: () => void;
  cities: string[];
  cityOptions: string[];
  onToggleCity: (city: string) => void;
  specialties: string[];
  specialtyOptions: string[];
  onToggleSpecialty: (specialty: string) => void;
  minRating: number;
  onMinRating: (value: number) => void;
  minExperience: number;
  onMinExperience: (value: number) => void;
  verifiedOnly: boolean;
  onVerifiedOnly: (value: boolean) => void;
  onClear: () => void;
}) {
  return (
    <div className="thy-card p-4 space-y-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.16em] text-thy-subtle font-semibold">Filters</p>
        <button type="button" onClick={onClear} className="text-xs text-thy-burgundy cursor-pointer">
          Clear
        </button>
      </div>

      <label className="flex items-center gap-2 border border-thy-burgundy/20 bg-thy-cream px-3 py-2">
        <Search size={14} className="text-thy-subtle shrink-0" />
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search people"
          className="w-full bg-transparent text-sm outline-none placeholder:text-thy-subtle"
        />
      </label>

      <FilterGroup title="Location">
        <CheckRow label="Near me" checked={nearMe} onChange={onToggleNearMe} />
        {cityOptions.map((city) => (
          <CheckRow key={city} label={city} checked={cities.includes(city)} onChange={() => onToggleCity(city)} />
        ))}
      </FilterGroup>

      {specialtyOptions.length > 0 && (
        <FilterGroup title="Specialty">
          {specialtyOptions.map((item) => (
            <CheckRow key={item} label={item} checked={specialties.includes(item)} onChange={() => onToggleSpecialty(item)} />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Rating">
        {[0, 4, 4.5].map((value) => (
          <CheckRow
            key={value}
            label={value === 0 ? 'Any' : `${value}+`}
            checked={minRating === value}
            onChange={() => onMinRating(value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Experience">
        {[0, 5, 10].map((value) => (
          <CheckRow
            key={value}
            label={value === 0 ? 'Any' : `${value}+ years`}
            checked={minExperience === value}
            onChange={() => onMinExperience(value)}
          />
        ))}
      </FilterGroup>

      <CheckRow label="Verified only" checked={verifiedOnly} onChange={() => onVerifiedOnly(!verifiedOnly)} />
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle font-semibold mb-2">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-thy-ink cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-thy-brand" />
      {label}
    </label>
  );
}

function toggleValue<T>(current: T[], value: T, set: (next: T[]) => void) {
  set(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
}
