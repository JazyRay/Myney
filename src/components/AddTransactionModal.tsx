'use client';

import { useState } from 'react';
import { TransactionType, incomeCategories, expenseCategories } from '@/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: { type: TransactionType; amount: number; category: string; description: string; date: string }) => void;
}

export default function AddTransactionModal({ isOpen, onClose, onAdd }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAdd({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--card-bg)] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Tambah Transaksi</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Transaction Type Toggle */}
          <div className="flex bg-[var(--background)] rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('');
              }}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${type === 'expense' ? 'bg-red-500 text-white shadow-lg' : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('');
              }}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${type === 'income' ? 'bg-green-500 text-white shadow-lg' : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'}`}
            >
              Pendapatan
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">Jumlah</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/60">Rp</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="input-field pl-12 text-lg font-semibold" required />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 ${
                    category === cat.name ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Tanggal</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" required />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi (Opsional)</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tambahkan catatan..." className="input-field" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 hover:shadow-lg ${type === 'income' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}
          >
            Tambah {type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
          </button>
        </form>
      </div>
    </div>
  );
}
