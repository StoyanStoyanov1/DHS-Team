import { AxiosResponse } from 'axios';

export interface IBaseCrudParams {
  endpoint: string;
  queryParams?: Record<string, any>;
}

export interface IGetAllParams extends IBaseCrudParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface IGetOneParams extends IBaseCrudParams {
  id: string | number;
}

export interface ICreateParams<T> extends IBaseCrudParams {
  data: T;
}

export interface IUpdateParams<T> extends IBaseCrudParams {
  id: string | number;
  data: Partial<T>;
}

export interface IDeleteParams extends IBaseCrudParams {
  id: string | number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ICrudService<T> {
  getAll(params: IGetAllParams): Promise<AxiosResponse<IPaginatedResponse<T>>>;
  getOne(params: IGetOneParams): Promise<AxiosResponse<T>>;
  create<D = T>(params: ICreateParams<D>): Promise<AxiosResponse<T>>;
  update<D = Partial<T>>(params: IUpdateParams<D>): Promise<AxiosResponse<T>>;
  delete(params: IDeleteParams): Promise<AxiosResponse<void>>;
}