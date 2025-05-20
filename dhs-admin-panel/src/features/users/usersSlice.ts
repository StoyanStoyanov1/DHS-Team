import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersState } from './types';
import { fetchUsers, fetchUserById, createUser, updateUser, deleteUser } from './usersThunks';

// Initial state
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  filters: {}
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Set pagination params
    setPagination: (state, action: PayloadAction<{ page?: number; limit?: number }>) => {
      if (action.payload.page !== undefined) {
        state.pagination.page = action.payload.page;
      }
      if (action.payload.limit !== undefined) {
        state.pagination.limit = action.payload.limit;
      }
    },
    
    // Set filter params
    setFilters: (state, action: PayloadAction<{ [key: string]: string | undefined }>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
    },
    
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset selected user
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination
        };
      })
      .addCase(fetchUsers.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch users';
      })
      
      // Fetch user by ID cases
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch user';
      })
      
      // Create user cases
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.users.unshift(action.payload);
          state.pagination.total += 1;
        }
      })
      .addCase(createUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create user';
      })
      
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const payload: any = action.payload; // Добавям типа any за payload
          // Добавям типизиране за user, за да реша проблема с 'never' типа
          const index = state.users.findIndex((user: any) => user.id === payload.id);
          if (index !== -1) {
            state.users[index] = payload;
          }
          if (state.selectedUser?.id === payload.id) {
            state.selectedUser = payload;
          }
        }
      })
      .addCase(updateUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update user';
      })
      
      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
        state.pagination.total -= 1;
      })
      .addCase(deleteUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete user';
      });
  }
});

export const { setPagination, setFilters, clearFilters, clearError, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;