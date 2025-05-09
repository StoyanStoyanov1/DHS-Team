import { RootState } from '@/src/store';

/**
 * Select the current authenticated user
 */
export const selectUser = (state: RootState) => state.auth.user;

/**
 * Select if the user is authenticated
 */
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

/**
 * Select loading state for auth
 */
export const selectAuthLoading = (state: RootState) => state.auth.loading;

/**
 * Select error state
 */
export const selectAuthError = (state: RootState) => state.auth.error;

/**
 * Select validation errors
 */
export const selectAuthValidationErrors = (state: RootState) => state.auth.validationErrors;

/**
 * Select debug mode status
 */
export const selectIsDebugMode = (state: RootState) => state.auth.isDebugMode;

/**
 * Select redirect path after login
 */
export const selectRedirectAfterLogin = (state: RootState) => state.auth.redirectAfterLogin;