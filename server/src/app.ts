import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { checkDatabase } from './db/pool.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { authRouter } from './routes/auth.routes.js';
import { paymentRouter } from './routes/payment.routes.js';
import { meRouter, tailorRouter } from './routes/profile.routes.js';
import { razorpayWebhook } from './controllers/payment.controller.js';
import { categoryRouter, designRouter, directoryTailorRouter } from './routes/catalogue.routes.js';
import { chatRouter } from './routes/chat.routes.js';
import { mongoose } from './db/mongo.js';

function isAllowedOrigin(origin?: string): boolean {
  if (!origin) return true;
  if (origin === env.FRONTEND_ORIGIN) return true;
  if (env.NODE_ENV !== 'production') {
    return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  }
  return false;
}

export const app = express();
app.set('trust proxy', 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// Razorpay signs the exact payload bytes, so this route must precede express.json().
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), razorpayWebhook);
app.use(express.json({ limit: '8mb' }));
app.use(cookieParser());
app.get('/api/v1/health', async (_request, response, next) => {
  try {
    const mongoOk = mongoose.connection.readyState === 1;
    if (!mongoOk) {
      response.status(503).json({
        success: false,
        error: { code: 'DB_UNAVAILABLE', message: 'MongoDB is not connected.' },
      });
      return;
    }
    if (env.DATABASE_URL) {
      await checkDatabase();
    }
    response.json({ success: true, data: { status: 'ok', mongo: 'connected' } });
  } catch (error) {
    next(error);
  }
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/designs', designRouter);
app.use('/api/v1/me', meRouter);
app.use('/api/v1/tailors', tailorRouter);
app.use('/api/v1/tailors', directoryTailorRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/chat', chatRouter);
app.use(notFound);
app.use(errorHandler);
