import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { confirmOtp, googleAuth, loginWithEmail, logout, me, refresh, registerAccount, requestOtp, resendOtp, updateRole } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const otpLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many code requests. Try again later.' } } });
const verifyLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 15, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many verification attempts. Try again later.' } } });

export const authRouter = Router();
authRouter.post('/otp/request', otpLimiter, requestOtp);
authRouter.post('/otp/resend', otpLimiter, resendOtp);
authRouter.post('/otp/verify', verifyLimiter, confirmOtp);
authRouter.post('/google/verify', verifyLimiter, googleAuth);
authRouter.post('/register', verifyLimiter, registerAccount);
authRouter.post('/login', verifyLimiter, loginWithEmail);
authRouter.patch('/role', authenticate, updateRole);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, me);
