'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getStudioGarment } from '@/lib/design-studio';
import { StudioStepper } from '@/components/studio/StudioStepper';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useC31 } from '@/hooks/useC31';
import { estimateHref } from '@/lib/c31';

export default function StudioCartPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}>
        <CartContent />
      </Suspense>
    </RequireCustomerAuth>
  );
}

function CartContent() {
  const searchParams = useSearchParams();
  const preset = getStudioGarment(searchParams.get('category'));
  const { state } = useC31();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-brand font-semibold">Ready-to-stitch cart</p>
      <h1 className="mt-2 text-3xl sm:text-4xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Cart
      </h1>
      <div className="mt-8">
        <StudioStepper current="cart" categoryId={preset.categoryId} />
      </div>
      {state.cart.length === 0 ? (
        <p className="mt-8 text-sm text-thy-muted">No fixed-price pieces yet. Add one from estimate details.</p>
      ) : (
        <ul className="mt-8 space-y-3 max-w-xl">
          {state.cart.map((item) => (
            <li key={item.id} className="thy-card p-5 flex items-center justify-between gap-3">
              <div>
                <p>{item.garment}</p>
                <p className="text-sm text-thy-muted">{item.tailorName} · ₹{item.price}</p>
              </div>
              <Link
                href={`/checkout/address?thread=${encodeURIComponent(item.threadId)}`}
                className="hero-leather-btn px-4 min-h-11 inline-flex items-center text-[11px] uppercase tracking-[0.14em]"
              >
                Buy now
              </Link>
            </li>
          ))}
        </ul>
      )}
      {state.cart[0] && (
        <Link href={estimateHref(state.cart[0].threadId)} className="inline-flex mt-6 text-sm text-thy-brand border-b border-thy-brand">
          View estimate details
        </Link>
      )}
    </main>
  );
}
