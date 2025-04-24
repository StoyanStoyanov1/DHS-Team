"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService, {
    LoginCredentials,
    RegisterCredentials,
    TokenPayload,
    ValidationErrors
} from '../services/auth.service';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    success: string | null;
    login: (email: string, password: string, remember: boolean) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    clearSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check for stored user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string, remember: boolean) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, remember }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Login failed');
            }

            const data = await response.json();
            setUser(data.user);
            setSuccess('Login successful!');
            
            if (remember) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            await fetch('/api/auth/logout', {
                method: 'POST',
            });

            setUser(null);
            localStorage.removeItem('user');
            router.push('/auth/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during logout');
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);
    const clearSuccess = () => setSuccess(null);

    return (
        <AuthContext.Provider value={{ user, loading, error, success, login, logout, clearError, clearSuccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default useAuth;