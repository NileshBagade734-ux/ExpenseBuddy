import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useApp } from '@/context/AppContext';
import { motion } from 'motion/react';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { setUser } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (fullName && email && password) {
      setUser({
        id: Date.now().toString(),
        fullName,
        email,
        theme: 'light',
        notificationsEnabled: true,
      });
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F8FA] to-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Create Account</h1>
          <p className="text-[#6B7280]">Join Expense Buddy today</p>
        </div>

        <Card className="p-8 border-[#E5E7EB] shadow-xl">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-[#E5E7EB]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#E5E7EB]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#E5E7EB]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-6 rounded-xl shadow-lg"
            >
              Register
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6B7280]">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-[#3B82F6] hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-[#6B7280] hover:text-[#1F2937]"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};
