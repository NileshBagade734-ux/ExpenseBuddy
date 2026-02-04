export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

export interface Budget {
  category: string;
  monthlyLimit: number;
  spent: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'expense' | 'income' | 'both';
}

export interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
}

export interface AppState {
  user: User | null;
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  categories: Category[];
  alerts: Alert[];
}
