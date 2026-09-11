export class ApiError extends Error {
  constructor(public readonly statusCode: number, message: string, public readonly code = 'REQUEST_FAILED') {
    super(message);
  }
}
