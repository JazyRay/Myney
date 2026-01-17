'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import AddTransactionModal from '@/components/AddTransactionModal';
import FloatingAddButton from '@/components/FloatingAddButton';
import BalanceCard from '@/components/BalanceCard';
import { TransactionType, incomeCategories, expenseCategories } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';

export default function TransaksiPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { transactions, isLoading, totalIncome, totalExpense, balance, addTransaction, deleteTransaction } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Quick input states
  const [quickAmount, setQuickAmount] = useState<string>('');
  const [quickType, setQuickType] = useState<TransactionType>('expense');
  const [quickCategory, setQuickCategory] = useState<string>('');
  const [quickDescription, setQuickDescription] = useState<string>('');

  // Delete confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<{
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
  } | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getCategoryIcon = (type: 'income' | 'expense', category: string) => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const cat = categories.find((c) => c.name === category);
    return cat?.icon || '📦';
  };

  // Delete Confirmation Modal Component
  const DeleteConfirmModal = ({
    isOpen,
    transaction,
    onConfirm,
    onCancel,
  }: {
    isOpen: boolean;
    transaction: { type: 'income' | 'expense'; amount: number; category: string; description: string } | null;
    onConfirm: () => void;
    onCancel: () => void;
  }) => {
    if (!isOpen || !transaction) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-500">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center mb-2">Hapus Transaksi?</h3>
          <p className="text-center text-[var(--foreground)]/60 mb-6">Tindakan ini tidak dapat dibatalkan</p>

          {/* Transaction Info */}
          <div className="bg-[var(--background)] rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--foreground)]/60">Kategori</span>
              <span className="font-medium">{transaction.category}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--foreground)]/60">Deskripsi</span>
              <span className="font-medium">{transaction.description || '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground)]/60">Jumlah</span>
              <span className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--background)] transition-colors font-medium">
              Batal
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium">
              Hapus
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Convert transactions for display
  const formattedTransactions = transactions.map((t) => ({
    id: t.id,
    type: t.type,
    amount: Number(t.amount),
    category: t.category,
    description: t.description || '',
    date: t.date,
  }));

  // Filter transactions
  const filteredTransactions = formattedTransactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDateFrom = !dateFrom || new Date(t.date) >= new Date(dateFrom);
    const matchesDateTo = !dateTo || new Date(t.date) <= new Date(dateTo);

    return matchesType && matchesCategory && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  // Sort by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get available categories based on filter type
  const availableCategories = filterType === 'income' ? incomeCategories : filterType === 'expense' ? expenseCategories : [...incomeCategories, ...expenseCategories];

  const handleAddTransaction = async (newTransaction: { type: TransactionType; amount: number; category: string; description: string; date: string }) => {
    try {
      await addTransaction(newTransaction);
    } catch (err) {
      console.error('Failed to add transaction:', err);
      alert('Gagal menambah transaksi. Silakan coba lagi.');
    }
  };

  const handleDeleteClick = (transaction: (typeof sortedTransactions)[0]) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTransaction) {
      try {
        await deleteTransaction(selectedTransaction.id);
        setDeleteModalOpen(false);
        setSelectedTransaction(null);
      } catch (err) {
        console.error('Failed to delete transaction:', err);
        alert('Gagal menghapus transaksi. Silakan coba lagi.');
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedTransaction(null);
  };

  // Get categories for quick input based on selected type
  const quickInputCategories = quickType === 'income' ? incomeCategories : expenseCategories;

  // Quick add transaction handler
  const handleQuickAdd = async () => {
    const amount = parseFloat(quickAmount.replace(/[^0-9]/g, ''));
    if (!amount || amount <= 0) return;

    const today = new Date().toISOString().split('T')[0];
    const selectedCategory = quickCategory || 'Lainnya';

    try {
      await addTransaction({
        type: quickType,
        amount: amount,
        category: selectedCategory,
        description: quickDescription || (quickType === 'income' ? 'Pendapatan cepat' : 'Pengeluaran cepat'),
        date: today,
      });
      setQuickAmount('');
      setQuickCategory('');
      setQuickDescription('');
    } catch (err) {
      console.error('Failed to quick add transaction:', err);
      alert('Gagal menambah transaksi. Silakan coba lagi.');
    }
  };

  // Handle quick type change - reset category when type changes
  const handleQuickTypeChange = (type: TransactionType) => {
    setQuickType(type);
    setQuickCategory('');
  };

  // Format input number with thousand separator
  const formatInputNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return number ? new Intl.NumberFormat('id-ID').format(parseInt(number)) : '';
  };

  const totalFiltered = sortedTransactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header activePage="transaksi" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      </div>
    );
  }

  // Not logged in - will redirect via useEffect
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header activePage="transaksi" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transaksi 💳</h1>
          <p className="text-[var(--foreground)]/60">Kelola semua transaksi pendapatan dan pengeluaran Anda</p>
        </div>

        {/* Balance Card */}
        <div className="mb-6">
          <BalanceCard balance={balance} income={totalIncome} expense={totalExpense} />
        </div>

        {/* Quick Input Section */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>⚡</span> Input Cepat
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Amount Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Nominal</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/60 font-medium">Rp</span>
                <input
                  type="text"
                  placeholder="Masukkan nominal..."
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(formatInputNumber(e.target.value))}
                  className="input-field pl-10 text-lg font-semibold"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleQuickAdd();
                  }}
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select value={quickCategory} onChange={(e) => setQuickCategory(e.target.value)} className="input-field">
                <option value="">Pilih Kategori</option>
                {quickInputCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Deskripsi (opsional)</label>
              <input
                type="text"
                placeholder="Contoh: Makan siang, Gaji, dll..."
                value={quickDescription}
                onChange={(e) => setQuickDescription(e.target.value)}
                className="input-field"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleQuickAdd();
                }}
              />
            </div>

            {/* Type Selection */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-2">Tipe Transaksi</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickTypeChange('expense')}
                  className={`flex-1 md:flex-none px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    quickType === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                  </svg>
                  <span className="hidden sm:inline">Pengeluaran</span>
                </button>
                <button
                  onClick={() => handleQuickTypeChange('income')}
                  className={`flex-1 md:flex-none px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    quickType === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                  <span className="hidden sm:inline">Pendapatan</span>
                </button>
              </div>
            </div>

            {/* Add Button */}
            <div className="flex items-end">
              <button
                onClick={handleQuickAdd}
                disabled={!quickAmount}
                className={`w-full md:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  quickAmount ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Tambah
              </button>
            </div>
          </div>

          {/* Preview */}
          {quickAmount && (
            <div
              className={`mt-4 p-4 rounded-xl border-2 border-dashed ${quickType === 'income' ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'}`}
            >
              <p className="text-sm text-[var(--foreground)]/60 mb-1">Preview transaksi:</p>
              <p className={`text-lg font-bold ${quickType === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {quickType === 'income' ? '+' : '-'} Rp {quickAmount}
                <span className="text-sm font-normal text-[var(--foreground)]/60 ml-2">({quickType === 'income' ? 'Pendapatan' : 'Pengeluaran'})</span>
              </p>
              {quickCategory && (
                <p className="text-sm text-[var(--foreground)]/60 mt-1">
                  {quickInputCategories.find((c) => c.name === quickCategory)?.icon || '📦'} {quickCategory}
                </p>
              )}
              {quickDescription && <p className="text-sm text-[var(--foreground)]/60 mt-1">📝 {quickDescription}</p>}
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Cari Transaksi</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input type="text" placeholder="Cari berdasarkan deskripsi atau kategori..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
              </div>
            </div>

            {/* Type Filter */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium mb-2">Tipe</label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as 'all' | TransactionType);
                  setFilterCategory('all');
                }}
                className="input-field"
              >
                <option value="all">Semua</option>
                <option value="income">Pendapatan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-field">
                <option value="all">Semua Kategori</option>
                {availableCategories.map((cat) => (
                  <option key={`${cat.type}-${cat.id}`} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Dari Tanggal</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Sampai Tanggal</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field" />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterCategory('all');
                  setDateFrom('');
                  setDateTo('');
                }}
                className="px-6 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--background)] transition-colors font-medium"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="card flex-1 min-w-[200px]">
            <p className="text-sm text-[var(--foreground)]/60 mb-1">Total Transaksi</p>
            <p className="text-2xl font-bold">{sortedTransactions.length}</p>
          </div>
          <div className="card flex-1 min-w-[200px]">
            <p className="text-sm text-[var(--foreground)]/60 mb-1">Total Pendapatan</p>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(sortedTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))}</p>
          </div>
          <div className="card flex-1 min-w-[200px]">
            <p className="text-sm text-[var(--foreground)]/60 mb-1">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(sortedTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))}</p>
          </div>
          <div className="card flex-1 min-w-[200px]">
            <p className="text-sm text-[var(--foreground)]/60 mb-1">Selisih</p>
            <p className={`text-2xl font-bold ${totalFiltered >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(totalFiltered)}</p>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="card overflow-hidden">
          <h3 className="text-xl font-bold mb-4">Daftar Transaksi</h3>

          {sortedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-[var(--background)] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[var(--foreground)]/30">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Tidak Ada Transaksi</h3>
              <p className="text-[var(--foreground)]/60">Tidak ada transaksi yang sesuai dengan filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-4 px-4 font-semibold text-[var(--foreground)]/60">Tanggal</th>
                    <th className="text-left py-4 px-4 font-semibold text-[var(--foreground)]/60">Kategori</th>
                    <th className="text-left py-4 px-4 font-semibold text-[var(--foreground)]/60">Deskripsi</th>
                    <th className="text-left py-4 px-4 font-semibold text-[var(--foreground)]/60">Tipe</th>
                    <th className="text-right py-4 px-4 font-semibold text-[var(--foreground)]/60">Jumlah</th>
                    <th className="text-center py-4 px-4 font-semibold text-[var(--foreground)]/60">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-[var(--border)] hover:bg-[var(--background)] transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-sm">{formatDate(transaction.date)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getCategoryIcon(transaction)}</span>
                          <span className="font-medium">{transaction.category}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[var(--foreground)]/80">{transaction.description || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.type === 'income' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {transaction.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleDeleteClick(transaction)}
                          className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 mx-auto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Floating Add Button */}
      <FloatingAddButton onClick={() => setIsModalOpen(true)} />

      {/* Add Transaction Modal */}
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddTransaction} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal isOpen={deleteModalOpen} transaction={selectedTransaction} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
    </div>
  );
}
