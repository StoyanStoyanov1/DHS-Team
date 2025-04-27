"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService, {
    LoginCredentials,
    RegisterCredentials,
    TokenPayload,
    ValidationErrors
} from '../services/auth.service';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<TokenPayload | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null);
    const router = useRouter();

    // Check if user is already logged in on initial load
    useEffect(() => {
        const initAuth = () => {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };

        initAuth();
    }, []);

    // Login function
    const login = async (credentials: LoginCredentials, redirectPath: string = '/') => {
        setLoading(true);
        setError(null);
        setValidationErrors(null);

        try {
            const user = await authService.login(credentials);
            if (user) {
                setUser(user);
                router.push(redirectPath); // Redirect to specified path on successful login
            }
        } catch (err: any) {
            handleAuthError(err);
            // Don't redirect on error, just show the error message
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData: RegisterCredentials, redirectPath: string = '/') => {
        setLoading(true);
        setError(null);
        setValidationErrors(null);

        try {
            const user = await authService.register(userData);
            setUser(user);
            router.push(redirectPath); // Redirect to specified path after registration
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    // Logout function
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

    // Update error handling to always display the exact server error message
    const handleAuthError = (err: any) => {
        console.log('Auth error:', err); // Debug log
        
        if (err.response) {
            // The request was made and the server responded with a status code
            const { data, status } = err.response;
            
            // Check for the "Account with this email already exists" error in the response data
            if (data && data.detail && typeof data.detail === 'string' && 
                data.detail.includes('Account with this email already exists')) {
                setError('Account with this email already exists');
                return;
            }
            
            if (status === 422 && data.errors) {
                // Validation errors
                setValidationErrors(data.errors);
            } else if (data.message) {
                // Use the server-provided error message directly
                setError(data.message);
            } else if (err.serverMessage) {
                // Use the serverMessage property added by our service
                setError(err.serverMessage);
            } else if (data.detail && typeof data.detail === 'string') {
                // Use detail field if available (common in FastAPI/Django responses)
                setError(data.detail);
            } else {
                // Fallback to a generic error message
                setError('An error occurred during authentication');
            }
        } else if (err.serverMessage) {
            // Use the serverMessage property added by our service
            setError(err.serverMessage);
        } else if (err.message && err.message !== 'Network Error') {
            // Use the error message if it's not a generic network error
            setError(err.message);
        } else if (err.request) {
            // The request was made but no response was received
            setError('No response from server. Please check your connection and try again.');
        } else {
            // Something happened in setting up the request
            setError('An error occurred. Please try again.');
        }
    };

    // Clear all errors
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
};

/**
 * Custom hook for managing user authentication state and actions.
 * Provides methods for login, logout, and checking authentication status.
 */

/**
 * useAuth hook.
 * @returns An object containing authentication state and methods.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;