'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Sparkles, AlertCircle, RotateCcw, Eye, Layers, User } from 'lucide-react';
import { FABRIC_TREATMENTS, asFabricTreatments, getStudioGarment } from '@/lib/design-studio';
import { patchStudioDraft, readFileAsDataUrl, readStudioDraft } from '@/lib/studio-draft';
import { GarmentVisualization } from '@/components/studio/GarmentVisualization';
import { StudioStepper } from '@/components/studio/StudioStepper';

const PHOTO_TIPS = [
  'Full body shot',
  'Good lighting',
  'Neutral posture',
  'Plain background',
  'Fitted clothes',
] as const;

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-sm border border-thy-ink/15 bg-thy-surface text-thy-ink transition-colors hover:border-thy-brand/40 hover:text-thy-deep cursor-pointer';

type ViewMode = 'vto' | 'overlay' | 'original';

export default function TryOnPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading try-on...</p>}>
      <TryOnContent />
    </Suspense>
  );
}

function TryOnContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const preset = useMemo(() => getStudioGarment(categoryId), [categoryId]);
  const query = `?category=${encodeURIComponent(preset.categoryId)}`;
  const fileRef = useRef<HTMLInputElement>(null);

  const [fabricImage, setFabricImage] = useState(preset.fabricImage);
  const [fabricLabel, setFabricLabel] = useState(preset.fabric);
  const [treatments, setTreatments] = useState(preset.treatments);
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [bodyPhotoLabel, setBodyPhotoLabel] = useState<string | null>(null);
  const [aiRender, setAiRender] = useState<string | null>(null);
  const [vtoImage, setVtoImage] = useState<string | null>(null);
  const [vtoGenerating, setVtoGenerating] = useState(false);
  const [vtoError, setVtoError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('vto');
  const [fitting, setFitting] = useState(false);

  useEffect(() => {
    const draft = readStudioDraft(preset.categoryId);
    setFabricImage(draft?.fabricImage || preset.fabricImage);
    setFabricLabel(draft?.fabricLabel || preset.fabric);
    setTreatments(draft?.treatments?.length ? draft.treatments : preset.treatments);
    setAiRender(draft?.aiRender || null);
    setVtoImage(draft?.tryOnRender || null);
    if (draft?.tryOnRender) {
      setViewMode('vto');
    } else {
      setViewMode('overlay');
    }
    const fromModel = draft?.bodyPhoto?.startsWith('/studio/tryon-');
    setBodyPhoto(fromModel ? null : draft?.bodyPhoto || null);
    setBodyPhotoLabel(fromModel ? null : draft?.bodyPhotoLabel || null);
  }, [preset]);

  const savePhoto = (url: string, label: string) => {
    setBodyPhoto(url);
    setBodyPhotoLabel(label);
    patchStudioDraft(preset.categoryId, {
      fabricImage,
      fabricLabel,
      treatments: asFabricTreatments(treatments),
      bodyPhoto: url,
      bodyPhotoLabel: label,
      aiRender: aiRender || undefined,
      tryOnRender: vtoImage || undefined,
    });
    setFitting(true);
    window.setTimeout(() => setFitting(false), 1100);
  };

  const generateVirtualTryOn = async (overridePhoto?: string) => {
    const photoToUse = overridePhoto || bodyPhoto;
    if (!photoToUse) return;

    // Use Gemini rendered garment if available, else fall back to default garment visualization/fabric
    const productToUse = aiRender || preset.fabricImage;

    setVtoGenerating(true);
    setVtoError(null);

    try {
      const res = await fetch('/api/studio/virtual-try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage: photoToUse,
          productImage: productToUse,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.image) {
        throw new Error(data.error || 'Virtual try-on model failed to generate image');
      }

      setVtoImage(data.image);
      setViewMode('vto');
      patchStudioDraft(preset.categoryId, { tryOnRender: data.image });
    } catch (err: unknown) {
      console.error('Virtual try-on error:', err);
      const msg = err instanceof Error ? err.message : 'Virtual try-on generation failed';
      setVtoError(msg);
      setViewMode('overlay');
    } finally {
      setVtoGenerating(false);
    }
  };

  const onBodyPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const url = await readFileAsDataUrl(file);
    savePhoto(url, file.name);
    // Automatically process to Google's virtual-try-on-001 model
    generateVirtualTryOn(url);
  };

  const useSampleModel = () => {
    const sampleUrl = '/studio/tryon-female.png';
    savePhoto(sampleUrl, 'Sample Studio Model');
    generateVirtualTryOn(sampleUrl);
  };

  const overlayClass =
    preset.silhouette === 'saree' || preset.silhouette === 'lehenga'
      ? 'w-[78%] max-w-sm bottom-[4%] mix-blend-multiply opacity-90'
      : 'w-[64%] max-w-xs top-[18%] mix-blend-multiply opacity-90';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Design studio</p>
      <h1
        className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95]"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        Virtual Try-On
      </h1>
      <p className="mt-3 text-sm text-thy-muted">
        Powered by Google <span className="font-mono text-xs bg-thy-mist px-1.5 py-0.5 rounded text-thy-brand">virtual-try-on-001</span>. See your tailored garment photorealistically draped on your body.
      </p>

      <div className="mt-8">
        <StudioStepper current="try-on" categoryId={preset.categoryId} />
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onBodyPhotoUpload} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] gap-4 sm:gap-5">
        {!bodyPhoto ? (
          <section className="bg-thy-deep text-[#fbfefd] px-5 sm:px-8 pt-8 pb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-thy-brand/20 border border-thy-brand/40 text-thy-brand text-[10px] uppercase tracking-[0.16em] mx-auto mb-2">
              <Sparkles size={12} />
              <span>Google Virtual Try-On · virtual-try-on-001</span>
            </div>
            <h2
              className="mt-3 text-center text-3xl sm:text-4xl leading-none"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Upload your photo
            </h2>
            <p className="text-center text-xs text-white/70 mt-2 max-w-md mx-auto">
              Our AI analyzes your body shape and realistically tailors the {preset.garment} onto you using Vertex AI.
            </p>

            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {PHOTO_TIPS.map((tip) => (
                <li key={tip} className="inline-flex items-center gap-1.5 text-[12px] text-white/85">
                  <Check size={14} className="text-thy-brand shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-center">
              <img
                src="/studio/tryon-female.png"
                alt="Example full-body pose"
                className="h-[22rem] sm:h-[26rem] w-auto object-contain"
              />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex-1 flex items-center justify-center min-h-12 rounded-full bg-[#fbfefd] text-thy-deep text-sm font-medium hover:bg-white transition-colors cursor-pointer"
              >
                Upload your photo
              </button>
              <button
                type="button"
                onClick={useSampleModel}
                className="flex items-center justify-center min-h-12 px-6 rounded-full border border-white/25 text-white text-sm hover:bg-white/10 transition-colors cursor-pointer"
              >
                Try with sample model
              </button>
            </div>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-white/50">
              Only upload a photo of yourself. Your photo is securely processed for virtual fitting.
            </p>
          </section>
        ) : (
          <section className="thy-card p-5 sm:p-7 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-thy-ink/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">
                    Virtual Try-On
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-thy-mist text-thy-brand font-mono font-medium">
                    virtual-try-on-001
                  </span>
                </div>
                <h2
                  className="mt-1 text-2xl sm:text-3xl leading-tight"
                  style={{ fontFamily: 'var(--font-cormorant), serif' }}
                >
                  Your design, on you
                </h2>
                <p className="mt-0.5 text-xs text-thy-muted">
                  {bodyPhotoLabel} · {preset.garment}
                </p>
              </div>

              {/* View Mode Toggle Switch */}
              <div className="flex items-center gap-1 bg-thy-bg border border-thy-ink/10 p-1 self-start sm:self-auto rounded-md">
                <button
                  type="button"
                  onClick={() => setViewMode('vto')}
                  disabled={!vtoImage && !vtoGenerating}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-all rounded ${
                    viewMode === 'vto'
                      ? 'bg-thy-brand text-white shadow-sm'
                      : vtoImage
                      ? 'text-thy-ink hover:text-thy-brand'
                      : 'text-thy-subtle/50 cursor-not-allowed'
                  }`}
                  title={vtoImage ? 'Photorealistic Google AI Virtual Try-On' : 'Generate AI Try-On first'}
                >
                  <Sparkles size={12} />
                  <span>AI Try-On</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('overlay')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-all rounded ${
                    viewMode === 'overlay'
                      ? 'bg-thy-brand text-white shadow-sm'
                      : 'text-thy-ink hover:text-thy-brand'
                  }`}
                >
                  <Layers size={12} />
                  <span>Quick Fit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('original')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-all rounded ${
                    viewMode === 'original'
                      ? 'bg-thy-brand text-white shadow-sm'
                      : 'text-thy-ink hover:text-thy-brand'
                  }`}
                >
                  <User size={12} />
                  <span>Photo</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {vtoError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 rounded">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Virtual Try-On Notice</p>
                  <p className="mt-0.5">{vtoError}</p>
                  <p className="mt-1 text-[11px] text-red-600">
                    Tips: ensure your full body is visible with good contrast against the background.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => generateVirtualTryOn()}
                  className="shrink-0 text-xs font-semibold underline hover:text-red-900 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Main Interactive Stage */}
            <div className="relative mt-4 overflow-hidden min-h-[28rem] sm:min-h-[34rem] bg-thy-deep rounded-sm flex items-center justify-center">
              {/* Display based on View Mode */}
              {viewMode === 'vto' && vtoImage ? (
                <img
                  src={vtoImage}
                  alt="Google Virtual Try-On Render"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <>
                  <img
                    src={bodyPhoto}
                    alt="Try-on photo"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                  {viewMode === 'overlay' && (
                    <div className={`absolute left-1/2 -translate-x-1/2 ${overlayClass}`}>
                      {aiRender ? (
                        <img
                          src={aiRender}
                          alt={preset.garment}
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      ) : (
                        <GarmentVisualization
                          silhouette={preset.silhouette}
                          treatments={treatments}
                          fabricImage={fabricImage}
                        />
                      )}
                    </div>
                  )}
                </>
              )}

              {/* AI Processing Overlay */}
              {vtoGenerating && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 text-[#fbfefd] bg-thy-deep/85 backdrop-blur-sm p-6 text-center animate-in fade-in duration-200">
                  <div className="relative">
                    <span className="h-16 w-16 rounded-full border-3 border-white/20 border-t-thy-brand animate-spin inline-block" />
                    <Sparkles size={20} className="text-thy-brand absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-wider uppercase text-thy-brand">
                      Google virtual-try-on-001
                    </p>
                    <p className="text-base font-serif text-white">
                      Generating Photorealistic Fit...
                    </p>
                    <p className="text-xs text-white/60 max-w-xs leading-relaxed">
                      Vertex AI is analyzing your posture and realistically tailoring the garment to your body.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick placing animation */}
              {fitting && !vtoGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#fbfefd] bg-thy-deep/70">
                  <span className="h-10 w-10 rounded-full border-2 border-white/25 border-t-thy-brand animate-spin" />
                  <p className="text-[11px] uppercase tracking-[0.18em]">Placing garment</p>
                </div>
              )}

              {/* Result Indicator Badge */}
              {viewMode === 'vto' && vtoImage && !vtoGenerating && (
                <div className="absolute bottom-3 left-3 bg-thy-deep/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded text-[10px] text-white flex items-center gap-1.5 shadow-lg">
                  <Sparkles size={13} className="text-thy-brand" />
                  <span>Google AI Virtual Try-On Render</span>
                </div>
              )}
            </div>

            {/* Quick action bar beneath the photo */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`${ghostBtn} flex-1`}
              >
                Change photo
              </button>
              {vtoImage ? (
                <button
                  type="button"
                  disabled={vtoGenerating}
                  onClick={() => generateVirtualTryOn()}
                  className={`${ghostBtn} gap-2`}
                >
                  <RotateCcw size={14} />
                  <span>Re-render AI Try-On</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={vtoGenerating}
                  onClick={() => generateVirtualTryOn()}
                  className="inline-flex items-center justify-center gap-2 min-h-11 px-5 text-sm font-semibold bg-thy-brand text-white hover:bg-thy-deep transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Sparkles size={15} />
                  <span>{vtoGenerating ? 'Processing…' : 'Generate with Google VTO'}</span>
                </button>
              )}
            </div>
          </section>
        )}

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

          {/* Virtual Try-On Control Card */}
          <div className="relative overflow-hidden border border-thy-brand/30 bg-gradient-to-br from-thy-mist to-thy-surface p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="shrink-0 h-8 w-8 rounded-full bg-thy-brand/10 border border-thy-brand/20 flex items-center justify-center">
                <Sparkles size={15} className="text-thy-brand" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">Vertex AI</p>
                  <span className="text-[9px] font-mono bg-white/70 border border-thy-brand/20 px-1 rounded text-thy-brand">
                    virtual-try-on-001
                  </span>
                </div>
                <p className="text-sm font-medium text-thy-ink mt-0.5">Photorealistic Body Try-On</p>
                <p className="text-xs text-thy-muted mt-1 leading-relaxed">
                  Generates realistic lighting, wrinkles, and fabric draping fitted precisely to your uploaded posture.
                </p>
              </div>
            </div>

            {bodyPhoto && (
              <button
                type="button"
                disabled={vtoGenerating}
                onClick={() => generateVirtualTryOn()}
                className="inline-flex w-full items-center justify-center gap-2 min-h-11 px-4 text-sm font-semibold bg-thy-brand text-white border border-thy-brand/60 transition-all hover:bg-thy-deep disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <Sparkles size={15} />
                {vtoGenerating ? 'Generating Try-On…' : vtoImage ? 'Re-generate AI Try-On' : 'Try-On with Google AI'}
              </button>
            )}

            {vtoImage && !vtoGenerating && (
              <p className="text-[10px] text-thy-brand text-center font-medium uppercase tracking-[0.14em]">
                ✓ AI Try-On ready · switch tabs to compare
              </p>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle mb-2">Treatments on this piece</p>
            <div className="flex flex-wrap gap-2">
              {FABRIC_TREATMENTS.map((treatment) => {
                const active = treatments.includes(treatment);
                return (
                  <span
                    key={treatment}
                    className={`px-3 min-h-9 inline-flex items-center text-[11px] uppercase tracking-[0.12em] border ${
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

          {/* Fabric project card */}
          <div className="bg-thy-mist/90 border border-thy-ink/10 p-4 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle">Fabric project</p>
            <div className="flex items-center gap-3">
              <img
                src={aiRender || fabricImage}
                alt={aiRender ? preset.garment : fabricLabel}
                className="h-14 w-14 object-cover border border-thy-ink/10 shrink-0 bg-white"
              />
              <div className="min-w-0">
                <p className="text-sm truncate font-medium">
                  {aiRender ? `${preset.garment} (Gemini)` : fabricLabel}
                </p>
                <p className="text-xs text-thy-brand font-semibold uppercase tracking-[0.12em]">
                  {aiRender ? 'AI Visualization' : 'From visualization'}
                </p>
              </div>
            </div>
          </div>

          <Link href={`/stitch-your-outfit/preview${query}`} className={`${ghostBtn} w-full`}>
            Back to visualization
          </Link>
          <Link
            href={`/stitch-your-outfit/measurements${query}`}
            className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 px-4 text-[11px] font-semibold uppercase tracking-[0.16em]"
          >
            Next: Measurements
          </Link>
        </aside>
      </div>
    </main>
  );
}
