/**
 * Authentication related types
 */

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    re_password: string;
    firstName?: string;
    lastName?: string;
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

export interface AuthContextType {
    user: TokenPayload | null;
    loading: boolean;
    error: string | null;
    validationErrors: ValidationErrors | null;
    login: (credentials: LoginCredentials, redirectPath?: string) => Promise<void>;
    register: (userData: RegisterCredentials, redirectPath?: string) => Promise<void>;
    logout: () => Promise<void>;
    clearErrors: () => void;
}
