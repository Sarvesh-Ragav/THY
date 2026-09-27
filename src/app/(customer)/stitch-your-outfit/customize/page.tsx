'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import { C15_AUDIENCE_LABELS, getC15Garment, isC15Audience } from '@/lib/c15-catalog';
import {
  completedCustomizationCount,
  customizationGroups,
  requiredCustomizationCount,
} from '@/lib/garment-customization';
import { getStudioGarment } from '@/lib/design-studio';
import { findKurtiDesign, isKurtiOptionAvailable, type KurtiMatchField } from '@/lib/kurti-catalogue';
import { patchStudioDraft, readStudioDraft, type GarmentCustomizationDetails } from '@/lib/studio-draft';
import { useKurtiCatalogue } from '@/lib/use-kurti-catalogue';

export default function CustomizeDesignPage() {
  return (
    <Suspense fallback={<main className="max-w-7xl mx-auto px-4 py-10 text-sm text-thy-subtle">Loading design options...</main>}>
      <CustomizeDesign />
    </Suspense>
  );
}

function CustomizeDesign() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category') || '';
  const audienceParam = searchParams.get('audience');
  const garment = getC15Garment(categoryId);
  const preset = useMemo(() => getStudioGarment(categoryId), [categoryId]);
  const groups = useMemo(() => customizationGroups(categoryId), [categoryId]);
  const audience = isC15Audience(audienceParam)
    ? audienceParam
    : garment?.audience;
  const audienceLabel = audience ? C15_AUDIENCE_LABELS[audience] : 'Selected';
  const required = requiredCustomizationCount(groups);

  const [details, setDetails] = useState<GarmentCustomizationDetails>({});
  const detailsRef = useRef(details);
  const isKurti = categoryId === 'kurti';
  const catalogue = useKurtiCatalogue(isKurti);
  const matchedDress = isKurti ? findKurtiDesign(catalogue.designs, details) : null;

  useEffect(() => {
    const draft = readStudioDraft(categoryId);
    const next = draft?.customization ?? { garment: preset.garment };
    detailsRef.current = next;
    setDetails(next);
  }, [categoryId, preset.garment]);

  useEffect(() => {
    if (!isKurti || catalogue.status !== 'ready') return;
    const match = findKurtiDesign(catalogue.designs, detailsRef.current);
    patchStudioDraft(preset.categoryId, {
      patternImage: match?.imageUrl ?? '',
      patternLabel: match?.title ?? '',
    });
  }, [isKurti, catalogue.status, catalogue.designs, preset.categoryId, details]);

  const done = completedCustomizationCount(groups, details);
  const ready = isKurti ? Boolean(matchedDress) : done >= required;
  const specific = groups.filter((group) => !group.required);

  const choose = (id: keyof GarmentCustomizationDetails, value: string) => {
    const next = { ...detailsRef.current, garment: preset.garment, [id]: value };
    detailsRef.current = next;
    setDetails(next);
    const match = isKurti ? findKurtiDesign(catalogue.designs, next) : null;
    patchStudioDraft(preset.categoryId, {
      fabricImage: readStudioDraft(preset.categoryId)?.fabricImage || preset.fabricImage,
      customization: next,
      patternImage: isKurti ? (match?.imageUrl ?? '') : undefined,
      patternLabel: isKurti ? (match?.title ?? '') : undefined,
    });
  };

  const generate = () => {
    if (!ready) return;
    const query = `?category=${encodeURIComponent(preset.categoryId)}${audience ? `&audience=${audience}` : ''}`;
    router.push(`/stitch-your-outfit/preview${query}`);
  };

  const requiredGroups = groups.filter((group) => group.required);

  return (
    <main className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:h-[calc(100dvh-7.25rem)] lg:overflow-hidden lg:px-8">
      <div className="grid grid-cols-1 gap-6 py-4 lg:h-full lg:grid-cols-[minmax(18rem,38%)_minmax(0,1fr)] lg:gap-8 lg:py-5">
        <aside className="lg:sticky lg:top-0 lg:h-full">
          <figure className="relative h-80 overflow-hidden border border-thy-ink/10 bg-thy-mist lg:h-full">
            <img
              src={matchedDress?.imageUrl || garment?.fabricImage || preset.fabricImage}
              alt={matchedDress?.title || `${audienceLabel} ${preset.garment}`}
              className={`absolute inset-0 h-full w-full ${matchedDress ? 'object-contain bg-white' : 'object-cover object-top'}`}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-thy-deep/80 to-transparent px-5 pb-5 pt-16">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
                {matchedDress ? 'Catalogue dress' : 'Selected outfit'}
              </p>
              <p className="mt-1 text-3xl text-white" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                {matchedDress ? matchedDress.title : `${audienceLabel} · ${preset.garment}`}
              </p>
            </figcaption>
          </figure>
        </aside>

        <section className="min-w-0 lg:h-full lg:overflow-y-auto lg:pr-2">
          <div className="sticky top-0 z-10 flex flex-wrap items-end justify-between gap-4 bg-thy-cream/95 pb-4 backdrop-blur-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-thy-brand">Stitch your outfit</p>
              <h1 className="mt-1 text-3xl leading-none sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Customize Your Design
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/stitch-your-outfit" className="text-sm font-semibold text-thy-ink">
                ← Back
              </Link>
              <button
                type="button"
                disabled={!ready}
                onClick={generate}
                className="hero-leather-btn min-h-12 px-5 text-xs uppercase tracking-[0.14em] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Generate Design →
              </button>
            </div>
          </div>

          {isKurti && (
            <p className="pb-2 text-sm text-thy-muted">
              {catalogue.status === 'loading'
                ? 'Loading catalogue dresses...'
                : catalogue.status === 'error'
                  ? 'The dress catalogue could not be loaded. Try again in a moment.'
                  : matchedDress
                    ? 'This combination matches a catalogue dress. Generate Design uses that dress as the visualization reference.'
                    : done >= required
                      ? 'No catalogue dress matches this combination. Choose a highlighted option.'
                      : 'Options that cannot match a catalogue dress stay unavailable.'}
            </p>
          )}

          <div className="space-y-8 pb-10 pt-2">
            {requiredGroups.map((group) => (
              <OptionGroup
                key={group.id}
                title={group.title}
                hint={group.hint}
                options={group.options}
                disabledOptions={
                  isKurti
                    ? group.options.filter(
                        (option) =>
                          !isKurtiOptionAvailable(
                            catalogue.designs,
                            details,
                            group.id as KurtiMatchField,
                            option
                          )
                      )
                    : []
                }
                selected={details[group.id]}
                onSelect={(value) => choose(group.id, value)}
              />
            ))}
            {specific.length > 0 && (
              <div className="space-y-8 border-t border-thy-ink/10 pt-8">
                <h2 className="text-lg font-bold text-thy-ink">Additional details</h2>
                {specific.map((group) => (
                  <OptionGroup
                    key={group.id}
                    title={group.title}
                    hint={group.hint}
                    options={group.options}
                    selected={details[group.id]}
                    onSelect={(value) => choose(group.id, value)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function OptionGroup({
  title,
  hint,
  options,
  disabledOptions = [],
  selected,
  onSelect,
}: {
  title: string;
  hint: string;
  options: string[];
  disabledOptions?: string[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-thy-ink">{title}</h3>
      <p className="mt-1 text-sm text-thy-muted">{hint}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {options.map((option) => {
          const active = selected === option;
          const disabled = disabledOptions.includes(option);
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option)}
              className={`inline-flex items-center justify-center gap-2 min-h-12 px-4 text-base border-2 disabled:cursor-not-allowed disabled:opacity-35 ${
                active
                  ? 'border-thy-brand bg-thy-mist text-thy-brand font-semibold'
                  : 'border-thy-ink/30 bg-thy-surface text-thy-ink hover:border-thy-brand'
              }`}
            >
              {option}
              {active ? <Check size={16} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
