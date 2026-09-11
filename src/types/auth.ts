/**
 * Auth Types for THY Client & Express API integration
 */

export interface LoginFormData {
  identifier: string; // 10-digit mobile number or E.164 phone number
}

export interface ValidationError {
  field: keyof LoginFormData | 'general';
  message: string;
}

export interface LoginApiResponse {
  success: boolean;
  message?: string;
  data?: {
    challengeId: string;
    expiresAt: string;
    mockOtp?: string;
  };
  error?: string;
}

export interface ThyLoginCardProps {
  initialIdentifier?: string;
  onSubmit?: (data: LoginFormData) => Promise<LoginApiResponse | void>;
  onGoogleSignIn?: () => void;
  onNavigateSignUp?: () => void;
  isLoading?: boolean;
}
