'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import QuickStats from '@/components/QuickStats';
import FloatingAddButton from '@/components/FloatingAddButton';
import { TransactionType } from '@/types';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const { transactions, isLoading, error, totalIncome, totalExpense, balance, addTransaction, deleteTransaction } = useTransactions();

  const handleAddTransaction = async (newTransaction: { type: TransactionType; amount: number; category: string; description: string; date: string }) => {
    try {
      await addTransaction(newTransaction);
    } catch (err) {
      console.error('Failed to add transaction:', err);
      alert('Gagal menambah transaksi. Silakan coba lagi.');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert('Gagal menghapus transaksi. Silakan coba lagi.');
    }
  };

  // Convert Transaction from database type to component type
  const formattedTransactions = transactions.map((t) => ({
    id: t.id,
    type: t.type,
    amount: Number(t.amount),
    category: t.category,
    description: t.description || '',
    date: t.date,
  }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header activePage="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{user ? `Selamat Datang! 👋` : 'Selamat Datang di Myney! 👋'}</h1>
          <p className="text-[var(--foreground)]/60">{user ? 'Kelola keuangan Anda dengan mudah dan cerdas' : 'Silakan login untuk mulai mengelola keuangan Anda'}</p>
        </div>

        {/* Loading State */}
        {(isLoading || authLoading) && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
          </div>
        )}

        {/* Error State */}
        {error && <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">{error}</div>}

        {/* Not Logged In State */}
        {!authLoading && !user && (
          <div className="card text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-[var(--background)] rounded-full flex items-center justify-center">
              <span className="text-4xl">🔐</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Login Diperlukan</h3>
            <p className="text-[var(--foreground)]/60 mb-4">Silakan login untuk melihat dan mengelola transaksi Anda</p>
            <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Login Sekarang
            </a>
          </div>
        )}

        {/* Main Content - Only show when logged in */}
        {!isLoading && !authLoading && user && (
          <>
            {/* Balance Card */}
            <div className="mb-8">
              <BalanceCard balance={balance} income={totalIncome} expense={totalExpense} />
            </div>

            {/* Quick Stats */}
            <div className="mb-8">
              <QuickStats transactions={formattedTransactions} />
            </div>

            {/* Transaction List */}
            <TransactionList transactions={formattedTransactions} onDelete={handleDeleteTransaction} />
          </>
        )}
      </main>

      {/* Floating Add Button - Only show when logged in */}
      {user && <FloatingAddButton onClick={() => setIsModalOpen(true)} />}

      {/* Add Transaction Modal */}
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddTransaction} />
    </div>
  );
}
