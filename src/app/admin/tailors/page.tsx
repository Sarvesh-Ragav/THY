'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  AdminApiError,
  getAdminTailorVerification,
  listAdminTailors,
  setAdminTailorDirectory,
  setAdminUserActive,
  verifyAdminTailor,
  type AdminTailor,
  type AdminVerificationReview,
} from '@/lib/admin-api';

type Filter = 'all' | 'pending' | 'approved' | 'rejected' | 'not_submitted';

function statusLabel(status: AdminTailor['verificationStatus']) {
  if (status === 'not_submitted') return 'Not submitted';
  return status;
}

function statusClass(status: AdminTailor['verificationStatus']) {
  if (status === 'approved') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (status === 'rejected') return 'bg-rose-50 text-rose-800 border-rose-200';
  if (status === 'pending') return 'bg-amber-50 text-amber-900 border-amber-200';
  return 'bg-thy-mist text-thy-muted border-thy-burgundy/15';
}

function kindLabel(kind: string) {
  return kind === 'government_id' ? 'Government ID' : 'Shop / studio proof';
}

export default function AdminTailorsPage() {
  const { accessToken } = useTailorSession();
  const [tailors, setTailors] = useState<AdminTailor[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [review, setReview] = useState<AdminVerificationReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await listAdminTailors(accessToken);
      setTailors(data.tailors);
      setError(null);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Unable to load tailors.');
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') return tailors;
    return tailors.filter((item) => item.verificationStatus === filter);
  }, [filter, tailors]);

  const counts = useMemo(
    () => ({
      all: tailors.length,
      pending: tailors.filter((item) => item.verificationStatus === 'pending').length,
      approved: tailors.filter((item) => item.verificationStatus === 'approved').length,
      rejected: tailors.filter((item) => item.verificationStatus === 'rejected').length,
      not_submitted: tailors.filter((item) => item.verificationStatus === 'not_submitted').length,
    }),
    [tailors]
  );

  const run = async (userId: string, action: () => Promise<unknown>) => {
    setBusyId(userId);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  };

  const openReview = async (userId: string) => {
    if (!accessToken) return;
    setReviewId(userId);
    setReview(null);
    setReviewLoading(true);
    setError(null);
    try {
      const data = await getAdminTailorVerification(accessToken, userId);
      setReview(data);
      setReviewNotes(data.reviewNotes || '');
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Unable to load verification documents.');
      setReviewId(null);
    } finally {
      setReviewLoading(false);
    }
  };

  const decide = async (status: 'approved' | 'rejected' | 'pending') => {
    if (!accessToken || !reviewId) return;
    if (status === 'rejected' && !reviewNotes.trim()) {
      setError('Add a short review note before rejecting.');
      return;
    }
    setBusyId(reviewId);
    try {
      await verifyAdminTailor(accessToken, reviewId, status, reviewNotes.trim());
      await load();
      setReviewId(null);
      setReview(null);
      setReviewNotes('');
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Unable to update verification.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">Directory</p>
      <h1 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Manage tailors
      </h1>
      <p className="mt-2 text-sm text-thy-muted">
        Review uploaded ID documents, approve or reject verification, and control directory listing.
      </p>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ['all', 'All'],
            ['pending', 'Pending'],
            ['approved', 'Approved'],
            ['rejected', 'Rejected'],
            ['not_submitted', 'Not submitted'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`px-3 py-2 text-[11px] uppercase tracking-[0.12em] border ${
              filter === id
                ? 'bg-thy-burgundy text-white border-thy-burgundy'
                : 'border-thy-burgundy/20 text-thy-ink hover:border-thy-burgundy/40'
            }`}
          >
            {label} ({counts[id]})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-thy-muted">No tailors in this filter.</p>
        ) : (
          filtered.map((tailor) => (
            <div key={tailor.id} className="thy-card p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                      {tailor.shopName}
                    </h2>
                    <span
                      className={`inline-flex px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] border rounded ${statusClass(
                        tailor.verificationStatus
                      )}`}
                    >
                      {statusLabel(tailor.verificationStatus)}
                    </span>
                  </div>
                  <p className="text-sm text-thy-muted">
                    {tailor.fullName} · {tailor.city} · {tailor.yearsOfExperience} yrs
                  </p>
                  <p className="text-xs text-thy-subtle mt-1">
                    {tailor.email || 'No email'} · {tailor.phone || 'No phone'}
                  </p>
                  <p className="mt-2 text-xs text-thy-ink">
                    Documents: {tailor.documentCount || 0}
                    {tailor.verificationDocument ? ` · ${tailor.verificationDocument}` : ''}
                    {tailor.verificationIdType ? ` · ${tailor.verificationIdType}` : ''}
                  </p>
                  {tailor.documents?.length ? (
                    <ul className="mt-1 text-xs text-thy-subtle space-y-0.5">
                      {tailor.documents.map((doc) => (
                        <li key={`${doc.kind}-${doc.fileName}`}>
                          {kindLabel(doc.kind)}: {doc.fileName}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {tailor.reviewNotes ? (
                    <p className="mt-2 text-xs text-thy-muted">Review note: {tailor.reviewNotes}</p>
                  ) : null}
                  <p className="text-xs text-thy-subtle mt-1">
                    Account: {tailor.isActive ? 'active' : 'disabled'} · Directory:{' '}
                    {tailor.isDirectoryActive ? 'listed' : 'hidden'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === tailor.id || tailor.verificationStatus === 'not_submitted'}
                    className="px-3 py-2 text-[11px] uppercase tracking-[0.12em] bg-thy-burgundy text-white disabled:opacity-50"
                    onClick={() => void openReview(tailor.id)}
                  >
                    Review files
                  </button>
                  <button
                    type="button"
                    disabled={busyId === tailor.id}
                    className="px-3 py-2 text-[11px] uppercase tracking-[0.12em] border border-thy-burgundy/30 disabled:opacity-50"
                    onClick={() =>
                      run(tailor.id, () =>
                        setAdminTailorDirectory(accessToken!, tailor.id, !tailor.isDirectoryActive)
                      )
                    }
                  >
                    {tailor.isDirectoryActive ? 'Hide listing' : 'Show listing'}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === tailor.id}
                    className="px-3 py-2 text-[11px] uppercase tracking-[0.12em] border border-thy-burgundy/30 disabled:opacity-50"
                    onClick={() =>
                      run(tailor.id, () => setAdminUserActive(accessToken!, tailor.id, !tailor.isActive))
                    }
                  >
                    {tailor.isActive ? 'Disable account' : 'Enable account'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {reviewId ? (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="bg-thy-cream w-full max-w-4xl max-h-[92dvh] overflow-y-auto border border-thy-burgundy/20 shadow-2xl">
            <div className="sticky top-0 bg-thy-cream border-b border-thy-burgundy/10 px-4 sm:px-6 py-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-thy-burgundy font-semibold">
                  Verification review
                </p>
                <h2 className="text-2xl mt-1" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                  {review?.shopName || 'Loading…'}
                </h2>
                {review ? (
                  <p className="text-sm text-thy-muted">
                    {review.fullName} · {statusLabel(review.verificationStatus)}
                    {review.idType ? ` · ${review.idType}` : ''}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="text-[11px] uppercase tracking-[0.14em] text-thy-muted hover:text-thy-ink"
                onClick={() => {
                  setReviewId(null);
                  setReview(null);
                }}
              >
                Close
              </button>
            </div>

            <div className="px-4 sm:px-6 py-5 space-y-5">
              {reviewLoading ? <p className="text-sm text-thy-muted">Loading uploaded documents…</p> : null}
              {!reviewLoading && review && review.documents.length === 0 ? (
                <p className="text-sm text-thy-muted">
                  No file content is stored for this tailor yet. Ask them to re-submit verification, or use the
                  document names on file: {review.documentName || 'none'}.
                </p>
              ) : null}

              {review?.documents.map((doc) => (
                <div key={`${doc.kind}-${doc.fileName}`} className="border border-thy-burgundy/15 bg-thy-surface p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-thy-burgundy font-semibold">
                        {kindLabel(doc.kind)}
                      </p>
                      <p className="text-sm text-thy-ink">{doc.fileName}</p>
                    </div>
                    <a
                      href={doc.dataUrl}
                      download={doc.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] uppercase tracking-[0.12em] border-b border-thy-burgundy/40 text-thy-burgundy"
                    >
                      Open / download
                    </a>
                  </div>
                  {doc.mimeType.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={doc.dataUrl}
                      alt={doc.fileName}
                      className="w-full max-h-[28rem] object-contain bg-thy-mist border border-thy-burgundy/10"
                    />
                  ) : doc.mimeType === 'application/pdf' ? (
                    <iframe title={doc.fileName} src={doc.dataUrl} className="w-full h-[28rem] border border-thy-burgundy/10 bg-white" />
                  ) : (
                    <p className="text-sm text-thy-muted">Preview unavailable for this file type.</p>
                  )}
                </div>
              ))}

              <label className="block text-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] text-thy-subtle">Review notes</span>
                <textarea
                  value={reviewNotes}
                  onChange={(event) => setReviewNotes(event.target.value)}
                  rows={3}
                  placeholder="Optional for approve. Required when rejecting."
                  className="mt-1.5 w-full border border-thy-burgundy/20 bg-thy-cream px-3 py-2 text-sm text-thy-ink outline-none focus:border-thy-burgundy/50"
                />
              </label>

              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  type="button"
                  disabled={busyId === reviewId || !review}
                  className="px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] bg-thy-burgundy text-white disabled:opacity-50"
                  onClick={() => void decide('approved')}
                >
                  Approve verification
                </button>
                <button
                  type="button"
                  disabled={busyId === reviewId || !review}
                  className="px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] border border-rose-300 text-rose-800 disabled:opacity-50"
                  onClick={() => void decide('rejected')}
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={busyId === reviewId || !review}
                  className="px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] border border-thy-burgundy/30 disabled:opacity-50"
                  onClick={() => void decide('pending')}
                >
                  Mark pending
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
