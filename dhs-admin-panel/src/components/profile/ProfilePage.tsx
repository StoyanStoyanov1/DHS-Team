'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/src/hooks/useAuth';
import GeneralInfoTab from './GeneralInfoTab';
import SecurityTab from './SecurityTab';
import ActivityTab from './ActivityTab';
import SettingsTab from './SettingsTab';
import ProfileHeader from './ProfileHeader';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  
  if (!user) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProfileHeader user={user} />
      
      <Card className="mt-6 shadow-md">
        <Tabs 
          defaultValue="general" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="p-6">
            <GeneralInfoTab user={user} />
          </TabsContent>
          
          <TabsContent value="security" className="p-6">
            <SecurityTab />
          </TabsContent>
          
          <TabsContent value="activity" className="p-6">
            <ActivityTab user={user} />
          </TabsContent>
          
          <TabsContent value="settings" className="p-6">
            <SettingsTab user={user} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}