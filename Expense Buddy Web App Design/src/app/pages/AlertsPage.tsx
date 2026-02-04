import React from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useApp } from '@/context/AppContext';
import { motion } from 'motion/react';
import { Bell, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead, dismissAlert } = useApp();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-[#EF4444]/10',
          text: 'text-[#EF4444]',
          border: 'border-[#EF4444]/20',
        };
      case 'success':
        return {
          bg: 'bg-[#10B981]/10',
          text: 'text-[#10B981]',
          border: 'border-[#10B981]/20',
        };
      default:
        return {
          bg: 'bg-[#3B82F6]/10',
          text: 'text-[#3B82F6]',
          border: 'border-[#3B82F6]/20',
        };
    }
  };

  const unreadAlerts = alerts.filter(a => !a.read);
  const readAlerts = alerts.filter(a => a.read);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Alerts & Notifications</h1>
            <p className="text-[#6B7280]">
              Stay updated with budget alerts and important notifications
            </p>
          </div>
          {unreadAlerts.length > 0 && (
            <Badge className="bg-[#EF4444] text-white border-0 px-3 py-1">
              {unreadAlerts.length} Unread
            </Badge>
          )}
        </div>
      </motion.div>

      {alerts.length === 0 ? (
        <Card className="p-12 border-[#E5E7EB] text-center">
          <Bell className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
          <p className="text-[#6B7280]">No alerts yet</p>
          <p className="text-sm text-[#6B7280] mt-2">
            You'll see budget alerts and notifications here
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Unread Alerts */}
          {unreadAlerts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#1F2937]">Unread</h2>
              {unreadAlerts.map((alert, index) => {
                const colors = getAlertColor(alert.type);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={`p-4 border-2 ${colors.border} ${colors.bg}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`${colors.text} mt-0.5`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${colors.text} font-medium mb-1`}>{alert.message}</p>
                          <p className="text-xs text-[#6B7280]">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAlertAsRead(alert.id)}
                            className={`${colors.text} hover:bg-white/50`}
                          >
                            Mark Read
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissAlert(alert.id)}
                            className="text-[#6B7280] hover:bg-white/50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Read Alerts */}
          {readAlerts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#1F2937]">Read</h2>
              {readAlerts.map((alert, index) => {
                const colors = getAlertColor(alert.type);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="p-4 border-[#E5E7EB] opacity-60">
                      <div className="flex items-start gap-4">
                        <div className={`${colors.text} mt-0.5`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1F2937] font-medium mb-1">{alert.message}</p>
                          <p className="text-xs text-[#6B7280]">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dismissAlert(alert.id)}
                          className="text-[#6B7280] hover:bg-[#F7F8FA]"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
