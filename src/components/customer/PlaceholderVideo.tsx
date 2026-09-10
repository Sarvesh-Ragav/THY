'use client';

import React, { useState } from 'react';

interface PlaceholderVideoProps {
  poster: string;
  label: string;
  className?: string;
}

export function PlaceholderVideo({ poster, label, className = '' }: PlaceholderVideoProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#2C2418] ${className}`}>
      <img src={poster} alt="" className={`absolute inset-0 h-full w-full object-cover ${playing ? 'opacity-30' : 'opacity-100'}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2418]/55 via-transparent to-[#2C2418]/20" />
      <button
        type="button"
        onClick={() => setPlaying((value) => !value)}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#F3EEE4]"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#F3EEE4]/70 bg-[#2C2418]/30 backdrop-blur-sm">
          <span className="ml-1 text-2xl">{playing ? '❚❚' : '▶'}</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.28em]">{playing ? 'Pause placeholder' : label}</span>
      </button>
    </div>
  );
}
