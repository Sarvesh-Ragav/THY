'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Ruler, CheckCheck, Clock, Send, Image as ImageIcon } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useSocketChat } from '@/hooks/useSocketChat';
import {
  listThreads,
  resolveMediaUrl,
  type ChatThread,
} from '@/lib/chat-api';
import { ThreadList } from '@/components/chat/ThreadList';
import { TypingIndicator } from '@/components/chat/TypingIndicator';

export default function TailorChatPage() {
  const { accessToken } = useTailorSession();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [text, setText] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('Includes stitching, lining, and the discussed customizations.');
  const [needsClarification, setNeedsClarification] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Load threads from MongoDB for the tailor
  useEffect(() => {
    if (!accessToken) {
      setLoadingThreads(false);
      return;
    }

    setLoadingThreads(true);
    listThreads(accessToken)
      .then((loadedThreads) => {
        setThreads(loadedThreads);
        if (loadedThreads.length > 0 && !activeId) {
          const firstId = loadedThreads[0]._id || loadedThreads[0].id || null;
          setActiveId(firstId);
        }
      })
      .catch((err) => {
        console.error('Failed to load tailor chat threads:', err);
      })
      .finally(() => {
        setLoadingThreads(false);
      });
  }, [accessToken]);

  const activeThread = useMemo(
    () => threads.find((t) => (t._id || t.id) === activeId) ?? null,
    [threads, activeId]
  );

  const {
    messages,
    thread,
    isConnected,
    isTyping,
    send,
    sendTyping,
  } = useSocketChat(activeId, accessToken, activeThread, 'tailor');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  const sendText = () => {
    if (!activeId || !text.trim()) return;
    const value = text.trim();
    setText('');
    sendTyping(false);

    send({
      kind: 'text',
      text: value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    sendTyping(true);
  };

  const sendPrice = () => {
    if (!activeId || !price.trim()) return;

    send({
      kind: 'quotation',
      text: `Quotation: ₹${price.trim()}`,
      quotation: {
        id: `q-${Date.now()}`,
        price: price.trim(),
        notes: note,
        status: 'pending',
      },
    });

    setPrice('');
  };

  if (loadingThreads) {
    return (
      <div className="p-8 text-sm text-thy-subtle animate-pulse">
        Connecting to tailor workspace and loading conversations...
      </div>
    );
  }

  return (
<<<<<<< Updated upstream
    <div className="space-y-4 text-thy-ink">
=======
    <div className="p-4 md:p-8 min-h-screen bg-thy-bg text-thy-ink space-y-4">
      {/* Top bar */}
>>>>>>> Stashed changes
      <div className="thy-card p-5 flex justify-between items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">
            Tailor Workspace · Live Consultation
          </p>
          <h1 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Customer Conversations
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          <span className="text-xs text-thy-muted">
            {isConnected ? 'Socket connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {threads.length === 0 ? (
        <div className="thy-card p-12 text-center space-y-2">
          <p className="text-base font-medium">No customer conversations yet</p>
          <p className="text-xs text-thy-muted max-w-md mx-auto">
            Conversations will appear here in real time as soon as customers consult you from your tailor profile or saved designs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[38rem]">
          {/* Thread List Sidebar */}
          <aside className="thy-card overflow-hidden">
            <div className="p-3 border-b border-thy-ink/10 bg-thy-mist/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-thy-muted">
                Active Inquiries ({threads.length})
              </p>
            </div>
            <ThreadList
              threads={threads}
              activeId={activeId}
              onSelect={setActiveId}
              viewerRole="tailor"
            />
          </aside>

          {/* Active Conversation Detail */}
          {activeThread && (
            <section className="md:col-span-2 thy-card flex flex-col min-h-[38rem]">
              {/* Thread header */}
              <div className="p-4 border-b border-thy-ink/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">{activeThread.customerName || 'Customer'}</h2>
                  <p className="text-xs text-thy-muted">
                    Status: <span className="capitalize">{activeThread.status.replace(/_/g, ' ')}</span>
                  </p>
                </div>
                {activeThread.activeQuotation && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-thy-muted">Active Price</span>
                    <p className="text-lg font-bold text-thy-brand">₹{activeThread.activeQuotation.price}</p>
                  </div>
                )}
              </div>
<<<<<<< Updated upstream
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
=======

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[26rem]">
                {messages.map((message) => {
                  const isTailor = message.sender === 'tailor';
                  const isSystem = message.sender === 'system' || message.kind === 'system';

                  if (isSystem) {
                    return (
                      <div key={message._id || message.id} className="text-center my-2">
                        <span className="inline-block px-3 py-1 bg-thy-mist text-thy-muted text-xs rounded-full border border-thy-ink/10">
                          {message.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <article
                      key={message._id || message.id}
                      className={`max-w-[85%] p-3.5 text-sm rounded-sm ${
                        isTailor ? 'ml-auto bg-thy-deep text-[#fbfefd]' : 'bg-thy-mist text-thy-ink'
                      }`}
                    >
                      {/* Visual Design / Fabric Attachment */}
                      {message.kind === 'attachment' && message.attachment && (
                        <div className="mb-2 p-2 bg-black/10 rounded-sm">
                          {message.attachment.preview && (
                            <img
                              src={resolveMediaUrl(message.attachment.preview)}
                              alt={message.attachment.title}
                              className="h-36 w-full object-cover rounded-sm mb-2"
                            />
                          )}
                          <p className="text-[10px] uppercase tracking-[0.14em] opacity-80">
                            {message.attachment.kind}
                          </p>
                          <p className="font-medium text-xs">{message.attachment.title}</p>
                          {message.attachment.details && (
                            <p className="text-[11px] opacity-80 mt-1">{message.attachment.details}</p>
                          )}
                        </div>
                      )}

                      {/* Customer Measurements Card */}
                      {message.kind === 'measurements' && (
                        <div className="mb-2 p-2.5 border border-thy-ink/20 bg-black/5 rounded-sm space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <Ruler size={14} />
                            <span>Customer Measurements</span>
                          </div>
                          {message.measurements && (
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs pt-1">
                              {Object.entries(message.measurements).map(([k, v]) => (
                                <div key={k} className="flex justify-between border-b border-thy-ink/10 pb-0.5">
                                  <span className="capitalize opacity-80">{k}:</span>
                                  <span className="font-mono font-medium">{String(v)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Voice Note Audio Player */}
                      {message.kind === 'voice' && message.voiceUrl && (
                        <div className="mb-2">
                          <audio controls src={resolveMediaUrl(message.voiceUrl)} className="w-full h-8" />
                        </div>
                      )}

                      {/* Tailor Quotation Bubble */}
                      {message.kind === 'quotation' && message.quotation && (
                        <div className="border border-white/20 p-3 space-y-1.5 bg-black/10 rounded-sm">
                          <p className="text-[10px] uppercase tracking-wider opacity-80">Official Price Quotation</p>
                          <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                            ₹{message.quotation.price}
                          </p>
                          {message.quotation.notes && <p className="text-xs opacity-90">{message.quotation.notes}</p>}
                        </div>
                      )}

                      {message.text && message.kind !== 'quotation' && <p>{message.text}</p>}

                      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                        <span>
                          {message.createdAt
                            ? new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                        {isTailor && (
                          <span>
                            {message.status === 'sending' ? (
                              <Clock size={10} className="animate-spin inline" />
                            ) : (
                              <CheckCheck size={12} className="inline" />
                            )}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}

                {isTyping && <TypingIndicator who={activeThread.customerName || 'Customer'} />}
                <div ref={bottomRef} />
>>>>>>> Stashed changes
              </div>

              {/* Quotation Composer Drawer */}
              <div className="p-4 border-t border-thy-ink/10 space-y-3 bg-thy-mist/40">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-thy-brand font-semibold">
                    {activeThread.activeQuotation ? 'Update Fixed Quotation' : 'Send Fixed Quotation'}
                  </p>
                  <span className="text-xs text-thy-muted">Official pricing for customer</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    className="thy-input"
                    type="number"
                    placeholder="Total Price (₹)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <input
                    className="thy-input sm:col-span-2"
                    placeholder="Stitching notes, inclusions, turnaround..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={sendPrice}
                  disabled={!price.trim()}
                  className="hero-leather-btn w-full min-h-10 text-[11px] uppercase tracking-[0.16em] disabled:opacity-50"
                >
                  Send Quotation to Customer
                </button>
              </div>

              {/* Reply Input Bar */}
              <form
                className="p-3 border-t border-thy-ink/10 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendText();
                }}
              >
                <input
                  className="thy-input flex-1 min-h-11"
                  value={text}
                  onChange={handleInputChange}
                  placeholder="Reply to the customer with fabric advice, turnaround time, etc..."
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="hero-leather-btn px-5 text-[11px] uppercase tracking-[0.14em] inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send size={14} />
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
