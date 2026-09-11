import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/api-error.js';

export const notFound: RequestHandler = (_request, response) => response.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } });

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) return response.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request data.', details: error.flatten().fieldErrors } });
  if (error instanceof ApiError) return response.status(error.statusCode).json({ success: false, error: { code: error.code, message: error.message } });
  console.error('Unhandled server error', error);
  return response.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } });
};
