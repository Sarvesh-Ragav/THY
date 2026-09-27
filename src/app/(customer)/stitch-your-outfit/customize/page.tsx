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
import { patchStudioDraft, readStudioDraft, type GarmentCustomizationDetails } from '@/lib/studio-draft';

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

  useEffect(() => {
    const draft = readStudioDraft(categoryId);
    const next = draft?.customization ?? { garment: preset.garment };
    detailsRef.current = next;
    setDetails(next);
  }, [categoryId, preset.garment]);

  const done = completedCustomizationCount(groups, details);
  const ready = done >= required;
  const specific = groups.filter((group) => !group.required);

  const choose = (id: keyof GarmentCustomizationDetails, value: string) => {
    const next = { ...detailsRef.current, garment: preset.garment, [id]: value };
    detailsRef.current = next;
    setDetails(next);
    patchStudioDraft(preset.categoryId, {
      fabricImage: readStudioDraft(preset.categoryId)?.fabricImage || preset.fabricImage,
      customization: next,
    });
  };

  const generate = () => {
    if (!ready) return;
    const query = `?category=${encodeURIComponent(preset.categoryId)}${audience ? `&audience=${audience}` : ''}`;
    router.push(`/stitch-your-outfit/preview${query}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-28">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Stitch your outfit</p>
      <h1
        className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95]"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        Customize Your Design
      </h1>
      <p className="mt-3 max-w-xl text-sm text-thy-muted">Choose the details you want for your outfit.</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
        <aside className="thy-card p-5 space-y-5 lg:sticky lg:top-28">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">Selected outfit</p>
            <h2 className="mt-2 text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {audienceLabel} · {preset.garment}
            </h2>
          </div>
          <div className="overflow-hidden border border-thy-ink/10 bg-thy-mist">
            <img src={garment?.fabricImage || preset.fabricImage} alt={preset.garment} className="h-52 w-full object-cover" />
          </div>
          <div className="border border-thy-brand/20 bg-thy-mist/70 p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-thy-brand font-semibold">Current design summary</p>
            <SummaryRow label="Garment" value={preset.garment} />
            <SummaryRow label="Selections" value={`${required} required`} />
            <SummaryRow label="Progress" value={ready ? 'Complete' : 'Not complete'} emphasis={!ready} />
          </div>
        </aside>

        <section className="space-y-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">Customization options</p>
            <p className="mt-1 text-sm text-thy-muted">Choose one option in each required section.</p>
          </div>

          {groups.filter((group) => group.required).map((group) => (
            <OptionGroup
              key={group.id}
              title={group.title}
              hint={group.hint}
              options={group.options}
              selected={details[group.id]}
              onSelect={(value) => choose(group.id, value)}
            />
          ))}

          {specific.length > 0 && (
            <div className="space-y-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle">Category-specific details</p>
                <p className="mt-1 text-sm text-thy-muted">Additional details for this garment.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-16 lg:bottom-0 inset-x-0 z-40 border-t border-thy-ink/10 bg-thy-cream/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <div>
            <Link href="/stitch-your-outfit" className="text-sm text-thy-ink">
              ← Back
            </Link>
            <p className="text-[11px] text-thy-subtle mt-0.5">
              {done} of {required} required selections
            </p>
          </div>
          <button
            type="button"
            disabled={!ready}
            onClick={generate}
            className="hero-leather-btn min-h-12 px-5 text-[11px] uppercase tracking-[0.16em] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Design →
          </button>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-thy-muted">{label}</span>
      <span className={emphasis ? 'font-semibold text-thy-brand' : 'font-medium text-thy-ink'}>{value}</span>
    </div>
  );
}

function OptionGroup({
  title,
  hint,
  options,
  selected,
  onSelect,
}: {
  title: string;
  hint: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.16em] text-thy-ink font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-thy-muted">{hint}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`inline-flex items-center gap-1.5 min-h-11 px-3 text-sm border ${
                active
                  ? 'border-thy-brand bg-thy-mist text-thy-brand'
                  : 'border-thy-ink/15 bg-thy-surface text-thy-ink hover:border-thy-brand/40'
              }`}
            >
              {option}
              {active ? <Check size={14} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
