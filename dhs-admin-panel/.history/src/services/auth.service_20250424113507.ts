import { AxiosError } from 'axios';
import api from './api';
import { jwtDecode } from 'jwt-decode';

const isBrowser = typeof window !== 'undefined';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    password_confirm: string;
}

export interface AuthResponse {
    token: string;
    message: string;
}

export interface TokenPayload {
    exp: number;
    iat: number;
    sub: string;
    email: string;
    roles: string[];
    iss: string;
    jti: string;
}

export interface ValidationErrors {
    [key: string]: string[];
}

export interface ErrorResponse {
    message: string;
    errors?: ValidationErrors;
}

class AuthService {
    private tokenKey = 'access_token';
    private refreshTimeoutId: NodeJS.Timeout | null = null;

    constructor() {
        // Initialize token refresh mechanism when service is created
        if (isBrowser) {
            this.initTokenRefresh();
        }
    }

    /**
     * Authenticate user and store JWT token
     */
    async login(credentials: LoginCredentials): Promise<TokenPayload> {
        try {
            const response = await api.post<AuthResponse>('/api/auth/sign-in', credentials);
            this.setToken(response.data.token);
            if (isBrowser) {
                this.initTokenRefresh();
            }
            return this.getDecodedToken() as TokenPayload;
        } catch (error) {
            this.handleAuthError(error as AxiosError);
            // Return the error response instead of throwing
            return Promise.reject(error);
        }
    }

    /**
     * Register a new user
     */
    async register(userData: RegisterCredentials): Promise<TokenPayload> {
        try {
            const response = await api.post<AuthResponse>('/api/auth/sign-up', userData);
            this.setToken(response.data.token);
            if (isBrowser) {
                this.initTokenRefresh();
            }
            return this.getDecodedToken() as TokenPayload;
        } catch (error) {
            this.handleAuthError(error as AxiosError);
            throw error;
        }
    }

    /**
     * Log out the current user
     */
    async logout(): Promise<void> {
        try {
            await api.post('/api/auth/sign-out');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearToken();
            if (isBrowser && this.refreshTimeoutId) {
                clearTimeout(this.refreshTimeoutId);
                this.refreshTimeoutId = null;
            }
        }
    }

    /**
     * Refresh the access token
     */
    async refreshToken(): Promise<void> {
        try {
            const response = await api.post<AuthResponse>('/api/auth/refresh');
            this.setToken(response.data.token);
            if (isBrowser) {
                this.initTokenRefresh();
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearToken();
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded = this.getDecodedToken();
            if (!decoded) return false;

            const { exp } = decoded as TokenPayload;
            const currentTime = Date.now() / 1000;

            return exp > currentTime;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    /**
     * Get current user information from token
     */
    getCurrentUser(): TokenPayload | null {
        try {
            return this.isAuthenticated() ? (this.getDecodedToken() as TokenPayload) : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Store JWT token in localStorage
     */
    private setToken(token: string): void {
        if (!isBrowser) return;
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Retrieve JWT token from localStorage
     */
    getToken(): string | null {
        if (!isBrowser) return null;
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Remove JWT token from localStorage
     */
    private clearToken(): void {
        if (!isBrowser) return;
        localStorage.removeItem(this.tokenKey);
    }

    /**
     * Decode JWT token
     */
    private getDecodedToken(): TokenPayload | null {
        const token = this.getToken();
        if (!token) return null;
        try {
            return jwtDecode<TokenPayload>(token);
        } catch (error) {
            console.error('Failed to decode token:', error);
            this.clearToken();
            return null;
        }
    }

    /**
     * Set up automatic token refresh based on expiration
     */
    private initTokenRefresh(): void {
        if (!isBrowser) return;

        if (this.refreshTimeoutId) {
            clearTimeout(this.refreshTimeoutId);
        }

        const token = this.getDecodedToken();
        if (!token) return;

        const { exp } = token;
        const currentTime = Date.now() / 1000;

        // If token is expired, clear it
        if (exp <= currentTime) {
            this.clearToken();
            return;
        }

        // Schedule refresh for 5 minutes before expiration
        const timeToExpiry = exp - currentTime;
        const refreshTime = Math.max((timeToExpiry - 5 * 60) * 1000, 0);

        this.refreshTimeoutId = setTimeout(() => {
            this.refreshToken();
        }, refreshTime);
    }

    /**
     * Handle authentication errors
     */
    private handleAuthError(error: AxiosError): void {
        if (error.response?.status === 401) {
            // Unauthorized - clear token
            this.clearToken();
        }

        // Other error handling could be added here
        console.error('Authentication error:', error.response?.data || error.message);
    }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;