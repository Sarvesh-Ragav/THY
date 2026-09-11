'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TailorDashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'pending'>('all');

  return (
    <div className="space-y-6">
      {/* Welcome & Status Banner */}
      <div className="bg-gradient-to-r from-[#053b36] to-[#00c9b7] p-6 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Welcome back, Kavs! 👋</h1>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              Studio Active
            </span>
          </div>
          <p className="text-xs text-teal-100">
            You have <strong className="text-white underline">2 pending requests</strong> and <strong className="text-white underline">3 active stitching orders</strong> today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/tailor-dashboard/new-requests"
            className="px-4 py-2 bg-white text-[#053b36] hover:bg-teal-50 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Review Requests →
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Pending Requests</span>
            <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-bold">Action Needed</span>
          </div>
          <div className="text-2xl font-black text-gray-900">02</div>
          <p className="text-[11px] text-gray-400">Needs price quotes</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>In Production</span>
            <span className="text-[#00c9b7] bg-teal-50 px-2 py-0.5 rounded-full text-[10px] font-bold">On Schedule</span>
          </div>
          <div className="text-2xl font-black text-gray-900">03</div>
          <p className="text-[11px] text-gray-400">Currently stitching</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Monthly Revenue</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">+18% vs last month</span>
          </div>
          <div className="text-2xl font-black text-gray-900">₹42,500</div>
          <p className="text-[11px] text-gray-400">12 orders completed</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Profile Rating</span>
            <span className="text-amber-500">★ 4.9</span>
          </div>
          <div className="text-2xl font-black text-gray-900">98%</div>
          <p className="text-[11px] text-gray-400">Positive feedback</p>
        </div>
      </div>

      {/* Operational Hub: Active Orders & Live Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Urgent Action Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Live Orders & Activity</h2>
              <p className="text-xs text-gray-500">Track current garment statuses and deadlines</p>
            </div>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl text-xs font-semibold text-gray-600">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-[#00c9b7] shadow-sm' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('urgent')}
                className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'urgent' ? 'bg-white text-[#00c9b7] shadow-sm' : ''}`}
              >
                Due Soon
              </button>
            </div>
          </div>

          {/* Orders Quick List */}
          <div className="divide-y divide-gray-50 text-xs">
            <div className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">ORD-8098</span>
                  <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md text-[10px]">Stitching</span>
                </div>
                <p className="text-gray-500">Silk Velvet Sherwani • Aarav Sharma</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-bold text-gray-900">Due Tomorrow</p>
                <Link href="/tailor-dashboard/active-orders" className="text-[#00c9b7] font-semibold hover:underline block">
                  Update Status →
                </Link>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">ORD-8099</span>
                  <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-md text-[10px]">Ready</span>
                </div>
                <p className="text-gray-500">Indo-Western Crop Top • Ananya Iyer</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-bold text-gray-900">Ready for Pickup</p>
                <Link href="/tailor-dashboard/active-orders" className="text-[#00c9b7] font-semibold hover:underline block">
                  View Details →
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t text-center">
            <Link href="/tailor-dashboard/active-orders" className="text-xs font-bold text-[#00c9b7] hover:underline">
              View All Active Orders →
            </Link>
          </div>
        </div>

        {/* Right Column: Quick Links & Notifications */}
        <div className="space-y-4">
          {/* Recent Alerts Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-gray-900">Quick Notifications</h3>
              <span className="bg-teal-50 text-[#00c9b7] text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-800">Quote Accepted</p>
                <p className="text-gray-500 text-[11px]">Aarav accepted your quotation of ₹12,000.</p>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-800">Payout Transferred</p>
                <p className="text-gray-500 text-[11px]">₹14,000 sent to registered bank account.</p>
              </div>
            </div>
            <Link
              href="/tailor-dashboard/notifications"
              className="block text-center pt-1 text-xs font-bold text-[#00c9b7] hover:underline"
            >
              Open Activity Feed →
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Studio Management</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                href="/tailor-dashboard/availability"
                className="p-3 bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-[#00c9b7] rounded-xl text-center transition-colors"
              >
                🗓️ Hours
              </Link>
              <Link
                href="/tailor-dashboard/portfolio"
                className="p-3 bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-[#00c9b7] rounded-xl text-center transition-colors"
              >
                📸 Portfolio
              </Link>
              <Link
                href="/tailor-dashboard/chat"
                className="p-3 bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-[#00c9b7] rounded-xl text-center transition-colors"
              >
                💬 Messages
              </Link>
              <Link
                href="/tailor-dashboard/earnings"
                className="p-3 bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-[#00c9b7] rounded-xl text-center transition-colors"
              >
                📊 Payouts
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}