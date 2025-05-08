import { useState, useCallback, useEffect } from 'react';
import { UsersService } from '../services/users.service';
import { User } from '../data/mock/users';
import { IPaginatedResponse } from '../types/crud.types';
import { AxiosError } from 'axios';

interface UseUsersServiceResult {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  fetchUsers: (page?: number, pageSize?: number, sortBy?: string, sortDirection?: 'asc' | 'desc', filters?: Record<string, any>) => Promise<void>;
  fetchUserById: (id: number | string) => Promise<User | null>;
  createUser: (userData: Omit<User, 'id'>) => Promise<User | null>;
  updateUser: (id: number | string, userData: Partial<User>) => Promise<User | null>;
  deleteUser: (id: number | string) => Promise<boolean>;
  toggleUserStatus: (id: number | string, isActive: boolean) => Promise<User | null>;
  changeUserRole: (id: number | string, role: string) => Promise<User | null>;
  searchUsers: (searchTerm: string) => Promise<void>;
}

export const useUsersService = (): UseUsersServiceResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });

  const usersService = new UsersService();

  const fetchUsers = useCallback(async (
    page = 1,
    pageSize = 10,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    filters?: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersService.getAll({
        page,
        pageSize,
        sortBy,
        sortDirection,
        filters
      });
      
      setUsers(response.data.data);
      setPagination({
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        pageSize: response.data.pagination.pageSize,
        totalPages: response.data.pagination.totalPages
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Възникна грешка при извличането на потребители');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: number | string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersService.getOne({ id });
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Възникна грешка при извличането на потребителя');
      console.error('Error fetching user by ID:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: Omit<User, 'id'>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersService.create({ data: userData });
      
      fetchUsers(pagination.page, pagination.pageSize);
      
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Възникна грешка при създаването на потребителя');
      console.error('Error creating user:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, fetchUsers]);

  const updateUser = useCallback(async (id: number | string, userData: Partial<User>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersService.update({ id, data: userData });
      
      fetchUsers(pagination.page, pagination.pageSize);
      
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Възникна грешка при обновяването на потребителя');
      console.error('Error updating user:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, fetchUsers]);

  const deleteUser = useCallback(async (id: number | string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await usersService.delete({ id });
      
      fetchUsers(pagination.page, pagination.pageSize);
      
      return true;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Възникна грешка при изтриването на потребителя');
      console.error('Error deleting user:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, fetchUsers]);

  const toggleUserStatus = useCallback(async (id: number | string, isActive: boolean): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersService.toggleUserStatus(Number(id), isActive);
      
      fetchUsers(pagination.page, pagination.pageSize);
      
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Възникна грешка при промяната на статуса на потребителя');
      console.error('Error toggling user status:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, fetchUsers]);

  const changeUserRole = useCallback(async (id: number | string, role: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersService.changeUserRole(Number(id), role);
      
      fetchUsers(pagination.page, pagination.pageSize);
      
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Възникна грешка при промяната на ролята на потребителя');
      console.error('Error changing user role:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, fetchUsers]);

  const searchUsers = useCallback(async (searchTerm: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersService.searchUsers(searchTerm);
      
      setUsers(response.data.data);
      setPagination({
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        pageSize: response.data.pagination.pageSize,
        totalPages: response.data.pagination.totalPages
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Възникна грешка при търсенето на потребители');
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(pagination.page, pagination.pageSize);
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    changeUserRole,
    searchUsers
  };
};