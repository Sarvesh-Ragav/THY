'use client';

import React from 'react';
import Link from 'next/link';

const mockPayouts = [
  { id: 'PAY-401', date: '2026-09-01', amount: '₹14,500', ordersCount: 4, status: 'Completed' },
  { id: 'PAY-402', date: '2026-09-08', amount: '₹18,200', ordersCount: 5, status: 'Completed' },
  { id: 'PAY-403', date: '2026-09-15', amount: '₹9,800', ordersCount: 3, status: 'Processing' },
];

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Reports</h1>
          <p className="text-sm text-gray-600">Track your revenue, completed order payouts, and financial summary.</p>
        </div>
        <Link 
          href="/tailor-dashboard" 
          className="text-sm font-semibold text-[#00c9b7] hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase">Total Revenue</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">₹42,500</h2>
          <p className="text-xs text-green-600 font-medium mt-1">↑ 12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase">Completed Orders</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">12</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">3 orders this week</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase">Pending Payout</span>
          <h2 className="text-3xl font-extrabold text-[#00c9b7] mt-2">₹9,800</h2>
          <p className="text-xs text-amber-600 font-medium mt-1">Scheduled for Sep 15</p>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Payout History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase">
                <th className="pb-3">Payout Ref</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Orders Settled</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {mockPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="py-3.5 font-bold text-gray-900">{payout.id}</td>
                  <td className="py-3.5">{payout.date}</td>
                  <td className="py-3.5">{payout.ordersCount} Orders</td>
                  <td className="py-3.5 font-bold text-gray-900">{payout.amount}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      payout.status === 'Completed'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}