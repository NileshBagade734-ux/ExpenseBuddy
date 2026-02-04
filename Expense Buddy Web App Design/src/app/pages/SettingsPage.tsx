import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { useApp } from '@/context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { User, Mail, Lock, Bell, Palette, LogOut } from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, updateUser, logout } = useApp();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    updateUser({
      fullName: formData.fullName,
      email: formData.email,
    });

    toast.success('Profile updated successfully!');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    toast.success('Password updated successfully!');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      onNavigate('landing');
      toast.success('Logged out successfully');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Settings</h1>
        <p className="text-[#6B7280]">Manage your account settings and preferences</p>
      </motion.div>

      {/* Profile Settings */}
      <Card className="p-6 border-[#E5E7EB]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <h2 className="text-xl font-semibold text-[#1F2937]">Profile Information</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="border-[#E5E7EB]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-[#E5E7EB]"
            />
          </div>

          <Button
            type="submit"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl"
          >
            Update Profile
          </Button>
        </form>
      </Card>

      {/* Password Settings */}
      <Card className="p-6 border-[#E5E7EB]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <h2 className="text-xl font-semibold text-[#1F2937]">Change Password</h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="border-[#E5E7EB]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="border-[#E5E7EB]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="border-[#E5E7EB]"
            />
          </div>

          <Button
            type="submit"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl"
          >
            Update Password
          </Button>
        </form>
      </Card>

      {/* Preferences */}
      <Card className="p-6 border-[#E5E7EB]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <h2 className="text-xl font-semibold text-[#1F2937]">Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#6B7280]" />
              <div>
                <p className="font-medium text-[#1F2937]">Budget Alerts</p>
                <p className="text-sm text-[#6B7280]">
                  Receive notifications when approaching budget limits
                </p>
              </div>
            </div>
            <Switch
              checked={user?.notificationsEnabled}
              onCheckedChange={(checked) => updateUser({ notificationsEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-[#6B7280]" />
              <div>
                <p className="font-medium text-[#1F2937]">Theme</p>
                <p className="text-sm text-[#6B7280]">Currently using Light mode</p>
              </div>
            </div>
            <div className="text-sm text-[#6B7280]">Light</div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-[#EF4444] bg-[#EF4444]/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#EF4444]/10 rounded-lg flex items-center justify-center">
            <LogOut className="w-5 h-5 text-[#EF4444]" />
          </div>
          <h2 className="text-xl font-semibold text-[#EF4444]">Account Actions</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1F2937]">Logout</p>
              <p className="text-sm text-[#6B7280]">Sign out of your account</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </Card>

      {/* Account Info */}
      <Card className="p-6 border-[#E5E7EB] bg-[#F7F8FA]">
        <h3 className="font-semibold text-[#1F2937] mb-3">Account Information</h3>
        <div className="space-y-2 text-sm text-[#6B7280]">
          <p>• Your data is stored locally in your browser</p>
          <p>• Clear browser data to reset the application</p>
          <p>• Export your data regularly to keep backups</p>
        </div>
      </Card>
    </div>
  );
};
