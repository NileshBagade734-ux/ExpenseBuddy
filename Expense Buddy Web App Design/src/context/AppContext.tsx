import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Transaction, Budget, Goal, Category, Alert, User } from '@/types';

interface AppContextType extends AppState {
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: string, monthlyLimit: number) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'read'>) => void;
  markAlertAsRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Food', color: '#F59E0B', type: 'expense' },
  { id: '2', name: 'Transport', color: '#8B5CF6', type: 'expense' },
  { id: '3', name: 'Entertainment', color: '#EC4899', type: 'expense' },
  { id: '4', name: 'Bills', color: '#EF4444', type: 'expense' },
  { id: '5', name: 'Salary', color: '#10B981', type: 'income' },
  { id: '6', name: 'Freelance', color: '#06B6D4', type: 'income' },
  { id: '7', name: 'Others', color: '#6B7280', type: 'both' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('expenseBuddy_user');
    const savedTransactions = localStorage.getItem('expenseBuddy_transactions');
    const savedBudgets = localStorage.getItem('expenseBuddy_budgets');
    const savedGoals = localStorage.getItem('expenseBuddy_goals');
    const savedCategories = localStorage.getItem('expenseBuddy_categories');
    const savedAlerts = localStorage.getItem('expenseBuddy_alerts');

    if (savedUser) setUserState(JSON.parse(savedUser));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user) localStorage.setItem('expenseBuddy_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('expenseBuddy_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('expenseBuddy_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('expenseBuddy_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('expenseBuddy_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('expenseBuddy_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update budget spending
    if (transaction.type === 'expense') {
      setBudgets(prev => {
        const budgetIndex = prev.findIndex(b => b.category === transaction.category);
        if (budgetIndex >= 0) {
          const updated = [...prev];
          updated[budgetIndex] = {
            ...updated[budgetIndex],
            spent: updated[budgetIndex].spent + transaction.amount,
          };

          // Check if budget exceeded
          if (updated[budgetIndex].spent >= updated[budgetIndex].monthlyLimit * 0.9) {
            addAlert({
              message: `You've used ${Math.round((updated[budgetIndex].spent / updated[budgetIndex].monthlyLimit) * 100)}% of your ${transaction.category} budget!`,
              type: updated[budgetIndex].spent >= updated[budgetIndex].monthlyLimit ? 'warning' : 'info',
            });
          }

          return updated;
        }
        return prev;
      });
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction && transaction.type === 'expense') {
      setBudgets(prev => {
        const budgetIndex = prev.findIndex(b => b.category === transaction.category);
        if (budgetIndex >= 0) {
          const updated = [...prev];
          updated[budgetIndex] = {
            ...updated[budgetIndex],
            spent: Math.max(0, updated[budgetIndex].spent - transaction.amount),
          };
          return updated;
        }
        return prev;
      });
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (category: string, monthlyLimit: number) => {
    setBudgets(prev => {
      const existingIndex = prev.findIndex(b => b.category === category);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], monthlyLimit };
        return updated;
      } else {
        const currentMonthExpenses = transactions
          .filter(t => 
            t.type === 'expense' && 
            t.category === category &&
            new Date(t.date).getMonth() === new Date().getMonth()
          )
          .reduce((sum, t) => sum + t.amount, 0);

        return [...prev, { category, monthlyLimit, spent: currentMonthExpenses }];
      }
    });
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'createdAt' | 'read'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUserState({ ...user, ...updates });
    }
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('expenseBuddy_user');
  };

  const value: AppContextType = {
    user,
    transactions,
    budgets,
    goals,
    categories,
    alerts,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    addCategory,
    deleteCategory,
    addAlert,
    markAlertAsRead,
    dismissAlert,
    setUser,
    updateUser,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
