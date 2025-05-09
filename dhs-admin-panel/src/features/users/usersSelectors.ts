import { RootState } from '@/src/store';
import { createSelector } from '@reduxjs/toolkit';

/**
 * Select all users from state
 */
export const selectUsers = (state: RootState) => state.users.users;

/**
 * Select selected user from state
 */
export const selectSelectedUser = (state: RootState) => state.users.selectedUser;

/**
 * Select users loading state
 */
export const selectUsersLoading = (state: RootState) => state.users.loading;

/**
 * Select users error state
 */
export const selectUsersError = (state: RootState) => state.users.error;

/**
 * Select users pagination
 */
export const selectUsersPagination = (state: RootState) => state.users.pagination;

/**
 * Select users filters
 */
export const selectUsersFilters = (state: RootState) => state.users.filters;

/**
 * Select active users
 */
export const selectActiveUsers = createSelector(
  [selectUsers],
  (users) => users.filter(user => user.status === 'active')
);

/**
 * Select users by role
 */
export const selectUsersByRole = (role: string) => 
  createSelector(
    [selectUsers],
    (users) => users.filter(user => user.role === role)
  );