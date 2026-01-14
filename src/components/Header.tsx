'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  activePage?: 'dashboard' | 'transaksi' | 'laporan' | 'profile';
}

export default function Header({ activePage = 'dashboard' }: HeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--card-bg)]/80 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-24 h-24">
                <Image src="/Myney Logo.png" alt="Myney Logo" fill className="object-contain" priority />
              </div>
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
                  <div className="border-t border-[var(--border)] my-2"></div>
                  <Link href="/profile" className={`block px-4 py-2 hover:bg-[var(--background)] ${activePage === 'profile' ? 'text-[var(--primary)]' : ''}`}>
                    👤 Profile
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

            {/* Profile Avatar with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-[var(--primary)] hover:ring-offset-2 transition-all ${
                  activePage === 'profile' ? 'ring-2 ring-[var(--primary)] ring-offset-2' : ''
                }`}
              >
                U
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 w-56 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/10 to-purple-600/10">
                    <p className="font-semibold">User Myney</p>
                    <p className="text-sm text-[var(--foreground)]/60">user@myney.com</p>
                  </div>
                  <div className="py-2">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--background)] transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      Profile Saya
                    </Link>
                    <Link href="/profile?tab=settings" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--background)] transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Pengaturan
                    </Link>
                  </div>
                  <div className="border-t border-[var(--border)] py-2">
                    <button className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
