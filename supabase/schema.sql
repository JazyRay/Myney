-- =============================================
-- MYNEY DATABASE SCHEMA
-- Jalankan SQL ini di Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABEL: categories (Kategori Transaksi)
-- =============================================
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABEL: transactions (Transaksi Keuangan)
-- =============================================
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEX untuk performa query
-- =============================================
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);

-- =============================================
-- TRIGGER: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy untuk transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Policy untuk categories
CREATE POLICY "Users can view own categories and defaults"
  ON categories FOR SELECT
  USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id AND is_default = false);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id AND is_default = false);

-- =============================================
-- DEFAULT CATEGORIES (Kategori Bawaan)
-- =============================================
INSERT INTO categories (name, icon, type, is_default) VALUES
  -- Income Categories
  ('Gaji', '💰', 'income', true),
  ('Freelance', '💻', 'income', true),
  ('Investasi', '📈', 'income', true),
  ('Bonus', '🎁', 'income', true),
  ('Lainnya', '📦', 'income', true),
  -- Expense Categories
  ('Makanan', '🍔', 'expense', true),
  ('Transportasi', '🚗', 'expense', true),
  ('Belanja', '🛒', 'expense', true),
  ('Hiburan', '🎮', 'expense', true),
  ('Tagihan', '📄', 'expense', true),
  ('Kesehatan', '💊', 'expense', true),
  ('Pendidikan', '📚', 'expense', true),
  ('Lainnya', '📦', 'expense', true);

-- =============================================
-- VIEWS (Optional - untuk kemudahan query)
-- =============================================

-- View untuk summary bulanan
CREATE OR REPLACE VIEW monthly_summary AS
SELECT 
  user_id,
  DATE_TRUNC('month', date) AS month,
  type,
  SUM(amount) AS total_amount,
  COUNT(*) AS transaction_count
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date), type;

-- View untuk summary per kategori
CREATE OR REPLACE VIEW category_summary AS
SELECT 
  user_id,
  category,
  type,
  SUM(amount) AS total_amount,
  COUNT(*) AS transaction_count
FROM transactions
GROUP BY user_id, category, type;
