import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Progress } from '@/app/components/ui/progress';
import { useApp } from '@/context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Target, Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

export const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || '0'),
        deadline: formData.deadline,
      });
      toast.success('Goal updated successfully');
      setEditingGoal(null);
    } else {
      addGoal({
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || '0'),
        deadline: formData.deadline,
      });
      toast.success('Goal added successfully');
      setShowAddDialog(false);
    }

    setFormData({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
  };

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
      toast.success('Goal deleted successfully');
    }
  };

  const handleAddAmount = (goalId: string, currentAmount: number) => {
    const amount = window.prompt('Enter amount to add:');
    if (amount && !isNaN(parseFloat(amount))) {
      updateGoal(goalId, { currentAmount: currentAmount + parseFloat(amount) });
      toast.success('Amount added successfully');
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Financial Goals</h1>
            <p className="text-[#6B7280]">Track your savings goals and progress</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </motion.div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <Card className="p-12 border-[#E5E7EB] text-center">
          <Target className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
          <p className="text-[#6B7280] mb-4">No financial goals yet</p>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl"
          >
            Create Your First Goal
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isCompleted = percentage >= 100;
            const isOverdue = daysRemaining < 0;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 border-[#E5E7EB]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isCompleted
                            ? 'bg-[#10B981]/10 text-[#10B981]'
                            : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                        }`}
                      >
                        {isCompleted ? (
                          <TrendingUp className="w-6 h-6" />
                        ) : (
                          <Target className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#1F2937]">{goal.title}</h3>
                        <p className="text-sm text-[#6B7280]">
                          {isCompleted
                            ? 'Completed!'
                            : isOverdue
                            ? `${Math.abs(daysRemaining)} days overdue`
                            : `${daysRemaining} days remaining`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(goal)}
                        className="text-[#3B82F6] hover:bg-[#3B82F6]/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(goal.id)}
                        className="text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#6B7280]">Progress</span>
                      <span
                        className={`font-semibold ${
                          isCompleted ? 'text-[#10B981]' : 'text-[#3B82F6]'
                        }`}
                      >
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-3"
                      indicatorClassName={isCompleted ? 'bg-[#10B981]' : 'bg-[#3B82F6]'}
                    />
                    <p className="text-xs text-[#6B7280] mt-2">
                      {percentage.toFixed(1)}% completed
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[#6B7280]">Target Date</p>
                      <p className="font-medium text-[#1F2937]">
                        {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    {!isCompleted && (
                      <Button
                        onClick={() => handleAddAmount(goal.id, goal.currentAmount)}
                        className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Funds
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Goal Dialog */}
      <Dialog
        open={showAddDialog || !!editingGoal}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingGoal(null);
            setFormData({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Save for vacation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="border-[#E5E7EB]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  required
                  className="pl-8 border-[#E5E7EB]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAmount">Current Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="pl-8 border-[#E5E7EB]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Target Date *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
                className="border-[#E5E7EB]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white"
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingGoal(null);
                  setFormData({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
