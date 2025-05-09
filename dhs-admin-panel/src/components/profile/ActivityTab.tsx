'use client';

import React from 'react';
import { TokenPayload } from '@/src/types/auth.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Calendar, Clock, Globe, Laptop, LogIn, Monitor, Smartphone, Terminal } from 'lucide-react';

interface ActivityTabProps {
  user: TokenPayload;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  time: Date;
  status: 'current' | 'recent' | 'expired';
}

interface AccountActivity {
  id: string;
  action: string;
  description: string;
  time: Date;
}

export default function ActivityTab({ user }: ActivityTabProps) {
  // Mock data for login sessions - in a real app, this would come from an API
  const loginSessions: LoginSession[] = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'London, United Kingdom',
      ipAddress: '84.123.45.678',
      time: new Date(2025, 4, 9, 10, 30), // Today
      status: 'current'
    },
    {
      id: '2',
      device: 'Safari on Mac',
      location: 'New York, United States',
      ipAddress: '192.168.1.1',
      time: new Date(2025, 4, 8, 14, 15), // Yesterday
      status: 'recent'
    },
    {
      id: '3',
      device: 'Firefox on Windows',
      location: 'Berlin, Germany',
      ipAddress: '45.67.89.123',
      time: new Date(2025, 4, 5, 9, 0), // Few days ago
      status: 'expired'
    },
    {
      id: '4',
      device: 'Mobile App on iOS',
      location: 'Paris, France',
      ipAddress: '123.45.67.89',
      time: new Date(2025, 3, 30, 18, 45), // Last month
      status: 'expired'
    },
  ];

  // Mock data for account activity
  const accountActivities: AccountActivity[] = [
    {
      id: '1',
      action: 'Profile updated',
      description: 'Personal information was updated',
      time: new Date(2025, 4, 8, 15, 30) // Yesterday
    },
    {
      id: '2',
      action: 'Password changed',
      description: 'Password was successfully changed',
      time: new Date(2025, 4, 7, 11, 20) // 2 days ago
    },
    {
      id: '3',
      action: 'Login from new device',
      description: 'New login from Chrome on Windows',
      time: new Date(2025, 4, 5, 9, 10) // 4 days ago
    },
    {
      id: '4',
      action: 'Two-factor authentication disabled',
      description: 'Two-factor authentication was turned off',
      time: new Date(2025, 4, 3, 14, 0) // 6 days ago
    },
  ];

  // Helper function to format date
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Function to get device icon
  const getDeviceIcon = (device: string) => {
    if (device.includes('Mobile')) {
      return <Smartphone className="h-5 w-5 text-gray-400" />;
    } else if (device.includes('Chrome') || device.includes('Safari') || device.includes('Firefox')) {
      return <Monitor className="h-5 w-5 text-gray-400" />;
    } else {
      return <Laptop className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div>
      <div className="space-y-8">
        {/* Login Sessions Section */}
        <div>
          <div className="flex items-center mb-4">
            <LogIn className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Login Sessions</h3>
          </div>
          
          <Card className="p-6">
            <div className="space-y-4">
              {loginSessions.map((session) => (
                <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-start mb-2 md:mb-0">
                    <div className="mr-4">
                      {getDeviceIcon(session.device)}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium">{session.device}</h4>
                        {session.status === 'current' && (
                          <Badge className="ml-2 bg-green-500 text-white" variant="outline">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center">
                        <div className="flex items-center mr-3">
                          <Globe className="h-3.5 w-3.5 mr-1" />
                          <span>{session.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Terminal className="h-3.5 w-3.5 mr-1" />
                          <span>IP: {session.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDate(session.time)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Account Activity Section */}
        <div>
          <div className="flex items-center mb-4">
            <Activity className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Account Activity</h3>
          </div>
          
          <Card className="p-6">
            <div className="space-y-6">
              {accountActivities.map((activity) => (
                <div key={activity.id} className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h4 className="font-medium">{activity.action}</h4>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center mt-1 md:mt-0">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(activity.time)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}