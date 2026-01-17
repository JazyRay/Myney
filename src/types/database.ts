export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          type: 'income' | 'expense';
          user_id: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          type: 'income' | 'expense';
          user_id?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          type?: 'income' | 'expense';
          user_id?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'income' | 'expense';
          amount: number;
          category: string;
          description: string | null;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'income' | 'expense';
          amount: number;
          category: string;
          description?: string | null;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'income' | 'expense';
          amount?: number;
          category?: string;
          description?: string | null;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          currency: string;
          language: string;
          theme: string;
          email_notifications: boolean;
          push_notifications: boolean;
          weekly_report: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          currency?: string;
          language?: string;
          theme?: string;
          email_notifications?: boolean;
          push_notifications?: boolean;
          weekly_report?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          currency?: string;
          language?: string;
          theme?: string;
          email_notifications?: boolean;
          push_notifications?: boolean;
          weekly_report?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      monthly_summary: {
        Row: {
          user_id: string;
          month: string;
          type: 'income' | 'expense';
          total_amount: number;
          transaction_count: number;
        };
      };
      category_summary: {
        Row: {
          user_id: string;
          category: string;
          type: 'income' | 'expense';
          total_amount: number;
          transaction_count: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

// Alias untuk kemudahan penggunaan
export type Transaction = Tables<'transactions'>;
export type Category = Tables<'categories'>;
export type NewTransaction = InsertTables<'transactions'>;
export type UpdateTransaction = UpdateTables<'transactions'>;
export type MonthlySummary = Views<'monthly_summary'>;
export type CategorySummary = Views<'category_summary'>;
