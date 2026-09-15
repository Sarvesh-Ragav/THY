import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../services/token.service.js';
import { ApiError } from '../utils/api-error.js';

import type { TokenPayload } from '../services/token.service.js';

declare global { namespace Express { interface Request { auth?: TokenPayload; } } }

export function authenticate(request: Request, _response: Response, next: NextFunction): void {
  try {
    const token = request.header('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) throw new ApiError(401, 'A valid access token is required.', 'UNAUTHENTICATED');
    request.auth = verifyAccessToken(token);
    next();
  } catch { next(new ApiError(401, 'A valid access token is required.', 'UNAUTHENTICATED')); }
}
