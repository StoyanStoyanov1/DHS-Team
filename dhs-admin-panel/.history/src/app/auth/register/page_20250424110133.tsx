'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import { validateRegistrationForm } from '@/src/utils/validation';
import Alert from '@/src/components/Alert';

export default function RegisterPage() {
    const router = useRouter();
    const pathname = usePathname();
    const { register, error, loading, validationErrors, clearErrors, user } = useAuth();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

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

        // Reset success message on new input
        if (registrationSuccess) setRegistrationSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setRegistrationSuccess(false); // Reset success state on new submit

        // Additional validation for terms
        if (!formData.terms) {
            setFormErrors({
                ...formErrors,
                terms: 'You must agree to the Terms of Service and Privacy Policy'
            });
            return;
        }

        // Client-side validation (only for relevant fields now)
        const { email, password, confirmPassword } = formData;
        const validation = validateRegistrationForm(email, password, confirmPassword);

        if (!validation.valid) {
            setFormErrors(validation.errors);
            return;
        }

        // Proceed with registration (only email and password)
        await register({
            email: formData.email,
            password: formData.password,
            password_confirm: formData.confirmPassword
        });
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

    // Effect to show success message after user state is updated
    useEffect(() => {
        if (user && !loading && pathname === '/auth/register') { // Check pathname to avoid showing on redirect
           setRegistrationSuccess(true);
           // Optional: Redirect after a short delay
           // setTimeout(() => router.push('/'), 2000);
        }
    }, [user, loading, router, pathname]);

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
                    if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) {
                        return !el.disabled && el.tabIndex !== -1;
                    }
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
        // Add event listener only if the form is being rendered
        if (formElement) {
           formElement.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (formElement) {
               formElement.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [registrationSuccess]);

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
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign up to get started with our platform
                    </p>
                </div>

                {registrationSuccess && (
                    <Alert
                        type="success"
                        message="Registration successful! Redirecting..."
                        // No onClose needed for success message, or make it dismissible
                    />
                )}

                {error && !registrationSuccess && ( // Don't show error if success message is shown
                    <Alert
                        type="error"
                        message={error}
                        onClose={clearErrors}
                    />
                )}

                {!registrationSuccess && (
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
                                    placeholder="Create a password"
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`appearance-none relative block w-full px-3 py-2 border ${
                                        formErrors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                checked={formData.terms}
                                onChange={handleInputChange}
                                className={`h-4 w-4 ${
                                    formErrors.terms ? 'text-red-600 focus:ring-red-500 border-red-300' : 'text-blue-600 focus:ring-blue-500 border-gray-300'
                                } rounded`}
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                I agree to the <Link href="#" className="text-blue-600 hover:text-blue-500 transition-colors">Terms of Service</Link> and <Link href="#" className="text-blue-600 hover:text-blue-500 transition-colors">Privacy Policy</Link>
                            </label>
                        </div>
                        {formErrors.terms && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.terms}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <UserPlus size={16} className="text-blue-300" />
                        </span>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                   </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account? {' '}
                        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}