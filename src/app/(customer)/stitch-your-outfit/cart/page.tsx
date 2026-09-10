'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getStudioGarment } from '@/lib/design-studio';
import { StudioStepper } from '@/components/studio/StudioStepper';

export default function StudioCartPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}>
      <CartContent />
    </Suspense>
  );
}

function CartContent() {
  const searchParams = useSearchParams();
  const preset = getStudioGarment(searchParams.get('category'));
  const query = `?category=${encodeURIComponent(preset.categoryId)}`;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Design studio</p>
      <h1 className="mt-2 text-3xl sm:text-4xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Cart
      </h1>
      <p className="mt-3 text-sm text-thy-muted">
        Checkout for this visualization will sit here after the tailor estimate is confirmed.
      </p>
      <div className="mt-8">
        <StudioStepper current="cart" categoryId={preset.categoryId} />
      </div>
      <div className="mt-8 thy-card p-6 max-w-lg space-y-4">
        <p className="text-sm text-thy-ink">{preset.garment}</p>
        <Link
          href={`/stitch-your-outfit/preview${query}`}
          className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 text-[11px] font-semibold uppercase tracking-[0.16em]"
        >
          Return to visualization
        </Link>
      </div>
    </main>
  );
}
