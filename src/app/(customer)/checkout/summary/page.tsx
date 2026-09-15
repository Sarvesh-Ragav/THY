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
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">Buy now</p>
      <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Order summary
      </h1>
      <p className="mt-3 text-sm text-thy-muted">Confirm the garment, atelier, and delivery before payment.</p>
      <div className="thy-divider-glow mt-4 max-w-md" />

      <section className="thy-card p-5 sm:p-6 mt-8 space-y-3">
        <p className="text-2xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          {thread?.request?.garment || 'Custom outfit'}
        </p>
        <p className="text-sm text-thy-muted">{thread?.tailorName}</p>
        {thread?.request?.fabric && <p className="text-sm text-thy-ink">{thread.request.fabric}</p>}
        <p className="text-3xl text-thy-burgundy pt-2" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          ₹{thread?.quotation?.price || '—'}
        </p>
        <p className="text-sm text-thy-muted pt-2 border-t border-thy-burgundy/10">
          Deliver to: {state.checkoutAddress || 'Add an address'}
        </p>
      </section>

      <div className="mt-6 space-y-3">
        <Link
          href={`/checkout/payment${query}`}
          className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em]"
        >
          Continue to payment
        </Link>
        <Link
          href={`/checkout/address${query}`}
          className="inline-flex w-full items-center justify-center min-h-11 text-[11px] font-semibold uppercase tracking-[0.14em] border border-thy-burgundy/20 text-thy-ink hover:border-thy-burgundy/40"
        >
          Edit address
        </Link>
      </div>
    </main>
  );
}
