'use client';

import React, { Suspense, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useC31 } from '@/hooks/useC31';
import { findThread } from '@/lib/c31';
import { createPaymentOrder, formatPaise, loadRazorpayCheckout, quoteToPaise, verifyPayment } from '@/lib/payment-api';

export default function CheckoutPaymentPage() {
  return <RequireCustomerAuth><Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}><PaymentStep /></Suspense></RequireCustomerAuth>;
}

function PaymentStep() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session, accessToken } = useTailorSession();
  const { state } = useC31();
  const thread = findThread(state, searchParams.get('thread'));
  const [status, setStatus] = useState<'idle' | 'opening' | 'verifying' | 'failed' | 'cancelled'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const checkoutKeyRef = useRef<string | null>(null);
  const amountPaise = quoteToPaise(thread?.quotation?.price);

  const pay = async () => {
    if (!accessToken) { setStatus('failed'); setMessage('Your session has expired. Please log in again.'); return; }
    if (!thread || !amountPaise || !state.checkoutAddress) { setStatus('failed'); setMessage('A fixed quotation and delivery address are required before payment.'); return; }
    setStatus('opening'); setMessage(null);
    try {
      const checkoutKey = checkoutKeyRef.current ?? crypto.randomUUID();
      checkoutKeyRef.current = checkoutKey;
      const { order, checkout } = await createPaymentOrder(accessToken, { checkoutKey, sourceThreadId: thread.id, tailorName: thread.tailorName, garmentName: thread.request?.garment || 'Custom outfit', deliveryAddress: state.checkoutAddress, amountPaise });
      await loadRazorpayCheckout();
      if (!window.Razorpay) throw new Error('Razorpay Checkout did not load.');
      new window.Razorpay({
        key: checkout.keyId, amount: checkout.amountPaise, currency: checkout.currency, name: 'THY', description: order.garmentName, order_id: checkout.razorpayOrderId,
        prefill: { contact: session.identifier, email: session.customerProfile?.email, name: session.customerProfile?.fullName }, theme: { color: '#3F1218' },
        modal: { ondismiss: () => { setStatus('cancelled'); setMessage('Payment was cancelled. Your order remains pending and has not been marked paid.'); } },
        handler: async (response) => { setStatus('verifying'); try { const verified = await verifyPayment(accessToken, order.id, response); router.push(`/checkout/confirmation?order=${encodeURIComponent(verified.order.id)}`); } catch (error) { setStatus('failed'); setMessage(error instanceof Error ? error.message : 'Payment could not be verified. Your order remains pending.'); } },
      }).open();
    } catch (error) { setStatus('failed'); setMessage(error instanceof Error ? error.message : 'Unable to start payment.'); }
  };

  return <main className="max-w-xl mx-auto px-4 py-10 space-y-5">
    <p className="text-[11px] uppercase tracking-[0.2em] text-thy-brand font-semibold">Payment</p>
    <h1 className="text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Pay {formatPaise(amountPaise ?? 0)}</h1>
    <div className="thy-card p-5 space-y-3 text-sm"><p>UPI · Card · Net banking</p><p className="text-thy-muted">The final payment is verified securely by THY before the order is marked paid.</p></div>
    {message && <p className={status === 'failed' ? 'text-sm text-red-700' : 'text-sm text-thy-muted'}>{message}</p>}
    <button type="button" disabled={status === 'opening' || status === 'verifying'} onClick={() => void pay()} className="hero-leather-btn w-full min-h-12 text-[11px] uppercase tracking-[0.16em] disabled:opacity-60">{status === 'opening' ? 'Opening secure payment...' : status === 'verifying' ? 'Verifying payment...' : 'Pay securely'}</button>
  </main>;
}
