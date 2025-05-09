'use client';

import React from 'react';
import { TokenPayload } from '@/src/types/auth.types';
import { User, Clock, MapPin } from 'lucide-react';

interface ProfileHeaderProps {
  user: TokenPayload;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  // Function to extract initials from email
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  // Function to generate a color based on email
  const getProfileColor = (email: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = email.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className={`${getProfileColor(user.email)} w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 md:mb-0 md:mr-6`}>
          {getInitials(user.email)}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{user.email}</h2>
          
          <div className="mt-2 flex flex-col md:flex-row md:items-center text-gray-600">
            <div className="flex items-center justify-center md:justify-start mb-2 md:mb-0">
              <User size={16} className="mr-2" />
              <span>{user.roles.join(', ')}</span>
            </div>
            
            <div className="mx-0 md:mx-4 my-2 md:my-0 border-none md:border-l md:border-gray-300 md:h-5"></div>
            
            <div className="flex items-center justify-center md:justify-start">
              <Clock size={16} className="mr-2" />
              <span>Last login: {new Date().toLocaleDateString('en-US')}</span>
            </div>
          </div>
          
          <p className="mt-4 text-gray-600 max-w-2xl">
            Manage your personal information, security settings, and account preferences.
          </p>
        </div>
      </div>
    </div>
  );
}