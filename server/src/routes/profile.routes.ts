import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize-role.js';
import { addAddress, addTailorVerification, patchAddress, patchCustomerPreferences, patchCustomerProfile, patchTailorProfile, putTailorPortfolio, readAddresses, readCustomerProfile, readTailorProfile, removeAddress } from '../controllers/profile.controller.js';

export const meRouter = Router();
meRouter.use(authenticate);
meRouter.get('/profile', readCustomerProfile);
meRouter.patch('/profile', patchCustomerProfile);
meRouter.patch('/preferences', requireRole('customer'), patchCustomerPreferences);
meRouter.get('/addresses', requireRole('customer'), readAddresses);
meRouter.post('/addresses', requireRole('customer'), addAddress);
meRouter.patch('/addresses/:addressId', requireRole('customer'), patchAddress);
meRouter.delete('/addresses/:addressId', requireRole('customer'), removeAddress);

export const tailorRouter = Router();
tailorRouter.get('/me', authenticate, requireRole('tailor'), readTailorProfile);
// A previously unassigned authenticated user may claim the tailor role only while creating this profile.
tailorRouter.patch('/me', authenticate, patchTailorProfile);
tailorRouter.put('/me/portfolio', authenticate, putTailorPortfolio);
tailorRouter.post('/me/verification', authenticate, addTailorVerification);
