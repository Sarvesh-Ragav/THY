'use client';

import React, { useState } from 'react';

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
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 text-slate-800 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Notifications Center</h1>
            {unreadCount > 0 && (
              <span className="bg-[#00c9b7] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time updates regarding new orders, customer messages, and payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
            >
              ✓ Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        
        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'all' ? 'bg-[#00c9b7] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'unread' ? 'bg-[#00c9b7] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
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
              <p className="text-xs font-bold text-slate-400">No notifications found.</p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex justify-between items-start gap-4 ${
                  !n.isRead
                    ? 'bg-teal-50/30 border-[#00c9b7]/40 shadow-xs'
                    : 'bg-white border-slate-200/80'
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
                      <h3 className="text-xs font-bold text-slate-900">{n.title}</h3>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#00c9b7]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
                    <span className="text-[10px] font-medium text-slate-400 block pt-1">{n.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-[10px] font-bold text-[#00c9b7] hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="text-slate-400 hover:text-rose-500 text-xs px-1"
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
  );
}