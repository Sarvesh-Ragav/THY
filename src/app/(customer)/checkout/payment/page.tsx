'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useC31 } from '@/hooks/useC31';
import { findThread } from '@/lib/c31';

export default function CheckoutPaymentPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}>
        <PaymentStep />
      </Suspense>
    </RequireCustomerAuth>
  );
}

function PaymentStep() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session, updateSession } = useTailorSession();
  const { state, save } = useC31();
  const thread = findThread(state, searchParams.get('thread'));

  const pay = () => {
    const id = `ORD-${Date.now().toString().slice(-6)}`;
    save({
      ...state,
      cart: state.cart.filter((item) => item.threadId !== thread?.id),
      orders: [
        {
          id,
          title: thread?.request?.garment || 'Custom outfit',
          status: 'Paid · In progress',
          tailorName: thread?.tailorName || 'Tailor',
          price: thread?.quotation?.price,
          threadId: thread?.id || '',
        },
        ...state.orders,
      ],
    });
    updateSession({
      customerOrders: [
        { id, title: thread?.request?.garment || 'Custom outfit', status: 'Paid · In progress' },
        ...session.customerOrders,
      ],
    });
    router.push(`/checkout/confirmation?order=${encodeURIComponent(id)}`);
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-10 space-y-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Payment</p>
      <h1 className="text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Pay ₹{thread?.quotation?.price || '0'}
      </h1>
      <div className="thy-card p-5 space-y-3 text-sm">
        <p>UPI · Card · Net banking (studio preview)</p>
        <p className="text-thy-muted">This confirms the fixed-price quotation. No live gateway is connected.</p>
      </div>
      <button type="button" onClick={pay} className="hero-leather-btn w-full min-h-12 text-[11px] uppercase tracking-[0.16em]">
        Confirm payment
      </button>
    </main>
  );
}
