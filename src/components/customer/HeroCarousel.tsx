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
      <div className="absolute inset-0 bg-thy-mist">
        <img src="/hero/fabric-olive.png" alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 bg-black cursor-pointer"
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
        <video
          key={video.id}
          src={video.src}
          aria-label={video.label}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
            videoIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1">
        {HERO_VIDEOS.map((video, videoIndex) => (
          <button
            key={video.id}
            type="button"
            aria-label={video.label}
            onClick={(event) => {
              event.stopPropagation();
              setIndex(videoIndex);
            }}
            className="h-11 px-1.5 flex items-center"
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-500 ${
                videoIndex === index
                  ? 'w-10 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                  : 'w-6 bg-white/35'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
