'use client';

import React from 'react';

export function TypingIndicator({ who = 'Someone' }: { who?: string }) {
  return (
    <div className="flex items-center gap-2 py-1 px-3 text-xs text-thy-muted italic animate-fade-in">
      <span>{who} is typing</span>
      <div className="inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-thy-brand animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-thy-brand animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-thy-brand animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
