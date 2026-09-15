import type { Socket } from 'socket.io';
import { verifyAccessToken, type TokenPayload } from '../services/token.service.js';

declare module 'socket.io' {
  interface SocketData {
    user: TokenPayload;
    userId: string;
  }
}

function parseCookie(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, pair) => {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const val = decodeURIComponent(pair.slice(idx + 1).trim());
      acc[key] = val;
    }
    return acc;
  }, {});
}

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void): void {
  try {
    let token: string | undefined =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token && socket.handshake.headers.cookie) {
      const cookies = parseCookie(socket.handshake.headers.cookie);
      token = cookies['thy_access_token'];
    }

    if (!token) {
      return next(new Error('Authentication token is required'));
    }

    const payload = verifyAccessToken(token);
    socket.data.user = payload;
    socket.data.userId = payload.userId;
    next();
  } catch (err) {
    return next(new Error('Invalid or expired authentication token'));
  }
}
