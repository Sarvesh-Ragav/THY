'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import { FABRIC_TREATMENTS, asFabricTreatments, getStudioGarment } from '@/lib/design-studio';
import { patchStudioDraft, readFileAsDataUrl, readStudioDraft } from '@/lib/studio-draft';
import { GarmentVisualization } from '@/components/studio/GarmentVisualization';
import { StudioStepper } from '@/components/studio/StudioStepper';

const PHOTO_TIPS = ['Full body', 'Good lighting', 'Just you', 'No hands in pockets', 'Fitted clothes'] as const;

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-sm border border-thy-ink/15 bg-thy-surface text-thy-ink transition-colors hover:border-thy-brand/40 hover:text-thy-deep';

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
  const [fitting, setFitting] = useState(false);

  useEffect(() => {
    const draft = readStudioDraft(preset.categoryId);
    setFabricImage(draft?.fabricImage || preset.fabricImage);
    setFabricLabel(draft?.fabricLabel || preset.fabric);
    setTreatments(draft?.treatments?.length ? draft.treatments : preset.treatments);
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
    });
    setFitting(true);
    window.setTimeout(() => setFitting(false), 1100);
  };

  const onBodyPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const url = await readFileAsDataUrl(file);
    savePhoto(url, file.name);
  };

  const overlayClass =
    preset.silhouette === 'saree' || preset.silhouette === 'lehenga'
      ? 'w-[78%] max-w-sm bottom-[4%] mix-blend-multiply opacity-90'
      : 'w-[64%] max-w-xs top-[18%] mix-blend-multiply opacity-90';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Design studio</p>
      <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Try-On Preview
      </h1>
      <p className="mt-3 text-sm text-thy-muted">
        Upload a photo, then see this fabric on the body.
      </p>

      <div className="mt-8">
        <StudioStepper current="try-on" categoryId={preset.categoryId} />
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onBodyPhotoUpload} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] gap-4 sm:gap-5">
        {!bodyPhoto ? (
          <section className="bg-thy-deep text-[#fbfefd] px-5 sm:px-8 pt-8 pb-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold text-center">Virtual try-on</p>
            <h2
              className="mt-3 text-center text-3xl sm:text-4xl leading-none"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Upload a photo
            </h2>
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

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-8 flex w-full items-center justify-center min-h-12 rounded-full bg-[#fbfefd] text-thy-deep text-sm font-medium"
            >
              Upload your photo
            </button>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-white/50">
              Only upload a photo of yourself. This is a studio preview and may not match a real fitting.
            </p>
          </section>
        ) : (
          <section className="thy-card p-5 sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Virtual try-on</p>
            <h2
              className="mt-2 text-2xl sm:text-3xl leading-tight"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Your design, on you
            </h2>
            <p className="mt-1 text-sm text-thy-muted">{preset.garment} laid over {bodyPhotoLabel}.</p>
            <div className="relative mt-6 overflow-hidden min-h-[26rem] sm:min-h-[32rem] bg-thy-deep">
              <img src={bodyPhoto} alt="Try-on photo" className="absolute inset-0 h-full w-full object-contain" />
              <div className={`absolute left-1/2 -translate-x-1/2 ${overlayClass}`}>
                <GarmentVisualization
                  silhouette={preset.silhouette}
                  treatments={treatments}
                  fabricImage={fabricImage}
                />
              </div>
              {fitting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#fbfefd] bg-thy-deep/70">
                  <span className="h-10 w-10 rounded-full border-2 border-white/25 border-t-thy-brand animate-spin" />
                  <p className="text-[11px] uppercase tracking-[0.18em]">Placing the garment</p>
                </div>
              )}
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className={`${ghostBtn} mt-4 w-full`}>
              Change photo
            </button>
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

          <div className="bg-thy-mist/90 border border-thy-ink/10 p-4 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle">Fabric project</p>
            <div className="flex items-center gap-3">
              <img src={fabricImage} alt="" className="h-14 w-14 object-cover border border-thy-ink/10 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm truncate">{fabricLabel}</p>
                <p className="text-xs text-thy-brand font-semibold uppercase tracking-[0.12em]">From visualization</p>
              </div>
            </div>
          </div>

          <Link href={`/stitch-your-outfit/preview${query}`} className={`${ghostBtn} w-full`}>
            Back to visualization
          </Link>
          <Link
            href="/my-measurements"
            className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 px-4 text-[11px] font-semibold uppercase tracking-[0.16em]"
          >
            Next: Measurements
          </Link>
        </aside>
      </div>
    </main>
  );
}
