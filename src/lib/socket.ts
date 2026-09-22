import { io, type Socket } from 'socket.io-client';
import { API_ROOT } from '@/lib/api-base';

let socket: Socket | null = null;
let currentToken: string | null = null;

export function getSocket(accessToken?: string | null): Socket {
  if (socket && socket.connected && (!accessToken || currentToken === accessToken)) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentToken = accessToken || null;

  socket = io(API_ROOT, {
    withCredentials: true,
    auth: {
      token: accessToken || '',
    },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message);
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
}
