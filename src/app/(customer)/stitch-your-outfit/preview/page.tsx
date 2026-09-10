'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  FABRIC_TREATMENTS,
  asFabricTreatments,
  getStudioGarment,
  type FabricTreatment,
} from '@/lib/design-studio';
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

function DesignPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category') ?? 'salwars';
  const preset = useMemo(() => getStudioGarment(categoryId), [categoryId]);
  const { session, isReady, updateSession } = useTailorSession();
  const loggedIn = isReady && session.isAuthenticated && isCustomerOnboardingComplete(session);
  const fileRef = useRef<HTMLInputElement>(null);

  const [treatments, setTreatments] = useState<FabricTreatment[]>(preset.treatments);
  const [fabricImage, setFabricImage] = useState(preset.fabricImage);
  const [fabricLabel, setFabricLabel] = useState(preset.fabric);
  const [generating, setGenerating] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setTreatments(preset.treatments);
    setFabricImage(preset.fabricImage);
    setFabricLabel(preset.fabric);
    setFavorite(false);
    setSaved(false);
    setEditing(false);
    setCompareOpen(false);
    setMessage(null);
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
    setTreatments((current) =>
      current.includes(treatment)
        ? current.filter((item) => item !== treatment)
        : [...current, treatment],
    );
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

  const onFabricUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFabricImage((previous) => {
      if (previous.startsWith('blob:')) URL.revokeObjectURL(previous);
      return url;
    });
    setFabricLabel(file.name);
    setSaved(false);
    regenerate();
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
            fabricImage: fabricImage.startsWith('blob:') ? preset.fabricImage : fabricImage,
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
            {generating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-thy-muted bg-thy-canvas/70">
                <span className="h-10 w-10 rounded-full border-2 border-thy-brand/30 border-t-thy-brand animate-spin" />
                <p className="text-[11px] uppercase tracking-[0.18em]">Laying fabric on the garment</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-[20rem]">
                  <GarmentVisualization
                    silhouette={preset.silhouette}
                    treatments={treatments}
                    fabricImage={fabricImage}
                  />
                </div>
              </div>
            )}
          </div>
          <p className="mt-3 text-xs text-thy-subtle">Studio visualization · not a photograph</p>
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
                    className={`px-3 min-h-9 text-[11px] uppercase tracking-[0.12em] border transition-colors ${
                      active
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

          <div className="mt-auto pt-1 space-y-2">
            <Link
              href={`/stitch-your-outfit/try-on${query}`}
              className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-center"
            >
              Continue to try-on
            </Link>
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
    </main>
  );
}
