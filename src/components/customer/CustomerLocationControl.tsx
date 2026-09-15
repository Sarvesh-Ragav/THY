'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LocateFixed, MapPin } from 'lucide-react';
import { CITIES } from '@/lib/customer-home-data';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';

export function CustomerLocationControl({
  className = '',
}: {
  className?: string;
}) {
  const { label, detecting, error, detect, setCity } = useCustomerLocation({ autoDetect: true });
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const display = !mounted ? 'Location' : detecting && !label ? 'Locating…' : label || 'Location';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className={`relative min-w-0 ${className}`} ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="thy-nav-link thy-nav-link-tall inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] min-h-11 px-2 max-w-[10.5rem] sm:max-w-[14rem]"
        aria-label={`Location: ${display}`}
        title={label || 'Detect location'}
        suppressHydrationWarning
      >
        <MapPin size={14} className="shrink-0" />
        <span className="truncate" suppressHydrationWarning>
          {display}
        </span>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-thy-surface border border-thy-ink/10 shadow-lg p-2 z-50 rounded-lg">
          <button
            type="button"
            className="flex w-full items-center gap-2 text-left px-2 py-2 text-sm text-thy-ink hover:bg-thy-mist min-h-11 rounded"
            onClick={() => {
              void detect();
            }}
          >
            <LocateFixed size={14} className="shrink-0 text-thy-burgundy" />
            {detecting ? 'Detecting…' : 'Use my location'}
          </button>
          {error && <p className="px-2 pb-2 text-[11px] text-rose-700">{error}</p>}
          <p className="px-2 pt-1 pb-1.5 text-[10px] uppercase tracking-[0.16em] text-thy-subtle font-semibold">Cities</p>
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              className={`block w-full text-left px-2 py-2 text-sm min-h-11 rounded ${
                label === city || (label && label.includes(city))
                  ? 'bg-thy-mist text-thy-burgundy'
                  : 'text-thy-ink hover:bg-thy-mist'
              }`}
              onClick={() => {
                setCity(city);
                setOpen(false);
              }}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
