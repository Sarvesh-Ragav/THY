'use client';

import { useEffect, useState } from 'react';
import type { KurtiCatalogueDesign } from '@/lib/kurti-catalogue';

export function useKurtiCatalogue(enabled: boolean) {
  const [designs, setDesigns] = useState<KurtiCatalogueDesign[]>([]);
  const [source, setSource] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    if (!enabled) return;
    let cancel = false;
    setStatus('loading');
    fetch('/api/catalogue/kurtis')
      .then(async (response) => {
        if (!response.ok) throw new Error('Catalogue request failed');
        return response.json() as Promise<{ designs?: KurtiCatalogueDesign[]; source?: string }>;
      })
      .then((data) => {
        if (cancel) return;
        setDesigns(Array.isArray(data.designs) ? data.designs : []);
        setSource(data.source ?? null);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancel) setStatus('error');
      });
    return () => {
      cancel = true;
    };
  }, [enabled]);

  return { designs, source, status };
}
