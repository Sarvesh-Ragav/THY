'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  X,
  FileText,
  AlertCircle,
  Package,
} from 'lucide-react';
import { useAppearance } from '@/components/providers/AppearanceProvider';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  fabric: string;
}

interface TimelineStep {
  title: string;
  time: string;
  completed: boolean;
  active?: boolean;
}

interface Order {
  id: string;
  boutique: string;
  rating: number;
  location: string;
  status: 'In Progress' | 'Completed' | 'Cancelled';
  currentStageText: string;
  date: string;
  total: number;
  paymentMode: string;
  deliveryAddress: string;
  items: OrderItem[];
  timeline: TimelineStep[];
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'THY-89241',
    boutique: 'Royal Stitch Atelier',
    rating: 4.9,
    location: 'T. Nagar, Chennai',
    status: 'In Progress',
    currentStageText: 'Cutting & stitching',
    date: '14 Sep 2026, 10:30 AM',
    total: 11900,
    paymentMode: 'UPI / GPay (Paid)',
    deliveryAddress: 'Flat 4B, Ceebros Apartments, Adyar, Chennai - 600020',
    items: [
      { name: 'Custom 3-Piece Tuxedo Blazer', qty: 1, price: 8500, fabric: 'Italian Navy Wool' },
      { name: 'Slim Fit Formal Trousers', qty: 2, price: 3400, fabric: 'Premium Cotton Twill' },
    ],
    timeline: [
      { title: 'Order confirmed', time: '14 Sep, 10:30 AM', completed: true },
      { title: 'Fabric picked up', time: '14 Sep, 03:15 PM', completed: true },
      { title: 'Measurements verified', time: '15 Sep, 11:00 AM', completed: true },
      { title: 'Cutting & stitching', time: 'In progress', completed: false, active: true },
      { title: 'Quality check & ironing', time: 'Pending', completed: false },
      { title: 'Delivered to doorstep', time: 'Estimated 19 Sep', completed: false },
    ],
  },
  {
    id: 'THY-87102',
    boutique: 'Vogue Custom Design Studio',
    rating: 4.8,
    location: 'Nungambakkam, Chennai',
    status: 'Completed',
    currentStageText: 'Delivered 11 Sep 2026',
    date: '06 Sep 2026, 02:20 PM',
    total: 4200,
    paymentMode: 'Credit Card (Paid)',
    deliveryAddress: 'Flat 4B, Ceebros Apartments, Adyar, Chennai - 600020',
    items: [
      { name: 'Silk Embroidered Anarkali Kurti', qty: 1, price: 4200, fabric: 'Pure Kanchipuram Silk with Zari' },
    ],
    timeline: [
      { title: 'Order confirmed', time: '06 Sep, 02:20 PM', completed: true },
      { title: 'Fabric picked up', time: '06 Sep, 05:00 PM', completed: true },
      { title: 'Measurements verified', time: '07 Sep, 10:00 AM', completed: true },
      { title: 'Cutting & stitching', time: '09 Sep, 01:00 PM', completed: true },
      { title: 'Quality check & ironing', time: '10 Sep, 04:00 PM', completed: true },
      { title: 'Delivered to doorstep', time: '11 Sep, 01:30 PM', completed: true },
    ],
  },
  {
    id: 'THY-85409',
    boutique: 'Thread & Tailor Co.',
    rating: 4.7,
    location: 'Velachery, Chennai',
    status: 'Cancelled',
    currentStageText: 'Cancelled by you',
    date: '01 Sep 2026, 09:15 AM',
    total: 2800,
    paymentMode: 'Refunded via UPI',
    deliveryAddress: 'Flat 4B, Ceebros Apartments, Adyar, Chennai - 600020',
    items: [{ name: 'Mandarin Collar Nehru Jacket', qty: 1, price: 2800, fabric: 'Raw Khadi Silk' }],
    timeline: [
      { title: 'Order confirmed', time: '01 Sep, 09:15 AM', completed: true },
      { title: 'Order cancelled', time: '01 Sep, 10:00 AM', completed: false, active: true },
    ],
  },
];

const ghostBtn =
  'inline-flex items-center justify-center min-h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] border border-thy-burgundy/20 bg-thy-cream text-thy-ink transition-colors hover:border-thy-burgundy/40 hover:text-thy-burgundy cursor-pointer';

function statusClass(status: Order['status']) {
  if (status === 'In Progress') return 'border-amber-300/70 bg-amber-50 text-amber-900';
  if (status === 'Completed') return 'border-thy-burgundy/20 bg-thy-mist text-thy-ink';
  return 'border-rose-200 bg-rose-50 text-rose-800';
}

export default function MyOrdersPage() {
  const { t } = useAppearance();
  const [orders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [selectedOrderTracking, setSelectedOrderTracking] = useState<Order | null>(null);

  const tabs = [
    { id: 'All', count: orders.length },
    { id: 'In Progress', count: orders.filter((o) => o.status === 'In Progress').length },
    { id: 'Completed', count: orders.filter((o) => o.status === 'Completed').length },
    { id: 'Cancelled', count: orders.filter((o) => o.status === 'Cancelled').length },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const needle = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(needle) ||
      order.boutique.toLowerCase().includes(needle) ||
      order.items.some(
        (item) => item.name.toLowerCase().includes(needle) || item.fabric.toLowerCase().includes(needle)
      );
    return matchesTab && matchesSearch;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">{t('ordersKicker')}</p>
      <h1
        className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        {t('ordersTitle')}
      </h1>
      <p className="mt-3 max-w-xl text-sm text-thy-muted">
        {t('ordersSub')}
      </p>
      <div className="thy-divider-glow mt-4 max-w-md" />

      <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-thy-subtle" />
          <input
            type="text"
            placeholder={t('ordersSearch')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="thy-input !pl-11"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto thy-scroll-x">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap border transition-colors ${
                  active
                    ? 'bg-thy-burgundy text-white border-thy-burgundy'
                    : 'border-thy-burgundy/20 bg-thy-cream text-thy-ink hover:border-thy-burgundy/40'
                }`}
              >
                {tab.id} · {tab.count}
              </button>
            );
          })}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="thy-card mt-8 p-10 text-center max-w-lg mx-auto space-y-3">
          <Package className="w-8 h-8 mx-auto text-thy-burgundy" />
          <h2 className="text-2xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {t('ordersEmpty')}
          </h2>
          <p className="text-sm text-thy-muted">{t('ordersEmptySub')}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button type="button" className={ghostBtn} onClick={() => { setActiveTab('All'); setSearchQuery(''); }}>
              Reset filters
            </button>
            <Link href="/stitch-your-outfit" className="hero-leather-btn inline-flex px-6 py-3 text-[11px] uppercase tracking-[0.16em]">
              Stitch an outfit
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {filteredOrders.map((order) => (
            <li key={order.id} className="thy-card p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-thy-burgundy/10">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                      {order.boutique}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-thy-ink">
                      <Star className="w-3 h-3 fill-current" />
                      {order.rating}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-thy-muted flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {order.location}
                    </span>
                    <span className="font-mono">{order.id}</span>
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] border ${statusClass(order.status)}`}>
                  {order.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {order.status === 'Cancelled' && <AlertCircle className="w-3.5 h-3.5" />}
                  {order.currentStageText}
                </span>
              </div>

              <div className="py-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.name} className="flex items-start justify-between gap-4 text-sm">
                    <div>
                      <p className="font-medium text-thy-ink">
                        {item.qty}× {item.name}
                      </p>
                      <p className="text-xs text-thy-muted mt-0.5">{item.fabric}</p>
                    </div>
                    <p className="font-semibold text-thy-ink shrink-0">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-thy-burgundy/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-thy-muted flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {order.date}
                  <span className="text-thy-ink font-semibold">₹{order.total.toLocaleString('en-IN')}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={ghostBtn} onClick={() => setSelectedOrderDetails(order)}>
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Details
                  </button>
                  {order.status !== 'Cancelled' && (
                    <button
                      type="button"
                      className="hero-leather-btn inline-flex min-h-10 px-4 text-[11px] uppercase tracking-[0.14em]"
                      onClick={() => setSelectedOrderTracking(order)}
                    >
                      <Truck className="w-3.5 h-3.5 mr-1.5" />
                      Track
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedOrderTracking && (
        <div className="fixed inset-0 z-50 bg-thy-deep/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="thy-card max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedOrderTracking(null)}
              className="absolute top-4 right-4 w-9 h-9 border border-thy-burgundy/20 text-thy-ink hover:border-thy-burgundy/40 inline-flex items-center justify-center"
              aria-label="Close tracker"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-[11px] uppercase tracking-[0.18em] text-thy-burgundy font-semibold">Progress</p>
            <h3 className="mt-1 text-2xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              Stitching tracker
            </h3>
            <p className="text-xs text-thy-muted mt-1 font-mono">
              {selectedOrderTracking.id} · {selectedOrderTracking.boutique}
            </p>

            <div className="relative mt-6 pl-6 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-thy-burgundy/15">
              {selectedOrderTracking.timeline.map((step, idx) => (
                <div key={step.title} className="relative">
                  <div
                    className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-thy-surface ${
                      step.completed
                        ? 'bg-thy-burgundy text-white'
                        : step.active
                          ? 'bg-amber-500 text-white'
                          : 'bg-thy-mist text-thy-subtle'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <p className={`text-sm font-semibold ${step.completed || step.active ? 'text-thy-ink' : 'text-thy-subtle'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-thy-muted mt-0.5">{step.time}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-thy-mist/70 border border-thy-burgundy/10 p-4 text-xs text-thy-muted">
              <p className="font-semibold text-thy-ink">Estimated doorstep delivery</p>
              <p className="mt-0.5">Friday, 19 Sep 2026 · evening slot</p>
            </div>
            <button type="button" className={`${ghostBtn} w-full mt-5`} onClick={() => setSelectedOrderTracking(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-thy-deep/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="thy-card max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 w-9 h-9 border border-thy-burgundy/20 text-thy-ink hover:border-thy-burgundy/40 inline-flex items-center justify-center"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-[11px] uppercase tracking-[0.18em] text-thy-burgundy font-semibold">Summary</p>
            <h3 className="mt-1 text-2xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              Order details
            </h3>
            <p className="text-xs text-thy-muted mt-1 font-mono">{selectedOrderDetails.id}</p>

            <dl className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-thy-muted">Atelier</dt>
                <dd className="font-semibold text-thy-ink text-right">{selectedOrderDetails.boutique}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-thy-muted">Payment</dt>
                <dd className="font-semibold text-thy-ink text-right">{selectedOrderDetails.paymentMode}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-thy-muted">Deliver to</dt>
                <dd className="font-semibold text-thy-ink text-right max-w-[240px]">{selectedOrderDetails.deliveryAddress}</dd>
              </div>
            </dl>

            <div className="mt-5 border border-thy-burgundy/15">
              <div className="bg-thy-mist/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-thy-muted flex justify-between">
                <span>Garment</span>
                <span>Amount</span>
              </div>
              <div className="divide-y divide-thy-burgundy/10 text-xs">
                {selectedOrderDetails.items.map((item) => (
                  <div key={item.name} className="p-4 flex justify-between gap-4">
                    <div>
                      <p className="font-semibold text-thy-ink">
                        {item.qty}× {item.name}
                      </p>
                      <p className="text-thy-muted mt-0.5">{item.fabric}</p>
                    </div>
                    <p className="font-semibold text-thy-ink">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="bg-thy-mist/40 px-4 py-3 border-t border-thy-burgundy/15 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="text-thy-burgundy">₹{selectedOrderDetails.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button type="button" className={`${ghostBtn} w-full mt-5`} onClick={() => setSelectedOrderDetails(null)}>
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
