'use client';

import React, { useState } from 'react';

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
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 text-slate-800 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Earnings & Payout Analytics</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track stitching revenue, platform fee deductions, and upcoming bank payouts.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-[#00c9b7] text-white text-xs font-bold rounded-xl hover:bg-[#00b5a4] transition-all shadow-xs">
          💳 Request Bank Payout
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Gross Revenue</span>
          <p className="text-2xl font-black text-slate-900">₹{totalRevenue}</p>
          <span className="text-[10px] text-emerald-600 font-bold">+18% from last month</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Earnings (Post 10% Fee)</span>
          <p className="text-2xl font-black text-[#00c9b7]">₹{netEarnings}</p>
          <span className="text-[10px] text-slate-400 font-medium">Platform Fee: ₹{platformFees}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Payout</span>
          <p className="text-2xl font-black text-amber-500">₹{pendingPayout}</p>
          <span className="text-[10px] text-slate-400 font-medium">Releasing upon delivery completion</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Orders</span>
          <p className="text-2xl font-black text-slate-900">3</p>
          <span className="text-[10px] text-slate-400 font-medium">100% On-time delivery rate</span>
        </div>

      </div>

      {/* Transactions Table Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Payout & Transaction History</h2>
          
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === 'all' ? 'bg-[#00c9b7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === 'paid' ? 'bg-[#00c9b7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="pb-3 px-2">Txn ID</th>
                <th className="pb-3 px-2">Order & Customer</th>
                <th className="pb-3 px-2">Date</th>
                <th className="pb-3 px-2 text-right">Gross Amount</th>
                <th className="pb-3 px-2 text-right">Platform Fee (10%)</th>
                <th className="pb-3 px-2 text-right">Net Payout</th>
                <th className="pb-3 px-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTxns.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-2 font-mono text-[11px] font-bold text-slate-400">{t.id}</td>
                  <td className="py-3.5 px-2">
                    <p className="font-bold text-slate-900">{t.garmentType}</p>
                    <span className="text-[10px] text-slate-400">{t.customerName} ({t.orderId})</span>
                  </td>
                  <td className="py-3.5 px-2 text-slate-500">{t.date}</td>
                  <td className="py-3.5 px-2 text-right font-bold text-slate-900">₹{t.amount}</td>
                  <td className="py-3.5 px-2 text-right text-rose-500 font-semibold">-₹{t.platformFee}</td>
                  <td className="py-3.5 px-2 text-right font-extrabold text-[#00c9b7]">₹{t.netPayout}</td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
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
  );
}