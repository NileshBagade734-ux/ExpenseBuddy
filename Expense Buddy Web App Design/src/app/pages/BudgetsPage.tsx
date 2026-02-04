import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Progress } from '@/app/components/ui/progress';
import { useApp } from '@/context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

export const BudgetsPage: React.FC = () => {
  const { budgets, updateBudget, categories, transactions } = useApp();
  const [budgetLimits, setBudgetLimits] = useState<{ [key: string]: string }>({});

  const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');

  // Get current month's spending for each category
  const getCurrentMonthSpending = (category: string) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return (
          t.type === 'expense' &&
          t.category === category &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSaveBudget = (category: string) => {
    const limit = parseFloat(budgetLimits[category]);
    if (isNaN(limit) || limit <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    updateBudget(category, limit);
    toast.success(`Budget for ${category} updated successfully`);
    setBudgetLimits({ ...budgetLimits, [category]: '' });
  };

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;

    if (percentage >= 100) {
      return { status: 'exceeded', color: 'text-[#EF4444]', bgColor: 'bg-[#EF4444]' };
    } else if (percentage >= 90) {
      return { status: 'warning', color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]' };
    } else if (percentage >= 70) {
      return { status: 'caution', color: 'text-[#3B82F6]', bgColor: 'bg-[#3B82F6]' };
    } else {
      return { status: 'good', color: 'text-[#10B981]', bgColor: 'bg-[#10B981]' };
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Budget Management</h1>
        <p className="text-[#6B7280]">Set and track your spending limits by category</p>
      </motion.div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {expenseCategories.map((category, index) => {
          const spent = getCurrentMonthSpending(category.name);
          const budget = budgets.find(b => b.category === category.name);
          const limit = budget?.monthlyLimit || 0;
          const percentage = limit > 0 ? (spent / limit) * 100 : 0;
          const status = limit > 0 ? getBudgetStatus(spent, limit) : null;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 border-[#E5E7EB]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="text-lg font-semibold text-[#1F2937]">{category.name}</h3>
                  </div>
                  {status && (
                    <Badge
                      variant={status.status === 'good' ? 'default' : 'destructive'}
                      className={`${status.bgColor} text-white border-0`}
                    >
                      {status.status === 'exceeded'
                        ? 'Exceeded'
                        : status.status === 'warning'
                        ? 'Warning'
                        : status.status === 'caution'
                        ? 'Caution'
                        : 'On Track'}
                    </Badge>
                  )}
                </div>

                {limit > 0 ? (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#6B7280]">Spent this month</span>
                        <span className={`font-semibold ${status?.color}`}>
                          ${spent.toFixed(2)} / ${limit.toFixed(2)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className="h-3"
                        indicatorClassName={status?.bgColor}
                      />
                      <p className="text-xs text-[#6B7280] mt-2">
                        {percentage.toFixed(1)}% of budget used
                      </p>
                    </div>

                    {status && (
                      <div className="mb-4">
                        {status.status === 'exceeded' && (
                          <div className="flex items-start gap-2 p-3 bg-[#EF4444]/10 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-[#EF4444] mt-0.5" />
                            <p className="text-sm text-[#EF4444]">
                              You've exceeded your budget by ${(spent - limit).toFixed(2)}
                            </p>
                          </div>
                        )}
                        {status.status === 'warning' && (
                          <div className="flex items-start gap-2 p-3 bg-[#F59E0B]/10 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-[#F59E0B] mt-0.5" />
                            <p className="text-sm text-[#F59E0B]">
                              You've used {percentage.toFixed(0)}% of your budget
                            </p>
                          </div>
                        )}
                        {status.status === 'good' && (
                          <div className="flex items-start gap-2 p-3 bg-[#10B981]/10 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                            <p className="text-sm text-[#10B981]">
                              ${(limit - spent).toFixed(2)} remaining
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mb-4">
                    <p className="text-sm text-[#6B7280] mb-2">
                      No budget set. Current spending: ${spent.toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor={`budget-${category.id}`}>
                    {limit > 0 ? 'Update' : 'Set'} Monthly Budget
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                        $
                      </span>
                      <Input
                        id={`budget-${category.id}`}
                        type="number"
                        step="0.01"
                        placeholder={limit > 0 ? limit.toString() : '0.00'}
                        value={budgetLimits[category.name] || ''}
                        onChange={(e) =>
                          setBudgetLimits({ ...budgetLimits, [category.name]: e.target.value })
                        }
                        className="pl-8 border-[#E5E7EB]"
                      />
                    </div>
                    <Button
                      onClick={() => handleSaveBudget(category.name)}
                      className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="p-6 border-[#E5E7EB]">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-[#3B82F6]" />
          <h2 className="text-xl font-semibold text-[#1F2937]">Budget Summary</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-[#1F2937]">
              ${budgets.reduce((sum, b) => sum + b.monthlyLimit, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-[#EF4444]">
              ${budgets.reduce((sum, b) => sum + b.spent, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Remaining</p>
            <p className="text-2xl font-bold text-[#10B981]">
              $
              {Math.max(
                0,
                budgets.reduce((sum, b) => sum + b.monthlyLimit - b.spent, 0)
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
