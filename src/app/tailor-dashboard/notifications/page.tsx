'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const initialNotifications = [
  {
    id: 1,
    type: 'request',
    title: 'New Order Request Received',
    description: 'Ananya Sharma submitted a custom request for a Designer Anarkali.',
    time: '10 minutes ago',
    unread: true,
  },
  {
    id: 2,
    type: 'payout',
    title: 'Payout Processed',
    description: 'Payment of ₹18,200 for settlement PAY-402 has been sent to your registered bank account.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 3,
    type: 'system',
    title: 'Profile Verification Update',
    description: 'Your tailor studio documentation is currently under final review by THY Admin.',
    time: '1 day ago',
    unread: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications & Alerts</h1>
          <p className="text-sm text-gray-600">Stay informed about order changes, customer updates, and system alerts.</p>
        </div>
        <Link 
          href="/tailor-dashboard" 
          className="text-sm font-semibold text-[#00c9b7] hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-xs font-semibold text-gray-600">
          Unread Alerts: {notifications.filter((n) => n.unread).length}
        </span>
        <button
          onClick={markAllAsRead}
          className="text-xs font-semibold text-[#00c9b7] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-colors flex justify-between items-start gap-4 ${
                item.unread 
                  ? 'bg-white border-[#00c9b7]/30 shadow-sm' 
                  : 'bg-gray-50/60 border-gray-100'
              }`}
            >
              <div className="flex gap-3">
                <div className="text-xl">
                  {item.type === 'request' && '📩'}
                  {item.type === 'payout' && '💰'}
                  {item.type === 'system' && '🔔'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#00c9b7]"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">{item.time}</span>
                </div>
              </div>

              <button
                onClick={() => clearNotification(item.id)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-500">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
}