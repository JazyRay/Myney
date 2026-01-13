'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { Transaction, incomeCategories, expenseCategories } from '@/types';

// Sample data untuk demo
const initialTransactions: Transaction[] = [
  { id: '1', type: 'income', amount: 15000000, category: 'Gaji', description: 'Gaji bulan Januari', date: '2026-01-10' },
  { id: '2', type: 'expense', amount: 500000, category: 'Makanan', description: 'Belanja bulanan', date: '2026-01-12' },
  { id: '3', type: 'expense', amount: 1500000, category: 'Tagihan', description: 'Listrik dan internet', date: '2026-01-11' },
  { id: '4', type: 'income', amount: 2500000, category: 'Freelance', description: 'Project website', date: '2026-01-08' },
  { id: '5', type: 'expense', amount: 200000, category: 'Transportasi', description: 'Bensin', date: '2026-01-13' },
  { id: '6', type: 'expense', amount: 150000, category: 'Hiburan', description: 'Nonton bioskop', date: '2026-01-09' },
  { id: '7', type: 'expense', amount: 300000, category: 'Kesehatan', description: 'Obat-obatan', date: '2026-01-07' },
  { id: '8', type: 'income', amount: 12000000, category: 'Gaji', description: 'Gaji bulan Desember', date: '2025-12-10' },
  { id: '9', type: 'expense', amount: 2000000, category: 'Belanja', description: 'Beli baju', date: '2025-12-15' },
  { id: '10', type: 'expense', amount: 800000, category: 'Makanan', description: 'Makan di restoran', date: '2025-12-20' },
  { id: '11', type: 'income', amount: 1000000, category: 'Bonus', description: 'Bonus akhir tahun', date: '2025-12-25' },
  { id: '12', type: 'expense', amount: 500000, category: 'Hiburan', description: 'Liburan', date: '2025-12-28' },
];

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function LaporanPage() {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter transactions by selected month and year
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate summary
  const summary = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  // Calculate expense by category
  const expenseByCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([name, amount]) => ({ name, amount }));
  }, [filteredTransactions]);

  // Calculate income by category
  const incomeByCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.type === 'income')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([name, amount]) => ({ name, amount }));
  }, [filteredTransactions]);

  // Get category icon
  const getCategoryIcon = (categoryName: string, type: 'income' | 'expense') => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    return categories.find((c) => c.name === categoryName)?.icon || '📦';
  };

  // Calculate percentage for progress bar
  const getPercentage = (amount: number, total: number) => {
    if (total === 0) return 0;
    return (amount / total) * 100;
  };

  const totalExpense = expenseByCategory.reduce((sum, cat) => sum + cat.amount, 0);
  const totalIncome = incomeByCategory.reduce((sum, cat) => sum + cat.amount, 0);

  // Daily spending chart data
  const dailyData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daily: { day: number; income: number; expense: number }[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayTransactions = filteredTransactions.filter((t) => {
        const date = new Date(t.date);
        return date.getDate() === i;
      });
      daily.push({
        day: i,
        income: dayTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        expense: dayTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      });
    }
    return daily;
  }, [filteredTransactions, selectedMonth, selectedYear]);

  const maxDailyAmount = Math.max(...dailyData.map((d) => Math.max(d.income, d.expense)), 1);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header activePage="laporan" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Laporan Keuangan 📊</h1>
          <p className="text-[var(--foreground)]/60">Analisis keuangan Anda berdasarkan periode waktu</p>
        </div>

        {/* Period Selector */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Bulan</label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="input-field">
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Tahun</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="input-field">
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                </svg>
              </div>
              <div>
                <p className="text-white/80 text-sm">Total Pendapatan</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.income)}</p>
              </div>
            </div>
            <div className="text-sm text-white/80">{filteredTransactions.filter((t) => t.type === 'income').length} transaksi</div>
          </div>

          <div className="card bg-gradient-to-br from-red-500 to-rose-600 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                </svg>
              </div>
              <div>
                <p className="text-white/80 text-sm">Total Pengeluaran</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.expense)}</p>
              </div>
            </div>
            <div className="text-sm text-white/80">{filteredTransactions.filter((t) => t.type === 'expense').length} transaksi</div>
          </div>

          <div className={`card text-white ${summary.balance >= 0 ? 'bg-gradient-to-br from-[var(--primary)] to-purple-600' : 'bg-gradient-to-br from-orange-500 to-amber-600'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white/80 text-sm">Saldo</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.balance)}</p>
              </div>
            </div>
            <div className="text-sm text-white/80">{summary.balance >= 0 ? '💪 Keuangan Anda sehat!' : '⚠️ Pengeluaran melebihi pendapatan'}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expense by Category */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Pengeluaran per Kategori</h3>
            {expenseByCategory.length === 0 ? (
              <div className="text-center py-8 text-[var(--foreground)]/60">Tidak ada pengeluaran pada periode ini</div>
            ) : (
              <div className="space-y-4">
                {expenseByCategory.map((cat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(cat.name, 'expense')}</span>
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <span className="font-bold text-red-500">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="w-full bg-[var(--background)] rounded-full h-3">
                      <div className="bg-gradient-to-r from-red-500 to-rose-500 h-3 rounded-full transition-all duration-500" style={{ width: `${getPercentage(cat.amount, totalExpense)}%` }}></div>
                    </div>
                    <p className="text-xs text-[var(--foreground)]/60 mt-1">{getPercentage(cat.amount, totalExpense).toFixed(1)}% dari total pengeluaran</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Income by Category */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Pendapatan per Kategori</h3>
            {incomeByCategory.length === 0 ? (
              <div className="text-center py-8 text-[var(--foreground)]/60">Tidak ada pendapatan pada periode ini</div>
            ) : (
              <div className="space-y-4">
                {incomeByCategory.map((cat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(cat.name, 'income')}</span>
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <span className="font-bold text-green-500">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="w-full bg-[var(--background)] rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${getPercentage(cat.amount, totalIncome)}%` }}></div>
                    </div>
                    <p className="text-xs text-[var(--foreground)]/60 mt-1">{getPercentage(cat.amount, totalIncome).toFixed(1)}% dari total pendapatan</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Daily Chart */}
        <div className="card">
          <h3 className="text-xl font-bold mb-6">
            Grafik Harian - {months[selectedMonth]} {selectedYear}
          </h3>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] h-64 flex items-end gap-1 px-4">
              {dailyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-1 items-center" style={{ height: '180px' }}>
                    {/* Income bar */}
                    {day.income > 0 && (
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-sm"
                        style={{ height: `${(day.income / maxDailyAmount) * 100}%`, minHeight: '4px' }}
                        title={`Pendapatan: ${formatCurrency(day.income)}`}
                      ></div>
                    )}
                    {/* Expense bar */}
                    {day.expense > 0 && (
                      <div
                        className="w-full bg-gradient-to-t from-red-500 to-rose-400 rounded-t-sm"
                        style={{ height: `${(day.expense / maxDailyAmount) * 100}%`, minHeight: '4px' }}
                        title={`Pengeluaran: ${formatCurrency(day.expense)}`}
                      ></div>
                    )}
                  </div>
                  <span className="text-xs text-[var(--foreground)]/60">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-400 rounded"></div>
              <span className="text-sm text-[var(--foreground)]/60">Pendapatan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-rose-400 rounded"></div>
              <span className="text-sm text-[var(--foreground)]/60">Pengeluaran</span>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="card mt-6 bg-gradient-to-r from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)]/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">💡</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Tips Keuangan</h3>
              {summary.balance >= 0 ? (
                <p className="text-[var(--foreground)]/80">
                  Bagus! Anda berhasil menyimpan {formatCurrency(summary.balance)} bulan ini. Pertimbangkan untuk menginvestasikan sebagian dari tabungan Anda untuk pertumbuhan keuangan jangka panjang.
                </p>
              ) : (
                <p className="text-[var(--foreground)]/80">
                  Pengeluaran Anda melebihi pendapatan sebesar {formatCurrency(Math.abs(summary.balance))}. Coba kurangi pengeluaran pada kategori {expenseByCategory[0]?.name || 'terbesar'}
                  untuk menyeimbangkan keuangan Anda.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
