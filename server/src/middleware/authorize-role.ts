import type { NextFunction, Request, Response } from 'express';
import { getUserRole } from '../services/profile.service.js';
import { ApiError } from '../utils/api-error.js';

export function requireRole(role: 'customer' | 'tailor') {
  return async (request: Request, _response: Response, next: NextFunction): Promise<void> => {
    try {
      const currentRole = await getUserRole(request.auth!.userId);
      if (currentRole !== role) throw new ApiError(403, 'You are not authorized to access this resource.', 'FORBIDDEN');
      next();
    } catch (error) { next(error); }
  };
}
