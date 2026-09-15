'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Mic, Paperclip, Ruler, Send } from 'lucide-react';
import {
  appendMessage,
  ensureThread,
  estimateHref,
  nowStamp,
  patchThread,
  setMessageStatus,
  tailorDirectoryEntry,
  type AttachmentKind,
  type ChatAttachment,
  type ChatEntry,
  type ChatMessage,
} from '@/lib/c31';
import { getStudioGarment, studioPreviewHref } from '@/lib/design-studio';
import type { CustomerDesignSave } from '@/lib/tailor-session';
import { useC31 } from '@/hooks/useC31';
import { useCustomerError } from '@/components/customer/CustomerErrorProvider';

const ghostBtn =
  'inline-flex items-center justify-center min-h-11 px-4 text-sm border border-thy-ink/15 bg-thy-surface text-thy-ink';

export function CustomerChatView({
  tailorId,
  from,
  designs,
}: {
  tailorId?: string | null;
  from?: ChatEntry | string | null;
  designs: CustomerDesignSave[];
}) {
  const { error } = useCustomerError();
  const { state, ready, save } = useC31();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [sheet, setSheet] = useState<AttachmentKind | null>(null);
  const [preview, setPreview] = useState<ChatAttachment | null>(null);
  const [recording, setRecording] = useState(false);
  const [pendingVoice, setPendingVoice] = useState<{ url: string; duration: number } | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const thread = useMemo(() => {
    if (!ready) return null;
    return ensureThread(state, tailorId).thread;
  }, [ready, state, tailorId]);

  useEffect(() => {
    if (!ready) return;
    const tailor = tailorDirectoryEntry(tailorId);
    save((current) => {
      if (current.threads.some((item) => item.tailorId === tailor.id)) return current;
      return ensureThread(current, tailorId).state;
    });
  }, [ready, tailorId, save]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages.length]);

  if (!ready || !thread) {
    return <p className="p-8 text-sm text-thy-subtle">Opening chat...</p>;
  }

  const offline = error === 'network' || (typeof navigator !== 'undefined' && navigator.onLine === false);

  const deliver = (message: ChatMessage, delay = 450) => {
    const status = offline ? 'failed' : 'sending';
    save((current) => {
      const ensured = ensureThread(current, tailorId);
      return appendMessage(ensured.state, ensured.thread.id, { ...message, status });
    });
    if (status === 'failed') return;
    window.setTimeout(() => {
      save((current) => setMessageStatus(current, thread.id, message.id, 'read'));
    }, delay);
  };

  const sendText = () => {
    const value = text.trim();
    if (!value) return;
    setText('');
    deliver({
      id: `msg-${Date.now()}`,
      sender: 'customer',
      kind: 'text',
      text: value,
      createdAt: nowStamp(),
      status: 'sending',
    });
  };

  const sendAttachment = (attachment: ChatAttachment) => {
    deliver({
      id: `att-${Date.now()}`,
      sender: 'customer',
      kind: 'attachment',
      text: attachment.title,
      createdAt: nowStamp(),
      status: 'uploading',
      attachment,
    }, 700);
    setPreview(null);
    setSheet(null);
  };

  const startRecording = async () => {
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
      setPendingVoice({ url, duration: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)) });
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const sendVoice = () => {
    if (!pendingVoice) return;
    deliver({
      id: `voice-${Date.now()}`,
      sender: 'customer',
      kind: 'voice',
      text: `Voice note · ${pendingVoice.duration}s`,
      createdAt: nowStamp(),
      status: 'uploading',
      voiceUrl: pendingVoice.url,
      voiceDuration: pendingVoice.duration,
    }, 800);
    setPendingVoice(null);
  };

  const retryMessage = (message: ChatMessage) => {
    save((current) => setMessageStatus(current, thread.id, message.id, 'delivered'));
    window.setTimeout(() => {
      save((current) => setMessageStatus(current, thread.id, message.id, 'read'));
    }, 400);
  };

  const placeOrder = () => {
    const requestId = `REQ-${Date.now().toString().slice(-6)}`;
    save((current) =>
      patchThread(current, thread.id, (item) => ({
        ...item,
        status: 'request_sent',
        request: {
          id: requestId,
          garment: designs[0]?.garment || designs[0]?.title || 'Custom outfit',
          fabric: designs[0]?.fabric || 'Customer fabric',
          measurements: current.measurements[0]?.details || 'Saved measurements',
          customization: 'As discussed in chat',
          stitching: 'Custom stitching',
          status: 'sent',
        },
        messages: [
          ...item.messages,
          {
            id: `place-${Date.now()}`,
            sender: 'customer',
            kind: 'system',
            text: 'Place Order sent. Requirements are finalized. This is not payment — the tailor will review and send a fixed price.',
            createdAt: nowStamp(),
            status: 'read',
          },
        ],
      })),
    );
  };

  const fabrics = [
    { id: 'f1', title: 'Uploaded charcoal silk', preview: '/hero/fabric-charcoal.png' },
    { id: 'f2', title: 'Beige brocade', preview: '/hero/fabric-beige.png' },
    { id: 'f3', title: 'Olive weave', preview: '/hero/fabric-olive.png' },
    ...designs
      .filter((design) => design.fabricImage)
      .map((design) => ({
        id: design.id,
        title: design.fabric || design.title,
        preview: design.fabricImage || '/hero/fabric-beige.png',
      })),
  ];

  const entryNote =
    from === 'estimate'
      ? 'Opened from estimate details'
      : from === 'order'
        ? 'Opened from order details'
        : 'Opened from tailor profile';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <header className="thy-card p-4 sm:p-5 flex items-center gap-3">
        <Link href="/tailors" className={`${ghostBtn} min-w-20`}>
          Back
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-thy-brand font-semibold">C31 · Customer chat</p>
          <h1 className="text-2xl sm:text-3xl truncate" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {thread.tailorName}
          </h1>
          <p className="text-xs text-thy-muted">
            {thread.verified ? 'Verified' : 'Tailor'} · {thread.online ? 'Online' : 'Offline'} · {entryNote}
          </p>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] gap-4">
        <section className="thy-card flex flex-col min-h-[32rem]">
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 max-h-[32rem]">
            {thread.messages.map((message) => (
              <article
                key={message.id}
                className={`max-w-[85%] p-3 text-sm ${
                  message.sender === 'customer'
                    ? 'ml-auto bg-thy-deep text-[#FBF6ED]'
                    : 'bg-thy-mist text-thy-ink'
                }`}
              >
                {message.kind === 'attachment' && message.attachment && (
                  <div className="mb-2">
                    {message.attachment.preview && (
                      <img src={message.attachment.preview} alt="" className="h-24 w-full object-cover mb-2" />
                    )}
                    <p className="text-[10px] uppercase tracking-[0.14em] opacity-80">{message.attachment.kind}</p>
                    {message.attachment.href && (
                      <Link href={message.attachment.href} className="underline text-xs">
                        Open preview
                      </Link>
                    )}
                  </div>
                )}
                {message.kind === 'voice' && message.voiceUrl && (
                  <audio controls src={message.voiceUrl} className="w-full mb-2" />
                )}
                {message.kind === 'quotation' && message.quotation && (
                  <div className="border border-white/20 p-3 space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.16em]">Price fixed</p>
                    <p className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                      ₹{message.quotation.price}
                    </p>
                    <p className="text-xs opacity-80">{message.quotation.note}</p>
                    <p className="text-[10px] opacity-70">Sent {message.quotation.sentAt}</p>
                    <Link href={estimateHref(thread.id)} className="inline-flex text-xs underline">
                      View full details
                    </Link>
                  </div>
                )}
                {message.text && <p>{message.text}</p>}
                <p className="mt-1 text-[10px] opacity-70 text-right">
                  {message.createdAt} · {message.status}
                </p>
                {message.status === 'failed' && (
                  <button type="button" className="mt-2 text-xs underline" onClick={() => retryMessage(message)}>
                    Retry
                  </button>
                )}
              </article>
            ))}
            <div ref={bottomRef} />
          </div>

          {pendingVoice && (
            <div className="px-4 py-3 border-t border-thy-ink/10 bg-thy-mist/80 space-y-2">
              <p className="text-xs text-thy-muted">Voice preview · {pendingVoice.duration}s</p>
              <audio controls src={pendingVoice.url} className="w-full" />
              <div className="grid grid-cols-3 gap-2">
                <button type="button" className={ghostBtn} onClick={() => setPendingVoice(null)}>
                  Delete
                </button>
                <button type="button" className={ghostBtn} onClick={() => setPendingVoice(null)}>
                  Cancel
                </button>
                <button type="button" className="hero-leather-btn min-h-11 text-[11px] uppercase tracking-[0.14em]" onClick={sendVoice}>
                  Send
                </button>
              </div>
            </div>
          )}

          <form
            className="p-3 border-t border-thy-ink/10 flex items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              sendText();
            }}
          >
            <button type="button" className={`${ghostBtn} px-3`} onClick={() => setSheet('measurements')} aria-label="Attachment">
              <Paperclip size={16} />
            </button>
            <button
              type="button"
              className={`${ghostBtn} px-3 ${recording ? 'border-thy-brand text-thy-brand' : ''}`}
              onClick={() => (recording ? stopRecording() : startRecording())}
              aria-label="Voice"
            >
              <Mic size={16} />
            </button>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Discuss design, fabric, measurements, price..."
              className="thy-input flex-1 min-h-11"
            />
            <button type="submit" className="hero-leather-btn h-11 w-11 inline-flex items-center justify-center" aria-label="Send">
              <Send size={16} />
            </button>
          </form>
        </section>

        <aside className="thy-card p-5 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-thy-subtle">Conversation</p>
          <p className="text-sm text-thy-muted">
            Design · Fabric · Measurements · Customization · Stitching · Price
          </p>
          {thread.status !== 'request_sent' && thread.status !== 'price_fixed' && thread.status !== 'quotation_updated' && (
            <button type="button" onClick={placeOrder} className="hero-leather-btn w-full min-h-12 text-[11px] uppercase tracking-[0.16em]">
              Place order
            </button>
          )}
          {(thread.status === 'request_sent' || thread.status === 'needs_clarification') && (
            <p className="text-sm text-thy-ink">Order request sent to tailor. Waiting for a fixed price — this is not payment.</p>
          )}
          {thread.quotation && (
            <Link href={estimateHref(thread.id)} className="hero-leather-btn inline-flex w-full items-center justify-center min-h-12 text-[11px] uppercase tracking-[0.16em]">
              Estimate details
            </Link>
          )}
          <p className="text-[10px] uppercase tracking-[0.14em] text-thy-subtle">
            Place order does not mean payment
          </p>
        </aside>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 bg-thy-deep/45 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-thy-surface p-5 sm:p-6 max-h-[90dvh] overflow-y-auto">
            <div className="flex gap-2 mb-4">
              {(['measurements', 'fabric', 'design'] as AttachmentKind[]).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setSheet(kind)}
                  className={`px-3 min-h-9 text-[11px] uppercase tracking-[0.12em] border ${
                    sheet === kind ? 'border-thy-brand text-thy-brand bg-thy-mist' : 'border-thy-ink/15'
                  }`}
                >
                  {kind}
                </button>
              ))}
            </div>

            {sheet === 'measurements' && (
              <ul className="space-y-2">
                {state.measurements.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${ghostBtn} w-full justify-start gap-2`}
                      onClick={() =>
                        setPreview({
                          kind: 'measurements',
                          title: item.label,
                          details: item.details,
                          href: '/my-measurements',
                        })
                      }
                    >
                      <Ruler size={15} />
                      <span className="text-left">
                        <span className="block">{item.label}</span>
                        <span className="block text-xs text-thy-muted">{item.details}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {sheet === 'fabric' && (
              <ul className="grid grid-cols-2 gap-3">
                {fabrics.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="w-full text-left border border-thy-ink/10"
                      onClick={() =>
                        setPreview({ kind: 'fabric', title: item.title, preview: item.preview })
                      }
                    >
                      <img src={item.preview} alt="" className="h-24 w-full object-cover" />
                      <p className="p-2 text-xs">{item.title}</p>
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" className={`${ghostBtn} w-full h-full min-h-24`} onClick={() => fileRef.current?.click()}>
                    <ImageIcon size={16} />
                    Upload image
                  </button>
                </li>
              </ul>
            )}

            {sheet === 'design' && (
              <ul className="space-y-2">
                {designs.length === 0 && (
                  <li className="text-sm text-thy-muted">
                    No saved designs.{' '}
                    <Link href="/stitch-your-outfit" className="text-thy-brand border-b border-thy-brand">
                      Visualize one
                    </Link>
                  </li>
                )}
                {designs.map((design) => {
                  const preset = getStudioGarment(design.categoryId);
                  return (
                    <li key={design.id}>
                      <button
                        type="button"
                        className={`${ghostBtn} w-full justify-start`}
                        onClick={() =>
                          setPreview({
                            kind: 'design',
                            title: design.title,
                            preview: design.fabricImage || preset.fabricImage,
                            href: studioPreviewHref(preset.categoryId),
                          })
                        }
                      >
                        {design.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <button type="button" className={`${ghostBtn} w-full mt-4`} onClick={() => setSheet(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[60] bg-thy-deep/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-thy-surface p-5 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-thy-subtle">Preview</p>
            <h2 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {preview.title}
            </h2>
            {preview.preview && <img src={preview.preview} alt="" className="h-40 w-full object-cover" />}
            {preview.details && <p className="text-sm text-thy-muted">{preview.details}</p>}
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={ghostBtn} onClick={() => setPreview(null)}>
                Cancel
              </button>
              <button type="button" className={ghostBtn} onClick={() => setPreview(null)}>
                Remove
              </button>
              <button
                type="button"
                className="hero-leather-btn col-span-2 min-h-12 text-[11px] uppercase tracking-[0.16em]"
                onClick={() => sendAttachment(preview)}
              >
                Send
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
