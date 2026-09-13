'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getStudioGarment } from '@/lib/design-studio';
import { StudioStepper } from '@/components/studio/StudioStepper';
import { chatHref, estimateHref } from '@/lib/c31';
import { useC31 } from '@/hooks/useC31';

export default function StudioEstimatePage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}>
      <EstimateContent />
    </Suspense>
  );
}

function EstimateContent() {
  const searchParams = useSearchParams();
  const preset = getStudioGarment(searchParams.get('category'));
  const query = `?category=${encodeURIComponent(preset.categoryId)}`;
  const { state } = useC31();
  const quoted = state.threads.find((thread) => thread.quotation);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Design studio</p>
      <h1 className="mt-2 text-3xl sm:text-4xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Estimate
      </h1>
      <p className="mt-3 text-sm text-thy-muted">
        Chat with a tailor, place the order request, then the fixed price appears here.
      </p>
      <div className="mt-8">
        <StudioStepper current="estimate" categoryId={preset.categoryId} />
      </div>
      <div className="mt-8 thy-card p-6 max-w-lg space-y-4">
        <p className="text-sm text-thy-ink">{preset.garment}</p>
        {quoted?.quotation ? (
          <>
            <p className="text-3xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              ₹{quoted.quotation.price}
            </p>
            <Link href={estimateHref(quoted.id)} className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em]">
              View full details
            </Link>
          </>
        ) : (
          <Link
            href={`${chatHref('t1', 'estimate')}&category=${preset.categoryId}`}
            className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em]"
          >
            Chat for a quote
          </Link>
        )}
        <Link href={`/stitch-your-outfit/preview${query}`} className="inline-flex text-sm text-thy-brand border-b border-thy-brand">
          Return to visualization
        </Link>
      </div>
    </main>
  );
}
