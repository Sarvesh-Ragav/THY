'use client';

import { useEffect, useState } from 'react';
import { fetchDirectoryTailors } from '@/lib/directory-api';
import type { PublicDirectoryTailor } from '@/lib/directory';

export function useDirectoryTailors() {
  const [tailors, setTailors] = useState<PublicDirectoryTailor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchDirectoryTailors()
      .then((items) => {
        if (!cancelled) setTailors(items);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load tailors.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { tailors, loading, error };
}
