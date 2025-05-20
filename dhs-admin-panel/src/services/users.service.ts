import { AxiosResponse } from 'axios';
import { User } from '../data/mock/users';
import { BaseCrudService } from './crud.service';
import { IGetAllParams, IPaginatedResponse } from '../types/crud.types';

export class UsersService extends BaseCrudService<User> {
  constructor() {
    super('/api/users');
  }

  async getActiveUsers(params?: Omit<IGetAllParams, 'endpoint'>): Promise<AxiosResponse<IPaginatedResponse<User>>> {
    return this.getAll({
      endpoint: '/api/users', // Using direct value instead of this.baseEndpoint
      ...params,
      filters: {
        ...params?.filters,
        isActive: true
      }
    });
  }

  async getUsersByRole(role: string, params?: Omit<IGetAllParams, 'endpoint'>): Promise<AxiosResponse<IPaginatedResponse<User>>> {
    return this.getAll({
      endpoint: '/api/users', // Using direct value
      ...params,
      filters: {
        ...params?.filters,
        role
      }
    });
  }

  async searchUsers(searchTerm: string, params?: Omit<IGetAllParams, 'endpoint'>): Promise<AxiosResponse<IPaginatedResponse<User>>> {
    return this.getAll({
      endpoint: '/api/users', // Using direct value
      ...params,
      queryParams: {
        ...params?.queryParams,
        search: searchTerm
      }
    });
  }

  async toggleUserStatus(userId: number, isActive: boolean): Promise<AxiosResponse<User>> {
    return this.update({
      endpoint: '/api/users', // Using direct value
      id: userId,
      data: { isActive }
    });
  }

  async changeUserRole(userId: number, role: string): Promise<AxiosResponse<User>> {
    return this.update({
      endpoint: '/api/users', // Using direct value
      id: userId,
      data: { role }
    });
  }
}
