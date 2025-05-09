/**
 * Interface for User entity
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt?: string;
}

/**
 * State interface for the users slice
 */
export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: {
    search?: string;
    status?: string;
    role?: string;
  };
}

/**
 * User creation request payload
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

/**
 * User update request payload
 */
export interface UpdateUserRequest {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
}

/**
 * Users list request params
 */
export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}