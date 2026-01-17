'use client';

import { useState } from 'react';
import { Transaction, incomeCategories, expenseCategories } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onConfirm: () => void;
  onCancel: () => void;
  formatCurrency: (amount: number) => string;
}

function DeleteConfirmModal({ isOpen, transaction, onConfirm, onCancel, formatCurrency }: DeleteConfirmModalProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel}></div>

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[var(--card-bg)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="pt-6 pb-2 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4 text-center">
          <h3 className="text-lg font-bold mb-2">Hapus Transaksi?</h3>
          <p className="text-[var(--foreground)]/60 text-sm mb-4">Apakah Anda yakin ingin menghapus transaksi ini?</p>

          {/* Transaction Info */}
          <div className="bg-[var(--background)] rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-semibold">{transaction.category}</p>
                <p className="text-xs text-[var(--foreground)]/60">{transaction.description || '-'}</p>
              </div>
              <p className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>

          <p className="text-xs text-[var(--foreground)]/50">Tindakan ini tidak dapat dibatalkan.</p>
        </div>

        {/* Buttons */}
        <div className="flex border-t border-[var(--border)]">
          <button onClick={onCancel} className="flex-1 py-3 font-semibold text-[var(--foreground)]/70 hover:bg-[var(--background)] transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l border-[var(--border)]">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getCategoryIcon = (transaction: Transaction) => {
    const categories = transaction.type === 'income' ? incomeCategories : expenseCategories;
    const category = categories.find((c) => c.name === transaction.category);
    return category?.icon || '📦';
  };

  if (transactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-[var(--background)] rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[var(--foreground)]/30">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Belum Ada Transaksi</h3>
        <p className="text-[var(--foreground)]/60">Mulai tambahkan transaksi pertama Anda!</p>
      </div>
    );
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTransaction) {
      onDelete(selectedTransaction.id);
      setDeleteModalOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <>
      <div className="card">
        <h3 className="text-xl font-bold mb-6">Riwayat Transaksi</h3>
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <p className="text-sm font-medium text-[var(--foreground)]/60 mb-3">{formatDate(date)}</p>
              <div className="space-y-3">
                {groupedTransactions[date].map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-xl hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {getCategoryIcon(transaction)}
                      </div>
                      <div>
                        <p className="font-semibold">{transaction.category}</p>
                        <p className="text-sm text-[var(--foreground)]/60">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <button
                        onClick={() => handleDeleteClick(transaction)}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal isOpen={deleteModalOpen} transaction={selectedTransaction} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} formatCurrency={formatCurrency} />
    </>
  );
}
