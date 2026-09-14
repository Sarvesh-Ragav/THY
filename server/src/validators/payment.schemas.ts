import { z } from 'zod';

export const createPaymentOrderSchema = z.object({
  checkoutKey: z.string().uuid(),
  sourceThreadId: z.string().trim().min(1).max(120).optional(),
  tailorName: z.string().trim().min(1).max(120),
  garmentName: z.string().trim().min(1).max(200),
  deliveryAddress: z.string().trim().min(1).max(1_000),
  amountPaise: z.number().int().positive().max(10_000_000),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpayOrderId: z.string().regex(/^order_[A-Za-z0-9]+$/),
  razorpayPaymentId: z.string().regex(/^pay_[A-Za-z0-9]+$/),
  razorpaySignature: z.string().regex(/^[a-f0-9]{64}$/i),
});
