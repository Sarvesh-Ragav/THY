'use client';

import React, { Suspense, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useC31 } from '@/hooks/useC31';
import { findThread } from '@/lib/c31';
import { createPaymentOrder, formatPaise, loadRazorpayCheckout, quoteToPaise, verifyPayment } from '@/lib/payment-api';

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
  const { session, accessToken } = useTailorSession();
  const { state } = useC31();
  const threadParam = searchParams.get('thread') || '';
  const thread = findThread(state, threadParam);
  const [status, setStatus] = useState<'idle' | 'opening' | 'verifying' | 'failed' | 'cancelled'>('idle');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [message, setMessage] = useState<string | null>(null);
  const checkoutKeyRef = useRef<string | null>(null);
  const amountPaise = quoteToPaise(thread?.quotation?.price);

  const pay = async () => {
    if (!accessToken) {
      setStatus('failed');
      setMessage('Your session has expired. Please log in again.');
      return;
    }
    if (!thread || !amountPaise || !state.checkoutAddress) {
      setStatus('failed');
      setMessage('A fixed quotation and delivery address are required before payment.');
      return;
    }
    setStatus('opening');
    setMessage(null);
    try {
      const checkoutKey = checkoutKeyRef.current ?? crypto.randomUUID();
      checkoutKeyRef.current = checkoutKey;
      const { order, checkout } = await createPaymentOrder(accessToken, {
        checkoutKey,
        sourceThreadId: thread.id,
        tailorName: thread.tailorName,
        garmentName: thread.request?.garment || 'Custom outfit',
        deliveryAddress: state.checkoutAddress,
        amountPaise,
      });
      await loadRazorpayCheckout();
      if (!window.Razorpay) throw new Error('Razorpay Checkout did not load.');

      new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amountPaise,
        currency: checkout.currency,
        name: 'THY',
        description: order.garmentName,
        order_id: checkout.razorpayOrderId,
        prefill: {
          contact: session.customerProfile?.phone || session.identifier,
          email: session.customerProfile?.email || (session.identifier.includes('@') ? session.identifier : undefined),
          name: session.customerProfile?.fullName,
        },
        theme: { color: '#5C1A24' },
        modal: {
          ondismiss: () => {
            setStatus('cancelled');
            setMessage('Payment was cancelled. Your order remains pending and has not been marked paid.');
          },
        },
        handler: async (response) => {
          setStatus('verifying');
          try {
            const verified = await verifyPayment(accessToken, order.id, response);
            router.push(`/checkout/confirmation?order=${encodeURIComponent(verified.order.id)}`);
          } catch (error) {
            setStatus('failed');
            setMessage(error instanceof Error ? error.message : 'Payment could not be verified. Your order remains pending.');
          }
        },
      }).open();
    } catch (error) {
      setStatus('failed');
      setMessage(error instanceof Error ? error.message : 'Unable to start payment.');
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">Payment</p>
      <h1
        className="mt-2 text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        Pay {formatPaise(amountPaise ?? 0)}
      </h1>
      <p className="mt-3 text-sm text-thy-muted">
        UPI, card, or net banking. THY verifies the payment before the order is marked paid.
      </p>
      <div className="thy-divider-glow mt-4 max-w-md" />

      <div className="thy-card p-5 sm:p-6 mt-8 space-y-3 text-sm">
        <p className="text-thy-ink font-medium">{thread?.request?.garment || 'Custom outfit'}</p>
        <p className="text-thy-muted">{thread?.tailorName}</p>
        <p className="text-thy-muted">Deliver to: {state.checkoutAddress || 'Add an address first'}</p>
      </div>

      <div className="thy-card p-5 sm:p-6 mt-4 space-y-2">
        {(
          [
            { id: 'upi' as const, label: 'UPI', hint: 'Google Pay, PhonePe, Paytm' },
            { id: 'card' as const, label: 'Card', hint: 'Visa, Mastercard, RuPay' },
            { id: 'netbanking' as const, label: 'Net banking', hint: 'Major Indian banks' },
          ] as const
        ).map((method) => (
          <label key={method.id} className="flex items-start gap-3 text-sm text-thy-ink cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              checked={selectedMethod === method.id}
              onChange={() => setSelectedMethod(method.id)}
              className="mt-1 accent-thy-brand"
            />
            <span>
              <span className="block">{method.label}</span>
              <span className="block text-xs text-thy-muted">{method.hint}</span>
            </span>
          </label>
        ))}
      </div>

      {message && (
        <p className={`mt-4 text-sm ${status === 'failed' ? 'text-rose-700' : 'text-thy-muted'}`}>{message}</p>
      )}

      <button
        type="button"
        disabled={status === 'opening' || status === 'verifying'}
        onClick={() => void pay()}
        className="hero-leather-btn w-full min-h-12 mt-6 text-[11px] uppercase tracking-[0.16em] disabled:opacity-60"
      >
        {status === 'opening'
          ? 'Opening secure payment...'
          : status === 'verifying'
            ? 'Verifying payment...'
            : 'Pay securely'}
      </button>
    </main>
  );
}
