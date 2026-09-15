'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';
import {
  listMessages,
  uploadChatMedia,
  type ChatMessage,
  type ChatThread,
} from '@/lib/chat-api';

export interface SendMessageOptions {
  kind: 'text' | 'voice' | 'product_share' | 'measurements' | 'quotation' | 'attachment' | 'system';
  text?: string;
  product?: any;
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
    preview?: string | null;
    href?: string | null;
    details?: string | null;
  };
  voiceUrl?: string;
  voiceDuration?: number;
}

export function useSocketChat(
  threadId: string | null,
  accessToken: string | null,
  initialThread: ChatThread | null = null,
  role: 'customer' | 'tailor' = 'customer'
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thread, setThread] = useState<ChatThread | null>(initialThread);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingSentRef = useRef<number>(0);

  // Sync initial thread
  useEffect(() => {
    if (initialThread) {
      setThread(initialThread);
    }
  }, [initialThread]);

  // Connect socket and listen to room events
  useEffect(() => {
    if (!accessToken) return;

    const socket = getSocket(accessToken);
    socketRef.current = socket;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    setIsConnected(socket.connected);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    const onChatMessage = (message: ChatMessage) => {
      const msgThreadId = (message.threadId as any)?._id || message.threadId;
      if (msgThreadId === threadId) {
        setMessages((prev) => {
          // 1. Reconcile optimistic message by clientId or temporary _id
          if (message.clientId) {
            const clientIdx = prev.findIndex(
              (m) =>
                m.clientId === message.clientId ||
                m._id === message.clientId ||
                m.id === message.clientId
            );
            if (clientIdx !== -1) {
              const updated = [...prev];
              updated[clientIdx] = message;
              return updated;
            }
          }

          // 2. Fallback check: if message with same sender, kind, and text is in "sending" status
          const pendingIdx = prev.findIndex(
            (m) =>
              m.status === 'sending' &&
              m.sender === message.sender &&
              m.kind === message.kind &&
              (m.text || '') === (message.text || '')
          );
          if (pendingIdx !== -1) {
            const updated = [...prev];
            updated[pendingIdx] = message;
            return updated;
          }

          // 3. Prevent duplicate by MongoDB _id or id
          const exists = prev.some((m) => m._id === message._id || (m.id && m.id === message.id));
          if (exists) {
            return prev.map((m) => (m._id === message._id || m.id === message.id ? message : m));
          }

          return [...prev, message];
        });
        socket.emit('chat:read', { threadId });
      }
    };

    const onThreadUpdate = (updatedThread: ChatThread) => {
      const updatedId = updatedThread._id || updatedThread.id;
      if (updatedId === threadId) {
        setThread(updatedThread);
      }
    };

    const onChatHistory = ({ threadId: hThreadId, messages: hMessages }: { threadId: string; messages: ChatMessage[] }) => {
      if (hThreadId === threadId) {
        setMessages((prev) => {
          const messageMap = new Map<string, ChatMessage>();
          for (const m of hMessages) {
            const key = m._id || m.id || '';
            if (key) messageMap.set(key, m);
          }
          const pending = prev.filter(
            (m) => m.status === 'sending' && !messageMap.has(m._id) && (!m.clientId || !messageMap.has(m.clientId))
          );
          return [...Array.from(messageMap.values()), ...pending];
        });
        setLoading(false);
      }
    };

    const onChatTyping = ({ threadId: tThreadId, typing }: { threadId: string; typing: boolean }) => {
      if (tThreadId === threadId) {
        setIsTyping(typing);
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        if (typing) {
          typingTimerRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3500);
        }
      }
    };

    socket.on('chat:message', onChatMessage);
    socket.on('chat:thread_update', onThreadUpdate);
    socket.on('chat:history', onChatHistory);
    socket.on('chat:typing', onChatTyping);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat:message', onChatMessage);
      socket.off('chat:thread_update', onThreadUpdate);
      socket.off('chat:history', onChatHistory);
      socket.off('chat:typing', onChatTyping);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [threadId, accessToken]);

  // Join thread and load history when threadId changes
  useEffect(() => {
    if (!threadId || !accessToken || !socketRef.current) return;

    setLoading(true);

    // Initial fetch from REST to load immediately without waiting for socket handshake
    listMessages(threadId, accessToken)
      .then((history) => {
        setMessages((prev) => {
          if (prev.length === 0) return history;
          const messageMap = new Map<string, ChatMessage>();
          for (const m of history) {
            const key = m._id || m.id || '';
            if (key) messageMap.set(key, m);
          }
          const pending = prev.filter(
            (m) => m.status === 'sending' && !messageMap.has(m._id) && (!m.clientId || !messageMap.has(m.clientId))
          );
          return [...Array.from(messageMap.values()), ...pending];
        });
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load messages from REST:', err);
        setLoading(false);
      });

    // Join room on socket
    socketRef.current.emit('chat:join', { threadId });
    socketRef.current.emit('chat:read', { threadId });
  }, [threadId, accessToken]);

  const send = useCallback(
    (payload: SendMessageOptions) => {
      if (!threadId || !socketRef.current) return;

      const clientId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const optimisticMessage: ChatMessage = {
        _id: clientId,
        id: clientId,
        clientId,
        threadId,
        sender: role,
        kind: payload.kind,
        text: payload.text || null,
        product: payload.product || null,
        measurements: payload.measurements || null,
        quotation: (payload.quotation as any) || null,
        attachment: payload.attachment || null,
        voiceUrl: payload.voiceUrl || null,
        voiceDuration: payload.voiceDuration || null,
        status: 'sending',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      socketRef.current.emit('chat:send', {
        threadId,
        clientId,
        ...payload,
      });
    },
    [threadId, role]
  );

  const markRead = useCallback(() => {
    if (!threadId || !socketRef.current) return;
    socketRef.current.emit('chat:read', { threadId });
  }, [threadId]);

  const sendTyping = useCallback(
    (typing: boolean) => {
      if (!threadId || !socketRef.current) return;
      const now = Date.now();
      // Throttle sending typing true to at most once per 1.5s
      if (typing && now - lastTypingSentRef.current < 1500) return;
      lastTypingSentRef.current = now;
      socketRef.current.emit('chat:typing', { threadId, typing });
    },
    [threadId]
  );

  const uploadMedia = useCallback(
    async (file: File | Blob, filename?: string) => {
      if (!threadId) throw new Error('No active thread');
      return await uploadChatMedia(file, threadId, accessToken, filename);
    },
    [threadId, accessToken]
  );

  return {
    messages,
    thread,
    setThread,
    isConnected,
    isTyping,
    loading,
    send,
    markRead,
    sendTyping,
    uploadMedia,
  };
}
