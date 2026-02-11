
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface User {
  id: string;
  name: string;
  password?: string;
  role?: 'ADMIN' | 'USER';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export interface BudgetGoal {
  category: string;
  limit: number;
  spent: number;
}

export interface FinancialReminder {
  id: string;
  date: string;
  title: string;
  amount?: number;
  completed: boolean;
}

export interface FinancialData {
  transactions: Transaction[];
  budgets: BudgetGoal[];
  reminders: FinancialReminder[];
}

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  TRANSACTIONS = 'TRANSACTIONS',
  BUDGETS = 'BUDGETS',
  CALENDAR = 'CALENDAR',
  SETTINGS = 'SETTINGS'
}
