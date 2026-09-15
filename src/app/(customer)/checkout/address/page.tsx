'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Plus } from 'lucide-react';
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
  const threadParam = searchParams.get('thread') || '';
  const thread = findThread(state, threadParam);
  const saved = [session.customerProfile?.address, label || session.customerProfile?.city]
    .filter(Boolean)
    .join(', ');
  const [address, setAddress] = useState(state.checkoutAddress || saved);
  const [selectedPreset, setSelectedPreset] = useState<'saved' | 'custom'>(saved ? 'saved' : 'custom');

  useEffect(() => {
    if (state.checkoutAddress) {
      setAddress(state.checkoutAddress);
    }
  }, [state.checkoutAddress]);

  const handleContinue = () => {
    if (!address.trim()) return;
    save({ ...state, checkoutAddress: address });
    router.push(`/checkout/summary?thread=${encodeURIComponent(threadParam)}`);
  };

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">Buy now</p>
      <h1
        className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        Address
      </h1>
      <p className="mt-3 text-sm text-thy-muted">
        {thread?.tailorName || 'Your tailor'} · ₹{thread?.quotation?.price || '—'}
      </p>
      <div className="thy-divider-glow mt-4 max-w-md" />

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={() => {
            setSelectedPreset('saved');
            if (saved) setAddress(saved);
          }}
          className={`w-full text-left thy-card p-4 flex items-start gap-3 ${
            selectedPreset === 'saved' ? 'border-thy-burgundy/40' : ''
          }`}
        >
          <input
            type="radio"
            name="addressPreset"
            checked={selectedPreset === 'saved'}
            onChange={() => setSelectedPreset('saved')}
            className="mt-1 accent-thy-brand"
          />
          <div className="min-w-0">
            <p className="text-sm text-thy-ink inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-thy-burgundy" />
              Saved address
            </p>
            <p className="mt-1 text-sm text-thy-muted">
              {session.customerProfile?.fullName ? `${session.customerProfile.fullName} · ` : ''}
              {saved || 'Add a delivery address to continue.'}
            </p>
          </div>
        </button>

        <div
          className={`thy-card p-4 space-y-3 ${selectedPreset === 'custom' ? 'border-thy-burgundy/40' : ''}`}
        >
          <button
            type="button"
            onClick={() => setSelectedPreset('custom')}
            className="flex w-full items-center gap-3 text-left"
          >
            <input
              type="radio"
              name="addressPreset"
              checked={selectedPreset === 'custom'}
              onChange={() => setSelectedPreset('custom')}
              className="accent-thy-brand"
            />
            <span className="text-sm text-thy-ink inline-flex items-center gap-1.5">
              <Plus size={14} className="text-thy-burgundy" />
              New address
            </span>
          </button>
          {selectedPreset === 'custom' && (
            <textarea
              className="thy-input min-h-28"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="House, street, city, pincode"
            />
          )}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <button
          type="button"
          disabled={!address.trim()}
          className="hero-leather-btn w-full min-h-12 text-[11px] uppercase tracking-[0.16em] disabled:opacity-60"
          onClick={handleContinue}
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
