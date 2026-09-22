import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize-role.js';
import {
  adminListCustomers,
  adminListOrders,
  adminListTailors,
  adminOverview,
  adminSetTailorDirectory,
  adminSetUserActive,
  adminTailorVerificationDocs,
  adminUpdateOrderFulfillment,
  adminVerifyTailor,
} from '../controllers/admin.controller.js';

export const adminRouter = Router();
adminRouter.use(authenticate, requireRole('admin'));

adminRouter.get('/overview', adminOverview);
adminRouter.get('/tailors', adminListTailors);
adminRouter.get('/tailors/:userId/verification', adminTailorVerificationDocs);
adminRouter.patch('/tailors/:userId/verification', adminVerifyTailor);
adminRouter.patch('/tailors/:userId/directory', adminSetTailorDirectory);
adminRouter.get('/customers', adminListCustomers);
adminRouter.patch('/users/:userId/active', adminSetUserActive);
adminRouter.get('/orders', adminListOrders);
adminRouter.patch('/orders/:orderId/fulfillment', adminUpdateOrderFulfillment);
