import type { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { createPaymentOrderSchema, verifyPaymentSchema } from '../validators/payment.schemas.js';
import { createPaymentOrder, fallbackWebhookEventId, getOrder, listOrders, processRazorpayWebhook, verifyPayment } from '../services/payment.service.js';
import { ApiError } from '../utils/api-error.js';
import { verifyRazorpayWebhookSignature } from '../utils/razorpay.js';

export const createOrder: RequestHandler = async (request, response, next) => { try { const order = await createPaymentOrder(request.auth!.userId, createPaymentOrderSchema.parse(request.body)); response.status(201).json({ success: true, data: { order, checkout: { keyId: env.RAZORPAY_KEY_ID, razorpayOrderId: order.razorpayOrderId, amountPaise: order.amountPaise, currency: order.currency } } }); } catch (error) { next(error); } };
export const verifyOrderPayment: RequestHandler = async (request, response, next) => { try { const order = await verifyPayment(request.auth!.userId, verifyPaymentSchema.parse(request.body)); response.json({ success: true, data: { order } }); } catch (error) { next(error); } };
export const readOrder: RequestHandler = async (request, response, next) => { try { const orderId = Array.isArray(request.params.orderId) ? request.params.orderId[0] : request.params.orderId; response.json({ success: true, data: { order: await getOrder(request.auth!.userId, orderId) } }); } catch (error) { next(error); } };
export const readOrders: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: { orders: await listOrders(request.auth!.userId) } }); } catch (error) { next(error); } };

export const razorpayWebhook: RequestHandler = async (request, response, next) => {
  try {
    const rawBody = request.body as Buffer;
    const signature = request.header('x-razorpay-signature');
    if (!Buffer.isBuffer(rawBody) || !verifyRazorpayWebhookSignature(rawBody, signature, env.RAZORPAY_WEBHOOK_SECRET)) throw new ApiError(400, 'Invalid webhook signature.', 'WEBHOOK_SIGNATURE_INVALID');
    const payload = JSON.parse(rawBody.toString('utf8')) as { event?: string };
    await processRazorpayWebhook(rawBody, request.header('x-razorpay-event-id') ?? fallbackWebhookEventId(rawBody), payload.event ?? 'unknown', payload);
    response.status(200).json({ success: true });
  } catch (error) { next(error); }
};
