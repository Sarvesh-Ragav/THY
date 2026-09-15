/**
 * Auth Types for THY Client & Express API integration
 */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationError {
  field: keyof LoginFormData | 'general';
  message: string;
}

export interface LoginApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ThyLoginCardProps {
  initialEmail?: string;
  onSubmit?: (data: LoginFormData) => Promise<LoginApiResponse | void>;
  onGoogleSignIn?: (credential: string) => void;
  onNavigateSignUp?: () => void;
  isLoading?: boolean;
}
