import { TokenPayload, ValidationErrors } from '@/src/types/auth.types';

/**
 * State interface for the auth slice
 */
export interface AuthState {
  user: TokenPayload | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  validationErrors: ValidationErrors | null;
  redirectAfterLogin: string | null;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  terms: boolean;
}
