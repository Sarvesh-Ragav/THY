import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { checkDatabase } from './db/pool.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { authRouter } from './routes/auth.routes.js';
import { paymentRouter } from './routes/payment.routes.js';
import { razorpayWebhook } from './controllers/payment.controller.js';

export const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
// Razorpay signs the exact payload bytes, so this route must precede express.json().
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), razorpayWebhook);
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.get('/api/v1/health', async (_request, response, next) => {
  try { await checkDatabase(); response.json({ success: true, data: { status: 'ok' } }); } catch (error) { next(error); }
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/payments', paymentRouter);
app.use(notFound);
app.use(errorHandler);
