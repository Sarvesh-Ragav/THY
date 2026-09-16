'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useC31 } from '@/hooks/useC31';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { listCustomerMeasurements, saveCustomerMeasurement } from '@/lib/chat-api';
import {
  formatMeasurementDetails,
  mergeSavedMeasurements,
  toSavedMeasurement,
} from '@/lib/measurements';
import type { SavedMeasurement } from '@/lib/c31';
import { DEFAULT_MEASUREMENTS } from '@/lib/c31';

export function useSavedMeasurements() {
  const { state, save, ready } = useC31();
  const { accessToken, isReady } = useTailorSession();
  const [remote, setRemote] = useState<SavedMeasurement[]>([]);
  const [saving, setSaving] = useState(false);

  const refreshRemote = useCallback(async () => {
    if (!accessToken) {
      setRemote([]);
      return;
    }
    try {
      const items = await listCustomerMeasurements(accessToken);
      setRemote(items.map(toSavedMeasurement));
    } catch {
      setRemote([]);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isReady) return;
    void refreshRemote();
  }, [isReady, refreshRemote]);

  const measurements = useMemo(
    () => mergeSavedMeasurements(ready ? state.measurements : [], remote),
    [ready, state.measurements, remote]
  );

  const addMeasurement = useCallback(
    async (input: {
      label: string;
      values: Record<string, string>;
      category?: string;
      unit?: 'inch' | 'cm';
    }): Promise<SavedMeasurement> => {
      const filled = Object.fromEntries(
        Object.entries(input.values).filter(([, value]) => value.trim())
      );
      const local: SavedMeasurement = {
        id: `m-${Date.now()}`,
        label: input.label,
        details: formatMeasurementDetails(filled, input.unit === 'cm' ? 'cm' : 'in'),
        values: filled,
      };

      const demoIds = new Set(DEFAULT_MEASUREMENTS.map((item) => item.id));
      save((current) => ({
        ...current,
        measurements: [
          local,
          ...current.measurements.filter((item) => item.id !== local.id && !demoIds.has(item.id)),
        ],
      }));

      if (!accessToken) return local;

      setSaving(true);
      try {
        const created = await saveCustomerMeasurement(
          {
            label: input.label,
            category: input.category,
            values: filled,
            unit: input.unit ?? 'inch',
          },
          accessToken
        );
        const saved = toSavedMeasurement(created);
        save((current) => ({
          ...current,
          measurements: [
            saved,
            ...current.measurements.filter((item) => item.id !== local.id && item.id !== saved.id),
          ],
        }));
        setRemote((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
        return saved;
      } catch {
        return local;
      } finally {
        setSaving(false);
      }
    },
    [accessToken, save]
  );

  return { measurements, addMeasurement, saving, refreshRemote };
}
