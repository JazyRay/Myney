'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--foreground)]/60">Memuat...</p>
        </div>
      </div>
    );
  }

  // If logged in, show nothing (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-purple-600 text-transparent bg-clip-text">Myney</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-[var(--foreground)] hover:text-[var(--primary)] font-medium transition-colors">
                Masuk
              </Link>
              <Link href="/login" className="px-5 py-2 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/10 rounded-full text-[var(--primary)] text-sm font-medium mb-6">
              <span className="animate-pulse">🚀</span>
              <span>Kelola Keuangan Lebih Mudah</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Atur Keuangan Anda dengan <span className="bg-gradient-to-r from-[var(--primary)] to-purple-600 text-transparent bg-clip-text">Myney</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-[var(--foreground)]/60 mb-8 max-w-2xl mx-auto">Aplikasi pencatatan keuangan pribadi yang simpel, cepat, dan aman. Lacak pemasukan dan pengeluaran Anda dengan mudah.</p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[var(--primary)]/25"
              >
                Mulai Sekarang — Gratis
              </Link>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl font-semibold text-lg hover:border-[var(--primary)] transition-colors">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>

          {/* Hero Image / Mockup */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-2xl p-4 sm:p-8 max-w-4xl mx-auto">
              {/* Mock Dashboard */}
              <div className="space-y-4">
                {/* Mock Balance Card */}
                <div className="bg-gradient-to-r from-[var(--primary)] to-purple-600 rounded-xl p-6 text-white">
                  <p className="text-white/80 text-sm mb-1">Total Saldo</p>
                  <p className="text-3xl font-bold">Rp 5.250.000</p>
                  <div className="flex gap-6 mt-4">
                    <div>
                      <p className="text-white/80 text-xs">Pemasukan</p>
                      <p className="text-lg font-semibold text-green-300">+Rp 8.500.000</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-xs">Pengeluaran</p>
                      <p className="text-lg font-semibold text-red-300">-Rp 3.250.000</p>
                    </div>
                  </div>
                </div>

                {/* Mock Transactions */}
                <div className="space-y-2">
                  {[
                    { icon: '💼', name: 'Gaji Bulanan', amount: '+Rp 8.500.000', color: 'text-green-500' },
                    { icon: '🛒', name: 'Belanja Bulanan', amount: '-Rp 1.200.000', color: 'text-red-500' },
                    { icon: '🍔', name: 'Makan & Minum', amount: '-Rp 850.000', color: 'text-red-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--card-bg)] rounded-full flex items-center justify-center">{item.icon}</div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className={`font-semibold ${item.color}`}>{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Fitur yang Memudahkan Hidup Anda</h2>
            <p className="text-[var(--foreground)]/60 max-w-2xl mx-auto">Semua yang Anda butuhkan untuk mengelola keuangan pribadi dalam satu aplikasi</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'Laporan Visual',
                description: 'Lihat ringkasan keuangan Anda dengan grafik dan chart yang mudah dipahami',
              },
              {
                icon: '🏷️',
                title: 'Kategori Transaksi',
                description: 'Kelompokkan transaksi berdasarkan kategori untuk analisis yang lebih baik',
              },
              {
                icon: '📱',
                title: 'Responsif',
                description: 'Akses dari perangkat apa saja - desktop, tablet, atau smartphone',
              },
              {
                icon: '🔒',
                title: 'Aman & Privat',
                description: 'Data Anda terenkripsi dan hanya Anda yang bisa mengaksesnya',
              },
              {
                icon: '⚡',
                title: 'Cepat & Ringan',
                description: 'Performa optimal tanpa loading yang lama, input transaksi dalam hitungan detik',
              },
              {
                icon: '🎨',
                title: 'Tampilan Modern',
                description: 'Antarmuka yang bersih dan modern dengan dukungan dark mode',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-[var(--background)] rounded-2xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors group">
                <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--foreground)]/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '100%', label: 'Gratis' },
              { value: '24/7', label: 'Akses Kapanpun' },
              { value: '🔐', label: 'Data Terenkripsi' },
            ].map((stat, i) => (
              <div key={i} className="p-8">
                <p className="text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-purple-600 text-transparent bg-clip-text mb-2">{stat.value}</p>
                <p className="text-[var(--foreground)]/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[var(--primary)] to-purple-600 rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Siap Mengelola Keuangan Anda?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">Bergabung sekarang dan mulai lacak setiap rupiah yang masuk dan keluar. Gratis selamanya, tanpa biaya tersembunyi.</p>
            <Link href="/login" className="inline-block px-8 py-4 bg-white text-[var(--primary)] rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors shadow-lg">
              Daftar Gratis Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">💰</span>
            </div>
            <span className="font-semibold bg-gradient-to-r from-[var(--primary)] to-purple-600 text-transparent bg-clip-text">Myney</span>
          </div>
          <p className="text-[var(--foreground)]/60 text-sm">© 2026 Myney. Dibuat dengan ❤️ untuk mengelola keuangan Anda.</p>
        </div>
      </footer>
    </div>
  );
}
