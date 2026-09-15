'use client';

import React from 'react';
import type { ChatThread } from '@/lib/chat-api';

interface ThreadListProps {
  threads: ChatThread[];
  activeId: string | null;
  onSelect: (threadId: string) => void;
  viewerRole?: 'tailor' | 'customer';
}

export function ThreadList({
  threads,
  activeId,
  onSelect,
  viewerRole = 'tailor',
}: ThreadListProps) {
  if (!threads || threads.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-thy-muted">
        No active conversations yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-thy-ink/10 overflow-y-auto max-h-[42rem]">
      {threads.map((thread) => {
        const id = thread._id || thread.id || '';
        const isActive = id === activeId;
        const displayName = viewerRole === 'tailor' ? thread.customerName || 'Customer' : thread.tailorName || 'Tailor';
        const unreadCount = viewerRole === 'tailor' ? thread.unreadCountTailor : thread.unreadCountCustomer;
        const lastMsgTime = thread.lastMessage?.sentAt
          ? new Date(thread.lastMessage.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '';

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`w-full text-left p-4 transition-colors flex items-start justify-between gap-3 ${
              isActive ? 'bg-thy-mist border-l-4 border-thy-brand' : 'hover:bg-thy-surface/70'
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-medium text-thy-ink truncate">{displayName}</p>
                {lastMsgTime && <span className="text-[10px] text-thy-muted whitespace-nowrap">{lastMsgTime}</span>}
              </div>

              <p className="text-xs text-thy-muted truncate">
                {thread.lastMessage?.text || 'Conversation started'}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-thy-ink/15 text-thy-muted rounded-sm">
                  {thread.status.replace(/_/g, ' ')}
                </span>
                {thread.activeQuotation && (
                  <span className="text-[10px] font-semibold text-thy-brand">
                    ₹{thread.activeQuotation.price}
                  </span>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white bg-thy-brand rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
