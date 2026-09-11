'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  type: 'order' | 'quote' | 'payment' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  linkUrl: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'quote',
    title: 'Quote Accepted by Customer',
    message: 'Aarav Sharma accepted your quotation of ₹12,000 for ORD-8098 (Sherwani).',
    time: '10 mins ago',
    isRead: false,
    linkUrl: '/tailor-dashboard/active-orders',
  },
  {
    id: 'notif-2',
    type: 'order',
    title: 'New Custom Order Request',
    message: 'Ananya Iyer submitted a request for Indo-Western Crop Top & Skirt.',
    time: '2 hours ago',
    isRead: false,
    linkUrl: '/tailor-dashboard/new-requests',
  },
  {
    id: 'notif-3',
    type: 'payment',
    title: 'Bank Payout Processed',
    message: 'Payout PAY-904 of ₹14,000 has been transferred to your registered bank account.',
    time: 'Yesterday',
    isRead: true,
    linkUrl: '/tailor-dashboard/earnings',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Profile Verification Update',
    message: 'Your tailor studio documentation is currently under final admin review.',
    time: '2 days ago',
    isRead: true,
    linkUrl: '/tailor-dashboard',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-xs text-gray-600">Updates on order requests, quote acceptances, and payouts.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-[#00c9b7] hover:underline"
          >
            Mark all as read
          </button>
          <Link href="/tailor-dashboard" className="text-sm font-semibold text-[#00c9b7] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  item.isRead ? 'bg-white' : 'bg-teal-50/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      item.isRead ? 'bg-gray-300' : 'bg-[#00c9b7]'
                    }`}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-gray-900">{item.title}</h3>
                      <span className="text-[10px] text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-600">{item.message}</p>
                    <Link
                      href={item.linkUrl}
                      className="inline-block text-[11px] font-semibold text-[#00c9b7] hover:underline pt-1"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>

                <button
                  onClick={() => handleClearNotification(item.id)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1"
                  title="Dismiss"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <div className="text-3xl">🔔</div>
            <h3 className="text-base font-bold text-gray-800">No notifications</h3>
            <p className="text-xs text-gray-500">You are all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}