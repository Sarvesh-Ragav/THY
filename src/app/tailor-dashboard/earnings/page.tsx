'use client';

import React, { useState } from 'react';
import { TailorPage } from '@/components/tailor/TailorPage';

interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  garmentType: string;
  date: string;
  amount: number;
  platformFee: number;
  netPayout: number;
  status: 'Paid' | 'Pending';
}

const TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-901',
    orderId: 'THY-8719',
    customerName: 'Pooja V.',
    garmentType: 'Lehenga Choli Alterations',
    date: '07 Sep 2026',
    amount: 850,
    platformFee: 85,
    netPayout: 765,
    status: 'Paid',
  },
  {
    id: 'TXN-882',
    orderId: 'THY-8640',
    customerName: 'Saritha N.',
    garmentType: 'Designer Salwar Set',
    date: '03 Sep 2026',
    amount: 2100,
    platformFee: 210,
    netPayout: 1890,
    status: 'Paid',
  },
  {
    id: 'TXN-850',
    orderId: 'THY-8512',
    customerName: 'Kavitha P.',
    garmentType: 'Bridal Blouse Custom Stitching',
    date: '28 Aug 2026',
    amount: 2500,
    platformFee: 250,
    netPayout: 2250,
    status: 'Paid',
  },
];

export default function TailorEarningsPage() {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const totalRevenue = 5450;
  const platformFees = 545;
  const netEarnings = totalRevenue - platformFees;
  const pendingPayout = 1665; // From upcoming completed orders (e.g. THY-8842 after final delivery)

  const filteredTxns = TRANSACTIONS.filter((t) => {
    if (filter === 'paid') return t.status === 'Paid';
    if (filter === 'pending') return t.status === 'Pending';
    return true;
  });

  return (
    <TailorPage
      title="Earnings"
      description="Track stitching revenue, platform fees, and upcoming bank payouts."
      actions={
        <button className="thy-btn px-5 py-3 text-[11px] uppercase tracking-[0.16em]">
          Request Bank Payout
        </button>
      }
    >
      <div className="space-y-6 text-thy-ink">

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="thy-card p-5 space-y-1">
          <span className="text-[10px] font-bold text-thy-subtle uppercase tracking-wider">Total Gross Revenue</span>
          <p className="text-2xl font-black text-thy-ink">₹{totalRevenue}</p>
          <span className="text-[10px] text-thy-burgundy font-bold">+18% from last month</span>
        </div>

        <div className="thy-card p-5 space-y-1">
          <span className="text-[10px] font-bold text-thy-subtle uppercase tracking-wider">Net Earnings (Post 10% Fee)</span>
          <p className="text-2xl font-black text-thy-burgundy">₹{netEarnings}</p>
          <span className="text-[10px] text-thy-subtle font-medium">Platform Fee: ₹{platformFees}</span>
        </div>

        <div className="thy-card p-5 space-y-1">
          <span className="text-[10px] font-bold text-thy-subtle uppercase tracking-wider">Pending Payout</span>
          <p className="text-2xl font-black text-amber-500">₹{pendingPayout}</p>
          <span className="text-[10px] text-thy-subtle font-medium">Releasing upon delivery completion</span>
        </div>

        <div className="thy-card p-5 space-y-1">
          <span className="text-[10px] font-bold text-thy-subtle uppercase tracking-wider">Completed Orders</span>
          <p className="text-2xl font-black text-thy-ink">3</p>
          <span className="text-[10px] text-thy-subtle font-medium">100% On-time delivery rate</span>
        </div>

      </div>

      {/* Transactions Table Section */}
      <div className="thy-card p-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xs font-bold text-thy-ink uppercase tracking-wider">Payout & Transaction History</h2>
          
          <div className="flex gap-1.5 bg-thy-mist p-1 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === 'all' ? 'bg-thy-burgundy text-white shadow-xs' : 'text-thy-muted hover:text-thy-ink'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === 'paid' ? 'bg-thy-burgundy text-white shadow-xs' : 'text-thy-muted hover:text-thy-ink'
              }`}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Table */}
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
              {filteredTxns.map((t) => (
                <tr key={t.id} className="hover:bg-thy-mist/60 transition-colors">
                  <td className="py-3.5 px-2 font-mono text-[11px] font-bold text-thy-subtle">{t.id}</td>
                  <td className="py-3.5 px-2">
                    <p className="font-bold text-thy-ink">{t.garmentType}</p>
                    <span className="text-[10px] text-thy-subtle">{t.customerName} ({t.orderId})</span>
                  </td>
                  <td className="py-3.5 px-2 text-thy-muted">{t.date}</td>
                  <td className="py-3.5 px-2 text-right font-bold text-thy-ink">₹{t.amount}</td>
                  <td className="py-3.5 px-2 text-right text-rose-500 font-semibold">-₹{t.platformFee}</td>
                  <td className="py-3.5 px-2 text-right font-extrabold text-thy-burgundy">₹{t.netPayout}</td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="bg-thy-mist text-thy-burgundy border border-thy-burgundy/20 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      </div>
    </TailorPage>
  );
}