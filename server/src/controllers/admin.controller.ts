import type { RequestHandler } from 'express';
import { z } from 'zod';
import {
  getAdminOverview,
  getTailorVerificationDocuments,
  listAdminCustomers,
  listAdminOrders,
  listAdminTailors,
  setTailorDirectoryActive,
  setTailorVerification,
  setUserActive,
  updateOrderFulfillment,
} from '../services/admin.service.js';

const verificationSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
  reviewNotes: z.string().trim().max(1000).optional(),
});

const activeSchema = z.object({
  isActive: z.boolean(),
});

const directorySchema = z.object({
  isDirectoryActive: z.boolean(),
});

const fulfillmentSchema = z.object({
  fulfillmentStatus: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
});

export const adminOverview: RequestHandler = async (_request, response, next) => {
  try {
    response.json({ success: true, data: await getAdminOverview() });
  } catch (error) {
    next(error);
  }
};

export const adminListTailors: RequestHandler = async (_request, response, next) => {
  try {
    response.json({ success: true, data: { tailors: await listAdminTailors() } });
  } catch (error) {
    next(error);
  }
};

export const adminVerifyTailor: RequestHandler = async (request, response, next) => {
  try {
    const { status, reviewNotes } = verificationSchema.parse(request.body);
    const result = await setTailorVerification(String(request.params.userId), status, reviewNotes || '');
    response.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminTailorVerificationDocs: RequestHandler = async (request, response, next) => {
  try {
    const result = await getTailorVerificationDocuments(String(request.params.userId));
    response.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminSetTailorDirectory: RequestHandler = async (request, response, next) => {
  try {
    const { isDirectoryActive } = directorySchema.parse(request.body);
    const result = await setTailorDirectoryActive(String(request.params.userId), isDirectoryActive);
    response.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminListCustomers: RequestHandler = async (_request, response, next) => {
  try {
    response.json({ success: true, data: { customers: await listAdminCustomers() } });
  } catch (error) {
    next(error);
  }
};

export const adminSetUserActive: RequestHandler = async (request, response, next) => {
  try {
    const { isActive } = activeSchema.parse(request.body);
    const result = await setUserActive(String(request.params.userId), isActive);
    response.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminListOrders: RequestHandler = async (_request, response, next) => {
  try {
    response.json({ success: true, data: { orders: await listAdminOrders() } });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateOrderFulfillment: RequestHandler = async (request, response, next) => {
  try {
    const { fulfillmentStatus } = fulfillmentSchema.parse(request.body);
    const result = await updateOrderFulfillment(String(request.params.orderId), fulfillmentStatus);
    response.json({ success: true, data: { order: result } });
  } catch (error) {
    next(error);
  }
};
