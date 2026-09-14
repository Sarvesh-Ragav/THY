import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

function safeCompare(left: string, right: string): boolean {
  const leftValue = Buffer.from(left, 'utf8');
  const rightValue = Buffer.from(right, 'utf8');
  return leftValue.length === rightValue.length && timingSafeEqual(leftValue, rightValue);
}

export function signRazorpayPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyRazorpayPaymentSignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  return safeCompare(signRazorpayPayload(`${orderId}|${paymentId}`, secret), signature);
}

export function verifyRazorpayWebhookSignature(rawBody: Buffer, signature: string | undefined, secret: string): boolean {
  return Boolean(signature) && safeCompare(signRazorpayPayload(rawBody.toString('utf8'), secret), signature!);
}

export function buildRazorpayOrderRequest(orderId: string, amountPaise: number) {
  return { amount: amountPaise, currency: 'INR', receipt: `thy_${orderId.replace(/-/g, '').slice(0, 32)}`, partial_payment: false, payment_capture: true };
}

export function fallbackWebhookEventId(rawBody: Buffer): string {
  return `body_${createHash('sha256').update(rawBody).digest('hex')}`;
}
