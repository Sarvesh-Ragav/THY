'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, ArrowRight, Bookmark, Plus, CheckCircle2 } from 'lucide-react';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useC31 } from '@/hooks/useC31';
import { findThread } from '@/lib/c31';

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all';

export default function CheckoutAddressPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<p className="p-8 text-center text-xs text-slate-500 font-medium">Loading address details...</p>}>
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

  const threadParam = searchParams.get('thread') || '';
  const thread = findThread(state, threadParam);

  // Default address fallback from session profile
  const profileAddress = [session.customerProfile?.address, session.customerProfile?.city]
    .filter(Boolean)
    .join(', ');

  const initialAddress = state.checkoutAddress || profileAddress || 'Flat 4B, Ceebros Apartments, Adyar, Chennai - 600020';
  
  const [address, setAddress] = useState(initialAddress);
  const [selectedPreset, setSelectedPreset] = useState<'saved' | 'custom'>('saved');

  // Keep state synchronized if custom text is edited
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
    <main className="max-w-xl mx-auto px-4 py-8 space-y-6 text-slate-800 font-sans">
      
      {/* Step Header */}
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <span className="text-[11px] uppercase tracking-widest text-[#26988a] font-extrabold">
          Step 1 of 3 • Buy Now
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Select Delivery Address
        </h1>
        {thread && (
          <p className="text-xs text-slate-500 font-medium flex items-center gap-2 pt-1">
            <span className="font-bold text-slate-700">{thread.tailorName || 'Master Tailor'}</span>
            <span>•</span>
            <span className="text-[#26988a] font-black">₹{thread.quotation?.price || '—'}</span>
          </p>
        )}
      </div>

      {/* Address Selection Cards */}
      <div className="space-y-3">
        {/* Saved Default Address Option */}
        <div
          onClick={() => {
            setSelectedPreset('saved');
            if (profileAddress) setAddress(profileAddress);
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
            selectedPreset === 'saved'
              ? 'border-[#26988a] bg-teal-50/40 ring-1 ring-[#26988a]'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <input
            type="radio"
            name="addressPreset"
            checked={selectedPreset === 'saved'}
            onChange={() => setSelectedPreset('saved')}
            className="mt-1 accent-[#26988a] cursor-pointer"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#26988a]" /> Primary Saved Address
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                Default
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {profileAddress || 'Flat 4B, Ceebros Apartments, Adyar, Chennai - 600020'}
            </p>
          </div>
        </div>

        {/* Custom Address Input Option */}
        <div
          onClick={() => setSelectedPreset('custom')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
            selectedPreset === 'custom'
              ? 'border-[#26988a] bg-teal-50/40 ring-1 ring-[#26988a]'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="addressPreset"
              checked={selectedPreset === 'custom'}
              onChange={() => setSelectedPreset('custom')}
              className="accent-[#26988a] cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#26988a]" /> Enter New / Custom Address
            </span>
          </div>

          {selectedPreset === 'custom' && (
            <textarea
              className="w-full min-h-24 p-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#26988a] text-slate-800 placeholder-slate-400"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="House/Flat No., Street, Landmark, City & Pincode"
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          disabled={!address.trim()}
          className="w-full py-3.5 bg-[#26988a] hover:bg-[#22877b] disabled:bg-slate-300 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          onClick={handleContinue}
        >
          <span>Continue to Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <Link href="/saved-addresses" className={`${ghostBtn} w-full`}>
          <Bookmark className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
          Manage Saved Addresses
        </Link>
      </div>

    </main>
  );
}