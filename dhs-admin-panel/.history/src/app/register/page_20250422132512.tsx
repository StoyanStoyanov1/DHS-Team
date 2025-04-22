'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="h-12 w-12 rounded bg-blue-500 flex items-center justify-center">
                            <div className="w-7 h-7 bg-white transform rotate-45"></div>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Adventure starts here
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Make your app management easy and fun!
                    </p>
                </div>
                
                <form className="mt-8 space-y-6">
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter your username"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter your email"
                            />
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
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                        </div>
                        
                        <div className="flex items-center">
                            <input
                                id="agree-terms"
                                name="agree-terms"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={agreedToTerms}
                                onChange={() => setAgreedToTerms(!agreedToTerms)}
                                required
                            />
                            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                                I agree to <a href="#" className="text-blue-600 hover:text-blue-500">privacy policy & terms</a>
                            </label>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign up
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account? {' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in instead
                        </Link>
                    </p>
                </div>
                
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                or
                            </span>
                        </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M22,12.1c0-0.6,0-1.3-0.1-1.9h-9.5v3.7h5.4c-0.2,1.4-1,2.6-2,3.4l0,0.2h2.9C20.9,15.9,22,14.2,22,12.1z" />
                                <path d="M12.3,22c2.4,0,4.5-0.8,6-2.2l-2.9-2.3c-0.8,0.5-1.9,0.9-3.1,0.9c-2.4,0-4.4-1.6-5.1-3.8H4.2v2.3C5.7,19.9,8.8,22,12.3,22z" />
                                <path d="M7.2,14.6c-0.2-0.6-0.3-1.2-0.3-1.9c0-0.7,0.1-1.3,0.3-1.9V8.5H4.2C3.4,9.6,3,10.8,3,12.1s0.4,2.5,1.2,3.6L7.2,14.6z" />
                                <path d="M12.3,7c1.4,0,2.6,0.5,3.5,1.3l0,0l2.5-2.5l0,0C16.9,4.5,14.8,3.7,12.3,3.7c-3.5,0-6.6,2.1-8.1,5.1l3,2.3C7.9,8.6,10,7,12.3,7z" />
                            </svg>
                        </button>
                        
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <svg className="h-5 w-5 text-blue-800" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M24,12.1c0,5.5-4.5,10-10,10S4,17.6,4,12.1C4,6.6,8.5,2.1,14,2.1S24,6.6,24,12.1z M13,8.3h2.2v-2h-2.2v2z M13,15.5h2.2v-5.4H13V15.5z" />
                            </svg>
                        </button>
                        
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12,2.1c-5.5,0-10,4.5-10,10c0,4.4,2.9,8.2,6.8,9.5c0.5,0.1,0.7-0.2,0.7-0.5c0-0.2,0-0.9,0-1.7c-2.8,0.6-3.4-1.3-3.4-1.3C5.7,17,5,16.6,5,16.6c-0.9-0.6,0.1-0.6,0.1-0.6c1,0.1,1.5,1,1.5,1c0.9,1.5,2.3,1.1,2.9,0.8c0.1-0.6,0.3-1.1,0.6-1.3c-2.2-0.3-4.6-1.1-4.6-4.9c0-1.1,0.4-2,1-2.7C6.5,8.1,6.2,7,6.7,5.5c0,0,0.8-0.3,2.8,1c0.8-0.2,1.7-0.3,2.5-0.3s1.7,0.1,2.5,0.3c1.9-1.3,2.8-1,2.8-1c0.5,1.4,0.2,2.5,0.1,2.8c0.6,0.7,1,1.6,1,2.7c0,3.8-2.3,4.7-4.6,4.9c0.3,0.3,0.6,0.9,0.6,1.8c0,1.3,0,2.3,0,2.6c0,0.3,0.2,0.6,0.7,0.5C19.1,20.3,22,16.5,22,12.1C22,6.6,17.5,2.1,12,2.1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 