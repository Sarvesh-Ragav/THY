'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, Heart, Scissors, Sparkles, X } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  FABRIC_TREATMENTS,
  asFabricTreatments,
  getStudioGarment,
  type FabricTreatment,
} from '@/lib/design-studio';
import {
  patchStudioDraft,
  readFileAsDataUrl,
  readStudioDraft,
  type GarmentCustomizationDetails,
} from '@/lib/studio-draft';
import { isCustomerOnboardingComplete } from '@/lib/tailor-session';
import { GarmentVisualization } from '@/components/studio/GarmentVisualization';
import { StudioStepper } from '@/components/studio/StudioStepper';

export default function DesignPreviewPage() {
  return (
    <Suspense fallback={<StudioFallback />}>
      <DesignPreviewContent />
    </Suspense>
  );
}

function StudioFallback() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <p className="text-sm text-thy-subtle">Preparing your visualization...</p>
    </main>
  );
}

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-sm border border-thy-ink/15 bg-thy-surface text-thy-ink transition-colors hover:border-thy-brand/40 hover:text-thy-deep';

const DEFAULT_PATTERN_IMAGE = '/preview/Roundneck_sleeveless_A-line_calflength.png';
const DEFAULT_PATTERN_LABEL = 'Roundneck sleeveless A-line';

function DesignPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category') ?? 'salwars';
  const preset = useMemo(() => getStudioGarment(categoryId), [categoryId]);
  const { session, isReady, updateSession } = useTailorSession();
  const loggedIn = isReady && session.isAuthenticated && isCustomerOnboardingComplete(session);
  const fileRef = useRef<HTMLInputElement>(null);
  const patternFileRef = useRef<HTMLInputElement>(null);

  const [treatments, setTreatments] = useState<FabricTreatment[]>(preset.treatments);
  const [fabricImage, setFabricImage] = useState(preset.fabricImage);
  const [fabricLabel, setFabricLabel] = useState(preset.fabric);
  const [patternImage, setPatternImage] = useState<string | null>(null);
  const [patternLabel, setPatternLabel] = useState<string | null>(null);
  const [patternModalOpen, setPatternModalOpen] = useState(false);
  const [generating, setGenerating] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // Gemini AI render state
  const [aiRender, setAiRender] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiRender, setShowAiRender] = useState(false);
  const [customization, setCustomization] = useState<GarmentCustomizationDetails | undefined>(undefined);

  const currentPatternImage = patternImage || DEFAULT_PATTERN_IMAGE;
  const currentPatternLabel = patternLabel || DEFAULT_PATTERN_LABEL;
  const hasCustomPattern = Boolean(patternImage);

  useEffect(() => {
    const draft = readStudioDraft(preset.categoryId);
    setTreatments(draft?.treatments?.length ? draft.treatments : preset.treatments);
    setFabricImage(draft?.fabricImage || preset.fabricImage);
    setFabricLabel(draft?.fabricLabel || preset.fabric);
    setPatternImage(draft?.patternImage || null);
    setPatternLabel(draft?.patternLabel || null);
    setCustomization(draft?.customization);
    setFavorite(false);
    setSaved(false);
    setEditing(false);
    setCompareOpen(false);
    setPatternModalOpen(false);
    setMessage(null);
    if (draft?.aiRender) {
      setAiRender(draft.aiRender);
      setShowAiRender(true);
    } else {
      setAiRender(null);
      setShowAiRender(false);
    }
    setAiError(null);
    setGenerating(true);
    const timer = window.setTimeout(() => setGenerating(false), 1100);
    return () => window.clearTimeout(timer);
  }, [preset]);

  const regenerate = () => {
    setGenerating(true);
    window.setTimeout(() => setGenerating(false), 900);
  };

  const toggleTreatment = (treatment: FabricTreatment) => {
    if (!editing) return;
    setTreatments((current) => {
      const next = current.includes(treatment)
        ? current.filter((item) => item !== treatment)
        : [...current, treatment];
      persistDraft({ treatments: next });
      return next;
    });
    setSaved(false);
    regenerate();
  };

  const requireAccount = (next: () => void) => {
    if (!loggedIn) {
      router.push('/login');
      return;
    }
    next();
  };

  const persistDraft = (next?: {
    fabricImage?: string;
    fabricLabel?: string;
    treatments?: FabricTreatment[];
    patternImage?: string | null;
    patternLabel?: string | null;
    aiRender?: string | null;
  }) => {
    patchStudioDraft(preset.categoryId, {
      fabricImage: next?.fabricImage ?? fabricImage,
      fabricLabel: next?.fabricLabel ?? fabricLabel,
      treatments: next?.treatments ?? treatments,
      patternImage:
        next && 'patternImage' in next
          ? (next.patternImage ?? undefined)
          : (patternImage ?? undefined),
      patternLabel:
        next && 'patternLabel' in next
          ? (next.patternLabel ?? undefined)
          : (patternLabel ?? undefined),
      aiRender:
        next && 'aiRender' in next
          ? (next.aiRender ?? undefined)
          : (aiRender ?? undefined),
    });
  };

  const onFabricUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const url = await readFileAsDataUrl(file);
    setFabricImage(url);
    setFabricLabel(file.name);
    setSaved(false);
    persistDraft({ fabricImage: url, fabricLabel: file.name });
    regenerate();
  };

  const onPatternUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const url = await readFileAsDataUrl(file);
    setPatternImage(url);
    setPatternLabel(file.name);
    setSaved(false);
    persistDraft({ patternImage: url, patternLabel: file.name });
    setMessage('Dress pattern uploaded.');
  };

  const onRemovePattern = () => {
    setPatternImage(null);
    setPatternLabel(null);
    setSaved(false);
    persistDraft({ patternImage: null, patternLabel: null });
    setMessage('Dress pattern removed.');
  };

  const generateWithAI = async () => {
    setAiGenerating(true);
    setAiError(null);
    setShowAiRender(false);
    try {
      const res = await fetch('/api/studio/generate-garment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garment: preset.garment,
          silhouette: preset.silhouette,
          fabricImage,
          patternImage: currentPatternImage,
          treatments,
          customization,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.image) {
        throw new Error(data.error || 'No image returned from model');
      }
      setAiRender(data.image);
      setShowAiRender(true);
      setSaved(false);
      persistDraft({ aiRender: data.image });
      setMessage('AI render complete — now showing Gemini visualization.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI generation failed';
      setAiError(msg);
      setMessage(null);
    } finally {
      setAiGenerating(false);
    }
  };

  const continueToTryOn = () => {
    persistDraft({ aiRender });
    router.push(`/stitch-your-outfit/try-on${query}`);
  };

  const saveDesign = () => {
    requireAccount(() => {
      const id = `design-${Date.now()}`;
      updateSession({
        customerDesigns: [
          {
            id,
            title: preset.garment,
            categoryId: preset.categoryId,
            garment: preset.garment,
            fabric: fabricLabel,
            fabricImage: aiRender ?? (fabricImage.startsWith('blob:') ? preset.fabricImage : fabricImage),
            patternImage: patternImage && !patternImage.startsWith('blob:') ? patternImage : undefined,
            patternLabel: patternLabel ?? undefined,
            treatments,
            favorite,
            createdAt: new Date().toISOString(),
          },
          ...session.customerDesigns,
        ],
      });
      setSaved(true);
      setMessage('Saved to My Designs.');
    });
  };

  const query = `?category=${encodeURIComponent(preset.categoryId)}`;
  const comparable = session.customerDesigns.filter((design) => design.categoryId);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Design studio</p>
          <h1
            className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95]"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            Design Preview
          </h1>
          <p className="mt-3 max-w-xl text-sm text-thy-muted">
            Inspect the visualized garment on your fabric before you try it on.
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-thy-subtle">
          Fabric project · Current design
        </p>
      </div>

      <div className="mt-8">
        <StudioStepper current="design" categoryId={preset.categoryId} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] gap-4 sm:gap-5">
        <section className="thy-card p-5 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Visualized</p>
          <h2
            className="mt-2 text-2xl sm:text-3xl leading-tight"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            Your design, on cloth
          </h2>
          <p className="mt-1 text-sm text-thy-muted">
            {preset.garment} mapped onto the selected fabric.
          </p>

          <div className="relative mt-6 overflow-hidden min-h-[22rem] sm:min-h-[28rem] hero-vellum border border-thy-ink/10">
            {/* AI generating overlay */}
            {aiGenerating && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-thy-deep/60 backdrop-blur-sm">
                <span className="h-12 w-12 rounded-full border-2 border-thy-brand/30 border-t-thy-brand animate-spin" />
                <div className="text-center">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white font-semibold">Generating with Gemini AI</p>
                  <p className="text-[10px] text-white/60 mt-1">Rendering your bespoke garment…</p>
                </div>
              </div>
            )}

            {/* SVG diagram overlay (loading) */}
            {generating && !aiGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-thy-muted bg-thy-canvas/70">
                <span className="h-10 w-10 rounded-full border-2 border-thy-brand/30 border-t-thy-brand animate-spin" />
                <p className="text-[11px] uppercase tracking-[0.18em]">Laying fabric on the garment</p>
              </div>
            )}

            {!generating && (
              <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
                {showAiRender && aiRender ? (
                  <img
                    src={aiRender}
                    alt={`AI render of ${preset.garment}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="w-full max-w-[20rem]">
                    <GarmentVisualization
                      silhouette={preset.silhouette}
                      treatments={treatments}
                      fabricImage={fabricImage}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Toggle between SVG and AI render */}
            {aiRender && !aiGenerating && (
              <button
                type="button"
                onClick={() => setShowAiRender((v) => !v)}
                className="absolute bottom-3 left-3 flex items-center gap-2 bg-thy-deep/80 backdrop-blur-sm text-white border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold cursor-pointer hover:bg-thy-brand/80 transition-colors"
              >
                <Sparkles size={12} />
                {showAiRender ? 'Show diagram' : 'Show AI render'}
              </button>
            )}

            {/* Pattern badge */}
            <button
              type="button"
              onClick={() => setPatternModalOpen(true)}
              className="absolute top-3 right-3 flex items-center gap-2 bg-thy-surface/90 backdrop-blur-xs border border-thy-ink/10 px-2.5 py-1.5 shadow-xs cursor-pointer hover:border-thy-brand/40 transition-colors"
              title="View dress pattern"
            >
              <img
                src={currentPatternImage}
                alt=""
                className="h-5 w-5 object-contain bg-white border border-thy-ink/10"
              />
              <span className="text-[10px] uppercase tracking-[0.14em] text-thy-brand font-semibold">
                {hasCustomPattern ? 'Pattern attached' : 'Default pattern'}
              </span>
            </button>
          </div>

          {/* AI error message */}
          {aiError && (
            <p className="mt-2 text-xs text-red-500 border border-red-200 bg-red-50 px-3 py-2">
              ⚠ {aiError}
            </p>
          )}

          <p className="mt-3 text-xs text-thy-subtle">
            {showAiRender ? 'Gemini AI render · photorealistic studio visualization' : 'Studio visualization · not a photograph'}
          </p>
        </section>

        <aside className="thy-card p-5 sm:p-6 flex flex-col gap-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-thy-subtle font-semibold">Design details</p>
            <dl className="mt-4 space-y-3">
              <div className="border-b border-thy-ink/10 pb-3">
                <dt className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle">Selected garment</dt>
                <dd
                  className="mt-1 text-2xl leading-tight"
                  style={{ fontFamily: 'var(--font-cormorant), serif' }}
                >
                  {preset.garment}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle">Selected fabric</dt>
                <dd className="mt-1 text-sm text-thy-ink break-all">{fabricLabel}</dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle mb-2">
              {editing ? 'Tap to add or remove' : 'Treatments on this piece'}
            </p>
            <div className="flex flex-wrap gap-2">
              {FABRIC_TREATMENTS.map((treatment) => {
                const active = treatments.includes(treatment);
                return (
                  <button
                    key={treatment}
                    type="button"
                    disabled={!editing}
                    onClick={() => toggleTreatment(treatment)}
                    className={`px-3 min-h-9 text-[11px] uppercase tracking-[0.12em] border transition-colors ${active
                        ? 'border-thy-brand/40 bg-thy-mist text-thy-brand'
                        : 'border-thy-ink/10 bg-thy-bg text-thy-subtle'
                      } ${editing ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    {treatment}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-thy-mist/90 border border-thy-ink/10 p-4 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle">Fabric project</p>
            <div className="flex items-center gap-3">
              <img src={fabricImage} alt="" className="h-14 w-14 object-cover border border-thy-ink/10 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm truncate">{fabricLabel}</p>
                <p className="text-xs text-thy-brand font-semibold uppercase tracking-[0.12em]">Generated</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFabricUpload} />
            <button type="button" onClick={() => fileRef.current?.click()} className={`${ghostBtn} w-full`}>
              Upload fabric photo
            </button>
          </div>

          <div className="bg-thy-mist/90 border border-thy-ink/10 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle">Dress pattern</p>
              {hasCustomPattern && (
                <button
                  type="button"
                  onClick={onRemovePattern}
                  className="text-[10px] uppercase tracking-[0.14em] text-thy-subtle hover:text-thy-deep underline transition-colors cursor-pointer"
                >
                  Reset to default
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPatternModalOpen(true)}
                className="relative group h-14 w-14 shrink-0 overflow-hidden border border-thy-ink/15 cursor-pointer bg-white text-left flex items-center justify-center p-1"
                title="Click to preview pattern"
              >
                <img
                  src={currentPatternImage}
                  alt={currentPatternLabel}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-thy-deep/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye size={15} />
                </span>
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate font-medium text-thy-ink">
                  {currentPatternLabel}
                </p>
                <p className="text-xs text-thy-brand font-semibold uppercase tracking-[0.12em]">
                  {hasCustomPattern ? 'Custom uploaded' : 'Default pattern'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPatternModalOpen(true)}
                className="p-1.5 text-thy-subtle hover:text-thy-brand border border-thy-ink/10 bg-thy-surface transition-colors shrink-0 cursor-pointer"
                title="View pattern preview"
              >
                <Eye size={14} />
              </button>
            </div>
            <input
              ref={patternFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPatternUpload}
            />
            <button
              type="button"
              onClick={() => patternFileRef.current?.click()}
              className={`${ghostBtn} w-full`}
            >
              {hasCustomPattern ? 'Change pattern photo' : 'Upload dress pattern'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                if (comparable.length === 0) {
                  setMessage('Save this design first to compare versions.');
                  return;
                }
                setCompareOpen(true);
              }}
              className={ghostBtn}
            >
              Compare designs
            </button>
            <Link href="/my-designs" className={`${ghostBtn} bg-thy-mist border-thy-brand/20`}>
              My designs
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditing((open) => !open);
              setMessage(
                editing
                  ? null
                  : 'Adjust colours, prints, motifs, embroidery and texture on the piece.',
              );
            }}
            className={`${ghostBtn} w-full bg-thy-bg`}
          >
            {editing ? 'Finish editing' : 'Customize / Edit design'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                requireAccount(() => {
                  setFavorite((open) => !open);
                  setMessage(favorite ? 'Removed from favorites.' : 'Marked as favorite.');
                })
              }
              className={`${ghostBtn} gap-2`}
            >
              <Heart size={15} className={favorite ? 'fill-thy-brand text-thy-brand' : 'text-thy-muted'} />
              Favorite
            </button>
            <button type="button" onClick={saveDesign} className={ghostBtn}>
              {saved ? 'Saved' : 'Save design'}
            </button>
          </div>

          {message && <p className="text-xs text-thy-muted">{message}</p>}

          {/* ── Gemini AI Generate button ── */}
          <div className="relative overflow-hidden border border-thy-brand/30 bg-gradient-to-br from-thy-mist to-thy-surface p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="shrink-0 h-8 w-8 rounded-full bg-thy-brand/10 border border-thy-brand/20 flex items-center justify-center">
                <Sparkles size={15} className="text-thy-brand" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">Gemini AI</p>
                <p className="text-sm font-medium text-thy-ink mt-0.5">Photorealistic garment render</p>
                <p className="text-xs text-thy-muted mt-1 leading-relaxed">
                  Generate a studio-quality photo of your garment using your fabric and pattern as references.
                </p>
              </div>
            </div>
            <button
              type="button"
              id="generate-with-gemini"
              disabled={aiGenerating}
              onClick={generateWithAI}
              className="inline-flex w-full items-center justify-center gap-2 min-h-11 px-4 text-sm font-semibold bg-thy-brand text-white border border-thy-brand/60 transition-all hover:bg-thy-deep disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles size={15} />
              {aiGenerating ? 'Generating…' : aiRender ? 'Re-generate' : 'Generate'}
            </button>
            {aiRender && !aiGenerating && (
              <p className="text-[10px] text-thy-brand text-center font-medium uppercase tracking-[0.14em]">
                ✓ AI render ready · use toggle below to view
              </p>
            )}
          </div>

          <div className="mt-auto pt-1 space-y-2">
            <button
              type="button"
              onClick={continueToTryOn}
              className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-center"
            >
              Continue to try-on
            </button>
            <p className="text-[10px] uppercase tracking-[0.14em] text-thy-subtle text-center">
              Try-on · Measurements · Tailor · Estimate · Cart
            </p>
          </div>
        </aside>
      </div>

      {compareOpen && (
        <div className="fixed inset-0 z-50 bg-thy-deep/45 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-4xl bg-thy-surface sm:border sm:border-thy-ink/10 p-5 sm:p-6 max-h-[90dvh] overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Compare designs
              </h2>
              <button type="button" className={`${ghostBtn} min-w-20`} onClick={() => setCompareOpen(false)}>
                Close
              </button>
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-thy-ink/10 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-thy-brand mb-2">Current</p>
                <div className="hero-vellum min-h-[16rem] flex items-center justify-center p-4">
                  <GarmentVisualization
                    silhouette={preset.silhouette}
                    treatments={treatments}
                    fabricImage={fabricImage}
                    patternId="compare-current"
                  />
                </div>
                <p className="mt-2 text-sm">{preset.garment}</p>
              </div>
              {comparable.slice(0, 1).map((design) => {
                const savedPreset = getStudioGarment(design.categoryId);
                return (
                  <div key={design.id} className="border border-thy-ink/10 p-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-thy-subtle mb-2">Saved</p>
                    <div className="hero-vellum min-h-[16rem] flex items-center justify-center p-4">
                      <GarmentVisualization
                        silhouette={savedPreset.silhouette}
                        treatments={asFabricTreatments(design.treatments)}
                        fabricImage={design.fabricImage || savedPreset.fabricImage}
                        patternId="compare-saved"
                      />
                    </div>
                    <p className="mt-2 text-sm">{design.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {patternModalOpen && (
        <div className="fixed inset-0 z-50 bg-thy-deep/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-thy-surface border border-thy-ink/15 p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-3 border-b border-thy-ink/10 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-thy-brand font-semibold">
                  {hasCustomPattern ? 'Attached Reference' : 'Default Pattern Reference'}
                </p>
                <h3 className="text-lg font-serif text-thy-ink mt-0.5 truncate max-w-xs">
                  {currentPatternLabel}
                </h3>
              </div>
              <button
                type="button"
                className="p-1 text-thy-subtle hover:text-thy-deep transition-colors cursor-pointer"
                onClick={() => setPatternModalOpen(false)}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-hidden flex items-center justify-center bg-white border border-thy-ink/10 p-3">
              <img
                src={currentPatternImage}
                alt={currentPatternLabel}
                className="max-h-[50vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => patternFileRef.current?.click()}
                className="text-xs text-thy-brand hover:underline font-medium cursor-pointer"
              >
                {hasCustomPattern ? 'Upload different photo' : 'Upload custom pattern'}
              </button>
              <button
                type="button"
                className={`${ghostBtn} min-w-24`}
                onClick={() => setPatternModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
