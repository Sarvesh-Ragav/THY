'use client';

import React, { useState } from 'react';
import { TailorPage } from '@/components/tailor/TailorPage';

interface NotificationItem {
  id: string;
  type: 'order' | 'message' | 'payout' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'New Estimate Request Received',
    description: 'Ananya Ramesh submitted a request for "Bridal Designer Blouse (Silk)". Review specs & send quote.',
    timestamp: '10 mins ago',
    isRead: false,
    linkUrl: '/tailor-dashboard/new-requests',
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'New Message from Meera K.',
    description: '"Could you confirm if the fabric has arrived safely?"',
    timestamp: '1 hour ago',
    isRead: false,
    linkUrl: '/tailor-dashboard/chat',
  },
  {
    id: 'notif-3',
    type: 'payout',
    title: 'Bank Payout Processed',
    description: 'Payout of ₹765 for Order THY-8719 has been successfully transferred to your HDFC Bank account.',
    timestamp: 'Yesterday',
    isRead: true,
    linkUrl: '/tailor-dashboard/earnings',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'THY Verified Badge Active',
    description: 'Your tailor profile has been verified! You now enjoy higher search rankings in your local area.',
    timestamp: '3 days ago',
    isRead: true,
    linkUrl: '/tailor-dashboard/portfolio',
  },
];

export default function TailorNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <TailorPage
      title="Notifications"
      description="Updates on new orders, customer messages, and payouts."
      actions={
        unreadCount > 0 ? (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center min-h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] border border-thy-burgundy/20 bg-thy-cream text-thy-ink hover:border-thy-burgundy/40"
          >
            Mark all as read
            <span className="ml-2 bg-thy-burgundy text-white text-[10px] px-2 py-0.5">{unreadCount}</span>
          </button>
        ) : null
      }
    >
      <div className="space-y-6 text-thy-ink">

      {/* Main Card */}
      <div className="thy-card p-6 space-y-4">
        
        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-thy-burgundy/10 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'all' ? 'bg-thy-burgundy text-white shadow-xs' : 'text-thy-muted hover:text-thy-ink'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'unread' ? 'bg-thy-burgundy text-white shadow-xs' : 'text-thy-muted hover:text-thy-ink'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="text-3xl">🔔</span>
              <p className="text-xs font-bold text-thy-subtle">No notifications found.</p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex justify-between items-start gap-4 ${
                  !n.isRead
                    ? 'bg-thy-mist/30 border-thy-burgundy/40 shadow-xs'
                    : 'bg-thy-surface border-thy-burgundy/15'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl">
                    {n.type === 'order' && '🛍️'}
                    {n.type === 'message' && '💬'}
                    {n.type === 'payout' && '💰'}
                    {n.type === 'system' && '✨'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-thy-ink">{n.title}</h3>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-thy-burgundy" />
                      )}
                    </div>
                    <p className="text-xs text-thy-muted leading-relaxed">{n.description}</p>
                    <span className="text-[10px] font-medium text-thy-subtle block pt-1">{n.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-[10px] font-bold text-thy-burgundy hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="text-thy-subtle hover:text-rose-500 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
      </div>
    </TailorPage>
  );
}