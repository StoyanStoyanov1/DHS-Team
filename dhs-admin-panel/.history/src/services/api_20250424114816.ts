// src/services/api.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const url = originalRequest.url || '';

        // Don't try to refresh for auth endpoints to prevent infinite loops
        const isAuthEndpoint = url.includes('/api/auth/sign-in') || 
                              url.includes('/api/auth/sign-up') || 
                              url.includes('/api/auth/refresh');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            try {
                originalRequest._retry = true;

                await axios.post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true });

                const newToken = localStorage.getItem('access_token');

                if (originalRequest.headers && newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                // Don't redirect here, let the component handle it
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;