/**
 * Auth Types for THY Client & Express API integration
 */

export interface LoginFormData {
  identifier: string; // Mobile number or email address
}

export interface ValidationError {
  field: keyof LoginFormData | 'general';
  message: string;
}

export interface LoginApiResponse {
  success: boolean;
  message?: string;
  data?: {
    userId: string;
    token?: string;
    requiresOtp?: boolean;
    authMethod: 'mobile' | 'email';
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
