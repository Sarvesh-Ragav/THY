'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  AdminApiError,
  listAdminOrders,
  updateAdminOrderFulfillment,
  type AdminOrder,
} from '@/lib/admin-api';

const STATUSES: AdminOrder['fulfillmentStatus'][] = ['pending', 'in_progress', 'completed', 'cancelled'];

function formatAmount(paise: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);
}

export default function AdminOrdersPage() {
  const { accessToken } = useTailorSession();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await listAdminOrders(accessToken);
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Unable to load orders.');
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">Fulfillment</p>
      <h1 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Update delivery status
      </h1>
      <p className="mt-2 text-sm text-thy-muted">Track paid orders and move them through delivery stages.</p>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      <div className="mt-6 space-y-3">
        {orders.length === 0 ? (
          <p className="text-sm text-thy-muted">No Mongo orders yet. Paid checkout orders will appear here.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="thy-card p-4 sm:p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {order.garmentName}
                  </h2>
                  <p className="text-sm text-thy-muted">
                    {order.tailorName} · {formatAmount(order.amountPaise)} · Payment {order.paymentStatus}
                  </p>
                  {order.deliveryAddress ? (
                    <p className="text-xs text-thy-subtle mt-1">
                      {[order.deliveryAddress.addressLine, order.deliveryAddress.city].filter(Boolean).join(', ')}
                    </p>
                  ) : null}
                </div>
                <label className="text-xs uppercase tracking-[0.12em] text-thy-subtle">
                  Delivery status
                  <select
                    className="mt-1.5 block min-w-[12rem] border border-thy-burgundy/20 bg-thy-cream px-3 py-2 text-sm text-thy-ink"
                    value={order.fulfillmentStatus}
                    disabled={busyId === order.id || !accessToken}
                    onChange={async (event) => {
                      if (!accessToken) return;
                      const next = event.target.value as AdminOrder['fulfillmentStatus'];
                      setBusyId(order.id);
                      try {
                        await updateAdminOrderFulfillment(accessToken, order.id, next);
                        await load();
                      } catch (err) {
                        setError(err instanceof AdminApiError ? err.message : 'Unable to update status.');
                      } finally {
                        setBusyId(null);
                      }
                    }}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
