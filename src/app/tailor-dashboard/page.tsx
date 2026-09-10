'use client';

import React from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  getPendingRequestCount,
  getTailorFirstName,
  isStudioReceivingOrders,
} from '@/lib/tailor-session';

export default function TailorDashboardOverview() {
  const { session, updateSession } = useTailorSession();
  const pendingCount = getPendingRequestCount(session);
  const receivingOrders = isStudioReceivingOrders(session);
  const firstName = getTailorFirstName(session);
  const verificationStatus = session.verification?.status ?? 'pending';

  const handleAvailabilityToggle = () => {
    const nextReceiving = !receivingOrders;
    updateSession({
      availability: {
        ...session.availability,
        isAvailable: nextReceiving,
        vacationMode: nextReceiving ? false : session.availability.vacationMode,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-thy-surface p-5 sm:p-6 rounded-2xl shadow-sm border border-thy-ink/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-thy-ink">Welcome back, {firstName}!</h1>
          <p className="text-thy-muted text-sm">Manage your tailoring orders and grow your business with THY.</p>
        </div>

        {verificationStatus === 'pending' && (
          <div className="bg-thy-mist border border-thy-brand/25 text-thy-deep p-3 rounded-xl text-sm flex items-center gap-3">
            <span>⏳ <strong>Verification Pending:</strong> Your verification is under review.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-thy-surface p-5 sm:p-6 rounded-2xl shadow-sm border border-thy-ink/10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center gap-3 mb-4">
              <h2 className="font-bold text-thy-ink">New Order Requests</h2>
              <span className="bg-thy-mist text-thy-brand font-bold px-3 py-1 rounded-full text-xs">
                {pendingCount} Pending
              </span>
            </div>
            <p className="text-sm text-thy-muted mb-4">Review incoming customer requests and provide custom quotations.</p>
          </div>
          <Link
            href="/tailor-dashboard/new-requests"
            className="w-full py-2.5 bg-thy-brand hover:bg-thy-brand-hover text-white text-center font-semibold rounded-xl text-sm transition-colors"
          >
            View Request Cards
          </Link>
        </div>

        <div className="bg-thy-surface p-5 sm:p-6 rounded-2xl shadow-sm border border-thy-ink/10 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-thy-ink mb-2">Your Availability</h2>
            <p className="text-sm text-thy-muted mb-4">Toggle whether you are taking on new customer orders right now.</p>
          </div>
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-thy-ink/10">
            <Link href="/tailor-dashboard/availability" className="text-sm font-semibold text-thy-brand hover:underline">
              Status: {receivingOrders ? 'Available' : 'Unavailable'}
            </Link>
            <button
              type="button"
              onClick={handleAvailabilityToggle}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                receivingOrders ? 'bg-thy-brand text-white' : 'bg-thy-mist text-thy-muted'
              }`}
            >
              {receivingOrders ? 'Available' : 'Unavailable'}
            </button>
          </div>
        </div>

        <div className="bg-thy-surface p-5 sm:p-6 rounded-2xl shadow-sm border border-thy-ink/10 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-thy-ink mb-2">Active Orders Overview</h2>
            <p className="text-sm text-thy-muted mb-4">
              {session.orders.length} items currently under stitching.
            </p>
          </div>
          <Link
            href="/tailor-dashboard/active-orders"
            className="w-full py-2.5 bg-thy-deep text-white text-center font-semibold rounded-xl text-sm hover:bg-thy-ink transition-colors"
          >
            View Active Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
