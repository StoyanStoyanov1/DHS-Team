'use client';

import React, { useState } from 'react';
import { TokenPayload } from '@/src/types/auth.types';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bell,
  CheckCircle2,
  Clock,
  Download,
  Globe,
  Languages,
  Moon,
  Palette,
  Settings,
  Sun,
  Trash2
} from 'lucide-react';

interface SettingsTabProps {
  user: TokenPayload;
}

export default function SettingsTab({ user }: SettingsTabProps) {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    systemNotifications: true,
    securityAlerts: true,
    productUpdates: false
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    denseMode: false,
    language: 'english',
    timezone: 'UTC+0'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleThemeChange = (theme: string) => {
    setAppearanceSettings(prev => ({
      ...prev,
      theme
    }));
  };
  
  const handleLanguageChange = (language: string) => {
    setAppearanceSettings(prev => ({
      ...prev,
      language
    }));
  };
  
  const handleTimezoneChange = (timezone: string) => {
    setAppearanceSettings(prev => ({
      ...prev,
      timezone
    }));
  };
  
  const handleDenseModeToggle = () => {
    setAppearanceSettings(prev => ({
      ...prev,
      denseMode: !prev.denseMode
    }));
  };
  
  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 800));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleExportData = () => {
    // In a real app, this would trigger a data export process
    alert('Your data export has been initiated. You will receive an email with download instructions.');
  };
  
  const handleDeleteAccount = () => {
    // In a real app, this would open a confirmation dialog
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };
  
  return (
    <div>
      <div className="space-y-8">
        {/* Notifications Section */}
        <div>
          <div className="flex items-center mb-4">
            <Bell className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Notification Preferences</h3>
          </div>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                </div>
                <Switch 
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4"></div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">System Notifications</h4>
                  <p className="text-sm text-gray-500">Receive in-app notifications for system events</p>
                </div>
                <Switch 
                  checked={notificationSettings.systemNotifications}
                  onCheckedChange={() => handleNotificationToggle('systemNotifications')}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4"></div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Security Alerts</h4>
                  <p className="text-sm text-gray-500">Get notified about important security events</p>
                </div>
                <Switch 
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={() => handleNotificationToggle('securityAlerts')}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4"></div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Product Updates</h4>
                  <p className="text-sm text-gray-500">Receive updates about new features and improvements</p>
                </div>
                <Switch 
                  checked={notificationSettings.productUpdates}
                  onCheckedChange={() => handleNotificationToggle('productUpdates')}
                />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Appearance Section */}
        <div>
          <div className="flex items-center mb-4">
            <Palette className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Appearance & Localization</h3>
          </div>
          
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant={appearanceSettings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant={appearanceSettings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant={appearanceSettings.theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleThemeChange('system')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dense-mode">Compact Mode</Label>
                  <Switch 
                    id="dense-mode"
                    checked={appearanceSettings.denseMode}
                    onCheckedChange={handleDenseModeToggle}
                  />
                </div>
                <p className="text-sm text-gray-500">Display more content with reduced spacing</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={appearanceSettings.language} 
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Languages className="h-4 w-4 mr-2 text-gray-500" />
                      <SelectValue placeholder="Select language" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select 
                  value={appearanceSettings.timezone} 
                  onValueChange={handleTimezoneChange}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <SelectValue placeholder="Select timezone" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="UTC+0">Greenwich Mean Time (UTC+0)</SelectItem>
                    <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Data Management Section */}
        <div>
          <div className="flex items-center mb-4">
            <Download className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Data Management</h3>
          </div>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-1">Export Your Data</h4>
                <p className="text-sm text-gray-500 mb-3">Download a copy of your personal data</p>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleExportData}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Request Data Export
                </Button>
              </div>
              
              <div className="border-t border-gray-200 pt-6"></div>
              
              <div>
                <h4 className="font-medium mb-1 text-red-600">Delete Account</h4>
                <p className="text-sm text-gray-500 mb-3">Permanently delete your account and all associated data</p>
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Save Settings Button */}
      <div className="mt-8 flex justify-end">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-green-600">
            <CheckCircle2 className="h-5 w-5 mr-1" />
            Settings saved successfully!
          </div>
        )}
        <Button 
          type="button" 
          onClick={handleSaveSettings}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}