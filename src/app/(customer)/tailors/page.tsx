'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BadgeCheck, MapPin, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import {
  CITIES,
  TAILOR_AVAILABILITY_LABELS,
  TAILOR_SPECIALTIES,
  TAILORS,
  specialtyForCategory,
  type DirectoryTailor,
  type TailorAvailability,
} from '@/lib/customer-home-data';
import { chatHref } from '@/lib/c31';

const ghostBtn =
  'inline-flex items-center justify-center min-h-10 px-3 text-sm text-center leading-none border border-thy-ink/15 bg-thy-surface text-thy-ink transition-colors hover:border-thy-brand/40 hover:text-thy-deep cursor-pointer';

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
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>(presetSpecialty ? [presetSpecialty] : []);
  const [availability, setAvailability] = useState<TailorAvailability[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TAILORS.filter((tailor) => {
      const matchesQuery =
        !needle ||
        tailor.name.toLowerCase().includes(needle) ||
        tailor.studio.toLowerCase().includes(needle) ||
        tailor.headline.toLowerCase().includes(needle) ||
        tailor.specialty.toLowerCase().includes(needle) ||
        tailor.city.toLowerCase().includes(needle);
      const matchesCity = cities.length === 0 || cities.includes(tailor.city);
      const matchesSpecialty = specialties.length === 0 || specialties.includes(tailor.specialty);
      const matchesAvailability = availability.length === 0 || availability.includes(tailor.availability);
      const matchesRating = tailor.rating >= minRating;
      const matchesExperience = tailor.yearsExperience >= minExperience;
      const matchesVerified = !verifiedOnly || tailor.verified;
      return (
        matchesQuery &&
        matchesCity &&
        matchesSpecialty &&
        matchesAvailability &&
        matchesRating &&
        matchesExperience &&
        matchesVerified
      );
    });
  }, [query, cities, specialties, availability, minRating, minExperience, verifiedOnly]);

  const clearFilters = () => {
    setQuery('');
    setCities([]);
    setSpecialties([]);
    setAvailability([]);
    setMinRating(0);
    setMinExperience(0);
    setVerifiedOnly(false);
  };

  const activeCount =
    cities.length +
    specialties.length +
    availability.length +
    (minRating > 0 ? 1 : 0) +
    (minExperience > 0 ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const filterPanel = (
    <Filters
      query={query}
      onQuery={setQuery}
      cities={cities}
      onToggleCity={(city) => toggleValue(cities, city, setCities)}
      specialties={specialties}
      onToggleSpecialty={(item) => toggleValue(specialties, item, setSpecialties)}
      availability={availability}
      onToggleAvailability={(item) => toggleValue(availability, item, setAvailability)}
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
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Network</p>
      <h1
        className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95]"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        Tailors
      </h1>
      <p className="mt-3 max-w-xl text-sm text-thy-muted">
        Find verified makers by city, craft, and availability — then open a full profile.
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
              {results.length} {results.length === 1 ? 'profile' : 'profiles'}
              {presetSpecialty && specialties.includes(presetSpecialty) ? ` · ${presetSpecialty}` : ''}
            </p>
          </div>

          <ul className="mt-4 space-y-3">
            {results.map((tailor) => (
              <li key={tailor.id}>
                <TailorResultCard tailor={tailor} />
              </li>
            ))}
          </ul>

          {results.length === 0 && (
            <div className="thy-card p-6 text-sm text-thy-muted">
              No tailors match these filters.
              <button type="button" className="ml-2 text-thy-brand underline cursor-pointer" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-thy-deep/40" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />
          <div className="absolute inset-y-0 left-0 w-[min(100%,20rem)] bg-thy-bg p-4 overflow-y-auto shadow-xl">
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

function TailorResultCard({ tailor }: { tailor: DirectoryTailor }) {
  return (
    <article className="thy-card p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
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
            className="text-xl leading-tight hover:text-thy-brand"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            {tailor.name}
          </Link>
          {tailor.verified && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-thy-brand font-semibold">
              <BadgeCheck size={14} />
              Verified
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-thy-ink">{tailor.headline}</p>
        <p className="mt-1 text-sm text-thy-muted inline-flex items-center gap-1">
          <MapPin size={13} />
          {tailor.studio} · {tailor.city}
        </p>
        <p className="mt-2 text-xs text-thy-subtle">
          {tailor.specialty} · {tailor.yearsExperience}+ yrs · {tailor.ordersCompleted} orders · {TAILOR_AVAILABILITY_LABELS[tailor.availability]}
        </p>
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-thy-ink">
          <Star size={14} className="text-thy-brand fill-thy-brand" />
          {tailor.rating.toFixed(1)}
          <span className="text-thy-muted">({tailor.reviewCount})</span>
        </p>
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
    </article>
  );
}

function Filters({
  query,
  onQuery,
  cities,
  onToggleCity,
  specialties,
  onToggleSpecialty,
  availability,
  onToggleAvailability,
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
  cities: string[];
  onToggleCity: (city: string) => void;
  specialties: string[];
  onToggleSpecialty: (specialty: string) => void;
  availability: TailorAvailability[];
  onToggleAvailability: (value: TailorAvailability) => void;
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
        <button type="button" onClick={onClear} className="text-xs text-thy-brand cursor-pointer">
          Clear
        </button>
      </div>

      <label className="flex items-center gap-2 border border-thy-ink/15 bg-thy-surface px-3 py-2">
        <Search size={14} className="text-thy-subtle shrink-0" />
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search people"
          className="w-full bg-transparent text-sm outline-none placeholder:text-thy-subtle"
        />
      </label>

      <FilterGroup title="Location">
        {CITIES.map((city) => (
          <CheckRow key={city} label={city} checked={cities.includes(city)} onChange={() => onToggleCity(city)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Specialty">
        {TAILOR_SPECIALTIES.map((item) => (
          <CheckRow key={item} label={item} checked={specialties.includes(item)} onChange={() => onToggleSpecialty(item)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        {(Object.keys(TAILOR_AVAILABILITY_LABELS) as TailorAvailability[]).map((item) => (
          <CheckRow
            key={item}
            label={TAILOR_AVAILABILITY_LABELS[item]}
            checked={availability.includes(item)}
            onChange={() => onToggleAvailability(item)}
          />
        ))}
      </FilterGroup>

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
