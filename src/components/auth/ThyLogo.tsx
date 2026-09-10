import React from 'react';

interface ThyLogoProps {
  className?: string;
  size?: number;
}

export const ThyLogo: React.FC<ThyLogoProps> = ({ className = '', size = 64 }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white drop-shadow-sm transition-transform hover:scale-105 duration-200"
      >
        {/* Infinity Loop (Top horizontal bar of the 'T' emblem) */}
        <path
          d="M 50 36 
             C 38 20, 18 20, 18 36 
             C 18 52, 38 52, 50 36 
             C 62 20, 82 20, 82 36 
             C 82 52, 62 52, 50 36 Z"
          stroke="white"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Sewing Needle Stem with transparent Needle Eye hole (Vertical stem of 'T') */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 50 38 
             C 50.8 45, 53.5 60, 53.5 74 
             C 53.5 85, 51.8 92, 50 94 
             C 48.2 92, 46.5 85, 46.5 74 
             C 46.5 60, 49.2 45, 50 38 Z 
             M 50 73 
             C 51.6 73, 51.6 83, 50 83 
             C 48.4 83, 48.4 73, 50 73 Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

