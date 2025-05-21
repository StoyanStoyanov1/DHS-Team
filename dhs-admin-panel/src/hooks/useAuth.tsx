"use client"
import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '../services/auth.service';
import {
    LoginCredentials,
    RegisterCredentials,
    TokenPayload,
    ValidationErrors
} from '../types/auth.types';

interface AuthContextType {
    user: TokenPayload | null;
    loading: boolean;
    error: string | null;
    validationErrors: ValidationErrors | null;
    login: (credentials: LoginCredentials, redirectPath?: string) => Promise<void>;
    register: (userData: RegisterCredentials, redirectPath?: string) => Promise<void>;
    logout: () => Promise<void>;
    clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderContent({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<TokenPayload | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            try {
                const currentUser = authService.getCurrentUser();
                setUser(currentUser);

                if (currentUser) {
                    const redirectParam = searchParams?.get('redirect');
                    if (redirectParam) {
                        const decodedRedirect = decodeURIComponent(redirectParam);
                        router.push(decodedRedirect);
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [router, searchParams]);

    const login = async (credentials: LoginCredentials, redirectPath: string = '/') => {
        setLoading(true);
        setError(null);
        setValidationErrors(null);

        try {
            const user = await authService.login(credentials);
            if (user) {
                setUser(user);
                router.push(redirectPath);
            }
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterCredentials, redirectPath: string = '/') => {
        setLoading(true);
        setError(null);
        setValidationErrors(null);

        try {
            const user = await authService.register(userData);
            setUser(user);
            router.push(redirectPath);
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);

        try {
            await authService.logout();
            setUser(null);
            router.push('/auth/login');
        } catch (err: any) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (err: any) => {
        if (err.response) {
            const { data, status } = err.response;

            if (data && data.detail && typeof data.detail === 'string' && 
                data.detail.includes('Account with this email already exists')) {
                setError('Account with this email already exists');
                return;
            }

            if (status === 422 && data.errors) {
                setValidationErrors(data.errors);
            } else if (data.message) {
                setError(data.message);
            } else if (err.serverMessage) {
                setError(err.serverMessage);
            } else if (data.detail && typeof data.detail === 'string') {
                setError(data.detail);
            } else {
                setError('An error occurred during authentication');
            }
        } else if (err.serverMessage) {
            setError(err.serverMessage);
        } else if (err.message && err.message !== 'Network Error') {
            setError(err.message);
        } else if (err.request) {
            setError('No response from server. Please check your connection and try again.');
        } else {
            setError('An error occurred. Please try again.');
        }
    };

    const clearErrors = () => {
        setError(null);
        setValidationErrors(null);
    };

    const value = {
        user,
        loading,
        error,
        validationErrors,
        login,
        register,
        logout,
        clearErrors
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        }>
            <AuthProviderContent children={children} />
        </Suspense>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;
