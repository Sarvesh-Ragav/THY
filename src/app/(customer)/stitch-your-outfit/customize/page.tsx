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

  const requiredGroups = groups.filter((group) => group.required);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Stitch your outfit</p>
          <h1
            className="mt-1 text-3xl sm:text-4xl leading-none"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            Customize Your Design
          </h1>
          <p className="mt-1.5 text-sm text-thy-muted">Choose one option in each required section.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/stitch-your-outfit" className="text-sm text-thy-ink">
            ← Back
          </Link>
          <button
            type="button"
            disabled={!ready}
            onClick={generate}
            className="hero-leather-btn min-h-11 px-4 text-[11px] uppercase tracking-[0.16em] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Design →
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <aside className="thy-card p-3.5 space-y-3 lg:col-span-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">Selected outfit</p>
            <h2 className="mt-1 text-2xl leading-none" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {audienceLabel} · {preset.garment}
            </h2>
          </div>
          <div className="overflow-hidden border border-thy-ink/10 bg-thy-mist">
            <img src={garment?.fabricImage || preset.fabricImage} alt={preset.garment} className="h-36 w-full object-cover object-top" />
          </div>
          <div className="border border-thy-brand/20 bg-thy-mist/70 px-3 py-2.5 space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-thy-brand font-semibold">Current design summary</p>
            <SummaryRow label="Garment" value={preset.garment} />
            <SummaryRow label="Progress" value={ready ? 'Complete' : `${done} of ${required}`} emphasis={!ready} />
          </div>
        </aside>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 content-start lg:col-span-8">
          {requiredGroups.map((group) => (
            <OptionGroup
              key={group.id}
              title={group.title}
              hint={group.hint}
              options={group.options}
              selected={details[group.id]}
              onSelect={(value) => choose(group.id, value)}
            />
          ))}
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
        </section>
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
      <p className="mt-0.5 text-xs text-thy-muted">{hint}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`inline-flex flex-1 min-w-[7.25rem] items-center justify-center gap-1.5 min-h-9 px-2 text-sm border text-center ${
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
