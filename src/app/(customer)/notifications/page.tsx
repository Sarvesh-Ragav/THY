'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { markInboxRead, unreadCount } from '@/lib/notifications';
import { markInboxAllRead, markInboxItemRead } from '@/lib/notification-api';

const TYPE_LABEL: Record<string, string> = {
  order: 'Order',
  quotation: 'Quotation',
  chat: 'Chat',
  pickup: 'Fabric pickup',
  delivery: 'Outfit handover',
  request: 'Request',
  message: 'Message',
  payout: 'Payout',
  system: 'Update',
};

export default function NotificationsPage() {
  const router = useRouter();
  const { session, updateSession, accessToken } = useTailorSession();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const items = session.customerNotifications ?? [];
  const unread = unreadCount(items);
  const visible = items.filter((item) => (tab === 'unread' ? !item.isRead : true));

  const openItem = (id: string, linkUrl?: string) => {
    updateSession({ customerNotifications: markInboxRead(items, id) });
    if (accessToken) void markInboxItemRead(id, accessToken).catch(() => undefined);
    if (linkUrl) router.push(linkUrl);
  };

  return (
    <RequireCustomerAuth>
      <CustomerPage titleKey="pageNotifications">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab('all')}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] border ${
                tab === 'all' ? 'bg-thy-burgundy text-white border-thy-burgundy' : 'border-thy-burgundy/20'
              }`}
            >
              All · {items.length}
            </button>
            <button
              type="button"
              onClick={() => setTab('unread')}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] border ${
                tab === 'unread' ? 'bg-thy-burgundy text-white border-thy-burgundy' : 'border-thy-burgundy/20'
              }`}
            >
              Unread · {unread}
            </button>
          </div>
          {unread > 0 ? (
            <button
              type="button"
              onClick={() => {
                updateSession({ customerNotifications: markInboxRead(items) });
                if (accessToken) void markInboxAllRead(accessToken).catch(() => undefined);
              }}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-thy-burgundy"
            >
              Mark all read
            </button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <div className="thy-card p-10 text-center space-y-2">
            <p className="text-lg text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              No notifications yet
            </p>
            <p className="text-sm text-thy-muted">
              Order tracking, quotations, chat, fabric pickup, and outfit handover updates appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openItem(item.id, item.linkUrl)}
                  className={`w-full text-left thy-card p-4 ${item.isRead ? '' : 'border-thy-burgundy/40 bg-thy-mist/40'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-thy-burgundy">
                        {TYPE_LABEL[item.type] || item.type}
                      </p>
                      <p className="text-sm font-semibold text-thy-ink mt-1">{item.title}</p>
                      <p className="text-sm text-thy-muted mt-1">{item.description}</p>
                      <p className="text-[11px] text-thy-subtle mt-2">{item.timestamp}</p>
                      {item.linkUrl ? (
                        <span className="inline-block mt-2 text-xs font-bold text-thy-burgundy">Open →</span>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CustomerPage>
    </RequireCustomerAuth>
  );
}
