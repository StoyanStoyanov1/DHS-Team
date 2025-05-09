'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfilePage from '@/src/components/profile/ProfilePage';
import LayoutPage from '@/src/components/Layout';

export default function Profile() {
  return (
    <LayoutPage>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <ProfilePage />
      </div>
    </LayoutPage>
  );
}