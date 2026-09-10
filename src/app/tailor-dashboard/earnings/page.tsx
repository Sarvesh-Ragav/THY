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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-thy-ink">Earnings & Reports</h1>
          <p className="text-sm text-thy-muted">Track your revenue, completed order payouts, and financial summary.</p>
        </div>
        <Link 
          href="/tailor-dashboard" 
          className="text-sm font-semibold text-thy-brand hover:underline self-start"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-thy-surface p-5 sm:p-6 rounded-2xl border border-thy-ink/10 shadow-sm">
          <span className="text-xs font-semibold text-thy-subtle uppercase">Total Revenue</span>
          <h2 className="text-3xl font-extrabold text-thy-ink mt-2">₹42,500</h2>
          <p className="text-xs text-green-600 font-medium mt-1">↑ 12% from last month</p>
        </div>

        <div className="bg-thy-surface p-5 sm:p-6 rounded-2xl border border-thy-ink/10 shadow-sm">
          <span className="text-xs font-semibold text-thy-subtle uppercase">Completed Orders</span>
          <h2 className="text-3xl font-extrabold text-thy-ink mt-2">12</h2>
          <p className="text-xs text-thy-muted font-medium mt-1">3 orders this week</p>
        </div>

        <div className="bg-thy-surface p-5 sm:p-6 rounded-2xl border border-thy-ink/10 shadow-sm">
          <span className="text-xs font-semibold text-thy-subtle uppercase">Pending Payout</span>
          <h2 className="text-3xl font-extrabold text-thy-brand mt-2">₹9,800</h2>
          <p className="text-xs text-thy-brand font-medium mt-1">Scheduled for Sep 15</p>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-thy-surface rounded-2xl border border-thy-ink/10 shadow-sm p-5 sm:p-6 space-y-4">
        <h2 className="text-lg font-bold text-thy-ink">Payout History</h2>
        
        <div className="thy-scroll-x">
          <table className="w-full min-w-[36rem] text-left text-xs">
            <thead>
              <tr className="border-b border-thy-ink/10 text-thy-subtle font-semibold uppercase">
                <th className="pb-3">Payout Ref</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Orders Settled</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-thy-mist text-thy-ink">
              {mockPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-thy-mist">
                  <td className="py-3.5 font-bold text-thy-ink">{payout.id}</td>
                  <td className="py-3.5">{payout.date}</td>
                  <td className="py-3.5">{payout.ordersCount} Orders</td>
                  <td className="py-3.5 font-bold text-thy-ink">{payout.amount}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      payout.status === 'Completed'
                        ? 'bg-thy-mist text-thy-deep border border-thy-brand/25'
                        : 'bg-thy-mist text-thy-muted border border-thy-ink/10'
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