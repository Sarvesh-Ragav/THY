import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildRazorpayOrderRequest, fallbackWebhookEventId, signRazorpayPayload, verifyRazorpayPaymentSignature, verifyRazorpayWebhookSignature } from '../src/utils/razorpay.js';

describe('Razorpay payment primitives', () => {
  it('creates an INR order request with an integer paise amount', () => {
    const request = buildRazorpayOrderRequest('11111111-1111-1111-1111-111111111111', 125050);
    assert.equal(request.amount, 125050);
    assert.equal(request.currency, 'INR');
    assert.equal(request.partial_payment, false);
  });
  it('accepts only a valid payment signature', () => {
    const signature = signRazorpayPayload('order_abc|pay_abc', 'secret');
    assert.equal(verifyRazorpayPaymentSignature('order_abc', 'pay_abc', signature, 'secret'), true);
    assert.equal(verifyRazorpayPaymentSignature('order_abc', 'pay_abc', 'invalid', 'secret'), false);
  });
  it('verifies webhook bodies and produces the same event id for duplicate webhook deliveries', () => {
    const body = Buffer.from('{"event":"payment.captured"}');
    assert.equal(verifyRazorpayWebhookSignature(body, signRazorpayPayload(body.toString(), 'webhook-secret'), 'webhook-secret'), true);
    assert.equal(verifyRazorpayWebhookSignature(body, 'bad', 'webhook-secret'), false);
    assert.equal(fallbackWebhookEventId(body), fallbackWebhookEventId(body));
  });
});
