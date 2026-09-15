import React from 'react';

export function TailorPage({
  kicker = 'Tailor workspace',
  title,
  description,
  actions,
  children,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="thy-reveal text-thy-ink">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="thy-section-label mb-2">{kicker}</p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl leading-[0.95] break-words text-thy-ink"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-xl text-sm text-thy-muted">{description}</p>
          ) : null}
          <div className="thy-divider-glow mt-4 max-w-md" />
        </div>
        {actions ? <div className="shrink-0 pb-1">{actions}</div> : null}
      </div>
      <div className="mt-6 md:mt-8">{children}</div>
    </div>
  );
}
