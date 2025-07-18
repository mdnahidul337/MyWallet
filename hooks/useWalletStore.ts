import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
// Simple UUID generator for React Native
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

import { Account, Transaction, Budget, SavingsGoal, Currency, Category } from '@/types/wallet';
import { defaultCategories } from '@/constants/categories';

// Storage keys
const ACCOUNTS_STORAGE_KEY = 'wallet_accounts';
const TRANSACTIONS_STORAGE_KEY = 'wallet_transactions';
const BUDGETS_STORAGE_KEY = 'wallet_budgets';
const SAVINGS_GOALS_STORAGE_KEY = 'wallet_savings_goals';
const CATEGORIES_STORAGE_KEY = 'wallet_categories';
const SETTINGS_STORAGE_KEY = 'wallet_settings';

// Settings interface
interface WalletSettings {
  defaultCurrency: Currency;
  pinEnabled: boolean;
  pinCode?: string;
  hideBalances: boolean;
}

// Default settings
const defaultSettings: WalletSettings = {
  defaultCurrency: 'USD',
  pinEnabled: false,
  hideBalances: false,
};

export const [WalletProvider, useWallet] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Accounts
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const data = await AsyncStorage.getItem(ACCOUNTS_STORAGE_KEY);
      return data ? (JSON.parse(data) as Account[]) : [];
    },
  });

  // Transactions
  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const data = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      return data ? (JSON.parse(data) as Transaction[]) : [];
    },
  });

  // Budgets
  const budgetsQuery = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const data = await AsyncStorage.getItem(BUDGETS_STORAGE_KEY);
      return data ? (JSON.parse(data) as Budget[]) : [];
    },
  });

  // Savings Goals
  const savingsGoalsQuery = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      const data = await AsyncStorage.getItem(SAVINGS_GOALS_STORAGE_KEY);
      return data ? (JSON.parse(data) as SavingsGoal[]) : [];
    },
  });

  // Categories
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
      return data ? (JSON.parse(data) as Category[]) : defaultCategories;
    },
  });

  // Settings
  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const data = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      return data ? (JSON.parse(data) as WalletSettings) : defaultSettings;
    },
  });

  // Mutations
  const accountsMutation = useMutation({
    mutationFn: async (accounts: Account[]) => {
      await AsyncStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      return accounts;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['accounts'], data);
    },
  });

  const transactionsMutation = useMutation({
    mutationFn: async (transactions: Transaction[]) => {
      await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
      return transactions;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['transactions'], data);
    },
  });

  const budgetsMutation = useMutation({
    mutationFn: async (budgets: Budget[]) => {
      await AsyncStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets));
      return budgets;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['budgets'], data);
    },
  });

  const savingsGoalsMutation = useMutation({
    mutationFn: async (goals: SavingsGoal[]) => {
      await AsyncStorage.setItem(SAVINGS_GOALS_STORAGE_KEY, JSON.stringify(goals));
      return goals;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['savingsGoals'], data);
    },
  });

  const categoriesMutation = useMutation({
    mutationFn: async (categories: Category[]) => {
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      return categories;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['categories'], data);
    },
  });

  const settingsMutation = useMutation({
    mutationFn: async (settings: WalletSettings) => {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      return settings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
    },
  });

  // Account operations
  const addAccount = (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newAccount: Account = {
      ...account,
      id: generateUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedAccounts = [...(accountsQuery.data || []), newAccount];
    return accountsMutation.mutateAsync(updatedAccounts).then(() => newAccount);
  };

  const updateAccount = (updatedAccount: Account) => {
    const accounts = accountsQuery.data || [];
    const updatedAccounts = accounts.map(account => 
      account.id === updatedAccount.id 
        ? { ...updatedAccount, updatedAt: Date.now() } 
        : account
    );
    accountsMutation.mutate(updatedAccounts);
  };

  const deleteAccount = (accountId: string) => {
    const accounts = accountsQuery.data || [];
    const updatedAccounts = accounts.filter(account => account.id !== accountId);
    accountsMutation.mutate(updatedAccounts);
    
    // Also delete related transactions
    const transactions = transactionsQuery.data || [];
    const updatedTransactions = transactions.filter(
      transaction => transaction.accountId !== accountId
    );
    transactionsMutation.mutate(updatedTransactions);
  };

  // Transaction operations
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newTransaction: Transaction = {
      ...transaction,
      id: generateUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedTransactions = [...(transactionsQuery.data || []), newTransaction];
    await transactionsMutation.mutateAsync(updatedTransactions);
    
    // Update account balance
    const accounts = accountsQuery.data || [];
    const account = accounts.find(a => a.id === transaction.accountId);
    
    if (account) {
      const updatedBalance = transaction.type === 'income' 
        ? account.balance + transaction.amount 
        : account.balance - transaction.amount;
      
      const updatedAccount = {
        ...account,
        balance: updatedBalance,
        updatedAt: now,
      };
      
      const updatedAccounts = accounts.map(a => 
        a.id === account.id ? updatedAccount : a
      );
      
      await accountsMutation.mutateAsync(updatedAccounts);
    }
    
    return newTransaction;
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    const transactions = transactionsQuery.data || [];
    const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);
    
    if (!oldTransaction) return;
    
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === updatedTransaction.id 
        ? { ...updatedTransaction, updatedAt: Date.now() } 
        : transaction
    );
    
    transactionsMutation.mutate(updatedTransactions);
    
    // Update account balance if amount or type changed
    if (
      oldTransaction.amount !== updatedTransaction.amount ||
      oldTransaction.type !== updatedTransaction.type ||
      oldTransaction.accountId !== updatedTransaction.accountId
    ) {
      const accounts = accountsQuery.data || [];
      
      // Revert old transaction
      if (oldTransaction.accountId) {
        const oldAccount = accounts.find(a => a.id === oldTransaction.accountId);
        if (oldAccount) {
          const revertedBalance = oldTransaction.type === 'income' 
            ? oldAccount.balance - oldTransaction.amount 
            : oldAccount.balance + oldTransaction.amount;
          
          const updatedOldAccount = {
            ...oldAccount,
            balance: revertedBalance,
            updatedAt: Date.now(),
          };
          
          const updatedAccounts = accounts.map(a => 
            a.id === oldAccount.id ? updatedOldAccount : a
          );
          
          accountsMutation.mutate(updatedAccounts);
        }
      }
      
      // Apply new transaction
      const newAccount = accounts.find(a => a.id === updatedTransaction.accountId);
      if (newAccount) {
        const updatedBalance = updatedTransaction.type === 'income' 
          ? newAccount.balance + updatedTransaction.amount 
          : newAccount.balance - updatedTransaction.amount;
        
        const updatedNewAccount = {
          ...newAccount,
          balance: updatedBalance,
          updatedAt: Date.now(),
        };
        
        const updatedAccounts = accounts.map(a => 
          a.id === newAccount.id ? updatedNewAccount : a
        );
        
        accountsMutation.mutate(updatedAccounts);
      }
    }
  };

  const deleteTransaction = (transactionId: string) => {
    const transactions = transactionsQuery.data || [];
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) return;
    
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    transactionsMutation.mutate(updatedTransactions);
    
    // Update account balance
    const accounts = accountsQuery.data || [];
    const account = accounts.find(a => a.id === transaction.accountId);
    
    if (account) {
      const updatedBalance = transaction.type === 'income' 
        ? account.balance - transaction.amount 
        : account.balance + transaction.amount;
      
      const updatedAccount = {
        ...account,
        balance: updatedBalance,
        updatedAt: Date.now(),
      };
      
      const updatedAccounts = accounts.map(a => 
        a.id === account.id ? updatedAccount : a
      );
      
      accountsMutation.mutate(updatedAccounts);
    }
  };

  // Budget operations
  const addBudget = (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newBudget: Budget = {
      ...budget,
      id: generateUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedBudgets = [...(budgetsQuery.data || []), newBudget];
    budgetsMutation.mutate(updatedBudgets);
    return newBudget;
  };

  const updateBudget = (updatedBudget: Budget) => {
    const budgets = budgetsQuery.data || [];
    const updatedBudgets = budgets.map(budget => 
      budget.id === updatedBudget.id 
        ? { ...updatedBudget, updatedAt: Date.now() } 
        : budget
    );
    budgetsMutation.mutate(updatedBudgets);
  };

  const deleteBudget = (budgetId: string) => {
    const budgets = budgetsQuery.data || [];
    const updatedBudgets = budgets.filter(budget => budget.id !== budgetId);
    budgetsMutation.mutate(updatedBudgets);
  };

  // Savings Goal operations
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newGoal: SavingsGoal = {
      ...goal,
      id: generateUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedGoals = [...(savingsGoalsQuery.data || []), newGoal];
    savingsGoalsMutation.mutate(updatedGoals);
    return newGoal;
  };

  const updateSavingsGoal = (updatedGoal: SavingsGoal) => {
    const goals = savingsGoalsQuery.data || [];
    const updatedGoals = goals.map(goal => 
      goal.id === updatedGoal.id 
        ? { ...updatedGoal, updatedAt: Date.now() } 
        : goal
    );
    savingsGoalsMutation.mutate(updatedGoals);
  };

  const deleteSavingsGoal = (goalId: string) => {
    const goals = savingsGoalsQuery.data || [];
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    savingsGoalsMutation.mutate(updatedGoals);
  };

  // Category operations
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: generateUUID(),
      isDefault: false,
    };
    
    const updatedCategories = [...(categoriesQuery.data || []), newCategory];
    categoriesMutation.mutate(updatedCategories);
    return newCategory;
  };

  const updateCategory = (updatedCategory: Category) => {
    const categories = categoriesQuery.data || [];
    const updatedCategories = categories.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    );
    categoriesMutation.mutate(updatedCategories);
  };

  const deleteCategory = (categoryId: string) => {
    const categories = categoriesQuery.data || [];
    const category = categories.find(c => c.id === categoryId);
    
    // Don't allow deletion of default categories
    if (category?.isDefault) {
      return false;
    }
    
    const updatedCategories = categories.filter(category => category.id !== categoryId);
    categoriesMutation.mutate(updatedCategories);
    return true;
  };

  // Settings operations
  const updateSettings = (settings: Partial<WalletSettings>) => {
    const currentSettings = settingsQuery.data || defaultSettings;
    const updatedSettings = { ...currentSettings, ...settings };
    settingsMutation.mutate(updatedSettings);
  };

  // Authentication
  const verifyPin = (pin: string) => {
    const settings = settingsQuery.data;
    if (settings?.pinEnabled && settings.pinCode === pin) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Calculate statistics
  const getMonthlyIncome = () => {
    const transactions = transactionsQuery.data || [];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime();
    
    return transactions
      .filter(t => 
        t.type === 'income' && 
        t.date >= startOfMonth && 
        t.date <= endOfMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyExpenses = () => {
    const transactions = transactionsQuery.data || [];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime();
    
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.date >= startOfMonth && 
        t.date <= endOfMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalBalance = () => {
    const accounts = accountsQuery.data || [];
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const getCategoryExpenses = (categoryId: string, period: 'week' | 'month' | 'year' = 'month') => {
    const transactions = transactionsQuery.data || [];
    const now = new Date();
    let startDate: number;
    
    switch (period) {
      case 'week':
        const day = now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day).getTime();
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1).getTime();
        break;
    }
    
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.categoryId === categoryId && 
        t.date >= startDate
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetProgress = (budgetId: string) => {
    const budgets = budgetsQuery.data || [];
    const transactions = transactionsQuery.data || [];
    
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return { spent: 0, total: 0, percentage: 0 };
    
    const { categoryId, amount, startDate, endDate } = budget;
    const currentTime = Date.now();
    const endDateValue = endDate || currentTime;
    
    const spent = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.categoryId === categoryId && 
        t.date >= startDate && 
        t.date <= endDateValue
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentage = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;
    
    return {
      spent,
      total: amount,
      percentage,
    };
  };

  // Initialize with default categories if none exist
  useEffect(() => {
    if (categoriesQuery.data && categoriesQuery.data.length === 0) {
      categoriesMutation.mutate(defaultCategories);
    }
  }, [categoriesQuery.data]);

  // Check if PIN is required
  useEffect(() => {
    if (settingsQuery.data && !settingsQuery.data.pinEnabled) {
      setIsAuthenticated(true);
    }
  }, [settingsQuery.data]);

  return {
    // Data
    accounts: accountsQuery.data || [],
    transactions: transactionsQuery.data || [],
    budgets: budgetsQuery.data || [],
    savingsGoals: savingsGoalsQuery.data || [],
    categories: categoriesQuery.data || [],
    settings: settingsQuery.data || defaultSettings,
    
    // Loading states
    isLoading: 
      accountsQuery.isLoading || 
      transactionsQuery.isLoading || 
      budgetsQuery.isLoading || 
      savingsGoalsQuery.isLoading || 
      categoriesQuery.isLoading || 
      settingsQuery.isLoading,
    
    // Account operations
    addAccount,
    updateAccount,
    deleteAccount,
    
    // Transaction operations
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Budget operations
    addBudget,
    updateBudget,
    deleteBudget,
    
    // Savings Goal operations
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    
    // Category operations
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Settings operations
    updateSettings,
    
    // Authentication
    isAuthenticated,
    verifyPin,
    logout,
    
    // Statistics
    getMonthlyIncome,
    getMonthlyExpenses,
    getTotalBalance,
    getCategoryExpenses,
    getBudgetProgress,
  };
});