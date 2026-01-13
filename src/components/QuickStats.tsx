'use client';

import { Transaction } from '@/types';

interface QuickStatsProps {
  transactions: Transaction[];
}

export default function QuickStats({ transactions }: QuickStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get current month transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const thisMonthIncome = thisMonthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpense = thisMonthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Calculate expense by category
  const expenseByCategory = thisMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(expenseByCategory).sort(([, a], [, b]) => b - a)[0];

  const stats = [
    {
      label: 'Transaksi Bulan Ini',
      value: thisMonthTransactions.length.toString(),
      icon: '📊',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Pendapatan Bulan Ini',
      value: formatCurrency(thisMonthIncome),
      icon: '📈',
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Pengeluaran Bulan Ini',
      value: formatCurrency(thisMonthExpense),
      icon: '📉',
      color: 'from-red-500 to-rose-500',
    },
    {
      label: 'Kategori Terbesar',
      value: topCategory ? topCategory[0] : '-',
      icon: '🏷️',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl mb-4`}>{stat.icon}</div>
          <p className="text-sm text-[var(--foreground)]/60 mb-1">{stat.label}</p>
          <p className="text-lg font-bold truncate">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
