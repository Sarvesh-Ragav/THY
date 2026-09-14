import Razorpay from 'razorpay';
import { env } from '../config/env.js';
import { pool } from '../db/pool.js';
import { ApiError } from '../utils/api-error.js';
import { buildRazorpayOrderRequest, fallbackWebhookEventId, verifyRazorpayPaymentSignature } from '../utils/razorpay.js';

const razorpay = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface CreatePaymentOrderInput { checkoutKey: string; sourceThreadId?: string; tailorName: string; garmentName: string; deliveryAddress: string; amountPaise: number; }
export interface VerifyPaymentInput { orderId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; }

function toOrder(row: Record<string, unknown>) {
  return { id: row.id, garmentName: row.garment_name, tailorName: row.tailor_name, amountPaise: row.amount_paise, currency: row.currency, paymentStatus: row.payment_status, fulfillmentStatus: row.fulfillment_status, razorpayOrderId: row.razorpay_order_id, createdAt: row.created_at };
}

export async function createPaymentOrder(userId: string, input: CreatePaymentOrderInput) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Serialise a checkout key so repeated clicks/retries create one gateway order.
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [`${userId}:${input.checkoutKey}`]);
    const existing = await client.query<Record<string, unknown>>('SELECT * FROM orders WHERE user_id = $1 AND checkout_key = $2 FOR UPDATE', [userId, input.checkoutKey]);
    if (existing.rowCount && existing.rows[0].razorpay_order_id) {
      await client.query('COMMIT');
      return toOrder(existing.rows[0]);
    }

    let orderId: string;
    if (existing.rowCount) orderId = existing.rows[0].id as string;
    else {
      const inserted = await client.query<{ id: string }>(
        `INSERT INTO orders (user_id, checkout_key, source_thread_id, tailor_name, garment_name, delivery_address, amount_paise)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [userId, input.checkoutKey, input.sourceThreadId ?? null, input.tailorName, input.garmentName, input.deliveryAddress, input.amountPaise],
      );
      orderId = inserted.rows[0].id;
    }
    const gatewayOrder = await razorpay.orders.create(buildRazorpayOrderRequest(orderId, input.amountPaise));
    const result = await client.query<Record<string, unknown>>(
      `UPDATE orders SET razorpay_order_id = $2, updated_at = NOW() WHERE id = $1
       RETURNING *`, [orderId, gatewayOrder.id],
    );
    await client.query(
      `INSERT INTO payments (order_id, razorpay_order_id, amount_paise) VALUES ($1, $2, $3)
       ON CONFLICT (order_id) DO NOTHING`, [orderId, gatewayOrder.id, input.amountPaise],
    );
    await client.query('COMMIT');
    return toOrder(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw new ApiError(502, 'Unable to create a payment order. Please try again.', 'PAYMENT_GATEWAY_ERROR');
  } finally { client.release(); }
}

export async function verifyPayment(userId: string, input: VerifyPaymentInput) {
  if (!verifyRazorpayPaymentSignature(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature, env.RAZORPAY_KEY_SECRET)) {
    throw new ApiError(400, 'Payment signature is invalid.', 'PAYMENT_SIGNATURE_INVALID');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query<Record<string, unknown>>(
      `SELECT o.* FROM orders o JOIN payments p ON p.order_id = o.id
       WHERE o.id = $1 AND o.user_id = $2 AND o.razorpay_order_id = $3 FOR UPDATE`,
      [input.orderId, userId, input.razorpayOrderId],
    );
    if (!result.rowCount) throw new ApiError(404, 'Payment order was not found.', 'PAYMENT_ORDER_NOT_FOUND');
    const order = result.rows[0];
    if (order.payment_status === 'paid') { await client.query('COMMIT'); return toOrder(order); }
    const duplicatePayment = await client.query<{ order_id: string }>('SELECT order_id FROM payments WHERE razorpay_payment_id = $1 FOR UPDATE', [input.razorpayPaymentId]);
    if (duplicatePayment.rowCount && duplicatePayment.rows[0].order_id !== input.orderId) throw new ApiError(409, 'This payment has already been processed.', 'PAYMENT_DUPLICATE');
    await client.query(
      `UPDATE payments SET razorpay_payment_id = $2, razorpay_signature = $3, status = 'paid', verified_at = NOW(), updated_at = NOW() WHERE order_id = $1`,
      [input.orderId, input.razorpayPaymentId, input.razorpaySignature],
    );
    const updated = await client.query<Record<string, unknown>>(
      `UPDATE orders SET payment_status = 'paid', fulfillment_status = 'pending', updated_at = NOW() WHERE id = $1 RETURNING *`, [input.orderId],
    );
    await client.query('COMMIT');
    return toOrder(updated.rows[0]);
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function getOrder(userId: string, orderId: string) {
  const result = await pool.query<Record<string, unknown>>('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, userId]);
  if (!result.rowCount) throw new ApiError(404, 'Order was not found.', 'ORDER_NOT_FOUND');
  return toOrder(result.rows[0]);
}

export async function listOrders(userId: string) {
  const result = await pool.query<Record<string, unknown>>('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows.map(toOrder);
}

export async function processRazorpayWebhook(rawBody: Buffer, eventId: string, eventType: string, payload: unknown) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const stored = await client.query<{ id: string }>(
      `INSERT INTO payment_webhook_events (razorpay_event_id, event_type, payload, signature_valid, processed_at)
       VALUES ($1, $2, $3, TRUE, NOW()) ON CONFLICT (razorpay_event_id) DO NOTHING RETURNING id`,
      [eventId, eventType, payload],
    );
    if (!stored.rowCount) { await client.query('COMMIT'); return { duplicate: true }; }
    const body = payload as { payload?: { payment?: { entity?: { order_id?: string; id?: string; error_description?: string } }; order?: { entity?: { id?: string } } } };
    const razorpayOrderId = body.payload?.payment?.entity?.order_id ?? body.payload?.order?.entity?.id;
    if (razorpayOrderId) {
      const status: PaymentStatus | null = eventType === 'payment.captured' || eventType === 'order.paid' ? 'paid' : eventType === 'payment.failed' ? 'failed' : null;
      if (status) {
        const paymentId = body.payload?.payment?.entity?.id ?? null;
        await client.query(`UPDATE payments SET status = $2, razorpay_payment_id = COALESCE(razorpay_payment_id, $3), failure_reason = CASE WHEN $2 = 'failed' THEN $4 ELSE failure_reason END, verified_at = CASE WHEN $2 = 'paid' THEN COALESCE(verified_at, NOW()) ELSE verified_at END, updated_at = NOW() WHERE razorpay_order_id = $1 AND status <> 'paid'`, [razorpayOrderId, status, paymentId, body.payload?.payment?.entity?.error_description ?? null]);
        await client.query(`UPDATE orders SET payment_status = $2, updated_at = NOW() WHERE razorpay_order_id = $1 AND payment_status <> 'paid'`, [razorpayOrderId, status]);
      }
    }
    await client.query('COMMIT');
    return { duplicate: false };
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export { fallbackWebhookEventId } from '../utils/razorpay.js';
