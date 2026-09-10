'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { OrderStatus, TailorActiveOrder } from '@/lib/tailor-session';

export default function ActiveOrdersPage() {
  const { session, updateSession } = useTailorSession();
  const [selectedOrder, setSelectedOrder] = useState<TailorActiveOrder | null>(null);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const nextOrders = session.orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    updateSession({ orders: nextOrders });
    setSelectedOrder((current) =>
      current?.id === orderId ? { ...current, status: newStatus } : current
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-thy-ink">Active Orders</h1>
          <p className="text-sm text-thy-muted">Track and manage current tailoring jobs from cutting to final delivery.</p>
        </div>
        <Link
          href="/tailor-dashboard"
          className="text-sm font-semibold text-thy-brand hover:underline self-start"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="space-y-4">
        {session.orders.map((order) => (
          <div key={order.id} className="bg-thy-surface p-5 sm:p-6 rounded-2xl shadow-sm border border-thy-ink/10 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-thy-subtle">{order.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  order.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : order.status === 'Fitting Scheduled'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-thy-mist text-thy-deep border border-thy-brand/25'
                }`}>
                  {order.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-thy-ink">{order.garmentType}</h3>
              <p className="text-xs text-thy-muted">
                Customer: <span className="font-semibold text-thy-ink">{order.customerName}</span> | Fabric: {order.fabricDetails}
              </p>
              <p className="text-xs text-thy-muted">
                📅 Target Delivery: <span className="font-medium text-thy-ink">{order.expectedCompletion}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setSelectedOrder(order)}
                className="px-4 py-3 sm:py-2 bg-thy-mist text-thy-ink rounded-xl text-xs font-semibold hover:bg-thy-mist transition-colors min-h-11"
              >
                View Details
              </button>

              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                className="px-3 py-3 sm:py-2 border rounded-xl text-xs font-semibold text-thy-ink focus:outline-none focus:ring-2 focus:ring-thy-brand min-h-11"
              >
                <option value="In Progress">In Progress</option>
                <option value="Fitting Scheduled">Fitting Scheduled</option>
                <option value="Ready to Stitch/Deliver">Ready for Delivery</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-thy-surface rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl space-y-4 max-h-[90dvh] overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-thy-ink text-lg">Order Details - {selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-thy-subtle hover:text-thy-muted font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-thy-ink">
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Garment:</strong> {selectedOrder.garmentType}</p>
              <p><strong>Fabric:</strong> {selectedOrder.fabricDetails}</p>
              <p><strong>Measurements:</strong> {selectedOrder.measurements}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Expected Date:</strong> {selectedOrder.expectedCompletion}</p>
            </div>

            <div className="pt-3 border-t text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-thy-brand text-white rounded-xl text-xs font-semibold hover:bg-thy-brand-hover"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
