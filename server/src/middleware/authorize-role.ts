import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';

export type AppRole = 'customer' | 'tailor' | 'admin';

async function resolveRole(request: Request): Promise<string | null> {
  if (request.auth?.role) return request.auth.role;
  const user = await User.findById(request.auth!.userId).select('role isActive');
  if (!user || user.isActive === false) return null;
  return user.role ?? null;
}

export function requireRole(...roles: AppRole[]) {
  return async (request: Request, _response: Response, next: NextFunction): Promise<void> => {
    try {
      const currentRole = await resolveRole(request);
      if (!currentRole || !roles.includes(currentRole as AppRole)) {
        throw new ApiError(403, 'You are not authorized to access this resource.', 'FORBIDDEN');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
