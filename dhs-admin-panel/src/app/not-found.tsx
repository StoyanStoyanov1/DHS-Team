"use client"

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-7xl font-extrabold text-gray-900">404</h2>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="mt-8">
          <div className="mt-6">
            <Link href="/" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Return to Home Page
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-center text-sm text-gray-500">
            If you believe this is an error, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
}