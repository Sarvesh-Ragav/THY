'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { TailorPage } from '@/components/tailor/TailorPage';

export default function TailorDashboardPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const { session } = useTailorSession();

  const displayName = session?.profile?.fullName || session?.identifier || 'Priya S!';

  return (
    <TailorPage
      title={`Welcome back, ${displayName}`}
      description="Manage your tailoring orders and grow your business with THY."
      actions={
        <p className="hidden lg:block text-xs font-semibold text-thy-burgundy italic tracking-wide max-w-xs text-right">
          Your Skill, Our Support — A More Stylish Tomorrow
        </p>
      }
    >
      <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* New Requests */}
        <div className="thy-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-thy-mist/80 border border-thy-mist text-thy-burgundy flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1584208124888-3a20b9c799e2?auto=format&fit=crop&w=150&q=80" 
              alt="Design Sketch" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-thy-muted">New Order Requests</p>
            <p className="text-xl font-black text-thy-ink">3</p>
            <Link href="/tailor-dashboard/new-requests" className="text-[11px] font-bold text-thy-burgundy hover:underline block">
              View Requests →
            </Link>
          </div>
        </div>

        {/* Active Orders */}
        <div className="thy-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-thy-mist/80 border border-thy-mist text-thy-burgundy flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=150&q=80" 
              alt="Sewing Machine" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-thy-muted">Active Orders</p>
            <p className="text-xl font-black text-thy-ink">5</p>
            <Link href="/tailor-dashboard/active-orders" className="text-[11px] font-bold text-thy-burgundy hover:underline block">
              View Orders →
            </Link>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="thy-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-thy-mist/80 border border-thy-mist text-thy-burgundy flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=150&q=80" 
              alt="Finished Garments" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-thy-muted">Completed Orders</p>
            <p className="text-xl font-black text-thy-ink">12</p>
            <span className="text-[10px] text-thy-subtle font-medium">This Month</span>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="thy-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-thy-mist/80 border border-thy-mist text-thy-burgundy flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=150&q=80" 
              alt="Shopping Bags" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-thy-muted">Total Earnings</p>
            <p className="text-xl font-black text-thy-ink">₹ 18,600</p>
            <Link href="/tailor-dashboard/earnings" className="text-[11px] font-bold text-thy-burgundy hover:underline block">
              View Reports →
            </Link>
          </div>
        </div>

        {/* Verification Status */}
        <div className="thy-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-thy-mist/80 border border-thy-mist text-thy-burgundy flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=150&q=80" 
              alt="Fashion Scissors" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-thy-muted">Verification Status</p>
            <span className="bg-thy-mist/80 text-thy-ink text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
              ✓ Verified Tailor
            </span>
            <p className="text-[10px] text-thy-subtle block pt-0.5">Thank you for being part of THY!</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* New Order Requests */}
            <div className="thy-card p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-thy-ink">New Order Requests</h2>
                  <span className="bg-thy-burgundy text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                </div>
                <Link href="/tailor-dashboard/new-requests" className="text-xs font-bold text-thy-burgundy hover:underline">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-thy-mist/70 rounded-2xl flex items-center justify-between gap-3 border border-thy-burgundy/10 hover:bg-thy-mist/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80"
                      alt="Anarkali Suit"
                      className="w-14 h-16 object-cover rounded-xl shrink-0 shadow-xs border border-thy-burgundy/15"
                    />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-extrabold text-thy-ink">#REQ-1024</p>
                      <p className="font-bold text-thy-ink">Aditi Sharma</p>
                      <p className="text-thy-muted text-[11px]">Anarkali Suit</p>
                      <p className="text-[10px] text-thy-subtle font-medium">Needed by 20 Sep 2026</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0">
                    <span className="bg-thy-mist text-thy-burgundy font-bold px-2 py-0.5 rounded-md text-[9px] inline-block">
                      New Request
                    </span>
                    <Link
                      href="/tailor-dashboard/new-requests"
                      className="px-3 py-1.5 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-active transition-colors block text-center shadow-2xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-thy-mist/70 rounded-2xl flex items-center justify-between gap-3 border border-thy-burgundy/10 hover:bg-thy-mist/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80"
                      alt="Blouse Design"
                      className="w-14 h-16 object-cover rounded-xl shrink-0 shadow-xs border border-thy-burgundy/15"
                    />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-extrabold text-thy-ink">#REQ-1025</p>
                      <p className="font-bold text-thy-ink">Meera Nair</p>
                      <p className="text-thy-muted text-[11px]">Blouse (Custom Design)</p>
                      <p className="text-[10px] text-thy-subtle font-medium">Needed by 15 Sep 2026</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0">
                    <span className="bg-thy-mist text-thy-burgundy font-bold px-2 py-0.5 rounded-md text-[9px] inline-block">
                      New Request
                    </span>
                    <Link
                      href="/tailor-dashboard/new-requests"
                      className="px-3 py-1.5 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-active transition-colors block text-center shadow-2xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-thy-mist/70 rounded-2xl flex items-center justify-between gap-3 border border-thy-burgundy/10 hover:bg-thy-mist/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=400&q=80"
                      alt="Kurta Set"
                      className="w-14 h-16 object-cover rounded-xl shrink-0 shadow-xs border border-thy-burgundy/15"
                    />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-extrabold text-thy-ink">#REQ-1026</p>
                      <p className="font-bold text-thy-ink">Rahul Verma</p>
                      <p className="text-thy-muted text-[11px]">Men's Kurta</p>
                      <p className="text-[10px] text-thy-subtle font-medium">Needed by 25 Sep 2026</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0">
                    <span className="bg-thy-mist text-thy-burgundy font-bold px-2 py-0.5 rounded-md text-[9px] inline-block">
                      New Request
                    </span>
                    <Link
                      href="/tailor-dashboard/new-requests"
                      className="px-3 py-1.5 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-active transition-colors block text-center shadow-2xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Orders */}
            <div className="thy-card p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-thy-ink">Active Orders</h2>
                  <span className="bg-thy-burgundy text-white text-[10px] font-bold px-2 py-0.5 rounded-full">5</span>
                </div>
                <Link href="/tailor-dashboard/active-orders" className="text-xs font-bold text-thy-burgundy hover:underline">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-thy-mist/70 rounded-2xl flex items-center justify-between gap-3 border border-thy-burgundy/10 hover:bg-thy-mist/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80"
                      alt="Lehenga"
                      className="w-14 h-16 object-cover rounded-xl shrink-0 shadow-xs border border-thy-burgundy/15"
                    />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-extrabold text-thy-ink">#ORD-1008</p>
                      <p className="font-bold text-thy-ink">Sneha Iyer</p>
                      <p className="text-thy-muted text-[11px]">Lehenga</p>
                      <p className="text-[10px] text-thy-subtle font-medium">Due by 18 Sep 2026</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0">
                    <span className="bg-thy-mist text-thy-burgundy font-bold px-2 py-0.5 rounded-md text-[9px] inline-block">
                      In Progress
                    </span>
                    <Link
                      href="/tailor-dashboard/active-orders"
                      className="px-3 py-1.5 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-active transition-colors block text-center shadow-2xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-thy-mist/70 rounded-2xl flex items-center justify-between gap-3 border border-thy-burgundy/10 hover:bg-thy-mist/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80"
                      alt="Frock"
                      className="w-14 h-16 object-cover rounded-xl shrink-0 shadow-xs border border-thy-burgundy/15"
                    />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-extrabold text-thy-ink">#ORD-1009</p>
                      <p className="font-bold text-thy-ink">Kavya Reddy</p>
                      <p className="text-thy-muted text-[11px]">Frock</p>
                      <p className="text-[10px] text-thy-subtle font-medium">Due by 22 Sep 2026</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0">
                    <span className="bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-md text-[9px] inline-block">
                      Fabric Received
                    </span>
                    <Link
                      href="/tailor-dashboard/active-orders"
                      className="px-3 py-1.5 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-active transition-colors block text-center shadow-2xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-thy-mist/70 rounded-2xl flex items-center justify-between gap-3 border border-thy-burgundy/10 hover:bg-thy-mist/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80"
                      alt="Sherwani"
                      className="w-14 h-16 object-cover rounded-xl shrink-0 shadow-xs border border-thy-burgundy/15"
                    />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-extrabold text-thy-ink">#ORD-1010</p>
                      <p className="font-bold text-thy-ink">Arjun Mehta</p>
                      <p className="text-thy-muted text-[11px]">Sherwani</p>
                      <p className="text-[10px] text-thy-subtle font-medium">Due by 30 Sep 2026</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0">
                    <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md text-[9px] inline-block">
                      Measurements Done
                    </span>
                    <Link
                      href="/tailor-dashboard/active-orders"
                      className="px-3 py-1.5 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-active transition-colors block text-center shadow-2xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Workshop Quick Spotlight Card */}
          <div 
            className="rounded-2xl border border-thy-mist/70 p-5 shadow-xs relative overflow-hidden bg-cover bg-center text-white"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(63, 18, 24, 0.92), rgba(92, 26, 36, 0.75)), url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80')`
            }}
          >
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="bg-thy-surface/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/30 uppercase tracking-wider">
                  Tailoring Tip
                </span>
                <h3 className="text-base font-bold mt-2">Fabric Quality & Precision Fitting</h3>
                <p className="text-xs text-thy-cream mt-1 max-w-xl font-medium leading-relaxed">
                  Always pre-wash or steam delicate fabrics prior to cutting patterns to prevent post-stitch shrinkage.
                </p>
              </div>
              <Link 
                href="/tailor-dashboard/portfolio" 
                className="px-4 py-2 bg-thy-surface text-thy-ink text-xs font-extrabold rounded-xl hover:bg-thy-mist transition-colors shadow-sm shrink-0"
              >
                Upload Work
              </Link>
            </div>
          </div>

          {/* Activity Feeds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="thy-card p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
                <h3 className="text-xs font-bold text-thy-ink">Recent Notifications</h3>
                <Link href="/tailor-dashboard/notifications" className="text-[11px] font-bold text-thy-burgundy hover:underline">
                  View All →
                </Link>
              </div>
              <div className="space-y-2.5 text-[11px]">
                <div className="flex justify-between text-thy-muted">
                  <span className="font-medium">• New order request from Aditi Sharma</span>
                  <span className="text-thy-subtle text-[10px]">2 hours ago</span>
                </div>
                <div className="flex justify-between text-thy-muted">
                  <span className="font-medium">• Customer responded to your quotation</span>
                  <span className="text-thy-subtle text-[10px]">5 hours ago</span>
                </div>
                <div className="flex justify-between text-thy-muted">
                  <span className="font-medium">• Order #ORD-1008 status updated</span>
                  <span className="text-thy-subtle text-[10px]">1 day ago</span>
                </div>
              </div>
            </div>

            <div className="thy-card p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
                <h3 className="text-xs font-bold text-thy-ink">Recent Messages</h3>
                <Link href="/tailor-dashboard/chat" className="text-[11px] font-bold text-thy-burgundy hover:underline">
                  View All →
                </Link>
              </div>
              <div className="space-y-3 text-[11px]">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Aditi Sharma"
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-thy-burgundy/15"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-thy-ink">Aditi Sharma</p>
                    <p className="text-thy-muted truncate">Hi, can we make sleeves a bit longer?</p>
                  </div>
                  <span className="text-thy-subtle text-[10px] shrink-0 font-medium">2 hours ago</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
                    alt="Kavya Reddy"
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-thy-burgundy/15"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-thy-ink">Kavya Reddy</p>
                    <p className="text-thy-muted truncate">Thank you! The fitting looks perfect.</p>
                  </div>
                  <span className="text-thy-subtle text-[10px] shrink-0 font-medium">1 day ago</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          <div className="thy-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-thy-ink">Your Availability</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-thy-ink">{isAvailable ? 'Available' : 'Busy'}</p>
                <p className="text-[10px] text-thy-subtle font-medium">
                  {isAvailable ? 'You are open to receive new order requests.' : 'Currently paused for new orders.'}
                </p>
              </div>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  isAvailable ? 'bg-thy-burgundy' : 'bg-thy-mist'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-thy-surface transition-transform shadow-xs ${
                    isAvailable ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden h-24 border border-thy-burgundy/10 shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
                alt="Boutique Studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-thy-deep/70 to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-bold text-white tracking-wide">
                  ✂ Studio Status: Active & Operational
                </span>
              </div>
            </div>

            <Link
              href="/tailor-dashboard/availability"
              className="block w-full text-center py-2.5 border border-thy-burgundy/15 rounded-xl text-xs font-bold text-thy-muted hover:bg-thy-mist/80 transition-colors"
            >
              Manage Availability →
            </Link>
          </div>

          <div className="thy-card p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
              <h3 className="text-xs font-bold text-thy-ink">Earnings & Reports</h3>
              <Link href="/tailor-dashboard/earnings" className="text-[11px] font-bold text-thy-burgundy hover:underline">
                View Reports →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div>
                <p className="text-sm font-black text-thy-ink">₹ 18,600</p>
                <p className="text-[10px] text-thy-subtle font-medium">Total Earnings This Month</p>
              </div>
              <div>
                <p className="text-sm font-black text-thy-ink">12</p>
                <p className="text-[10px] text-thy-subtle font-medium">Completed Orders This Month</p>
              </div>
              <div>
                <p className="text-sm font-black text-thy-ink">₹ 1,550</p>
                <p className="text-[10px] text-thy-subtle font-medium">Avg. Order Value</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden h-24 border border-thy-burgundy/10 shadow-2xs mt-2">
              <img
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
                alt="Revenue Analytics"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-thy-deep/70 to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-bold text-white tracking-wide">
                  📈 Monthly Growth: +18% vs Last Month
                </span>
              </div>
            </div>
          </div>

          <div className="thy-card p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
              <h3 className="text-xs font-bold text-thy-ink">Your Portfolio</h3>
              <Link href="/tailor-dashboard/portfolio" className="text-[11px] font-bold text-thy-burgundy hover:underline">
                View Portfolio →
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-2 pt-1">
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80"
                alt="Blouse Work"
                className="w-full h-16 object-cover rounded-xl border border-thy-burgundy/10 shadow-2xs hover:opacity-90 transition-opacity"
              />
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80"
                alt="Suit Design"
                className="w-full h-16 object-cover rounded-xl border border-thy-burgundy/10 shadow-2xs hover:opacity-90 transition-opacity"
              />
              <img
                src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=300&q=80"
                alt="Kurta Outfit"
                className="w-full h-16 object-cover rounded-xl border border-thy-burgundy/10 shadow-2xs hover:opacity-90 transition-opacity"
              />
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80"
                alt="Ethnic Dress"
                className="w-full h-16 object-cover rounded-xl border border-thy-burgundy/10 shadow-2xs hover:opacity-90 transition-opacity"
              />
              <img
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&q=80"
                alt="Frock Design"
                className="w-full h-16 object-cover rounded-xl border border-thy-burgundy/10 shadow-2xs hover:opacity-90 transition-opacity"
              />
            </div>
          </div>

        </div>

      </div>
      </div>
    </TailorPage>
  );
}