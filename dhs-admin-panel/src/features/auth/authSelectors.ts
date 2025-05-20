import { RootState } from '../../store';
import { AuthState } from './types';

/**
 * Select the current authenticated user
 */
export const selectUser = (state: RootState) => (state as any).auth.user;

/**
 * Select if the user is authenticated
 */
export const selectIsAuthenticated = (state: RootState) => (state as any).auth.isAuthenticated;

/**
 * Select loading state for auth
 */
export const selectAuthLoading = (state: RootState) => (state as any).auth.loading;

/**
 * Select error state
 */
export const selectAuthError = (state: RootState) => (state as any).auth.error;

/**
 * Select validation errors
 */
export const selectAuthValidationErrors = (state: RootState) => (state as any).auth.validationErrors;


/**
 * Select redirect path after login
 */
export const selectRedirectAfterLogin = (state: RootState) => (state as any).auth.redirectAfterLogin;
