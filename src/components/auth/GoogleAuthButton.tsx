'use client';

import { useEffect, useRef } from 'react';

interface GoogleAuthButtonProps {
  onCredential: (credential: string) => void;
  text?: 'continue_with' | 'signin_with' | 'signup_with';
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (element: HTMLElement, options: object) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function GoogleAuthButton({ onCredential, text = 'continue_with' }: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      console.warn('[GoogleAuthButton] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set.');
      return;
    }

    const initializeGis = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => {
          onCredential(response.credential);
        },
        context: 'signin',
        ux_mode: 'popup',
      });

      if (containerRef.current) {
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          shape: 'rectangular',
          theme: 'outline',
          text,
          size: 'large',
          logo_alignment: 'left',
          width: containerRef.current.offsetWidth || 360,
        });
      }
    };

    // If GIS script already loaded, initialize immediately
    if (window.google?.accounts?.id) {
      initializeGis();
      return;
    }

    // Load the GIS script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGis;
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove any rendered button iframes if script was appended
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [clientId, onCredential, text]);

  return (
    <div
      ref={containerRef}
      id="google-signin-button"
      className="w-full flex items-center justify-center min-h-[44px]"
    />
  );
}
