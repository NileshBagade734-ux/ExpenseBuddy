import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/app/components/ui/badge';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout, alerts } = useApp();

  const unreadAlerts = alerts.filter(a => !a.read).length;

  return (
    <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-[#F7F8FA] rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6 text-[#1F2937]" />
      </button>

      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-[#1F2937]">Welcome back, {user?.fullName || 'User'}!</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Badge */}
        <div className="relative">
          <Bell className="w-5 h-5 text-[#6B7280]" />
          {unreadAlerts > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-[#EF4444] text-white text-xs px-1.5 py-0.5">
              {unreadAlerts}
            </Badge>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-[#1F2937]">{user?.fullName}</p>
            <p className="text-xs text-[#6B7280]">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-[#F7F8FA] rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>
      </div>
    </header>
  );
};
