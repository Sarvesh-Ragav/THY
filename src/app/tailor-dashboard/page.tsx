'use client';

import React from 'react';
import Link from 'next/link';

export default function TailorDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-6 text-xs font-semibold text-gray-600">
          <Link href="/tailor-dashboard" className="text-[#00c9b7] font-bold">
            Dashboard
          </Link>
          <Link href="/tailor-dashboard/new-requests" className="hover:text-[#00c9b7]">
            New Requests
          </Link>
          <Link href="/tailor-dashboard/active-orders" className="hover:text-[#00c9b7]">
            Active Orders
          </Link>
          <Link href="/tailor-dashboard/availability" className="hover:text-[#00c9b7]">
            Availability
          </Link>
          <Link href="/tailor-dashboard/chat" className="hover:text-[#00c9b7]">
            Chat
          </Link>
          <Link href="/tailor-dashboard/earnings" className="hover:text-[#00c9b7]">
            Earnings & Reports
          </Link>
        </div>
      </div>

      {/* Verification Banner */}
      <div className="bg-teal-50 border border-teal-200 text-teal-800 p-4 rounded-2xl flex items-center justify-between text-xs">
        <div>
          <h2 className="font-bold text-sm">Welcome back, kavs!</h2>
          <p className="text-gray-600">Manage your tailoring orders and grow your business with THY.</p>
        </div>
        <span className="bg-white px-3 py-1 rounded-full border border-teal-300 font-semibold text-[11px]">
          ⏳ Verification Pending: Your verification is under review.
        </span>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Requests */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">New Order Requests</h3>
              <span className="bg-teal-50 text-[#00c9b7] text-[10px] font-bold px-2 py-0.5 rounded-full">
                2 Pending
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Review incoming customer requests and provide custom quotations.
            </p>
          </div>
          <Link
            href="/tailor-dashboard/new-requests"
            className="w-full text-center py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-semibold hover:bg-[#00b5a4] transition-colors"
          >
            View Request Cards
          </Link>
        </div>

        {/* Availability */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Your Availability</h3>
            <p className="text-xs text-gray-500">
              Toggle whether you are taking on new customer orders right now.
            </p>
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <span className="text-xs font-bold text-[#00c9b7]">Status: Available</span>
            <Link
              href="/tailor-dashboard/availability"
              className="px-3 py-1 bg-[#00c9b7] text-white rounded-lg text-xs font-semibold"
            >
              Configure
            </Link>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Active Orders Overview</h3>
            <p className="text-xs text-gray-500">2 items currently under stitching.</p>
          </div>
          <Link
            href="/tailor-dashboard/active-orders"
            className="w-full text-center py-2 bg-[#053b36] text-white rounded-xl text-xs font-semibold hover:bg-[#022824] transition-colors"
          >
            View Active Orders
          </Link>
        </div>

        {/* Earnings & Reports Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Earnings & Revenue</h3>
            <p className="text-xs text-gray-500">Track monthly payouts and financial statements.</p>
          </div>
          <Link
            href="/tailor-dashboard/earnings"
            className="w-full text-center py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-semibold hover:bg-[#00b5a4] transition-colors"
          >
            View Financials
          </Link>
        </div>
      </div>
    </div>
  );
}