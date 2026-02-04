import React from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useApp } from '@/context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  Plus,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, transactions } = useApp();

  // Calculate summary stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savings = balance > 0 ? balance : 0;

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const summaryCards = [
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'text-[#EF4444]',
      bgColor: 'bg-[#EF4444]/10',
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      color: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10',
    },
    {
      title: 'Balance',
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? 'text-[#3B82F6]' : 'text-[#EF4444]',
      bgColor: 'bg-[#3B82F6]/10',
    },
    {
      title: 'Savings',
      value: savings,
      icon: PiggyBank,
      color: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-[#1F2937]">Welcome back, {user?.fullName}!</h1>
        <p className="text-[#6B7280] mt-2">Here's your financial overview</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 border-[#E5E7EB] hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
                <h3 className="text-sm text-[#6B7280] mb-1">{card.title}</h3>
                <p className={`text-2xl font-bold ${card.color}`}>
                  ${card.value.toFixed(2)}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6 border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => onNavigate('add-transaction')}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl shadow-lg"
            >
              <ArrowDownCircle className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
            <Button
              onClick={() => onNavigate('add-transaction')}
              className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl shadow-lg"
            >
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              Add Income
            </Button>
            <Button
              onClick={() => onNavigate('reports')}
              variant="outline"
              className="border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white rounded-xl"
            >
              View Reports
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-6 border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1F2937]">Recent Transactions</h2>
            <Button
              onClick={() => onNavigate('transactions')}
              variant="ghost"
              className="text-[#3B82F6] hover:text-[#2563EB]"
            >
              View All
            </Button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Plus className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <p className="text-[#6B7280] mb-4">No transactions yet</p>
              <Button
                onClick={() => onNavigate('add-transaction')}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl"
              >
                Add Your First Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] hover:bg-[#F7F8FA] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'income'
                          ? 'bg-[#10B981]/10 text-[#10B981]'
                          : 'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpCircle className="w-5 h-5" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">{transaction.category}</p>
                      <p className="text-sm text-[#6B7280]">
                        {new Date(transaction.date).toLocaleDateString()} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
