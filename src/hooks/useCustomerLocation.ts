'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  CITY_COORDS,
  cityFromLocation,
  coordsForCity,
  readBrowserPosition,
  reverseGeocode,
  type GeoCoords,
} from '@/lib/geo';

let autoDetectStarted = false;

export function useCustomerLocation(options?: { autoDetect?: boolean }) {
  const autoDetect = options?.autoDetect ?? false;
  const { session, isReady, updateSession } = useTailorSession();
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyCoords = useCallback(
    async (coords: GeoCoords) => {
      const geo = await reverseGeocode(coords);
      updateSession({
        selectedLocation: geo.label,
        locationCoords: coords,
      });
      return geo;
    },
    [updateSession]
  );

  const detect = useCallback(async () => {
    setDetecting(true);
    setError(null);
    try {
      const coords = await readBrowserPosition();
      await applyCoords(coords);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not read your location.');
    } finally {
      setDetecting(false);
    }
  }, [applyCoords]);

  const setCity = useCallback(
    (city: string) => {
      setError(null);
      updateSession({
        selectedLocation: city,
        locationCoords: coordsForCity(city) ?? CITY_COORDS.Chennai,
      });
    },
    [updateSession]
  );

  useEffect(() => {
    if (!autoDetect || !isReady) return;
    if (session.locationCoords && session.selectedLocation) return;
    if (autoDetectStarted) return;
    autoDetectStarted = true;
    void detect();
  }, [autoDetect, detect, isReady, session.locationCoords, session.selectedLocation]);

  return {
    label: session.selectedLocation,
    coords: session.locationCoords,
    city: cityFromLocation(session.selectedLocation, session.locationCoords),
    detecting,
    error,
    detect,
    setCity,
  };
}
