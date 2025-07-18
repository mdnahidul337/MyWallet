export type Currency = 
  | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CNY' | 'INR' 
  | 'BDT' | 'PKR' | 'LKR' | 'NPR' | 'MYR' | 'SGD' | 'THB' | 'VND' 
  | 'IDR' | 'PHP' | 'KRW' | 'TWD' | 'HKD' | 'AED' | 'SAR' | 'QAR' 
  | 'KWD' | 'BHD' | 'OMR' | 'JOD' | 'EGP' | 'ZAR' | 'NGN' | 'KES' 
  | 'GHS' | 'TZS' | 'UGX' | 'RWF' | 'ETB' | 'MAD' | 'TND' | 'DZD' 
  | 'LYD' | 'BRL' | 'ARS' | 'CLP' | 'COP' | 'PEN' | 'MXN' | 'RUB' 
  | 'TRY' | 'PLN' | 'CZK' | 'HUF' | 'RON' | 'BGN' | 'HRK' | 'RSD' 
  | 'UAH' | 'BYN' | 'KZT' | 'UZS' | 'KGS' | 'TJS' | 'TMT' | 'AFN' 
  | 'IRR' | 'IQD' | 'SYP' | 'LBP' | 'ILS';

export type AccountType = 'cash' | 'credit' | 'bank' | 'digital';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
  color: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  date: number;
  location?: string;
  receiptImage?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: number;
  updatedAt: number;
}

export interface Budget {
  id: string;
  title: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: number;
  endDate?: number;
  createdAt: number;
  updatedAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: Currency;
  deadline?: number;
  createdAt: number;
  updatedAt: number;
}