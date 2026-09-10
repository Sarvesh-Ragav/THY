import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(165deg, #0b332f 0%, #0d5c55 48%, #00c9b7 125%)',
          color: '#fbfefd',
          fontSize: 148,
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}
      >
        THY
      </div>
    ),
    { ...size },
  );
}
