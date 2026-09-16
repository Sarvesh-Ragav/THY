'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useC31 } from '@/hooks/useC31';
import { chatHref, findThread } from '@/lib/c31';

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-sm border border-thy-ink/15 bg-thy-surface text-thy-ink';

export default function EstimateDetailsPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<div className="p-8 text-sm text-thy-subtle" suppressHydrationWarning>Loading estimate...</div>}>
        <EstimateDetails />
      </Suspense>
    </RequireCustomerAuth>
  );
}

function EstimateDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, ready, save } = useC31();
  const thread = findThread(state, searchParams.get('thread'));

  if (!ready) return <div className="p-8 text-sm text-thy-subtle" suppressHydrationWarning>Loading...</div>;
  const quotation = thread?.quotation;
  if (!thread || !quotation) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <h1 className="text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          Estimate details
        </h1>
        <p className="text-sm text-thy-muted">No fixed price yet. Chat with a tailor first.</p>
        <Link href="/tailors" className="hero-leather-btn inline-flex min-h-12 px-5 items-center text-[11px] uppercase tracking-[0.16em]">
          Find a tailor
        </Link>
      </main>
    );
  }

  const addToCart = () => {
    if (state.cart.some((item) => item.quotationId === quotation.id)) {
      router.push('/stitch-your-outfit/cart');
      return;
    }
    save({
      ...state,
      cart: [
        {
          id: `cart-${Date.now()}`,
          quotationId: quotation.id,
          threadId: thread.id,
          tailorName: thread.tailorName,
          garment: thread.request?.garment || 'Custom outfit',
          price: quotation.price,
        },
        ...state.cart,
      ],
    });
    router.push('/stitch-your-outfit/cart');
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Complete quotation</p>
      <h1 className="text-4xl leading-[0.95]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Estimate details
      </h1>

      <section className="thy-card p-6 space-y-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle">Price fixed</p>
        <p className="text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          ₹{quotation.price}
        </p>
        <p className="text-sm text-thy-muted">{quotation.note}</p>
        <p className="text-xs text-thy-subtle">Sent {quotation.sentAt} · {thread.tailorName}</p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-thy-subtle">Garment</dt>
            <dd>{thread.request?.garment || 'Custom outfit'}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-thy-subtle">Fabric</dt>
            <dd>{thread.request?.fabric || 'As discussed'}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-thy-subtle">Measurements</dt>
            <dd>{thread.request?.measurements || 'Saved set'}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-thy-subtle">Stitching</dt>
            <dd>{thread.request?.stitching || 'Custom'}</dd>
          </div>
        </dl>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button type="button" onClick={addToCart} className={ghostBtn}>
          Add to cart
        </button>
        <Link
          href={`/checkout/address?thread=${encodeURIComponent(thread.id)}`}
          className="hero-leather-btn inline-flex items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em]"
        >
          Buy now
        </Link>
      </div>
      <Link href={chatHref(thread.tailorId, 'estimate')} className="inline-flex text-sm text-thy-brand border-b border-thy-brand">
        Back to chat
      </Link>
    </main>
  );
}
