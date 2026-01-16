'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TransactionType } from '@/types';

// Transaction type from database
interface DBTransaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

interface UseTransactionsReturn {
  transactions: DBTransaction[];
  isLoading: boolean;
  error: string | null;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  addTransaction: (transaction: { type: TransactionType; amount: number; category: string; description: string; date: string }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<DBTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // User tidak login, tampilkan data kosong
        setTransactions([]);
        return;
      }

      const { data, error: fetchError } = await supabase.from('transactions').select('*').order('date', { ascending: false }).order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTransactions((data as DBTransaction[]) || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Gagal mengambil data transaksi');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Add transaction
  const addTransaction = async (transaction: { type: TransactionType; amount: number; category: string; description: string; date: string }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Silakan login terlebih dahulu');
      }

      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description || null,
          date: transaction.date,
        } as never)
        .select()
        .single();

      if (insertError) throw insertError;

      // Add to local state (optimistic update)
      setTransactions((prev) => [data as DBTransaction, ...prev]);
    } catch (err) {
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('transactions').delete().eq('id', id);

      if (deleteError) throw deleteError;

      // Remove from local state (optimistic update)
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      throw err;
    }
  };

  // Calculate totals
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        () => {
          // Refresh data when changes occur
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    totalIncome,
    totalExpense,
    balance,
    addTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
  };
}
