'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getStudioGarment } from '@/lib/design-studio';
import { GarmentVisualization } from '@/components/studio/GarmentVisualization';
import { StudioStepper } from '@/components/studio/StudioStepper';

export default function TryOnPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading try-on...</p>}>
      <TryOnContent />
    </Suspense>
  );
}

function TryOnContent() {
  const searchParams = useSearchParams();
  const preset = getStudioGarment(searchParams.get('category'));
  const query = `?category=${encodeURIComponent(preset.categoryId)}`;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Design studio</p>
      <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Try-On Preview
      </h1>
      <p className="mt-3 text-sm text-thy-muted">See the visualized garment on a figure before adding measurements.</p>

      <div className="mt-8">
        <StudioStepper current="try-on" categoryId={preset.categoryId} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="thy-card p-5 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Virtual try-on</p>
          <div className="mt-5 bg-thy-mist min-h-[22rem] flex items-end justify-center overflow-hidden">
            <div className="w-[70%] max-w-sm">
              <GarmentVisualization
                silhouette={preset.silhouette}
                treatments={preset.treatments}
                fabricImage={preset.fabricImage}
              />
            </div>
          </div>
        </section>

        <aside className="thy-card p-5 sm:p-6 space-y-4">
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{preset.garment}</h2>
          <p className="text-sm text-thy-muted">
            This is a preview of how the generated design sits on the body. Measurements come next so a tailor can stitch the real piece.
          </p>
          <Link
            href={`/stitch-your-outfit/preview${query}`}
            className="inline-flex items-center justify-center min-h-11 border border-thy-ink/15 text-sm"
          >
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
