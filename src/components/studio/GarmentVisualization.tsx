import React from 'react';
import type { FabricTreatment, GarmentSilhouette } from '@/lib/design-studio';

export function GarmentVisualization({
  silhouette,
  treatments,
  fabricImage,
  patternId = 'thy-fabric',
}: {
  silhouette: GarmentSilhouette;
  treatments: FabricTreatment[];
  fabricImage?: string;
  patternId?: string;
}) {
  const prints = treatments.includes('Prints');
  const motifs = treatments.includes('Motifs');
  const embroidery = treatments.includes('Embroidery');
  const texture = treatments.includes('Texture');
  const colors = treatments.includes('Colors');
  const fill = fabricImage ? `url(#${patternId})` : colors ? '#5C1A24' : '#4A1520';
  const stripe = colors ? 'rgba(251,254,253,0.38)' : 'rgba(92,26,36,0.45)';
  const stroke = embroidery ? '#d4b56a' : '#3F1218';

  return (
    <svg viewBox="0 0 320 380" className="w-full h-full" role="img" aria-label="AI-generated garment visualization">
      <defs>
        {fabricImage && (
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="320" height="380">
            <image href={fabricImage} x="0" y="0" width="320" height="380" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        )}
      </defs>
      {texture && (
        <g opacity="0.18">
          {Array.from({ length: 18 }).map((_, row) =>
            Array.from({ length: 16 }).map((__, col) => (
              <circle key={`${row}-${col}`} cx={12 + col * 20} cy={14 + row * 21} r="1.2" fill="#3F1218" />
            )),
          )}
        </g>
      )}

      {silhouette === 'kurti' && (
        <g transform="translate(70 48)">
          <path
            d="M28 18 C40 4 68 0 90 0 C112 0 140 4 152 18 L168 42 C150 50 146 62 146 78 L146 292 C146 308 132 318 90 318 C48 318 34 308 34 292 L34 78 C34 62 30 50 12 42 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={embroidery ? 3 : 1.5}
          />
          <path d="M70 8 C78 28 102 28 110 8" fill="none" stroke={stroke} strokeWidth="2" />
          {prints &&
            [28, 56, 84, 112, 140].map((x) => (
              <rect key={x} x={x} y="72" width="14" height="220" rx="7" fill={stripe} />
            ))}
          {motifs &&
            [0, 1, 2, 3, 4].flatMap((col) =>
              [0, 1, 2, 3, 4].map((row) => (
                <circle key={`${col}-${row}`} cx={35 + col * 28} cy={92 + row * 42} r="4.5" fill="#FBF6ED" />
              )),
            )}
        </g>
      )}

      {silhouette === 'saree' && (
        <g transform="translate(58 36)">
          <path d="M86 8 C108 8 128 28 128 58 C128 82 112 100 86 104 C60 100 44 82 44 58 C44 28 64 8 86 8 Z" fill="#3F1218" />
          <path
            d="M28 108 C70 92 150 96 188 118 L176 332 C120 318 70 322 24 338 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={embroidery ? 3 : 1.5}
          />
          <path d="M28 108 C8 170 18 250 24 338" fill="none" stroke={stripe} strokeWidth="18" />
          {prints && <path d="M188 118 C160 180 168 270 176 332" fill="none" stroke={stripe} strokeWidth="14" />}
          {motifs &&
            [0, 1, 2, 3].map((i) => (
              <circle key={i} cx={70 + i * 22} cy={160 + i * 36} r="5" fill="#FBF6ED" />
            ))}
        </g>
      )}

      {silhouette === 'sherwani' && (
        <g transform="translate(78 40)">
          <path
            d="M24 22 C40 6 64 0 82 0 C100 0 124 6 140 22 L158 48 C146 54 144 66 144 80 L144 300 C144 316 124 328 82 328 C40 328 20 316 20 300 L20 80 C20 66 18 54 6 48 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={embroidery ? 3 : 1.5}
          />
          <path d="M82 78 L82 300" stroke={stripe} strokeWidth="6" />
          {prints &&
            [48, 116].map((x) => (
              <rect key={x} x={x} y="90" width="10" height="200" rx="5" fill={stripe} />
            ))}
          {motifs &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx="82" cy={96 + i * 34} r="5" fill="#FBF6ED" />
            ))}
        </g>
      )}

      {silhouette === 'lehenga' && (
        <g transform="translate(50 28)">
          <path
            d="M86 8 C104 8 118 24 118 46 C118 62 108 74 86 78 C64 74 54 62 54 46 C54 24 68 8 86 8 Z"
            fill="#3F1218"
          />
          <path d="M54 86 C72 80 100 80 118 86 L132 150 C110 144 62 144 40 150 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <path
            d="M18 154 C70 138 150 138 202 154 L214 340 C140 322 70 322 6 340 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={embroidery ? 3 : 1.5}
          />
          {prints &&
            [40, 80, 120, 160].map((x) => (
              <path key={x} d={`M${x} 168 L${x + 8} 328`} stroke={stripe} strokeWidth="12" />
            ))}
          {motifs &&
            [0, 1, 2].flatMap((row) =>
              [0, 1, 2, 3].map((col) => (
                <circle key={`${row}-${col}`} cx={56 + col * 36} cy={190 + row * 48} r="5" fill="#FBF6ED" />
              )),
            )}
        </g>
      )}
    </svg>
  );
}
