'use client';

import React, { useEffect, useState } from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { formatPaise, getOrders } from '@/lib/payment-api';
import type { PersistedOrder } from '@/types/payment';

export default function MyOrdersPage() { return <RequireCustomerAuth><MyOrdersContent /></RequireCustomerAuth>; }
function MyOrdersContent() {
  const { accessToken } = useTailorSession(); const [orders, setOrders] = useState<PersistedOrder[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (!accessToken) return; void getOrders(accessToken).then(({ orders: saved }) => setOrders(saved)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load orders.')).finally(() => setLoading(false)); }, [accessToken]);
  return <CustomerPage title="My Orders">{error ? <p className="text-sm text-red-700">{error}</p> : loading ? <p className="text-sm text-thy-muted">Loading orders...</p> : orders.length === 0 ? <p className="text-sm text-thy-muted">No orders yet.</p> : <ul className="space-y-3">{orders.map((order) => <li key={order.id} className="thy-card p-4"><p>{order.garmentName}</p><p className="text-sm text-thy-subtle">Payment: {order.paymentStatus} · Fulfillment: {order.fulfillmentStatus}</p><p className="text-xs text-thy-muted">{order.tailorName} · {formatPaise(order.amountPaise)}</p></li>)}</ul>}</CustomerPage>;
}
