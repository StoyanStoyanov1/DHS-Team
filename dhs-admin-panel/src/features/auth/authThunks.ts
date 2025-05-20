import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/src/services/auth.service';
import { LoginRequest, RegisterRequest } from './types';

/**
 * Login thunk - handle authentication
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login({
        email: credentials.email,
        password: credentials.password
      });
      return response;
    } catch (error: any) {
      // Handle validation errors
      if (error.validationErrors) {
        return rejectWithValue({
          error: error.message,
          validationErrors: error.validationErrors
        });
      }

      return rejectWithValue({
        error: error.message || 'Login failed'
      });
    }
  }
);

/**
 * Register thunk - handle user registration
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register({
        email: userData.email,
        password: userData.password,
        re_password: userData.confirmPassword, // changed from confirmPassword to re_password
        firstName: userData.firstName,
        lastName: userData.lastName
      });
      return response;
    } catch (error: any) {
      // Handle validation errors
      if (error.validationErrors) {
        return rejectWithValue({
          error: error.message,
          validationErrors: error.validationErrors
        });
      }

      return rejectWithValue({
        error: error.message || 'Registration failed'
      });
    }
  }
);

/**
 * Logout thunk - handle user logout
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error: any) {
      return rejectWithValue({
        error: error.message || 'Logout failed'
      });
    }
  }
);

/**
 * Get current user thunk - retrieve authenticated user data
 */
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = authService.getCurrentUser();
      return currentUser;
    } catch (error: any) {
      return rejectWithValue({
        error: error.message || 'Failed to get current user'
      });
    }
  }
);
