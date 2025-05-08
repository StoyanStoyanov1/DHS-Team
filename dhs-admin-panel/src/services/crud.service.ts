import { AxiosResponse } from 'axios';
import api from './api';
import {
  IGetAllParams,
  IGetOneParams,
  ICreateParams,
  IUpdateParams,
  IDeleteParams,
  IPaginatedResponse,
  ICrudService,
} from '../types/crud.types';

export class BaseCrudService<T> implements ICrudService<T> {
  constructor(private baseEndpoint: string = '') {}

  async getAll(params: IGetAllParams): Promise<AxiosResponse<IPaginatedResponse<T>>> {
    const { endpoint = this.baseEndpoint, page = 1, pageSize = 10, sortBy, sortDirection, filters, queryParams } = params;
    
    const requestParams: Record<string, any> = {
      page,
      pageSize,
      ...queryParams,
    };

    if (sortBy) {
      requestParams.sortBy = sortBy;
      requestParams.sortDirection = sortDirection || 'asc';
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          requestParams[key] = value;
        }
      });
    }

    return api.get<IPaginatedResponse<T>>(endpoint, { params: requestParams });
  }

  async getOne(params: IGetOneParams): Promise<AxiosResponse<T>> {
    const { endpoint = this.baseEndpoint, id, queryParams } = params;
    return api.get<T>(`${endpoint}/${id}`, { params: queryParams });
  }

  async create<D = T>(params: ICreateParams<D>): Promise<AxiosResponse<T>> {
    const { endpoint = this.baseEndpoint, data, queryParams } = params;
    return api.post<T>(endpoint, data, { params: queryParams });
  }

  async update<D = Partial<T>>(params: IUpdateParams<D>): Promise<AxiosResponse<T>> {
    const { endpoint = this.baseEndpoint, id, data, queryParams } = params;
    return api.put<T>(`${endpoint}/${id}`, data, { params: queryParams });
  }

  async delete(params: IDeleteParams): Promise<AxiosResponse<void>> {
    const { endpoint = this.baseEndpoint, id, queryParams } = params;
    return api.delete<void>(`${endpoint}/${id}`, { params: queryParams });
  }
}