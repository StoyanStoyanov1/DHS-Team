import { combineReducers } from '@reduxjs/toolkit';
// Import feature reducers
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';

/**
 * Root reducer that combines all feature slices
 * Add each feature reducer here as you create them
 */
const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  // Add additional reducers here
});

export default rootReducer;