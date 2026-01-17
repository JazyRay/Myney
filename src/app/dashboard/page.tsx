'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import QuickStats from '@/components/QuickStats';
import FloatingAddButton from '@/components/FloatingAddButton';
import { TransactionType } from '@/types';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { transactions, isLoading, error, totalIncome, totalExpense, balance, addTransaction, deleteTransaction } = useTransactions();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

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

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--foreground)]/60">Memuat...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

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
          <h1 className="text-3xl font-bold mb-2">Selamat Datang! 👋</h1>
          <p className="text-[var(--foreground)]/60">Kelola keuangan Anda dengan mudah dan cerdas</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
          </div>
        )}

        {/* Error State */}
        {error && <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">{error}</div>}

        {/* Main Content */}
        {!isLoading && (
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

      {/* Floating Add Button */}
      <FloatingAddButton onClick={() => setIsModalOpen(true)} />

      {/* Add Transaction Modal */}
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddTransaction} />
    </div>
  );
}
