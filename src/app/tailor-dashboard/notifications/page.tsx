'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TailorPage } from '@/components/tailor/TailorPage';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

export default function TailorNotificationsPage() {
  const { session, updateSession } = useTailorSession();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const notifications = session.notifications;
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const filteredNotifs = notifications.filter((item) => (activeTab === 'unread' ? !item.isRead : true));

  const markAllAsRead = () => {
    updateSession({ notifications: notifications.map((item) => ({ ...item, isRead: true })) });
  };

  const markAsRead = (id: string) => {
    updateSession({
      notifications: notifications.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    });
  };

  const deleteNotification = (id: string) => {
    updateSession({ notifications: notifications.filter((item) => item.id !== id) });
  };

  return (
    <TailorPage
      title="Notifications"
      description="Updates on new orders, customer messages, and payouts."
      actions={
        unreadCount > 0 ? (
          <button
            type="button"
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
        <div className="thy-card p-6 space-y-4">
          <div className="flex gap-2 border-b border-thy-burgundy/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl ${
                activeTab === 'all' ? 'bg-thy-burgundy text-white shadow-xs' : 'text-thy-muted hover:text-thy-ink'
              }`}
            >
              All Alerts ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl ${
                activeTab === 'unread' ? 'bg-thy-burgundy text-white shadow-xs' : 'text-thy-muted hover:text-thy-ink'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          <div className="space-y-3">
            {filteredNotifs.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-xs font-bold text-thy-subtle">No notifications found.</p>
              </div>
            ) : (
              filteredNotifs.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-2xl border flex justify-between items-start gap-4 ${
                    !note.isRead ? 'bg-thy-mist/30 border-thy-burgundy/40 shadow-xs' : 'bg-thy-surface border-thy-burgundy/15'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-thy-ink">{note.title}</h3>
                      {!note.isRead ? <span className="w-2 h-2 rounded-full bg-thy-burgundy" /> : null}
                    </div>
                    <p className="text-xs text-thy-muted leading-relaxed">{note.description}</p>
                    <span className="text-[10px] font-medium text-thy-subtle block pt-1">{note.timestamp}</span>
                    {note.linkUrl ? (
                      <Link href={note.linkUrl} className="text-[11px] font-bold text-thy-burgundy hover:underline">
                        Open →
                      </Link>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!note.isRead ? (
                      <button type="button" onClick={() => markAsRead(note.id)} className="text-[10px] font-bold text-thy-burgundy hover:underline">
                        Mark read
                      </button>
                    ) : null}
                    <button type="button" onClick={() => deleteNotification(note.id)} className="text-thy-subtle hover:text-rose-500 text-xs px-1">
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
