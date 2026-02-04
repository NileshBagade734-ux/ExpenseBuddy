import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useApp } from '@/context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Tag, Plus, Trash2, Palette } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export const CategoriesPage: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useApp();
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3B82F6',
    type: 'expense' as 'expense' | 'income' | 'both',
  });

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Gray', value: '#6B7280' },
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.name) {
      toast.error('Please enter a category name');
      return;
    }

    // Check if category already exists
    if (categories.some(c => c.name.toLowerCase() === newCategory.name.toLowerCase())) {
      toast.error('Category already exists');
      return;
    }

    addCategory(newCategory);
    toast.success('Category added successfully');
    setNewCategory({ name: '', color: '#3B82F6', type: 'expense' });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" category?`)) {
      deleteCategory(id);
      toast.success('Category deleted successfully');
    }
  };

  const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');
  const incomeCategories = categories.filter(c => c.type === 'income' || c.type === 'both');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Category Management</h1>
        <p className="text-[#6B7280]">Add and manage custom transaction categories</p>
      </motion.div>

      {/* Add Category Form */}
      <Card className="p-6 border-[#E5E7EB]">
        <h2 className="text-xl font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Category
        </h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name *</Label>
              <Input
                id="categoryName"
                placeholder="e.g., Shopping"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
                className="border-[#E5E7EB]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryType">Type *</Label>
              <Select
                value={newCategory.type}
                onValueChange={(value: any) => setNewCategory({ ...newCategory, type: value })}
              >
                <SelectTrigger className="border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryColor">Color *</Label>
              <Select
                value={newCategory.color}
                onValueChange={(value) => setNewCategory({ ...newCategory, color: value })}
              >
                <SelectTrigger className="border-[#E5E7EB]">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: newCategory.color }}
                      />
                      <span>
                        {colorOptions.find(c => c.value === newCategory.color)?.name || 'Select'}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        <span>{color.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </form>
      </Card>

      {/* Expense Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1F2937] flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#EF4444]" />
          Expense Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenseCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-4 border-[#E5E7EB] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Palette
                        className="w-5 h-5"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2937]">{category.name}</p>
                      <p className="text-xs text-[#6B7280] capitalize">{category.type}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="text-[#EF4444] hover:bg-[#EF4444]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Income Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1F2937] flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#10B981]" />
          Income Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-4 border-[#E5E7EB] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Palette
                        className="w-5 h-5"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2937]">{category.name}</p>
                      <p className="text-xs text-[#6B7280] capitalize">{category.type}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="text-[#EF4444] hover:bg-[#EF4444]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
