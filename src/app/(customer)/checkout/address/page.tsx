'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useC31 } from '@/hooks/useC31';
import { findThread } from '@/lib/c31';

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-sm border border-thy-ink/15 bg-thy-surface';

export default function CheckoutAddressPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}>
        <AddressStep />
      </Suspense>
    </RequireCustomerAuth>
  );
}

function AddressStep() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session } = useTailorSession();
  const { state, save } = useC31();
  const thread = findThread(state, searchParams.get('thread'));
  const saved = [session.customerProfile?.address, session.customerProfile?.city].filter(Boolean).join(', ');
  const [address, setAddress] = useState(state.checkoutAddress || saved);

  return (
    <main className="max-w-xl mx-auto px-4 py-10 space-y-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Buy now</p>
      <h1 className="text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Address selection
      </h1>
      <p className="text-sm text-thy-muted">
        {thread?.tailorName} · ₹{thread?.quotation?.price || '—'}
      </p>
      <textarea
        className="thy-input min-h-28"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Delivery address"
      />
      <button
        type="button"
        className="hero-leather-btn w-full min-h-12 text-[11px] uppercase tracking-[0.16em]"
        onClick={() => {
          save({ ...state, checkoutAddress: address });
          router.push(`/checkout/summary?thread=${encodeURIComponent(searchParams.get('thread') || '')}`);
        }}
      >
        Continue to summary
      </button>
      <Link href="/saved-addresses" className={`${ghostBtn} w-full`}>
        Saved addresses
      </Link>
    </main>
  );
}
