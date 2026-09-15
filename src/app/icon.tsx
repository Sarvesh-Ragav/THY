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
          background: 'linear-gradient(165deg, #3F1218 0%, #4A1520 48%, #5C1A24 125%)',
          color: '#FBF6ED',
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
