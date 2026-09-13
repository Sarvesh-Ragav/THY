'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useC31 } from '@/hooks/useC31';
import { findThread } from '@/lib/c31';

export default function CheckoutSummaryPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}>
        <SummaryStep />
      </Suspense>
    </RequireCustomerAuth>
  );
}

function SummaryStep() {
  const searchParams = useSearchParams();
  const { state } = useC31();
  const thread = findThread(state, searchParams.get('thread'));
  const query = `?thread=${encodeURIComponent(searchParams.get('thread') || '')}`;

  return (
    <main className="max-w-xl mx-auto px-4 py-10 space-y-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Buy now</p>
      <h1 className="text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Order summary
      </h1>
      <section className="thy-card p-5 space-y-2 text-sm">
        <p>{thread?.request?.garment || 'Custom outfit'}</p>
        <p className="text-thy-muted">{thread?.tailorName}</p>
        <p>{thread?.request?.fabric}</p>
        <p className="text-2xl pt-2" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          ₹{thread?.quotation?.price}
        </p>
        <p className="text-thy-muted">Deliver to: {state.checkoutAddress || 'Add an address'}</p>
      </section>
      <Link
        href={`/checkout/payment${query}`}
        className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em]"
      >
        Continue to payment
      </Link>
    </main>
  );
}
