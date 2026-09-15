'use client';

import React from 'react';
import { useAppearance } from '@/components/providers/AppearanceProvider';
import type { UiKey } from '@/lib/i18n';

export function CustomerPage({
  title,
  titleKey,
  children,
}: {
  title?: string;
  titleKey?: UiKey;
  children?: React.ReactNode;
}) {
  const { t } = useAppearance();
  const heading = titleKey ? t(titleKey) : title;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 thy-reveal">
      <p className="thy-section-label mb-2">THY</p>
      <h1
        className="text-3xl sm:text-4xl md:text-5xl leading-[0.95] break-words text-thy-ink"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        {heading}
      </h1>
      <div className="thy-divider-glow mt-4 max-w-md" />
      <div className="mt-6 md:mt-8 text-thy-ink">{children}</div>
    </main>
  );
}
