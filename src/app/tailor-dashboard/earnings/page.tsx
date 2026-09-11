'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PayoutTransaction {
  id: string;
  orderId: string;
  customerName: string;
  garmentType: string;
  completedDate: string;
  amount: string;
  status: 'Transferred' | 'Processing';
}

const initialPayouts: PayoutTransaction[] = [
  {
    id: 'PAY-901',
    orderId: 'ORD-8012',
    customerName: 'Rahul Sharma',
    garmentType: 'Custom Sherwani',
    completedDate: '2026-09-08',
    amount: '₹9,500',
    status: 'Transferred',
  },
  {
    id: 'PAY-904',
    orderId: 'ORD-8045',
    customerName: 'Neha Gupta',
    garmentType: 'Bridal Lehenga',
    completedDate: '2026-09-09',
    amount: '₹14,000',
    status: 'Transferred',
  },
  {
    id: 'PAY-908',
    orderId: 'ORD-8102',
    customerName: 'Sneha Reddy',
    garmentType: 'Anarkali Suit',
    completedDate: '2026-09-11',
    amount: '₹4,800',
    status: 'Processing',
  },
];

export default function EarningsPage() {
  const [payouts] = useState<PayoutTransaction[]>(initialPayouts);
  const [timeframe, setTimeframe] = useState<'this_month' | 'last_month' | 'all'>('this_month');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1>
          <p className="text-xs text-gray-600">Track revenue generated from completed tailoring orders.</p>
        </div>
        <Link href="/tailor-dashboard" className="text-sm font-semibold text-[#00c9b7] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Financial Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-400">Total Earnings (Sept 2026)</span>
          <div className="text-2xl font-bold text-gray-900">₹28,300</div>
          <p className="text-[11px] text-teal-600 font-medium">↑ 14% higher than last month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-400">Pending Bank Payout</span>
          <div className="text-2xl font-bold text-amber-600">₹4,800</div>
          <p className="text-[11px] text-gray-500">Scheduled transfer: Sept 14, 2026</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-400">Completed Orders</span>
          <div className="text-2xl font-bold text-gray-900">18 Orders</div>
          <p className="text-[11px] text-gray-500">Average ticket: ₹1,570/order</p>
        </div>
      </div>

      {/* Payout History Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900">Recent Completed Payouts</h3>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-1.5 border rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-2">Payout ID</th>
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Garment</th>
                <th className="py-3 px-2">Completed Date</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {payouts.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-2 text-gray-400 font-bold">{pay.id}</td>
                  <td className="py-3 px-2 font-semibold text-gray-900">{pay.orderId}</td>
                  <td className="py-3 px-2">{pay.customerName}</td>
                  <td className="py-3 px-2">{pay.garmentType}</td>
                  <td className="py-3 px-2 text-gray-500">{pay.completedDate}</td>
                  <td className="py-3 px-2 font-bold text-gray-900">{pay.amount}</td>
                  <td className="py-3 px-2 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pay.status === 'Transferred'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {pay.status}
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