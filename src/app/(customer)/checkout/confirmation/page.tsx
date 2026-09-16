'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { formatPaise, getOrder } from '@/lib/payment-api';
import { placeCustomerWorkspaceOrder } from '@/lib/notifications';
import type { PersistedOrder } from '@/types/payment';

export default function CheckoutConfirmationPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}>
        <Confirmation />
      </Suspense>
    </RequireCustomerAuth>
  );
}

function Confirmation() {
  const searchParams = useSearchParams();
  const { accessToken, updateSession } = useTailorSession();
  const [order, setOrder] = useState<PersistedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('order');
    if (!accessToken || !id) return;
    void getOrder(accessToken, id)
      .then(({ order: saved }) => {
        setOrder(saved);
        if (saved.paymentStatus === 'paid') {
          updateSession((current) => {
            if (current.customerOrders.some((item) => item.id === saved.id)) return {};
            return placeCustomerWorkspaceOrder(current, {
              title: saved.garmentName,
              tailorName: saved.tailorName,
              total: Math.round(saved.amountPaise / 100),
              paymentMode: 'Paid',
              deliveryAddress: current.customerProfile?.address || '',
              fabric: saved.garmentName,
            });
          });
        }
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load order.'));
  }, [accessToken, searchParams, updateSession]);

  const paid = order?.paymentStatus === 'paid';

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">Order confirmation</p>
      <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        {paid ? 'Order placed' : 'Payment pending'}
      </h1>
      <p className="mt-3 text-sm text-thy-muted">
        {paid ? 'Your stitch is confirmed. Track it from My Orders.' : 'Complete payment to confirm this order with the atelier.'}
      </p>
      <div className="thy-divider-glow mt-4 max-w-md" />

      <section className="thy-card p-6 mt-8 space-y-2">
        {error && <p className="text-sm text-rose-700">{error}</p>}
        {!order && !error && <p className="text-sm text-thy-muted">Loading your order...</p>}
        {order && (
          <>
            <p className="text-xs font-mono text-thy-subtle">{order.id}</p>
            <p className="text-2xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {order.garmentName}
            </p>
            <p className="text-sm text-thy-muted">
              {order.tailorName} · {formatPaise(order.amountPaise)}
            </p>
            <p className="text-sm pt-2 border-t border-thy-burgundy/10">
              Payment: {order.paymentStatus} · Fulfillment: {order.fulfillmentStatus}
            </p>
          </>
        )}
      </section>

      <Link
        href="/my-orders"
        className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 mt-6 text-[11px] uppercase tracking-[0.16em]"
      >
        My orders
      </Link>
    </main>
  );
}
