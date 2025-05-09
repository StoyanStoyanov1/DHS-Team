'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function SecurityTab() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailAlerts: true,
    sessionTimeout: true
  });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear messages when user starts typing again
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  const handleSecurityToggle = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({ 
      ...prev, 
      [setting]: !prev[setting] 
    }));
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords don't match");
      setIsSubmitting(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Here you would make an API call to update the password
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API call
      
      // Reset form on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccessMessage('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password', error);
      setErrorMessage('Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="space-y-8">
        {/* Password Change Section */}
        <div>
          <div className="flex items-center mb-4">
            <Lock className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Change Password</h3>
          </div>
          
          <Card className="p-6">
            <form onSubmit={handlePasswordSubmit}>
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  {successMessage}
                </div>
              )}
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  {errorMessage}
                </div>
              )}
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showNewPassword ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long and include at least one number, one uppercase letter and one special character.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Password...
                      </span>
                    ) : 'Change Password'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
        
        {/* Security Settings Section */}
        <div>
          <div className="flex items-center mb-4">
            <Shield className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Security Settings</h3>
          </div>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Switch 
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4"></div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Alerts for Suspicious Activity</h4>
                  <p className="text-sm text-gray-500">Receive email notifications for unusual login attempts</p>
                </div>
                <Switch 
                  checked={securitySettings.emailAlerts}
                  onCheckedChange={() => handleSecurityToggle('emailAlerts')}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4"></div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto Session Timeout</h4>
                  <p className="text-sm text-gray-500">Automatically log out after 30 minutes of inactivity</p>
                </div>
                <Switch 
                  checked={securitySettings.sessionTimeout}
                  onCheckedChange={() => handleSecurityToggle('sessionTimeout')}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}