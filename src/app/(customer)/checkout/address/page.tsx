'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useC31 } from '@/hooks/useC31';
import { findThread } from '@/lib/c31';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] border border-thy-burgundy/20 bg-thy-cream text-thy-ink hover:border-thy-burgundy/40';

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
  const { label } = useCustomerLocation();
  const { state, save } = useC31();
  const thread = findThread(state, searchParams.get('thread'));
  const saved = [session.customerProfile?.address, label || session.customerProfile?.city].filter(Boolean).join(', ');
  const [address, setAddress] = useState(state.checkoutAddress || saved);

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">Buy now</p>
      <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Address
      </h1>
      <p className="mt-3 text-sm text-thy-muted">
        {thread?.tailorName || 'Your tailor'} · ₹{thread?.quotation?.price || '—'}
      </p>
      <div className="thy-divider-glow mt-4 max-w-md" />

      <div className="thy-card p-5 sm:p-6 mt-8 space-y-4">
        <label className="block text-sm text-thy-ink">
          Delivery address
          <textarea
            className="thy-input mt-2 min-h-28"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="House, street, city, pincode"
          />
        </label>
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
      </div>
    </main>
  );
}
