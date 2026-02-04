import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { useApp } from '@/context/AppContext';
import { motion } from 'motion/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export const ReportsPage: React.FC = () => {
  const { transactions, categories } = useApp();
  const [timePeriod, setTimePeriod] = useState('month');

  // Calculate monthly income vs expense
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return { month, income, expenses };
    });
  };

  // Calculate category-wise spending
  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals).map(([name, value]) => {
      const category = categories.find(c => c.name === name);
      return {
        name,
        value,
        color: category?.color || '#6B7280',
      };
    });
  };

  // Calculate weekly trends (last 7 weeks)
  const getWeeklyData = () => {
    const weeks = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= weekStart && date <= weekEnd;
      });

      const income = weekTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = weekTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      weeks.push({
        week: `Week ${7 - i}`,
        income,
        expenses,
        net: income - expenses,
      });
    }

    return weeks;
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();
  const weeklyData = getWeeklyData();

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const avgExpense = transactions.filter(t => t.type === 'expense').length > 0
    ? totalExpenses / transactions.filter(t => t.type === 'expense').length
    : 0;

  const avgIncome = transactions.filter(t => t.type === 'income').length > 0
    ? totalIncome / transactions.filter(t => t.type === 'income').length
    : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Reports & Analytics</h1>
            <p className="text-[#6B7280]">Visualize your financial data</p>
          </div>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40 border-[#E5E7EB]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280] mb-2">Total Income</p>
          <p className="text-2xl font-bold text-[#10B981]">${totalIncome.toFixed(2)}</p>
        </Card>
        <Card className="p-6 border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280] mb-2">Total Expenses</p>
          <p className="text-2xl font-bold text-[#EF4444]">${totalExpenses.toFixed(2)}</p>
        </Card>
        <Card className="p-6 border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280] mb-2">Avg. Income</p>
          <p className="text-2xl font-bold text-[#10B981]">${avgIncome.toFixed(2)}</p>
        </Card>
        <Card className="p-6 border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280] mb-2">Avg. Expense</p>
          <p className="text-2xl font-bold text-[#EF4444]">${avgExpense.toFixed(2)}</p>
        </Card>
      </div>

      {/* Income vs Expense Chart */}
      <Card className="p-6 border-[#E5E7EB]">
        <h2 className="text-xl font-semibold text-[#1F2937] mb-6">
          {timePeriod === 'month' ? 'Monthly' : 'Weekly'} Income vs Expenses
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timePeriod === 'month' ? monthlyData : weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey={timePeriod === 'month' ? 'month' : 'week'} stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: '#EF4444', r: 4 }}
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="p-6 border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Spending by Category</h2>
          {categoryData.length === 0 ? (
            <div className="text-center py-12 text-[#6B7280]">
              No expense data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Category Bar Chart */}
        <Card className="p-6 border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Category Comparison</h2>
          {categoryData.length === 0 ? (
            <div className="text-center py-12 text-[#6B7280]">
              No expense data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
};
