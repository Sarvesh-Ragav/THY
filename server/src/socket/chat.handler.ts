import type { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { ChatThread, ChatMessage } from '../models/Chat.js';

interface ChatSendPayload {
  threadId: string;
  clientId?: string;
  kind: 'text' | 'voice' | 'product_share' | 'measurements' | 'quotation' | 'attachment' | 'system';
  text?: string;
  product?: {
    id: string;
    title: string;
    imageUrl: string;
    category?: string;
    fabricRef?: string;
  };
  measurements?: Record<string, any>;
  quotation?: {
    id?: string;
    price: string;
    notes?: string;
    status?: 'pending' | 'accepted' | 'declined' | 'expired';
  };
  attachment?: {
    kind: 'measurements' | 'fabric' | 'design';
    title: string;
    preview?: string;
    href?: string;
    details?: string;
  };
  voiceUrl?: string;
  voiceDuration?: number;
}

export function registerChatHandler(io: Server, socket: Socket): void {
  const userId = socket.data.userId;

  socket.on('chat:join', async ({ threadId }: { threadId: string }) => {
    try {
      if (!threadId || !Types.ObjectId.isValid(threadId)) {
        return socket.emit('chat:error', { code: 'INVALID_ID', message: 'Valid thread ID is required' });
      }

      const thread = await ChatThread.findById(threadId);
      if (!thread) {
        return socket.emit('chat:error', { code: 'NOT_FOUND', message: 'Thread not found' });
      }

      const isCustomer = thread.customerId.toString() === userId;
      const isTailor = thread.tailorId.toString() === userId;

      if (!isCustomer && !isTailor) {
        return socket.emit('chat:error', { code: 'FORBIDDEN', message: 'You are not a participant in this conversation' });
      }

      const room = `thread:${threadId}`;
      await socket.join(room);

      const messages = await ChatMessage.find({ threadId: thread._id }).sort({ createdAt: 1 }).limit(100);

      socket.emit('chat:history', { threadId, messages });
    } catch (err) {
      console.error('Error in chat:join:', err);
      socket.emit('chat:error', { code: 'SERVER_ERROR', message: 'Failed to join chat thread' });
    }
  });

  socket.on('chat:send', async (payload: ChatSendPayload) => {
    try {
      const { threadId, kind } = payload;
      if (!threadId || !Types.ObjectId.isValid(threadId)) {
        return socket.emit('chat:error', { code: 'INVALID_ID', message: 'Valid thread ID is required' });
      }

      const thread = await ChatThread.findById(threadId);
      if (!thread) {
        return socket.emit('chat:error', { code: 'NOT_FOUND', message: 'Thread not found' });
      }

      const isCustomer = thread.customerId.toString() === userId;
      const isTailor = thread.tailorId.toString() === userId;

      if (!isCustomer && !isTailor) {
        return socket.emit('chat:error', { code: 'FORBIDDEN', message: 'Not authorized for this thread' });
      }

      const sender: 'customer' | 'tailor' = isCustomer ? 'customer' : 'tailor';

      if (kind === 'quotation' && !isTailor) {
        return socket.emit('chat:error', { code: 'FORBIDDEN', message: 'Only tailors can send quotations' });
      }

      let quotationData = null;
      if (kind === 'quotation' && payload.quotation) {
        quotationData = {
          id: payload.quotation.id || `q-${Date.now()}`,
          price: payload.quotation.price,
          notes: payload.quotation.notes || '',
          sentAt: new Date(),
          updated: Boolean(thread.activeQuotation),
          status: payload.quotation.status || 'pending',
        };
      }

      const message = await ChatMessage.create({
        threadId: thread._id,
        sender,
        kind,
        text: payload.text || null,
        product: payload.product || null,
        measurements: payload.measurements ? new Map(Object.entries(payload.measurements)) : null,
        quotation: quotationData,
        attachment: payload.attachment || null,
        voiceUrl: payload.voiceUrl || null,
        voiceDuration: payload.voiceDuration || null,
        status: 'delivered',
      });

      let previewText = payload.text || '';
      if (kind === 'quotation' && quotationData) {
        previewText = `Quotation: ₹${quotationData.price}`;
      } else if (kind === 'voice') {
        previewText = `Voice note (${payload.voiceDuration || 0}s)`;
      } else if (kind === 'attachment' && payload.attachment) {
        previewText = `Attachment: ${payload.attachment.title}`;
      } else if (kind === 'measurements') {
        previewText = 'Shared measurements';
      }

      thread.lastMessage = {
        text: previewText,
        sender,
        kind,
        sentAt: new Date(),
      };

      if (isCustomer) {
        thread.unreadCountTailor = (thread.unreadCountTailor || 0) + 1;
      } else {
        thread.unreadCountCustomer = (thread.unreadCountCustomer || 0) + 1;
      }

      if (kind === 'quotation' && quotationData) {
        thread.activeQuotation = quotationData as any;
        thread.status = thread.activeQuotation ? 'quotation_updated' : 'price_fixed';
      } else if (thread.status === 'new') {
        thread.status = 'active';
      }

      await thread.save();

      const room = `thread:${threadId}`;
      const messagePayload = message.toObject() as any;
      if (payload.clientId) {
        messagePayload.clientId = payload.clientId;
      }

      io.to(room).emit('chat:message', messagePayload);
      io.to(room).emit('chat:thread_update', thread);
    } catch (err) {
      console.error('Error in chat:send:', err);
      socket.emit('chat:error', { code: 'SERVER_ERROR', message: 'Failed to send message' });
    }
  });

  socket.on('chat:read', async ({ threadId }: { threadId: string }) => {
    try {
      if (!threadId || !Types.ObjectId.isValid(threadId)) return;

      const thread = await ChatThread.findById(threadId);
      if (!thread) return;

      const isCustomer = thread.customerId.toString() === userId;
      const isTailor = thread.tailorId.toString() === userId;

      if (!isCustomer && !isTailor) return;

      if (isCustomer) {
        thread.unreadCountCustomer = 0;
      } else {
        thread.unreadCountTailor = 0;
      }

      await thread.save();
      const room = `thread:${threadId}`;
      io.to(room).emit('chat:thread_update', thread);
    } catch (err) {
      console.error('Error in chat:read:', err);
    }
  });

  socket.on('chat:typing', ({ threadId, typing }: { threadId: string; typing: boolean }) => {
    if (!threadId) return;
    const room = `thread:${threadId}`;
    socket.to(room).emit('chat:typing', { threadId, userId, typing });
  });
}
