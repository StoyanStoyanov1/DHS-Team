import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL = 'http://13.61.5.83';

const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

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

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const url = originalRequest.url || '';

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
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;