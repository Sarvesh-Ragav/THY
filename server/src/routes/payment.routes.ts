import { Router } from 'express';
import { createOrder, readOrder, readOrders, verifyOrderPayment } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/authenticate.js';

export const paymentRouter = Router();
paymentRouter.use(authenticate);
paymentRouter.post('/orders', createOrder);
paymentRouter.post('/verify', verifyOrderPayment);
paymentRouter.get('/orders', readOrders);
paymentRouter.get('/orders/:orderId', readOrder);
