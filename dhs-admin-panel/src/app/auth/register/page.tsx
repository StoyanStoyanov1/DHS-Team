/**
 * Registration page component.
 * Allows new users to create an account by providing their details.
 * Includes client-side validation and error handling.
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import { validateRegistrationForm } from '@/src/utils/validation';
import Alert from '@/src/components/Alert';
import { ValidationErrors } from '@/src/types/auth.types';

interface FormErrors {
    [key: string]: string;
}

// Component that safely uses the search params
function RegisterPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams?.get('redirect') || '/';
    const { register, error, loading, validationErrors, clearErrors, user } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [alreadyLoggedInMessage, setAlreadyLoggedInMessage] = useState<string | null>(null);

    // No longer automatically redirect logged-in users
    // Instead, we'll show them a message if they try to submit the form

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

        // Clear the logged in message if it exists
        if (alreadyLoggedInMessage) {
            setAlreadyLoggedInMessage(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        // Check if user is already logged in
        if (user) {
            setAlreadyLoggedInMessage("You can go to the dashboard or log out first if you want to create another account.");
            return;
        }

        // Additional validation for terms
        if (!formData.terms) {
            setFormErrors({
                ...formErrors,
                terms: 'You must agree to the Terms of Service and Privacy Policy'
            });
            return;
        }

        // Client-side validation
        const { email, password, confirmPassword } = formData;
        const validation = validateRegistrationForm(email, password, confirmPassword);

        if (!validation.valid) {
            setFormErrors(validation.errors);
            return;
        }

        // Check for password matching
        if (formData.password !== formData.confirmPassword) {
            setFormErrors({
                ...formErrors,
                confirmPassword: 'Passwords do not match'
            });
            return;
        }

        // Proceed with registration, passing the redirect path
        await register({
            email: formData.email,
            password: formData.password,
            re_password: formData.confirmPassword
        }, redirectPath);
    };

    // Check for server-side validation errors
    useEffect(() => {
        if (validationErrors) {
            const errors: FormErrors = {};

            Object.entries(validationErrors).forEach(([field, messages]) => {
                errors[field] = Array.isArray(messages) ? messages[0] : messages as string;
            });

            setFormErrors(errors);
        }
    }, [validationErrors]);

    // Update error handling to display server error messages
    useEffect(() => {
        if (error) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                general: error
            }));
        }
    }, [error]);

    return (
        <div className="auth-page-container min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700/20 transition-colors duration-200">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                            <div className="w-7 h-7 bg-white dark:bg-gray-200 transform rotate-45 transition-colors duration-200"></div>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                        Sign up to get started with our platform
                    </p>
                </div>

                {formErrors.general && (
                    <Alert
                        type="error"
                        message={formErrors.general}
                        onClose={() => setFormErrors((prevErrors) => ({ ...prevErrors, general: '' }))}
                    />
                )}

                {alreadyLoggedInMessage && (
                    <Alert
                        type="info"
                        message={alreadyLoggedInMessage}
                        onClose={() => setAlreadyLoggedInMessage(null)}
                    />
                )}

                {user && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 px-4 py-3 rounded relative mb-4 transition-colors duration-200">
                        <span className="block sm:inline">
                        You're already registered and logged in.
                        </span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
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
                                    formErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm`}
                                placeholder="Enter your email"
                            />
                            {formErrors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
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
                                        formErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm`}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 cursor-pointer transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formErrors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
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
                                        formErrors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 cursor-pointer transition-colors duration-200"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={formData.terms}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 transition-colors duration-200"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                I agree to the <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">Privacy Policy</a>
                            </label>
                        </div>
                        {formErrors.terms && (
                            <p className="text-sm text-red-600 dark:text-red-400">{formErrors.terms}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800 transition-colors ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <UserPlus size={16} className="text-blue-300 dark:text-blue-200" />
                        </span>
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                        Already have an account? {' '}
                        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Main component that wraps the content with Suspense
export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        }>
            <RegisterPageContent />
        </Suspense>
    );
}
