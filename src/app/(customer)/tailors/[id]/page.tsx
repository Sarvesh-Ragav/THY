'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { chatHref } from '@/lib/c31';
import { fetchDirectoryTailor } from '@/lib/directory-api';
import type { PublicDirectoryTailor } from '@/lib/directory';
import { PublicTailorProfile } from '@/components/tailor/PublicTailorProfile';

export default function TailorProfilePage() {
  const params = useParams<{ id: string }>();
  const [tailor, setTailor] = useState<PublicDirectoryTailor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    let cancelled = false;
    setLoading(true);
    fetchDirectoryTailor(params.id)
      .then((item) => {
        if (!cancelled) setTailor(item);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Tailor was not found.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/tailors" className="inline-flex items-center gap-2 text-sm text-thy-brand">
        <ArrowLeft size={16} />
        Back to tailors
      </Link>

      {loading && <p className="mt-6 text-sm text-thy-muted">Loading public profile…</p>}
      {error && !loading && (
        <div className="mt-6 thy-card p-6 text-sm text-thy-muted">
          {error} This page only shows tailors who have signed up on THY.
        </div>
      )}
      {tailor && (
        <div className="mt-6">
          <PublicTailorProfile
            tailor={tailor}
            actions={
              <>
                <Link
                  href={chatHref(tailor.id, 'profile')}
                  className="hero-leather-btn inline-flex items-center justify-center gap-2 min-h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-center leading-none"
                >
                  <MessageSquare size={14} />
                  Message
                </Link>
                <Link
                  href={`/request-estimate?tailor=${encodeURIComponent(tailor.id)}`}
                  className="inline-flex items-center justify-center min-h-11 px-4 text-sm text-center leading-none border border-thy-ink/15 hover:border-thy-brand/40"
                >
                  Request estimate
                </Link>
              </>
            }
          />
        </div>
      )}
    </main>
  );
}
