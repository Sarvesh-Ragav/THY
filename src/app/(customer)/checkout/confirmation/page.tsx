'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useC31 } from '@/hooks/useC31';
import { chatHref } from '@/lib/c31';

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
  const { state } = useC31();
  const order = state.orders.find((item) => item.id === searchParams.get('order')) ?? state.orders[0];
  const thread = state.threads.find((item) => item.id === order?.threadId);

  return (
    <main className="max-w-xl mx-auto px-4 py-10 space-y-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Order confirmation</p>
      <h1 className="text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Order placed
      </h1>
      <section className="thy-card p-6 space-y-2">
        <p className="text-sm text-thy-subtle">{order?.id}</p>
        <p className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          {order?.title}
        </p>
        <p className="text-sm text-thy-muted">{order?.tailorName} · ₹{order?.price}</p>
        <p className="text-sm">{order?.status}</p>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/my-orders" className="hero-leather-btn inline-flex items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em]">
          My orders
        </Link>
        {thread && (
          <Link
            href={chatHref(thread.tailorId, 'order')}
            className="inline-flex items-center justify-center min-h-12 border border-thy-ink/15 text-sm"
          >
            Chat about this order
          </Link>
        )}
      </div>
    </main>
  );
}
