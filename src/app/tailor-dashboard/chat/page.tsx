'use client';

import React, { useMemo, useState } from 'react';
import { useC31 } from '@/hooks/useC31';
import { appendMessage, nowStamp, patchThread } from '@/lib/c31';

export default function TailorChatPage() {
  const { state, ready, save } = useC31();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('Includes stitching, lining, and the discussed customizations.');
  const [needsClarification, setNeedsClarification] = useState(false);

  const threads = state.threads;
  const active = useMemo(
    () => threads.find((thread) => thread.id === (activeId || threads[0]?.id)) ?? null,
    [threads, activeId],
  );

  if (!ready) return <p className="p-8 text-sm text-thy-subtle">Loading chat...</p>;

  const sendText = () => {
    if (!active || !text.trim()) return;
    const value = text.trim();
    setText('');
    save((current) => {
      let next = appendMessage(current, active.id, {
        id: `t-${Date.now()}`,
        sender: 'tailor',
        kind: 'text',
        text: value,
        createdAt: nowStamp(),
        status: 'sent',
      });
      if (needsClarification && active.status === 'request_sent') {
        next = patchThread(next, active.id, (thread) => ({
          ...thread,
          status: 'needs_clarification',
          request: thread.request ? { ...thread.request, status: 'needs_clarification' } : thread.request,
        }));
      }
      return next;
    });
    setNeedsClarification(false);
  };

  const sendPrice = () => {
    if (!active || !price.trim()) return;
    const quote = {
      id: `q-${Date.now()}`,
      price: price.trim(),
      note,
      sentAt: nowStamp(),
      updated: Boolean(active.quotation),
    };
    save((current) =>
      patchThread(current, active.id, (thread) => ({
        ...thread,
        status: thread.quotation ? 'quotation_updated' : 'price_fixed',
        quotation: quote,
        request: thread.request ? { ...thread.request, status: 'priced' } : thread.request,
        messages: [
          ...thread.messages,
          {
            id: `quote-${Date.now()}`,
            sender: 'tailor',
            kind: 'quotation',
            text: `Final price ₹${quote.price}`,
            createdAt: nowStamp(),
            status: 'sent',
            quotation: quote,
          },
        ],
      })),
    );
    setPrice('');
  };

  return (
    <div className="space-y-4 text-thy-ink">
      <div className="thy-card p-5 flex justify-between items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">C31</p>
          <h1 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Customer chat
          </h1>
        </div>
        <span className="text-xs text-thy-brand">Online</span>
      </div>

      {threads.length === 0 ? (
        <p className="text-sm text-thy-muted">No customer conversations yet. They start when a customer opens chat from a tailor profile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[36rem]">
          <aside className="thy-card overflow-hidden">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => setActiveId(thread.id)}
                className={`w-full text-left p-4 border-b border-thy-ink/10 ${
                  thread.id === active?.id ? 'bg-thy-mist' : ''
                }`}
              >
                <p className="text-sm font-medium">Customer</p>
                <p className="text-xs text-thy-muted">{thread.tailorStudio} · {thread.status.replaceAll('_', ' ')}</p>
              </button>
            ))}
          </aside>

          {active && (
            <section className="md:col-span-2 thy-card flex flex-col">
              <div className="p-4 border-b border-thy-ink/10">
                <p className="text-sm">Thread · {active.status.replaceAll('_', ' ')}</p>
                {active.request && (
                  <p className="text-xs text-thy-muted mt-1">
                    {active.request.garment} · {active.request.fabric} · {active.request.measurements}
                  </p>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[22rem]">
                {active.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[80%] p-3 text-sm ${
                      message.sender === 'tailor' ? 'ml-auto bg-thy-deep text-[#FBF6ED]' : 'bg-thy-mist'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-[10px] opacity-70 mt-1">{message.createdAt}</p>
                  </div>
                ))}
              </div>

              {(active.status === 'request_sent' || active.status === 'needs_clarification' || active.status === 'price_fixed') && (
                <div className="p-4 border-t border-thy-ink/10 space-y-3 bg-thy-mist/60">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-thy-subtle">
                    {active.quotation ? 'Update price' : 'Fix price'}
                  </p>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={needsClarification}
                      onChange={(event) => setNeedsClarification(event.target.checked)}
                    />
                    Clarification needed — send a chat note first
                  </label>
                  <input
                    className="thy-input"
                    placeholder="Final price"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                  <textarea
                    className="thy-input min-h-20"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                  <button type="button" onClick={sendPrice} className="hero-leather-btn w-full min-h-11 text-[11px] uppercase tracking-[0.16em]">
                    Confirm / send final price
                  </button>
                </div>
              )}

              <form
                className="p-3 border-t border-thy-ink/10 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendText();
                }}
              >
                <input
                  className="thy-input flex-1"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Reply to the customer..."
                />
                <button type="submit" className="hero-leather-btn px-5 text-[11px] uppercase tracking-[0.14em]">
                  Send
                </button>
              </form>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
