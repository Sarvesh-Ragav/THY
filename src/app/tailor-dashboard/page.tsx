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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}!</h1>
          <p className="text-gray-600 text-sm">Manage your tailoring orders and grow your business with THY.</p>
        </div>

        {verificationStatus === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-xl text-sm flex items-center gap-3">
            <span>⏳ <strong>Verification Pending:</strong> Your verification is under review.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900">New Order Requests</h2>
              <span className="bg-teal-50 text-[#00c9b7] font-bold px-3 py-1 rounded-full text-xs">
                {pendingCount} Pending
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Review incoming customer requests and provide custom quotations.</p>
          </div>
          <Link
            href="/tailor-dashboard/new-requests"
            className="w-full py-2.5 bg-[#00c9b7] text-white text-center font-semibold rounded-xl text-sm hover:bg-[#00b5a4] transition-colors"
          >
            View Request Cards
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-900 mb-2">Your Availability</h2>
            <p className="text-sm text-gray-600 mb-4">Toggle whether you are taking on new customer orders right now.</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Link href="/tailor-dashboard/availability" className="text-sm font-semibold text-[#00c9b7] hover:underline">
              Status: {receivingOrders ? 'Available' : 'Unavailable'}
            </Link>
            <button
              type="button"
              onClick={handleAvailabilityToggle}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                receivingOrders ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {receivingOrders ? 'Available' : 'Unavailable'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-900 mb-2">Active Orders Overview</h2>
            <p className="text-sm text-gray-600 mb-4">
              {session.orders.length} items currently under stitching.
            </p>
          </div>
          <Link
            href="/tailor-dashboard/active-orders"
            className="w-full py-2.5 bg-gray-900 text-white text-center font-semibold rounded-xl text-sm hover:bg-gray-800 transition-colors"
          >
            View Active Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
