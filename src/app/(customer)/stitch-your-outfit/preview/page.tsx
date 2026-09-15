'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, ImagePlus, Sparkles, Upload, X } from 'lucide-react';
import {
  FABRIC_TREATMENTS,
  getStudioGarment,
  type FabricTreatment,
} from '@/lib/design-studio';
import {
  patchStudioDraft,
  readFileAsDataUrl,
  readStudioDraft,
  type GarmentCustomizationDetails,
} from '@/lib/studio-draft';
import { FavoriteDesignButton } from '@/components/studio/FavoriteDesignButton';
import { StudioStepper } from '@/components/studio/StudioStepper';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { generatedDesignId, isDesignFavorited, refreshFavoritedImage } from '@/lib/wishlist';

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
  'inline-flex items-center justify-center min-h-11 px-4 text-sm text-center leading-none border border-thy-ink/15 bg-thy-surface text-thy-ink transition-colors hover:border-thy-brand/40 hover:text-thy-deep cursor-pointer';

const DEFAULT_PATTERN_IMAGE = '/preview/Roundneck_sleeveless_A-line_calflength.png';
const DEFAULT_PATTERN_LABEL = 'Roundneck sleeveless A-line';

function isUploadedFabric(src: string | null | undefined) {
  return Boolean(src && (src.startsWith('data:') || src.startsWith('blob:')));
}

function DesignPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, updateSession } = useTailorSession();
  const categoryId = searchParams.get('category') ?? 'salwars';
  const preset = useMemo(() => getStudioGarment(categoryId), [categoryId]);
  const fileRef = useRef<HTMLInputElement>(null);
  const patternFileRef = useRef<HTMLInputElement>(null);

  const [treatments, setTreatments] = useState<FabricTreatment[]>(preset.treatments);
  const [fabricImage, setFabricImage] = useState(preset.fabricImage);
  const [fabricLabel, setFabricLabel] = useState(preset.fabric);
  const [patternImage, setPatternImage] = useState<string | null>(null);
  const [patternLabel, setPatternLabel] = useState<string | null>(null);
  const [patternModalOpen, setPatternModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [aiRender, setAiRender] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiRender, setShowAiRender] = useState(false);
  const [customization, setCustomization] = useState<GarmentCustomizationDetails | undefined>(undefined);
  const [dragActive, setDragActive] = useState(false);

  const currentPatternImage = patternImage || DEFAULT_PATTERN_IMAGE;
  const currentPatternLabel = patternLabel || DEFAULT_PATTERN_LABEL;
  const hasCustomPattern = Boolean(patternImage);
  const hasUserFabric = isUploadedFabric(fabricImage);
  const query = `?category=${encodeURIComponent(preset.categoryId)}`;

  useEffect(() => {
    const draft = readStudioDraft(preset.categoryId);
    setTreatments(draft?.treatments?.length ? draft.treatments : preset.treatments);
    setFabricImage(draft?.fabricImage || preset.fabricImage);
    setFabricLabel(draft?.fabricLabel || preset.fabric);
    setPatternImage(draft?.patternImage || null);
    setPatternLabel(draft?.patternLabel || null);
    setCustomization(draft?.customization);
    setPatternModalOpen(false);
    setMessage(null);
    setDragActive(false);
    if (draft?.aiRender) {
      setAiRender(draft.aiRender);
      setShowAiRender(true);
    } else {
      setAiRender(null);
      setShowAiRender(false);
    }
    setAiError(null);
  }, [preset]);

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

  const applyFabricFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file.');
      return;
    }
    const url = await readFileAsDataUrl(file);
    setFabricImage(url);
    setFabricLabel(file.name);
    setAiRender(null);
    setShowAiRender(false);
    persistDraft({ fabricImage: url, fabricLabel: file.name, aiRender: null });
    setMessage('Fabric added. Preview is ready.');
  };

  const onFabricUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await applyFabricFile(file);
  };

  const onFabricDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const onFabricDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const onFabricDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await applyFabricFile(file);
  };

  const onPatternUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const url = await readFileAsDataUrl(file);
    setPatternImage(url);
    setPatternLabel(file.name);
    persistDraft({ patternImage: url, patternLabel: file.name });
    setMessage('Dress pattern uploaded.');
  };

  const onRemovePattern = () => {
    setPatternImage(null);
    setPatternLabel(null);
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
      persistDraft({ aiRender: data.image });
      const designId = generatedDesignId(preset.categoryId);
      if (isDesignFavorited(session, designId)) {
        updateSession({
          customerDesigns: refreshFavoritedImage(session.customerDesigns, designId, data.image, {
            fabric: fabricLabel,
            treatments,
          }),
        });
      }
      setMessage('Dress visualization ready. Tap the heart to save it to your wishlist.');
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

  const continueToMeasurements = () => {
    persistDraft({ aiRender });
    router.push(`/stitch-your-outfit/measurements${query}`);
  };

  const previewImage = showAiRender && aiRender ? aiRender : fabricImage;
  const previewLabel = showAiRender && aiRender ? `${preset.garment} AI render` : fabricLabel;
  const favoriteDesign = {
    id: generatedDesignId(preset.categoryId),
    title: `Custom ${preset.garment}`,
    categoryId: preset.categoryId,
    garment: preset.garment,
    fabric: fabricLabel,
    treatments,
    patternImage: currentPatternImage,
    patternLabel: currentPatternLabel,
  };

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
            Drop in your fabric photo, then continue to try-on or measurements.
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
          <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Fabric</p>
          <h2
            className="mt-2 text-2xl sm:text-3xl leading-tight"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            {hasUserFabric ? 'Your fabric preview' : 'Insert your fabric'}
          </h2>
          <p className="mt-1 text-sm text-thy-muted">
            {hasUserFabric
              ? 'Preview of the fabric you added. Use the button on the right to replace it.'
              : 'Drag and drop a fabric photo here, or click to browse.'}
          </p>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFabricUpload} />

          <div
            role={hasUserFabric ? undefined : 'button'}
            tabIndex={hasUserFabric ? undefined : 0}
            onClick={() => {
              if (!hasUserFabric) fileRef.current?.click();
            }}
            onKeyDown={(event) => {
              if (!hasUserFabric && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                fileRef.current?.click();
              }
            }}
            onDragOver={onFabricDragOver}
            onDragLeave={onFabricDragLeave}
            onDrop={onFabricDrop}
            className={`relative mt-6 overflow-hidden min-h-[22rem] sm:min-h-[28rem] border transition-colors ${
              dragActive
                ? 'border-thy-brand bg-thy-mist'
                : hasUserFabric
                  ? 'hero-vellum border-thy-ink/10'
                  : 'border-dashed border-thy-ink/20 bg-thy-canvas/60 cursor-pointer'
            }`}
          >
            {aiGenerating && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-thy-deep/60 backdrop-blur-sm">
                <span className="h-12 w-12 rounded-full border-2 border-thy-brand/30 border-t-thy-brand animate-spin" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-white font-semibold">Visualizing your dress</p>
              </div>
            )}

            {hasUserFabric ? (
              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                <img
                  src={previewImage}
                  alt={previewLabel}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center border border-thy-brand/30 bg-thy-mist text-thy-brand">
                  <Upload size={22} />
                </span>
                <p className="text-sm font-medium text-thy-ink">Drag and drop your fabric here</p>
                <p className="text-xs text-thy-muted">or click to choose a photo from your device</p>
              </div>
            )}

            {hasUserFabric && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  fileRef.current?.click();
                }}
                className="absolute top-3 right-3 z-20 inline-flex items-center justify-center gap-2 bg-thy-surface/95 backdrop-blur-xs border border-thy-ink/15 px-3 py-2 text-[10px] uppercase tracking-[0.14em] font-semibold leading-none text-thy-ink shadow-xs cursor-pointer hover:border-thy-brand/40 hover:text-thy-brand transition-colors"
                title="Add a different fabric image"
              >
                <ImagePlus size={14} />
                Change image
              </button>
            )}

            {aiRender && hasUserFabric && !aiGenerating && (
              <FavoriteDesignButton
                design={favoriteDesign}
                image={aiRender}
                className="absolute top-3 left-3 z-20 inline-flex h-10 w-10 items-center justify-center bg-thy-surface/95 backdrop-blur-xs border border-thy-ink/15 text-thy-brand shadow-xs cursor-pointer hover:border-thy-brand/40 transition-colors disabled:opacity-50"
              />
            )}

            {aiRender && hasUserFabric && !aiGenerating && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAiRender((v) => !v);
                }}
                className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-thy-deep/80 backdrop-blur-sm text-white border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold cursor-pointer hover:bg-thy-brand/80 transition-colors"
              >
                <Sparkles size={12} />
                {showAiRender ? 'Show fabric' : 'Show AI render'}
              </button>
            )}
          </div>

          {aiError && (
            <p className="mt-2 text-xs text-red-500 border border-red-200 bg-red-50 px-3 py-2">
              ⚠ {aiError}
            </p>
          )}

          <p className="mt-3 text-xs text-thy-subtle">
            {hasUserFabric
              ? showAiRender
                ? 'Dress visualization'
                : 'Your uploaded fabric photo'
              : 'JPG, PNG or WEBP · drop a clear photo of the cloth'}
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
                <dd className="mt-1 text-sm text-thy-ink break-all">
                  {hasUserFabric ? fabricLabel : 'No fabric added yet'}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle mb-2">Treatments on this piece</p>
            <div className="flex flex-wrap gap-2">
              {FABRIC_TREATMENTS.map((treatment) => {
                const active = treatments.includes(treatment);
                return (
                  <span
                    key={treatment}
                    className={`inline-flex items-center px-3 min-h-9 text-[11px] uppercase tracking-[0.12em] border ${
                      active
                        ? 'border-thy-brand/40 bg-thy-mist text-thy-brand'
                        : 'border-thy-ink/10 bg-thy-bg text-thy-subtle'
                    }`}
                  >
                    {treatment}
                  </span>
                );
              })}
            </div>
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

          {message && <p className="text-xs text-thy-muted">{message}</p>}

          <button
            type="button"
            id="generate-with-gemini"
            disabled={aiGenerating}
            onClick={generateWithAI}
            className="inline-flex w-full items-center justify-center min-h-12 px-4 text-sm font-semibold text-center leading-none bg-thy-brand text-white border border-thy-brand/60 transition-all hover:bg-thy-deep disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {aiGenerating ? 'Visualizing…' : 'Visualize your dress'}
          </button>

          <div className="mt-auto pt-1 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={continueToTryOn}
                className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-center leading-none"
              >
                Continue to try-on
              </button>
              <button
                type="button"
                onClick={continueToMeasurements}
                className={`${ghostBtn} w-full min-h-12 uppercase tracking-[0.16em] text-[11px] font-semibold text-center leading-none`}
              >
                Next
              </button>
            </div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-thy-subtle text-center">
              Try-on · Measurements · Tailor · Estimate · Cart
            </p>
          </div>
        </aside>
      </div>

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
