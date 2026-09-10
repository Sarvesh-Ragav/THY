'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HERO_VIDEOS } from '@/lib/customer-home-data';

export function HeroCarousel() {
  const [available, setAvailable] = useState(true);
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setAvailable(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  useEffect(() => {
    if (!available) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_VIDEOS.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [available]);

  const goNext = () => setIndex((current) => (current + 1) % HERO_VIDEOS.length);

  if (!available) {
    return (
      <div className="absolute inset-0 bg-[#e6dccb]">
        <img src="/hero/fabric-beige.png" alt="" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-[#2C2418]/35" />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 bg-[#2C2418] cursor-pointer"
      onClick={goNext}
      onTouchStart={(event) => {
        startX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (startX.current == null) return;
        const delta = event.changedTouches[0].clientX - startX.current;
        if (delta > 40) setIndex((current) => (current === 0 ? HERO_VIDEOS.length - 1 : current - 1));
        if (delta < -40) goNext();
        startX.current = null;
      }}
    >
      {HERO_VIDEOS.map((video, videoIndex) => (
        <img
          key={video.id}
          src={video.poster}
          alt={video.label}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2418]/70 via-[#2C2418]/20 to-[#2C2418]/25 pointer-events-none" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_VIDEOS.map((video, videoIndex) => (
          <button
            key={video.id}
            type="button"
            aria-label={video.label}
            onClick={(event) => {
              event.stopPropagation();
              setIndex(videoIndex);
            }}
            className={`h-1.5 w-8 ${videoIndex === index ? 'bg-[#C4A15A]' : 'bg-[#F3EEE4]/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
