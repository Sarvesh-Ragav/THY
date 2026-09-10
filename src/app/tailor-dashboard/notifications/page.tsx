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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-thy-ink">Notifications & Alerts</h1>
          <p className="text-sm text-thy-muted">Stay informed about order changes, customer updates, and system alerts.</p>
        </div>
        <Link 
          href="/tailor-dashboard" 
          className="text-sm font-semibold text-thy-brand hover:underline self-start"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-thy-surface p-4 rounded-2xl border border-thy-ink/10 shadow-sm">
        <span className="text-xs font-semibold text-thy-muted">
          Unread Alerts: {notifications.filter((n) => n.unread).length}
        </span>
        <button
          onClick={markAllAsRead}
          className="text-xs font-semibold text-thy-brand hover:underline"
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
              className={`p-4 rounded-2xl border transition-colors flex justify-between items-start gap-3 ${
                item.unread 
                  ? 'bg-thy-surface border-thy-brand/30 shadow-sm' 
                  : 'bg-thy-mist/70 border-thy-ink/10'
              }`}
            >
              <div className="flex gap-3">
                <div className="text-xl">
                  {item.type === 'request' && '📩'}
                  {item.type === 'payout' && '💰'}
                  {item.type === 'system' && '🔔'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-thy-ink">{item.title}</h3>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-thy-brand"></span>
                    )}
                  </div>
                  <p className="text-xs text-thy-muted mt-0.5">{item.description}</p>
                  <span className="text-[10px] text-thy-subtle mt-2 block">{item.time}</span>
                </div>
              </div>

              <button
                onClick={() => clearNotification(item.id)}
                className="text-thy-subtle hover:text-thy-muted text-xs font-bold"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <div className="bg-thy-surface p-8 rounded-2xl border border-thy-ink/10 text-center text-xs text-thy-muted">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
}