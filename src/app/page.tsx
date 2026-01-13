'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import QuickStats from '@/components/QuickStats';
import FloatingAddButton from '@/components/FloatingAddButton';
import { Transaction, TransactionType } from '@/types';

// Sample data untuk demo
const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 15000000,
    category: 'Gaji',
    description: 'Gaji bulan Januari',
    date: '2026-01-10',
  },
  {
    id: '2',
    type: 'expense',
    amount: 500000,
    category: 'Makanan',
    description: 'Belanja bulanan',
    date: '2026-01-12',
  },
  {
    id: '3',
    type: 'expense',
    amount: 1500000,
    category: 'Tagihan',
    description: 'Listrik dan internet',
    date: '2026-01-11',
  },
  {
    id: '4',
    type: 'income',
    amount: 2500000,
    category: 'Freelance',
    description: 'Project website',
    date: '2026-01-08',
  },
  {
    id: '5',
    type: 'expense',
    amount: 200000,
    category: 'Transportasi',
    description: 'Bensin',
    date: '2026-01-13',
  },
];

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate totals
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAddTransaction = (newTransaction: { type: TransactionType; amount: number; category: string; description: string; date: string }) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      ...newTransaction,
    };
    setTransactions([transaction, ...transactions]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header activePage="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang! 👋</h1>
          <p className="text-[var(--foreground)]/60">Kelola keuangan Anda dengan mudah dan cerdas</p>
        </div>

        {/* Balance Card */}
        <div className="mb-8">
          <BalanceCard balance={balance} income={totalIncome} expense={totalExpense} />
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStats transactions={transactions} />
        </div>

        {/* Transaction List */}
        <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
      </main>

      {/* Floating Add Button */}
      <FloatingAddButton onClick={() => setIsModalOpen(true)} />

      {/* Add Transaction Modal */}
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddTransaction} />
    </div>
  );
}
