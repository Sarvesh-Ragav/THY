import type { RequestHandler } from 'express';
import { ApiError } from '../utils/api-error.js';
import { createAddressSchema, addressIdSchema, customerPreferencesSchema, customerProfileSchema, tailorPortfolioSchema, tailorProfileSchema, tailorVerificationSchema, updateAddressSchema } from '../validators/profile.schemas.js';
import { createAddress, deleteAddress, getCustomerProfile, getTailorProfile, listAddresses, submitTailorVerification, updateAddress, updateCustomerPreferences, updateCustomerProfile, updateTailorProfile } from '../services/profile.service.js';
import { replaceTailorPortfolio, saveTailorVerification, updateDirectoryTailorDetails } from '../services/directory.service.js';
import { User } from '../models/User.js';

export const readCustomerProfile: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: await getCustomerProfile(request.auth!.userId) }); } catch (error) { next(error); } };
export const patchCustomerProfile: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: { profile: await updateCustomerProfile(request.auth!.userId, customerProfileSchema.parse(request.body)) } }); } catch (error) { next(error); } };
export const patchCustomerPreferences: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: { preferences: await updateCustomerPreferences(request.auth!.userId, customerPreferencesSchema.parse(request.body)) } }); } catch (error) { next(error); } };
export const readAddresses: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: { addresses: await listAddresses(request.auth!.userId) } }); } catch (error) { next(error); } };
export const addAddress: RequestHandler = async (request, response, next) => { try { response.status(201).json({ success: true, data: { address: await createAddress(request.auth!.userId, createAddressSchema.parse(request.body)) } }); } catch (error) { next(error); } };
export const patchAddress: RequestHandler = async (request, response, next) => { try { const { addressId } = addressIdSchema.parse(request.params); response.json({ success: true, data: { address: await updateAddress(request.auth!.userId, addressId, updateAddressSchema.parse(request.body)) } }); } catch (error) { next(error); } };
export const removeAddress: RequestHandler = async (request, response, next) => { try { const { addressId } = addressIdSchema.parse(request.params); await deleteAddress(request.auth!.userId, addressId); response.status(204).send(); } catch (error) { next(error); } };
export const readTailorProfile: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: { profile: await getTailorProfile(request.auth!.userId) } }); } catch (error) { next(error); } };
export const patchTailorProfile: RequestHandler = async (request, response, next) => {
  try {
    const input = tailorProfileSchema.parse(request.body);
    let postgresProfile = null;
    try {
      postgresProfile = await updateTailorProfile(request.auth!.userId, input);
    } catch {
      postgresProfile = null;
    }
    const directory = await updateDirectoryTailorDetails(request.auth!.userId, input);
    response.json({ success: true, data: { profile: directory || postgresProfile } });
  } catch (error) {
    next(error);
  }
};
export const addTailorVerification: RequestHandler = async (request, response, next) => {
  try {
    let role = request.auth?.role;
    if (role !== 'tailor') {
      const user = await User.findById(request.auth!.userId).select('role');
      role = user?.role ?? role;
    }
    if (role !== 'tailor') {
      throw new ApiError(403, 'You are not authorized to access this resource.', 'FORBIDDEN');
    }
    const input = tailorVerificationSchema.parse(request.body);
    const mongoVerification = await saveTailorVerification(request.auth!.userId, input);
    try {
      await submitTailorVerification(request.auth!.userId, input);
    } catch {
      // Postgres is optional; Mongo is the source of truth for login restore.
    }
    response.status(201).json({ success: true, data: { verification: mongoVerification } });
  } catch (error) {
    next(error);
  }
};
export const putTailorPortfolio: RequestHandler = async (request, response, next) => {
  try {
    let role = request.auth?.role;
    if (role !== 'tailor') {
      const user = await User.findById(request.auth!.userId).select('role');
      role = user?.role ?? role;
    }
    if (role !== 'tailor') {
      throw new ApiError(403, 'You are not authorized to access this resource.', 'FORBIDDEN');
    }
    const { portfolio } = tailorPortfolioSchema.parse(request.body);
    response.json({ success: true, data: { portfolio: await replaceTailorPortfolio(request.auth!.userId, portfolio) } });
  } catch (error) {
    next(error);
  }
};
