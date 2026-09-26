'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useDirectoryTailors } from '@/hooks/useDirectoryTailors';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { listThreads, type ChatThread } from '@/lib/chat-api';

type ChatRow = {
  id: string;
  name: string;
  studio: string;
  preview: string;
  image: string;
  time?: string;
  unread: number;
};

function initials(name: string) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '');
  return letters.join('') || 'T';
}

function formatChatTime(iso?: string) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export function CustomerChatInbox() {
  const { accessToken } = useTailorSession();
  const { tailors, loading: tailorsLoading, error: tailorsError } = useDirectoryTailors();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!accessToken) {
      setThreadsLoading(false);
      return;
    }

    let cancelled = false;
    setThreadsLoading(true);
    listThreads(accessToken)
      .then((loaded) => {
        if (!cancelled) setThreads(loaded);
      })
      .catch(() => {
        if (!cancelled) setThreads([]);
      })
      .finally(() => {
        if (!cancelled) setThreadsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const rows = useMemo(() => {
    const threadByTailor = new Map(threads.map((thread) => [String(thread.tailorId), thread]));
    const seen = new Set<string>();
    const items: Array<ChatRow & { sortTime: number }> = [];

    for (const tailor of tailors) {
      seen.add(tailor.id);
      const thread = threadByTailor.get(tailor.id);
      const sentAt = thread?.lastMessage?.sentAt;
      items.push({
        id: tailor.id,
        name: tailor.name || thread?.tailorName || 'Tailor',
        studio: tailor.studio || thread?.tailorStudio || '',
        preview: thread?.lastMessage?.text || tailor.specialty || 'Start a conversation',
        image: tailor.image || '',
        time: sentAt,
        unread: thread?.unreadCountCustomer || 0,
        sortTime: sentAt ? new Date(sentAt).getTime() : 0,
      });
    }

    for (const thread of threads) {
      const id = String(thread.tailorId || '');
      if (!id || seen.has(id)) continue;
      const sentAt = thread.lastMessage?.sentAt;
      items.push({
        id,
        name: thread.tailorName || 'Tailor',
        studio: thread.tailorStudio || '',
        preview: thread.lastMessage?.text || 'Conversation started',
        image: '',
        time: sentAt,
        unread: thread.unreadCountCustomer || 0,
        sortTime: sentAt ? new Date(sentAt).getTime() : 0,
      });
    }

    items.sort((a, b) => {
      if (a.sortTime !== b.sortTime) return b.sortTime - a.sortTime;
      return a.name.localeCompare(b.name);
    });

    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.name, item.studio, item.preview].some((value) => value.toLowerCase().includes(needle))
    );
  }, [tailors, threads, query]);

  const loading = tailorsLoading || threadsLoading;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">Messages</p>
        <h1 className="mt-1 text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          Chats
        </h1>
        <p className="mt-1 text-sm text-thy-muted">Choose a tailor to open the conversation.</p>
      </header>

      <form
        className="mt-5 flex items-center gap-2 border border-thy-ink/15 bg-thy-surface px-3 py-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search size={16} className="text-thy-subtle shrink-0" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tailors"
          className="w-full bg-transparent text-sm outline-none placeholder:text-thy-subtle"
        />
      </form>

      <section className="mt-4 thy-card overflow-hidden">
        {loading && (
          <div className="divide-y divide-thy-ink/10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-thy-mist shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-thy-mist" />
                  <div className="h-3 w-48 bg-thy-mist/80" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-thy-ink">
              {query.trim() ? 'No tailors match that search.' : 'No tailors to message yet.'}
            </p>
            {tailorsError && !query.trim() && (
              <p className="mt-2 text-xs text-thy-muted">{tailorsError}</p>
            )}
            <Link href="/tailors" className="inline-block mt-4 text-sm text-thy-brand border-b border-thy-brand">
              Browse tailors
            </Link>
          </div>
        )}

        {!loading && rows.length > 0 && (
          <ul className="divide-y divide-thy-ink/10">
            {rows.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/chat?tailor=${encodeURIComponent(row.id)}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-thy-mist transition-colors"
                >
                  {row.image ? (
                    <img src={row.image} alt="" className="h-12 w-12 rounded-full object-cover shrink-0 bg-thy-mist" />
                  ) : (
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-thy-deep text-thy-canvas text-sm font-semibold shrink-0">
                      {initials(row.name)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold text-thy-ink truncate">{row.name}</span>
                      {row.time ? (
                        <span className="text-[11px] text-thy-subtle whitespace-nowrap">{formatChatTime(row.time)}</span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-3">
                      <span className="text-xs text-thy-muted truncate">
                        {row.studio ? `${row.studio} · ` : ''}
                        {row.preview}
                      </span>
                      {row.unread > 0 ? (
                        <span className="inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full bg-thy-brand text-white text-[10px] font-bold">
                          {row.unread}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
