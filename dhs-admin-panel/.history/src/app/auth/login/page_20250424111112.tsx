'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import Alert from '@/src/components/Alert';

export default function LoginPage() {
    const router = useRouter();
    const { login, error, loading, validationErrors, clearErrors, user } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const formRef = useRef<HTMLFormElement>(null);

    // If user is already logged in, redirect to dashboard
    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    // Clear form errors when input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        setFormData({
            ...formData,
            [name]: inputValue
        });

        // Clear specific error when user starts typing
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        clearErrors();
        setFormErrors({}); // Clear previous errors

        const { email, password } = formData;

        // Basic check for empty fields (HTML required attribute handles this mostly)
        let currentErrors: {[key: string]: string} = {};
        if (!email) {
            currentErrors.email = 'Email is required.';
        }
        if (!password) {
            currentErrors.password = 'Password is required.';
        }

        if (Object.keys(currentErrors).length > 0) {
            setFormErrors(currentErrors);
            return;
        }

        try {
            // Proceed with login
            await login({ email, password });
        } catch (err) {
            // Handle any unexpected errors
            console.error('Login error:', err);
        }
    };

    // Check for server-side validation errors
    useEffect(() => {
        if (validationErrors) {
            const errors: {[key: string]: string} = {};

            Object.entries(validationErrors).forEach(([field, messages]) => {
                errors[field] = Array.isArray(messages) ? messages[0] : messages;
            });

            setFormErrors(errors);
        }
    }, [validationErrors]);

    // Effect for keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const form = formRef.current;
                if (!form) return;

                const focusableElements = Array.from(
                    form.querySelectorAll<HTMLInputElement | HTMLButtonElement | HTMLAnchorElement>(
                        'input:not([type="hidden"]), button[type="submit"], input[type="checkbox"], a'
                    )
                ).filter(el => {
                    // Check disabled only for relevant elements
                    if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) {
                        return !el.disabled && el.tabIndex !== -1;
                    }
                    // For anchors or other elements, just check tabIndex
                    return el.tabIndex !== -1;
                });

                const currentIndex = focusableElements.findIndex(el => el === document.activeElement);

                let nextIndex;
                if (event.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % focusableElements.length;
                } else { // ArrowUp
                    nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
                }
                focusableElements[nextIndex]?.focus();
            }
        };

        const formElement = formRef.current;
        formElement?.addEventListener('keydown', handleKeyDown);

        return () => {
            formElement?.removeEventListener('keydown', handleKeyDown);
        };
    }, []); // Empty dependency array ensures this runs once

    return (
        <div className="auth-page-container min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                            <div className="w-7 h-7 bg-white transform rotate-45"></div>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Welcome back!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={clearErrors}
                    />
                )}

                <form ref={formRef} className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`appearance-none relative block w-full px-3 py-2 border ${
                                    formErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm`}
                                placeholder="Enter your email"
                            />
                            {formErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`appearance-none relative block w-full px-3 py-2 border ${
                                        formErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <LogIn size={16} className="text-blue-300" />
                        </span>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account? {' '}
                        <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Sign up instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}