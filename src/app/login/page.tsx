'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setError('Cek email Anda untuk konfirmasi pendaftaran!');
      } else {
        await signIn(email, password);
        router.push('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : isSignUp ? 'Gagal mendaftar. Silakan coba lagi.' : 'Email atau password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-purple-600 text-transparent bg-clip-text">Myney</span>
          </Link>
        </div>

        {/* Card */}
        <div className="card">
          <h1 className="text-2xl font-bold mb-2 text-center">{isSignUp ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}</h1>
          <p className="text-[var(--foreground)]/60 text-center mb-6">{isSignUp ? 'Daftar untuk mulai mengelola keuangan Anda' : 'Masuk untuk melanjutkan ke dashboard Anda'}</p>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-4 rounded-xl text-sm ${error.includes('Cek email') ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field" required minLength={6} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </>
              ) : isSignUp ? (
                'Daftar'
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm">
            <span className="text-[var(--foreground)]/60">{isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}</span>{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              {isSignUp ? 'Masuk' : 'Daftar'}
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
