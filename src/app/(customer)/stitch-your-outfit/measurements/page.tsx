'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Check, Layers, Ruler, Shirt, Upload } from 'lucide-react';
import {
  C15_AUDIENCE_LABELS,
  getC15Garment,
  isC15Audience,
} from '@/lib/c15-catalog';
import { getStudioGarment } from '@/lib/design-studio';
import { useSavedMeasurements } from '@/hooks/useSavedMeasurements';
import { measurementCategoryForGarment } from '@/lib/measurements';
import {
  formatSizeMeasurements,
  SIZE_CHART,
  toSizeUnit,
  type SizeUnit,
} from '@/lib/size-chart';
import {
  patchStudioDraft,
  readFileAsDataUrl,
  readStudioDraft,
  type StudioMeasurementChoice,
} from '@/lib/studio-draft';
import { StudioStepper } from '@/components/studio/StudioStepper';

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-sm text-center leading-none border border-thy-ink/15 bg-thy-surface text-thy-ink transition-colors hover:border-thy-brand/40 hover:text-thy-deep cursor-pointer';

const MANUAL_FIELDS = ['Bust', 'Waist', 'Hip', 'Shoulder', 'Length'] as const;
const TUTORIAL_EMBED_SRC = 'https://www.youtube.com/embed/4KkWlnkGdME';

type MethodView = 'home' | 'manual' | 'size' | 'sample' | 'guide';

export default function StudioMeasurementsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-thy-subtle" suppressHydrationWarning>Loading measurements...</div>}>
      <MeasurementsContent />
    </Suspense>
  );
}

function MeasurementsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const audienceParam = searchParams.get('audience');
  const preset = useMemo(() => getStudioGarment(categoryId), [categoryId]);
  const query = `?category=${encodeURIComponent(preset.categoryId)}`;
  const { measurements, addMeasurement, saving } = useSavedMeasurements();
  const sampleFileRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<MethodView>('home');
  const [choice, setChoice] = useState<StudioMeasurementChoice | undefined>(undefined);
  const [thumb, setThumb] = useState(preset.fabricImage);
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const [size, setSize] = useState('M');
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('in');
  const [sampleImage, setSampleImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [guideFrom, setGuideFrom] = useState<'home' | 'manual'>('home');

  const c15 = getC15Garment(preset.categoryId);
  const audienceLabel = isC15Audience(audienceParam)
    ? C15_AUDIENCE_LABELS[audienceParam]
    : c15
      ? C15_AUDIENCE_LABELS[c15.audience]
      : preset.silhouette === 'sherwani'
        ? 'Men'
        : 'Women';
  const garmentLabel = c15?.label ?? preset.garment.replace(/^A-line /, '');
  const outfitTitle = `Custom ${garmentLabel}`;

  useEffect(() => {
    const draft = readStudioDraft(preset.categoryId);
    setThumb(draft?.aiRender || draft?.fabricImage || preset.fabricImage);
    setChoice(draft?.measurementChoice);
    if (draft?.measurementChoice?.size) setSize(draft.measurementChoice.size);
  }, [preset]);

  const persistChoice = (next: StudioMeasurementChoice) => {
    setChoice(next);
    patchStudioDraft(preset.categoryId, { measurementChoice: next });
    setMessage(null);
  };

  const continueToTailors = () => {
    if (!choice) {
      setMessage('Choose a measurement method or use a saved set to continue.');
      return;
    }
    router.push(`/tailors${query}`);
  };

  const onSampleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image of a well-fitting garment.');
      return;
    }
    const url = await readFileAsDataUrl(file);
    setSampleImage(url);
  };

  if (view !== 'home') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <button
          type="button"
          onClick={() => setView(view === 'guide' && guideFrom === 'manual' ? 'manual' : 'home')}
          className="inline-flex items-center gap-2 text-sm text-thy-brand cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className={`mt-6 ${view === 'size' || view === 'guide' ? 'max-w-4xl' : 'max-w-2xl'}`}>
          {view === 'manual' && (
            <>
              <h1 className="text-3xl sm:text-4xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Enter manually
              </h1>
              <p className="mt-2 text-sm text-thy-muted">Add your measurements in inches for a closer fit.</p>
              <button
                type="button"
                className={`${ghostBtn} mt-4`}
                onClick={() => {
                  setGuideFrom('manual');
                  setView('guide');
                }}
              >
                Watch tutorial
              </button>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MANUAL_FIELDS.map((field) => (
                  <label key={field} className="block">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle">{field}</span>
                    <input
                      className="thy-input mt-1"
                      inputMode="decimal"
                      placeholder="in"
                      value={manualValues[field] ?? ''}
                      onChange={(event) =>
                        setManualValues((current) => ({ ...current, [field]: event.target.value }))
                      }
                    />
                  </label>
                ))}
              </div>
              <button
                type="button"
                disabled={saving}
                className="hero-leather-btn mt-6 inline-flex items-center justify-center min-h-12 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-center leading-none disabled:opacity-50"
                onClick={() => {
                  const filled = Object.fromEntries(
                    MANUAL_FIELDS
                      .map((field) => [field, (manualValues[field] ?? '').trim()] as const)
                      .filter(([, value]) => value)
                  );
                  if (Object.keys(filled).length === 0) {
                    setMessage('Enter at least one measurement to save.');
                    return;
                  }
                  void addMeasurement({
                    label: `${garmentLabel} · Manual fit`,
                    values: filled,
                    category: measurementCategoryForGarment(preset.categoryId),
                  }).then((saved) => {
                    persistChoice({
                      method: 'saved',
                      measurementId: saved.id,
                      measurementLabel: saved.details || saved.label,
                    });
                    setMessage('Measurements saved. They now appear in Saved measurements.');
                    setView('home');
                  });
                }}
              >
                {saving ? 'Saving…' : 'Save measurements'}
              </button>
            </>
          )}

          {view === 'size' && (
            <>
              <h1 className="text-3xl sm:text-4xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Choose standard size
              </h1>
              <p className="mt-2 text-sm text-thy-muted">
                Hover a size to see bust, waist, and hips. Your tailor can still refine the fit later.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {SIZE_CHART.map((row) => {
                  const active = size === row.size;
                  return (
                    <div
                      key={row.size}
                      className="relative"
                      onMouseEnter={() => setHoveredSize(row.size)}
                      onMouseLeave={() => setHoveredSize(null)}
                    >
                      <button
                        type="button"
                        onClick={() => setSize(row.size)}
                        onMouseEnter={() => setHoveredSize(row.size)}
                        onMouseLeave={() => setHoveredSize(null)}
                        onFocus={() => setHoveredSize(row.size)}
                        onBlur={() => setHoveredSize((current) => (current === row.size ? null : current))}
                        className={`inline-flex items-center justify-center min-h-12 min-w-14 px-3 border text-sm font-medium text-center leading-none cursor-pointer ${
                          active
                            ? 'border-thy-brand bg-thy-mist text-thy-brand'
                            : 'border-thy-ink/15 bg-thy-surface text-thy-ink'
                        }`}
                      >
                        {row.size}
                      </button>
                      {hoveredSize === row.size && (
                        <div className="absolute left-1/2 top-full z-20 mt-2 w-44 -translate-x-1/2 border border-thy-ink/10 bg-thy-surface px-3 py-2 text-center shadow-md">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-thy-brand font-semibold">{row.size}</p>
                          <p className="mt-1 text-xs text-thy-ink leading-relaxed">
                            {formatSizeMeasurements(row.size, sizeUnit)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-sm text-thy-muted">
                {formatSizeMeasurements(hoveredSize || size, sizeUnit)}
              </p>

              <div className="mt-8 thy-card p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-thy-ink">Size Guide</p>
                    <p className="mt-1 text-sm text-thy-muted">
                      Body Measurement ({sizeUnit === 'in' ? 'inches' : 'cm'})
                    </p>
                  </div>
                  <div className="inline-flex border border-thy-ink/15 overflow-hidden">
                    {(['in', 'cm'] as const).map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setSizeUnit(unit)}
                        className={`inline-flex items-center justify-center min-h-9 px-3 text-xs uppercase tracking-[0.12em] font-semibold leading-none cursor-pointer ${
                          sizeUnit === unit ? 'bg-thy-deep text-white' : 'bg-thy-surface text-thy-muted'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-thy-ink/15 text-thy-subtle">
                        <th className="py-2 px-3 text-left font-medium">Size</th>
                        <th className="py-2 px-3 text-left font-medium">Brand Size</th>
                        <th className="py-2 px-3 text-left font-medium">Bust</th>
                        <th className="py-2 px-3 text-left font-medium">Waist</th>
                        <th className="py-2 px-3 text-left font-medium">Hips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_CHART.map((row) => {
                        const active = size === row.size;
                        const hovering = hoveredSize === row.size;
                        return (
                          <tr
                            key={row.size}
                            onClick={() => setSize(row.size)}
                            onMouseEnter={() => setHoveredSize(row.size)}
                            onMouseLeave={() => setHoveredSize(null)}
                            className={`border-b border-thy-ink/10 cursor-pointer ${
                              active ? 'bg-thy-mist' : hovering ? 'bg-thy-canvas' : 'bg-thy-surface'
                            }`}
                          >
                            <td className="py-2.5 px-3">
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className={`h-3.5 w-3.5 rounded-full border ${
                                    active ? 'border-thy-brand bg-thy-brand' : 'border-thy-ink/30 bg-white'
                                  }`}
                                />
                                {row.size}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">{row.brandSize}</td>
                            <td className="py-2.5 px-3">{toSizeUnit(row.bust, sizeUnit)}</td>
                            <td className="py-2.5 px-3">{toSizeUnit(row.waist, sizeUnit)}</td>
                            <td className="py-2.5 px-3">{toSizeUnit(row.hips, sizeUnit)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="button"
                className="hero-leather-btn mt-6 inline-flex items-center justify-center min-h-12 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-center leading-none"
                onClick={() => {
                  persistChoice({
                    method: 'size',
                    size,
                    measurementLabel: `Standard size ${size} · ${formatSizeMeasurements(size)}`,
                  });
                  setView('home');
                }}
              >
                Use size {size}
              </button>
            </>
          )}

          {view === 'sample' && (
            <>
              <h1 className="text-3xl sm:text-4xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Use sample garment
              </h1>
              <p className="mt-2 text-sm text-thy-muted">
                Upload a photo of a well-fitting garment your tailor can reference.
              </p>
              <input
                ref={sampleFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) await onSampleFile(file);
                }}
              />
              <div
                role="button"
                tabIndex={0}
                onClick={() => sampleFileRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    sampleFileRef.current?.click();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={async (event) => {
                  event.preventDefault();
                  setDragActive(false);
                  const file = event.dataTransfer.files?.[0];
                  if (file) await onSampleFile(file);
                }}
                className={`mt-6 relative overflow-hidden min-h-[16rem] border cursor-pointer ${
                  dragActive ? 'border-thy-brand bg-thy-mist' : 'border-dashed border-thy-ink/20 bg-thy-canvas/60'
                }`}
              >
                {sampleImage ? (
                  <img src={sampleImage} alt="Sample garment" className="absolute inset-0 h-full w-full object-contain p-4" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
                    <Upload size={22} className="text-thy-brand" />
                    <p className="text-sm">Drag and drop a garment photo</p>
                    <p className="text-xs text-thy-muted">or click to browse</p>
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={!sampleImage}
                className="hero-leather-btn mt-6 inline-flex items-center justify-center min-h-12 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-center leading-none disabled:opacity-50"
                onClick={() => {
                  persistChoice({ method: 'sample', measurementLabel: 'Sample garment reference' });
                  setView('home');
                }}
              >
                Use this garment
              </button>
            </>
          )}

          {view === 'guide' && (
            <div className="relative w-full aspect-video overflow-hidden bg-thy-deep">
              <iframe
                src={TUTORIAL_EMBED_SRC}
                title="Measurement tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-thy-brand cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1
        className="mt-6 text-3xl sm:text-4xl md:text-5xl leading-[0.95]"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        Measurement
      </h1>
      <p className="mt-3 max-w-xl text-sm text-thy-muted">Provide your measurements for a better fit</p>

      <div className="mt-8">
        <StudioStepper current="measurements" categoryId={preset.categoryId} />
      </div>

      <section className="mt-10 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle font-semibold">Your outfit</p>
        <div className="mt-3 thy-card p-4 flex items-center gap-4">
          <img src={thumb} alt="" className="h-20 w-20 object-cover border border-thy-ink/10 shrink-0 bg-white" />
          <div className="min-w-0 flex-1">
            <p className="text-xl leading-tight" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {outfitTitle}
            </p>
            <p className="mt-1 text-sm text-thy-muted">
              {audienceLabel} • {garmentLabel}
            </p>
            <Link
              href={`/stitch-your-outfit/preview${query}`}
              className="mt-2 inline-flex items-center gap-1 text-sm text-thy-brand"
            >
              View Design
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle font-semibold">
          How would you like to provide your measurements?
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
          <MethodCard
            icon={Ruler}
            title="Enter Manually"
            body="Add your measurements yourself"
            active={choice?.method === 'manual'}
            onClick={() => setView('manual')}
          />
          <MethodCard
            icon={Layers}
            title="Choose Standard Size"
            body="Select XS–7XL"
            active={choice?.method === 'size'}
            onClick={() => setView('size')}
          />
          <MethodCard
            icon={Shirt}
            title="Use Sample Garment"
            body="Use a well-fitting garment"
            active={choice?.method === 'sample'}
            onClick={() => setView('sample')}
          />
          <MethodCard
            icon={BookOpen}
            title="Measurement Guide"
            body="Watch the tutorial"
            onClick={() => {
              setGuideFrom('home');
              setView('guide');
            }}
          />
        </div>
      </section>

      <section className="mt-10 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle font-semibold">Saved measurements</p>
        <ul className="mt-3 space-y-3">
          {measurements.map((item) => {
            const selected = choice?.method === 'saved' && choice.measurementId === item.id;
            return (
              <li key={item.id} className={`thy-card p-4 ${selected ? 'border-thy-brand' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-thy-ink">{item.label}</p>
                    <p className="mt-1 text-sm text-thy-muted">{item.details}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-thy-brand font-semibold shrink-0">
                    <Check size={12} />
                    Saved
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    persistChoice({
                      method: 'saved',
                      measurementId: item.id,
                      measurementLabel: item.label,
                    })
                  }
                  className={`${ghostBtn} mt-4 w-full sm:w-auto`}
                >
                  {selected ? 'Selected' : 'Use These Measurements'}
                </button>
              </li>
            );
          })}
          {measurements.length === 0 && (
            <li className="thy-card p-4 text-sm text-thy-muted">
              No saved measurements yet. Enter them manually and tap Save measurements.
            </li>
          )}
        </ul>
      </section>

      {message && <p className="mt-4 max-w-3xl text-sm text-thy-muted">{message}</p>}
      {choice?.measurementLabel && !message && (
        <p className="mt-4 max-w-3xl text-sm text-thy-brand">{choice.measurementLabel}</p>
      )}

      <div className="mt-8 max-w-3xl flex justify-end">
        <button
          type="button"
          onClick={continueToTailors}
          className="hero-leather-btn inline-flex items-center justify-center gap-2 min-h-12 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-center leading-none"
        >
          Continue
          <ArrowRight size={14} />
        </button>
      </div>
    </main>
  );
}

function MethodCard({
  icon: Icon,
  title,
  body,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`thy-card p-5 text-left items-start justify-start min-h-[10.5rem] w-full h-full flex flex-col cursor-pointer transition-colors hover:border-thy-brand/40 ${
        active ? 'border-thy-brand' : ''
      }`}
    >
      <Icon size={22} className="text-thy-brand shrink-0" />
      <p
        className="mt-3 w-full text-lg leading-snug min-h-[2.5rem] text-left"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        {title}
      </p>
      <p className="mt-1 w-full text-sm leading-snug text-thy-muted text-left min-h-[2.5rem]">{body}</p>
      <ArrowRight size={16} className="mt-auto text-thy-brand shrink-0" />
    </button>
  );
}
