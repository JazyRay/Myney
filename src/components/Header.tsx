'use client';

import Link from 'next/link';

interface HeaderProps {
  activePage?: 'dashboard' | 'transaksi' | 'laporan';
}

export default function Header({ activePage = 'dashboard' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--card-bg)]/80 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">M</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">Myney</h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`transition-colors font-medium ${activePage === 'dashboard' ? 'text-[var(--primary)]' : 'text-[var(--foreground)]/60 hover:text-[var(--primary)]'}`}>
              Dashboard
            </Link>
            <Link href="/transaksi" className={`transition-colors font-medium ${activePage === 'transaksi' ? 'text-[var(--primary)]' : 'text-[var(--foreground)]/60 hover:text-[var(--primary)]'}`}>
              Transaksi
            </Link>
            <Link href="/laporan" className={`transition-colors font-medium ${activePage === 'laporan' ? 'text-[var(--primary)]' : 'text-[var(--foreground)]/60 hover:text-[var(--primary)]'}`}>
              Laporan
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <div className="md:hidden relative group">
              <button className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-12 w-48 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
                <div className="py-2">
                  <Link href="/" className={`block px-4 py-2 hover:bg-[var(--background)] ${activePage === 'dashboard' ? 'text-[var(--primary)]' : ''}`}>
                    Dashboard
                  </Link>
                  <Link href="/transaksi" className={`block px-4 py-2 hover:bg-[var(--background)] ${activePage === 'transaksi' ? 'text-[var(--primary)]' : ''}`}>
                    Transaksi
                  </Link>
                  <Link href="/laporan" className={`block px-4 py-2 hover:bg-[var(--background)] ${activePage === 'laporan' ? 'text-[var(--primary)]' : ''}`}>
                    Laporan
                  </Link>
                </div>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white font-semibold">U</div>
          </div>
        </div>
      </div>
    </header>
  );
}
