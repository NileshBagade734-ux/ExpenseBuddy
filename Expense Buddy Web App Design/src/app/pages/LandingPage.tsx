import React from 'react';
import { TrendingUp, PieChart, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { motion } from 'motion/react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Easy Tracking',
      description: 'Manually add and manage all your expenses and income with ease',
    },
    {
      icon: PieChart,
      title: 'Visual Insights',
      description: 'Beautiful charts and graphs to understand your spending patterns',
    },
    {
      icon: Target,
      title: 'Smart Budgeting',
      description: 'Set budgets for categories and get alerts when you exceed them',
    },
  ];

  const benefits = [
    'Track expenses and income manually',
    'Set and monitor budgets by category',
    'View detailed analytics and reports',
    'Set financial goals and track progress',
    'Export data as CSV or PDF',
    'Beautiful, intuitive interface',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F8FA] to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[#1F2937] mb-6">
            Track Your Expenses <span className="text-[#3B82F6]">Effortlessly</span>
          </h1>
          <p className="text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Take control of your finances with Expense Buddy - the modern, clean, 
            and premium personal finance tracking platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => onNavigate('login')}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            >
              Login
            </Button>
            <Button
              onClick={() => onNavigate('register')}
              variant="outline"
              className="border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white px-8 py-6 text-lg rounded-xl"
            >
              Register
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#1F2937] text-center mb-12">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300 border-[#E5E7EB]">
                <div className="w-16 h-16 bg-[#3B82F6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-[#3B82F6]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">{feature.title}</h3>
                <p className="text-[#6B7280]">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1F2937] text-center mb-12">
            Everything You Need
          </h2>
          <Card className="p-8 border-[#E5E7EB]">
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                  <span className="text-[#1F2937]">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 pb-24">
        <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-r from-[#3B82F6] to-[#2563EB] border-0">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Join Expense Buddy today and start tracking your expenses effortlessly
          </p>
          <Button
            onClick={() => onNavigate('register')}
            className="bg-white text-[#3B82F6] hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg"
          >
            Get Started Free
          </Button>
        </Card>
      </section>
    </div>
  );
};
