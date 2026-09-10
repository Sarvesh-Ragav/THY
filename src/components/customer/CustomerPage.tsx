import React from 'react';

export function CustomerPage({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
      <h1 className="text-3xl sm:text-4xl md:text-5xl leading-[0.95] break-words" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        {title}
      </h1>
      <div className="mt-6 md:mt-8">{children}</div>
    </main>
  );
}
