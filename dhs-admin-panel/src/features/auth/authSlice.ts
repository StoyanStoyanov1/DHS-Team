import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';
import { loginUser, registerUser, logoutUser, getCurrentUser } from './authThunks';

// Debug mode detection
const DEBUG_MODE = process.env.NODE_ENV === 'development' ? 
    (process.env.NEXT_PUBLIC_DEBUG_AUTH !== 'false') : 
    (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true');

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  validationErrors: null,
  isDebugMode: DEBUG_MODE,
  redirectAfterLogin: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear any errors in the auth state
    clearErrors: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    
    // Set the redirect path after login
    setRedirectPath: (state, action: PayloadAction<string | null>) => {
      state.redirectAfterLogin = action.payload;
    },
    
    // Reset state (used on logout)
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload?.error || 'Authentication failed';
        state.validationErrors = action.payload?.validationErrors || null;
      })
      
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || 'Registration failed';
        state.validationErrors = action.payload?.validationErrors || null;
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, () => {
        // Reset to initial state
        return initialState;
      })
      .addCase(logoutUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || 'Logout failed';
      })
      
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action: any) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.error || 'Failed to fetch user';
      });
  }
});

export const { clearErrors, setRedirectPath, resetState } = authSlice.actions;
export default authSlice.reducer;