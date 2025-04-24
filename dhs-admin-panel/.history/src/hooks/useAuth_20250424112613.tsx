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
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterCredentials) => Promise<void>;
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
    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        setValidationErrors(null);

        try {
            const user = await authService.login(credentials);
            if (user) {
                setUser(user);
                router.push('/');
            }
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData: RegisterCredentials) => {
        setLoading(true);
        setError(null);
        setValidationErrors(null);

        try {
            const user = await authService.register(userData);
            setUser(user);
            router.push('/'); // Redirect to dashboard after registration
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

    // Handle authentication errors
    const handleAuthError = (err: any) => {
        if (err.response) {
            // The request was made and the server responded with a status code
            const { data, status } = err.response;

            if (status === 422 && data.errors) {
                // Validation errors
                setValidationErrors(data.errors);
            } else if (status === 401) {
                // Unauthorized
                setError('Invalid credentials');
            } else if (status === 400 && data.message) {
                // Bad request with message
                setError(data.message);
            } else {
                // Other error with server response
                setError(data.message || 'An error occurred during authentication');
            }
        } else if (err.request) {
            // The request was made but no response was received
            setError('No response from server. Please try again later.');
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

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;