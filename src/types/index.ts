export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export const incomeCategories: Category[] = [
  { id: '1', name: 'Gaji', icon: '💰', type: 'income' },
  { id: '2', name: 'Freelance', icon: '💻', type: 'income' },
  { id: '3', name: 'Investasi', icon: '📈', type: 'income' },
  { id: '4', name: 'Bonus', icon: '🎁', type: 'income' },
  { id: '5', name: 'Lainnya', icon: '📦', type: 'income' },
];

export const expenseCategories: Category[] = [
  { id: '1', name: 'Makanan', icon: '🍔', type: 'expense' },
  { id: '2', name: 'Transportasi', icon: '🚗', type: 'expense' },
  { id: '3', name: 'Belanja', icon: '🛒', type: 'expense' },
  { id: '4', name: 'Hiburan', icon: '🎮', type: 'expense' },
  { id: '5', name: 'Tagihan', icon: '📄', type: 'expense' },
  { id: '6', name: 'Kesehatan', icon: '💊', type: 'expense' },
  { id: '7', name: 'Pendidikan', icon: '📚', type: 'expense' },
  { id: '8', name: 'Lainnya', icon: '📦', type: 'expense' },
];
