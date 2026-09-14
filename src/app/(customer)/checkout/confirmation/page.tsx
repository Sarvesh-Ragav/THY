'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { formatPaise, getOrder } from '@/lib/payment-api';
import type { PersistedOrder } from '@/types/payment';

export default function CheckoutConfirmationPage() { return <RequireCustomerAuth><Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}><Confirmation /></Suspense></RequireCustomerAuth>; }
function Confirmation() {
  const searchParams = useSearchParams(); const { accessToken } = useTailorSession(); const [order, setOrder] = useState<PersistedOrder | null>(null); const [error, setError] = useState<string | null>(null);
  useEffect(() => { const id = searchParams.get('order'); if (!accessToken || !id) return; void getOrder(accessToken, id).then(({ order: saved }) => setOrder(saved)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load order.')); }, [accessToken, searchParams]);
  return <main className="max-w-xl mx-auto px-4 py-10 space-y-5">
    <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Order confirmation</p>
    <h1 className="text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{order?.paymentStatus === 'paid' ? 'Order placed' : 'Payment pending'}</h1>
    <section className="thy-card p-6 space-y-2">{error && <p className="text-sm text-red-700">{error}</p>}{!order && !error && <p className="text-sm text-thy-muted">Loading your order...</p>}<p className="text-sm text-thy-subtle">{order?.id}</p><p className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{order?.garmentName}</p><p className="text-sm text-thy-muted">{order?.tailorName} · {order && formatPaise(order.amountPaise)}</p><p className="text-sm">Payment: {order?.paymentStatus ?? 'pending'} · Fulfillment: {order?.fulfillmentStatus ?? 'pending'}</p></section>
    <Link href="/my-orders" className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em]">My orders</Link>
  </main>;
}
