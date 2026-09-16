'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ThyOtpVerificationForm } from '@/components/auth/ThyOtpVerificationForm';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';
import { resendOtp, verifyOtp } from '@/lib/auth-api';
import { AuthMain } from '@/components/ui/AppScreen';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { session, completeAuthentication } = useTailorSession();
  const [challengeId, setChallengeId] = React.useState('');

  React.useEffect(() => {
    if (!session.identifier || challengeId) return;
    resendOtp(session.identifier).then((result) => setChallengeId(result.challengeId)).catch(() => undefined);
  }, [session.identifier, challengeId]);

  return (
    <AuthMain>
      <ThyOtpVerificationForm
        identifier={session.identifier}
        onVerifyOtp={async (otp) => {
          if (!challengeId) throw new Error('Request a verification code before continuing.');
          const result = await verifyOtp(session.identifier, challengeId, otp);
          const next = completeAuthentication(result);
          router.push(getPostAuthPath(next));
          return true;
        }}
        onResendOtp={async () => {
          const result = await resendOtp(session.identifier);
          setChallengeId(result.challengeId);
          return true;
        }}
        onNavigateBack={() => router.push('/')}
      />
    </AuthMain>
  );
}
