'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Mic, Paperclip, Ruler, Send, CheckCheck, Clock } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useSocketChat } from '@/hooks/useSocketChat';
import {
  ensureThread,
  listCustomerDesigns,
  resolveMediaUrl,
  type ChatAttachment,
  type ChatThread,
  type CustomerDesign,
} from '@/lib/chat-api';
import { toShareableMeasurement } from '@/lib/measurements';
import { useSavedMeasurements } from '@/hooks/useSavedMeasurements';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { tailorDirectoryEntry, estimateHref, type ChatEntry } from '@/lib/c31';
import type { CustomerDesignSave } from '@/lib/tailor-session';
import { recordEstimateRequest } from '@/lib/notifications';

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-sm border border-thy-ink/15 bg-thy-surface text-thy-ink hover:bg-thy-mist transition-colors';

export function CustomerChatView({
  tailorId,
  from,
  designs: localDesigns = [],
}: {
  tailorId?: string | null;
  from?: ChatEntry | string | null;
  designs?: CustomerDesignSave[];
}) {
  const { updateSession, accessToken } = useTailorSession();
  const { measurements: savedMeasurements } = useSavedMeasurements();
  const fileRef = useRef<HTMLInputElement>(null);

  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [threadLoading, setThreadLoading] = useState(true);
  const [threadError, setThreadError] = useState<string | null>(null);

  const [text, setText] = useState('');
  const [sheet, setSheet] = useState<'measurements' | 'fabric' | 'design' | null>(null);
  const [preview, setPreview] = useState<ChatAttachment | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // MongoDB sourced options
  const [serverDesigns, setServerDesigns] = useState<CustomerDesign[]>([]);

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [pendingVoice, setPendingVoice] = useState<{ blob: Blob; url: string; duration: number } | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch or initialize thread from MongoDB
  useEffect(() => {
    if (!accessToken || !tailorId) {
      setThreadLoading(false);
      return;
    }

    setThreadLoading(true);
    setThreadError(null);

    ensureThread(tailorId, accessToken)
      .then((thread) => {
        setActiveThread(thread);
      })
      .catch((err) => {
        console.error('Failed to ensure thread:', err);
        setThreadError(err.message || 'Unable to open chat conversation');
      })
      .finally(() => {
        setThreadLoading(false);
      });
  }, [tailorId, accessToken]);

  // Load saved designs and measurements from MongoDB
  useEffect(() => {
    if (!accessToken) return;

    listCustomerDesigns(accessToken)
      .then(setServerDesigns)
      .catch((err) => console.warn('Could not load designs from MongoDB:', err));
  }, [accessToken]);

  const activeThreadId = activeThread?._id || activeThread?.id || null;

  const {
    messages,
    thread,
    isConnected,
    isTyping,
    send,
    sendTyping,
    uploadMedia,
  } = useSocketChat(activeThreadId, accessToken, activeThread, 'customer');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  const fallbackTailor = useMemo(() => tailorDirectoryEntry(tailorId), [tailorId]);
  const tailorName = thread?.tailorName || fallbackTailor?.name || 'Tailor';
  const tailorStudio = thread?.tailorStudio || fallbackTailor?.studio || 'Atelier';

  const sendText = () => {
    const value = text.trim();
    if (!value) return;
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

  const sendAttachment = async (attachment: ChatAttachment, fileToUpload?: File | null) => {
    try {
      setIsUploading(true);
      let finalAttachment = { ...attachment };

      if (fileToUpload) {
        const uploaded = await uploadMedia(fileToUpload);
        finalAttachment.preview = uploaded.url;
      }

      send({
        kind: 'attachment',
        text: finalAttachment.title,
        attachment: finalAttachment,
      });

      setPreview(null);
      setPreviewFile(null);
      setSheet(null);
    } catch (err: any) {
      alert(err.message || 'Failed to upload attachment');
    } finally {
      setIsUploading(false);
    }
  };

  const sendMeasurementCard = (item: ReturnType<typeof toShareableMeasurement>) => {
    send({
      kind: 'measurements',
      text: `Measurements: ${item.label}`,
      measurements: item.values,
      attachment: {
        kind: 'measurements',
        title: item.label,
        details: Object.entries(item.values || {})
          .map(([k, v]) => `${k}: ${v}${item.unit || 'in'}`)
          .join(' · '),
        href: '/my-measurements',
      },
    });
    setSheet(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      startedAtRef.current = Date.now();
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setPendingVoice({
          blob,
          url,
          duration: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
        });
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (err) {
      alert('Could not access microphone');
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const sendVoice = async () => {
    if (!pendingVoice) return;
    try {
      setIsUploading(true);
      const uploaded = await uploadMedia(pendingVoice.blob, `voice-${Date.now()}.webm`);
      send({
        kind: 'voice',
        text: `Voice note · ${pendingVoice.duration}s`,
        voiceUrl: uploaded.url,
        voiceDuration: pendingVoice.duration,
      });
      setPendingVoice(null);
    } catch (err: any) {
      alert(err.message || 'Failed to upload voice note');
    } finally {
      setIsUploading(false);
    }
  };

  const placeOrder = () => {
    send({
      kind: 'system',
      text: 'Place Order sent. Requirements are finalized. Tailor will review and send a fixed price quotation.',
    });
    updateSession((current) =>
      recordEstimateRequest(current, {
        garmentType: thread?.activeQuotation ? 'Quoted garment' : 'Custom stitch',
        tailorName: thread?.tailorName || tailorName,
        description: 'Order placed from live chat',
      })
    );
  };

  const fabrics = [
    { id: 'f1', title: 'Uploaded charcoal silk', preview: '/hero/fabric-charcoal.png' },
    { id: 'f2', title: 'Beige brocade', preview: '/hero/fabric-beige.png' },
    { id: 'f3', title: 'Olive weave', preview: '/hero/fabric-olive.png' },
  ];

  if (threadLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-thy-subtle">
        <p className="animate-pulse">Connecting to tailor chat...</p>
      </div>
    );
  }

  if (threadError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-red-600">
        <p>{threadError}</p>
        <Link href="/chat" className={`${ghostBtn} mt-4`}>
          Back to chats
        </Link>
      </div>
    );
  }

  const currentStatus = thread?.status || 'new';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <header className="thy-card p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/chat" className={`${ghostBtn} min-w-20`}>
            Chats
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">
              Live Tailor Consultation
            </p>
            <h1 className="text-2xl sm:text-3xl truncate" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {tailorName}
            </h1>
            <p className="text-xs text-thy-muted truncate">
              {tailorStudio} {from ? `· From ${from}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          <span className="text-xs text-thy-muted hidden sm:inline">
            {isConnected ? 'Real-time connected' : 'Connecting...'}
          </span>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] gap-4">
        <section className="thy-card flex flex-col min-h-[34rem]">
          {/* Message stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 max-h-[34rem]">
            {messages.map((message) => {
              const isCustomer = message.sender === 'customer';
              const isSystem = message.sender === 'system' || message.kind === 'system';

              if (isSystem) {
                return (
                  <div key={message._id || message.id} className="text-center my-3">
                    <span className="inline-block px-3 py-1.5 bg-thy-mist text-thy-subtle text-xs rounded-full border border-thy-ink/10">
                      {message.text}
                    </span>
                  </div>
                );
              }

              return (
                <article
                  key={message._id || message.id}
                  className={`max-w-[85%] p-3.5 text-sm rounded-sm ${
                    isCustomer ? 'ml-auto bg-thy-deep text-[#fbfefd]' : 'bg-thy-mist text-thy-ink'
                  }`}
                >
                  {message.kind === 'attachment' && message.attachment && (
                    <div className="mb-2 p-2 bg-black/10 rounded-sm">
                      {message.attachment.preview && (
                        <img
                          src={resolveMediaUrl(message.attachment.preview)}
                          alt={message.attachment.title}
                          className="h-36 w-full object-cover rounded-sm mb-2"
                        />
                      )}
                      <p className="text-[10px] uppercase tracking-[0.14em] opacity-80">{message.attachment.kind}</p>
                      <p className="font-medium text-xs">{message.attachment.title}</p>
                      {message.attachment.details && (
                        <p className="text-[11px] opacity-80 mt-1">{message.attachment.details}</p>
                      )}
                      {message.attachment.href && (
                        <Link href={message.attachment.href} className="underline text-xs mt-1 inline-block">
                          View details
                        </Link>
                      )}
                    </div>
                  )}

                  {message.kind === 'measurements' && (
                    <div className="mb-2 p-2.5 border border-white/20 bg-black/10 rounded-sm space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Ruler size={14} />
                        <span>Saved Measurements</span>
                      </div>
                      {message.measurements && (
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs pt-1">
                          {Object.entries(message.measurements).map(([k, v]) => (
                            <div key={k} className="flex justify-between border-b border-white/10 pb-0.5">
                              <span className="capitalize opacity-80">{k}:</span>
                              <span className="font-mono">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {message.kind === 'voice' && message.voiceUrl && (
                    <div className="mb-2">
                      <audio controls src={resolveMediaUrl(message.voiceUrl)} className="w-full h-8" />
                    </div>
                  )}

                  {message.kind === 'quotation' && message.quotation && (
                    <div className="border border-white/20 p-3 space-y-2 bg-thy-mist/10 rounded-sm">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-thy-brand">Official Quotation</p>
                        <span className="text-[10px] uppercase px-1.5 py-0.5 bg-thy-brand text-white rounded-xs">
                          {message.quotation.status}
                        </span>
                      </div>
                      <p className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                        ₹{message.quotation.price}
                      </p>
                      {message.quotation.notes && <p className="text-xs opacity-80">{message.quotation.notes}</p>}
                      <Link
                        href={estimateHref(activeThreadId || '')}
                        className="inline-flex text-xs underline font-medium mt-1 text-thy-brand"
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  )}

                  {message.text && message.kind !== 'quotation' && <p>{message.text}</p>}

                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                    <span>
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </span>
                    {isCustomer && (
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

            {isTyping && <TypingIndicator who={tailorName} />}
            <div ref={bottomRef} />
          </div>

          {/* Pending Voice Preview */}
          {pendingVoice && (
            <div className="px-4 py-3 border-t border-thy-ink/10 bg-thy-mist/80 space-y-2">
              <p className="text-xs text-thy-muted">Voice preview · {pendingVoice.duration}s</p>
              <audio controls src={pendingVoice.url} className="w-full" />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={ghostBtn}
                  onClick={() => setPendingVoice(null)}
                  disabled={isUploading}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="hero-leather-btn min-h-11 text-[11px] uppercase tracking-[0.14em]"
                  onClick={sendVoice}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Send Voice Note'}
                </button>
              </div>
            </div>
          )}

          {/* Chat input box */}
          <form
            className="p-3 border-t border-thy-ink/10 flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendText();
            }}
          >
            <button
              type="button"
              className={`${ghostBtn} px-3`}
              onClick={() => setSheet('design')}
              aria-label="Attachment"
              title="Share Design or Measurements"
            >
              <Paperclip size={16} />
            </button>

            <button
              type="button"
              className={`${ghostBtn} px-3 ${recording ? 'border-red-500 text-red-500 animate-pulse' : ''}`}
              onClick={() => (recording ? stopRecording() : startRecording())}
              aria-label="Voice"
              title={recording ? 'Stop Recording' : 'Hold or Click to Record Voice'}
            >
              <Mic size={16} />
            </button>

            <input
              value={text}
              onChange={handleInputChange}
              placeholder="Discuss design, fabric, measurements, price..."
              className="thy-input flex-1 min-h-11"
            />

            <button
              type="submit"
              disabled={!text.trim()}
              className="hero-leather-btn h-11 w-11 inline-flex items-center justify-center disabled:opacity-50"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </section>

        {/* Sidebar info & action panel */}
        <aside className="thy-card p-5 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle">Consultation Status</p>
          <div className="p-3 bg-thy-mist rounded-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-thy-brand">
              {currentStatus.replace(/_/g, ' ')}
            </span>
            <p className="text-xs text-thy-muted mt-1">
              {currentStatus === 'price_fixed' || currentStatus === 'quotation_updated'
                ? 'Tailor has provided a final quotation. You can review and proceed.'
                : 'Discuss requirements and share dress visuals and measurements.'}
            </p>
          </div>

          {currentStatus !== 'request_sent' &&
            currentStatus !== 'price_fixed' &&
            currentStatus !== 'quotation_updated' && (
              <button
                type="button"
                onClick={placeOrder}
                className="hero-leather-btn w-full min-h-12 text-[11px] uppercase tracking-[0.16em]"
              >
                Send Requirements
              </button>
            )}

          {thread?.activeQuotation && (
            <div className="p-3 border border-thy-brand/20 bg-thy-mist/40 space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-thy-muted">Current Fixed Price</p>
              <p className="text-2xl font-bold text-thy-brand">₹{thread.activeQuotation.price}</p>
              <Link
                href={estimateHref(activeThreadId || '')}
                className="hero-leather-btn inline-flex w-full items-center justify-center min-h-11 text-[11px] uppercase tracking-[0.16em]"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}

          <div className="border-t border-thy-ink/10 pt-4 space-y-2">
            <p className="text-xs font-medium text-thy-ink">Quick Share</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSheet('design')}
                className={`${ghostBtn} w-full text-xs gap-1.5`}
              >
                <ImageIcon size={14} />
                Dress Visual
              </button>
              <button
                type="button"
                onClick={() => setSheet('measurements')}
                className={`${ghostBtn} w-full text-xs gap-1.5`}
              >
                <Ruler size={14} />
                Measurements
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Attachment / Visual Sharing Modal Sheet */}
      {sheet && (
        <div className="fixed inset-0 z-50 bg-thy-deep/45 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-thy-surface p-5 sm:p-6 max-h-[90dvh] overflow-y-auto rounded-t-lg sm:rounded-lg shadow-xl">
            <div className="flex gap-2 mb-4 border-b border-thy-ink/10 pb-3">
              {(['design', 'measurements', 'fabric'] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setSheet(kind)}
                  className={`px-3 min-h-9 text-[11px] uppercase tracking-[0.12em] border rounded-xs ${
                    sheet === kind ? 'border-thy-brand text-thy-brand bg-thy-mist font-semibold' : 'border-thy-ink/15'
                  }`}
                >
                  {kind === 'design' ? 'Dress Visuals' : kind}
                </button>
              ))}
            </div>

            {/* Dress Visuals from MongoDB */}
            {sheet === 'design' && (
              <div className="space-y-3">
                <p className="text-xs text-thy-muted">
                  Share dress designs from your saved Design Studio concepts:
                </p>
                {serverDesigns.length === 0 && localDesigns.length === 0 ? (
                  <div className="p-4 text-center border border-dashed border-thy-ink/20 rounded-sm">
                    <p className="text-xs text-thy-muted mb-2">No saved designs found.</p>
                    <Link href="/stitch-your-outfit" className="text-xs text-thy-brand underline">
                      Create a design in Studio
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                    {/* Render designs saved in MongoDB StudioDesign */}
                    {serverDesigns.map((design) => (
                      <button
                        key={design._id || design.id}
                        type="button"
                        className="text-left border border-thy-ink/10 hover:border-thy-brand p-2 transition-colors rounded-xs group"
                        onClick={() =>
                          setPreview({
                            kind: 'design',
                            title: design.title,
                            preview: design.previewImageUrl,
                            details: design.category,
                          })
                        }
                      >
                        <img
                          src={resolveMediaUrl(design.previewImageUrl)}
                          alt={design.title}
                          className="h-28 w-full object-cover rounded-xs mb-2 group-hover:opacity-90"
                        />
                        <p className="text-xs font-medium truncate">{design.title}</p>
                        <p className="text-[10px] text-thy-muted capitalize">{design.category}</p>
                      </button>
                    ))}

                    {/* Fallback to local designs if any */}
                    {serverDesigns.length === 0 &&
                      localDesigns.map((design) => (
                        <button
                          key={design.id}
                          type="button"
                          className="text-left border border-thy-ink/10 hover:border-thy-brand p-2 transition-colors rounded-xs group"
                          onClick={() =>
                            setPreview({
                              kind: 'design',
                              title: design.title,
                              preview: design.fabricImage || '/hero/fabric-beige.png',
                              details: design.garment || 'Custom Garment',
                            })
                          }
                        >
                          <img
                            src={design.fabricImage || '/hero/fabric-beige.png'}
                            alt={design.title}
                            className="h-28 w-full object-cover rounded-xs mb-2 group-hover:opacity-90"
                          />
                          <p className="text-xs font-medium truncate">{design.title}</p>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Measurements from MongoDB */}
            {sheet === 'measurements' && (
              <div className="space-y-3">
                <p className="text-xs text-thy-muted">Select a measurement set to share with the tailor:</p>
                {savedMeasurements.length === 0 ? (
                  <div className="p-4 text-center border border-dashed border-thy-ink/20 rounded-sm">
                    <p className="text-xs text-thy-muted mb-2">No saved measurements found.</p>
                    <Link href="/my-measurements" className="text-xs text-thy-brand underline">
                      Add measurements in profile
                    </Link>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {savedMeasurements.map((m) => (
                      <li key={m.id}>
                        <button
                          type="button"
                          className={`${ghostBtn} w-full justify-between gap-2 text-left p-3`}
                          onClick={() => sendMeasurementCard(toShareableMeasurement(m))}
                        >
                          <div className="flex items-center gap-2">
                            <Ruler size={16} className="text-thy-brand shrink-0" />
                            <div>
                              <p className="text-xs font-medium">{m.label}</p>
                              <p className="text-[11px] text-thy-muted">
                                {m.details ||
                                  Object.entries(m.values || {})
                                    .slice(0, 3)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(' · ')}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] text-thy-brand font-semibold uppercase">Send</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Fabric and custom photo uploads */}
            {sheet === 'fabric' && (
              <div className="space-y-3">
                <p className="text-xs text-thy-muted">Upload fabric photos or reference patterns:</p>
                <div className="grid grid-cols-2 gap-3">
                  {fabrics.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="text-left border border-thy-ink/10 hover:border-thy-brand p-2 transition-colors rounded-xs"
                      onClick={() =>
                        setPreview({
                          kind: 'fabric',
                          title: item.title,
                          preview: item.preview,
                        })
                      }
                    >
                      <img src={item.preview} alt="" className="h-24 w-full object-cover rounded-xs mb-1" />
                      <p className="text-xs truncate">{item.title}</p>
                    </button>
                  ))}

                  <button
                    type="button"
                    className={`${ghostBtn} w-full h-full min-h-24 flex-col gap-1`}
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImageIcon size={18} />
                    <span className="text-xs">Upload from device</span>
                  </button>
                </div>
              </div>
            )}

            <button type="button" className={`${ghostBtn} w-full mt-4`} onClick={() => setSheet(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Visual Preview Modal Before Sending */}
      {preview && (
        <div className="fixed inset-0 z-[60] bg-thy-deep/50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-thy-surface p-5 space-y-4 rounded-t-lg sm:rounded-lg shadow-2xl">
            <p className="text-[11px] uppercase tracking-[0.16em] text-thy-subtle">Preview to Share</p>
            <h2 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {preview.title}
            </h2>
            {preview.preview && (
              <img
                src={resolveMediaUrl(preview.preview)}
                alt=""
                className="h-48 w-full object-cover rounded-sm border border-thy-ink/10"
              />
            )}
            {preview.details && <p className="text-xs text-thy-muted">{preview.details}</p>}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={ghostBtn}
                onClick={() => {
                  setPreview(null);
                  setPreviewFile(null);
                }}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="hero-leather-btn min-h-12 text-[11px] uppercase tracking-[0.16em]"
                onClick={() => sendAttachment(preview, previewFile)}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Send to Tailor'}
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file) return;
          setPreviewFile(file);
          setPreview({
            kind: 'fabric',
            title: file.name,
            preview: URL.createObjectURL(file),
          });
        }}
      />
    </main>
  );
}
