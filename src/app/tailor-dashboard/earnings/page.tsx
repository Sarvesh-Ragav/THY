'use client';

import React, { useMemo, useState } from 'react';
import { TailorPage } from '@/components/tailor/TailorPage';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { earningsSummary } from '@/lib/tailor-studio';

export default function TailorEarningsPage() {
  const { session } = useTailorSession();
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const summary = earningsSummary(session.payouts, session.orders);
  const filteredTxns = useMemo(
    () =>
      session.payouts.filter((item) => {
        if (filter === 'paid') return item.status === 'Paid';
        if (filter === 'pending') return item.status === 'Pending';
        return true;
      }),
    [filter, session.payouts]
  );

  return (
    <TailorPage title="Earnings" description="Track stitching revenue, platform fees, and upcoming bank payouts.">
      <div className="space-y-6 text-thy-ink">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="thy-card p-5 space-y-1">
            <span className="text-[10px] font-bold text-thy-subtle uppercase tracking-wider">Total Gross Revenue</span>
            <p className="text-2xl font-black text-thy-ink">₹{summary.totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="thy-card p-5 space-y-1">
            <span className="text-[10px] font-bold text-thy-subtle uppercase tracking-wider">Net Earnings (Post 10% Fee)</span>
            <p className="text-2xl font-black text-thy-burgundy">₹{summary.netEarnings.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-thy-subtle font-medium">Platform Fee: ₹{summary.platformFees}</span>
          </div>
          <div className="thy-card p-5 space-y-1">
            <span className="text-[10px] font-bold text-thy-subtle uppercase tracking-wider">Pending Payout</span>
            <p className="text-2xl font-black text-amber-500">₹{summary.pendingPayout.toLocaleString('en-IN')}</p>
          </div>
          <div className="thy-card p-5 space-y-1">
            <span className="text-[10px] font-bold text-thy-subtle uppercase tracking-wider">Completed Orders</span>
            <p className="text-2xl font-black text-thy-ink">{summary.completedCount}</p>
          </div>
        </div>

        <div className="thy-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-xs font-bold text-thy-ink uppercase tracking-wider">Payout & Transaction History</h2>
            <div className="flex gap-1.5 bg-thy-mist p-1 rounded-xl">
              {(['all', 'paid', 'pending'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize ${
                    filter === key ? 'bg-thy-burgundy text-white shadow-xs' : 'text-thy-muted hover:text-thy-ink'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          {filteredTxns.length === 0 ? (
            <p className="text-sm text-thy-muted py-8 text-center">No payouts yet. Complete an order to add one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-thy-burgundy/10 text-thy-subtle uppercase text-[10px] tracking-wider font-bold">
                    <th className="pb-3 px-2">Txn ID</th>
                    <th className="pb-3 px-2">Order & Customer</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2 text-right">Gross Amount</th>
                    <th className="pb-3 px-2 text-right">Platform Fee (10%)</th>
                    <th className="pb-3 px-2 text-right">Net Payout</th>
                    <th className="pb-3 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-thy-burgundy/10 font-medium text-thy-ink">
                  {filteredTxns.map((item) => {
                    const fee = Math.round(item.amount * 0.1);
                    return (
                      <tr key={item.id} className="hover:bg-thy-mist/60">
                        <td className="py-3.5 px-2 font-mono text-[11px] font-bold text-thy-subtle">{item.id}</td>
                        <td className="py-3.5 px-2">
                          <p className="font-bold text-thy-ink">{item.garmentType}</p>
                          <span className="text-[10px] text-thy-subtle">
                            {item.customerName} ({item.orderId})
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-thy-muted">{item.date}</td>
                        <td className="py-3.5 px-2 text-right font-bold">₹{item.amount}</td>
                        <td className="py-3.5 px-2 text-right text-rose-500 font-semibold">-₹{fee}</td>
                        <td className="py-3.5 px-2 text-right font-extrabold text-thy-burgundy">₹{item.amount - fee}</td>
                        <td className="py-3.5 px-2 text-center">
                          <span className="bg-thy-mist text-thy-burgundy border border-thy-burgundy/20 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </TailorPage>
  );
}
