'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Image from 'next/image';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'User Myney',
    email: 'user@myney.com',
    phone: '+62 812 3456 7890',
    avatar: '',
    currency: 'IDR',
    language: 'id',
    notifications: {
      email: true,
      push: true,
      weekly: false,
    },
    theme: 'system',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header activePage="profile" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile 👤</h1>
          <p className="text-[var(--foreground)]/60">Kelola informasi akun dan pengaturan aplikasi</p>
        </div>

        {/* Success Toast */}
        {showSaveSuccess && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Perubahan berhasil disimpan!
          </div>
        )}

        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile.avatar ? <Image src={profile.avatar} alt="Avatar" fill className="rounded-full object-cover" /> : getInitials(profile.name)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-[var(--foreground)]/60">{profile.email}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">Akun Aktif</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">Member Sejak Jan 2026</span>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]'}`}
          >
            👤 Informasi Pribadi
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]'}`}
          >
            ⚙️ Pengaturan
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]'}`}
          >
            🔒 Keamanan
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="card">
            <h3 className="text-lg font-bold mb-6">Informasi Pribadi</h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                {isEditing ? (
                  <input type="text" value={editedProfile.name} onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })} className="input-field" />
                ) : (
                  <p className="py-3 px-4 bg-[var(--background)] rounded-xl">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                {isEditing ? (
                  <input type="email" value={editedProfile.email} onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })} className="input-field" />
                ) : (
                  <p className="py-3 px-4 bg-[var(--background)] rounded-xl">{profile.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Nomor Telepon</label>
                {isEditing ? (
                  <input type="tel" value={editedProfile.phone} onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })} className="input-field" />
                ) : (
                  <p className="py-3 px-4 bg-[var(--background)] rounded-xl">{profile.phone}</p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button onClick={handleSave} className="flex-1 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    Simpan Perubahan
                  </button>
                  <button onClick={handleCancel} className="px-6 py-3 border border-[var(--border)] rounded-xl font-semibold hover:bg-[var(--background)] transition-colors">
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Preferences */}
            <div className="card">
              <h3 className="text-lg font-bold mb-6">Preferensi Aplikasi</h3>
              <div className="space-y-4">
                {/* Currency */}
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium">Mata Uang</p>
                    <p className="text-sm text-[var(--foreground)]/60">Pilih mata uang default</p>
                  </div>
                  <select value={profile.currency} onChange={(e) => setProfile({ ...profile, currency: e.target.value })} className="input-field w-32">
                    <option value="IDR">IDR (Rp)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="SGD">SGD (S$)</option>
                  </select>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium">Bahasa</p>
                    <p className="text-sm text-[var(--foreground)]/60">Pilih bahasa aplikasi</p>
                  </div>
                  <select value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })} className="input-field w-40">
                    <option value="id">🇮🇩 Indonesia</option>
                    <option value="en">🇺🇸 English</option>
                  </select>
                </div>

                {/* Theme */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Tema</p>
                    <p className="text-sm text-[var(--foreground)]/60">Pilih tema tampilan</p>
                  </div>
                  <div className="flex gap-2">
                    {(['light', 'dark', 'system'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setProfile({ ...profile, theme })}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${profile.theme === theme ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)]'}`}
                      >
                        {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="card">
              <h3 className="text-lg font-bold mb-6">Notifikasi</h3>
              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium">Notifikasi Email</p>
                    <p className="text-sm text-[var(--foreground)]/60">Terima pemberitahuan via email</p>
                  </div>
                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, email: !profile.notifications.email },
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-all ${profile.notifications.email ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.notifications.email ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium">Notifikasi Push</p>
                    <p className="text-sm text-[var(--foreground)]/60">Terima notifikasi di perangkat</p>
                  </div>
                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, push: !profile.notifications.push },
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-all ${profile.notifications.push ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.notifications.push ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Weekly Report */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Laporan Mingguan</p>
                    <p className="text-sm text-[var(--foreground)]/60">Terima ringkasan keuangan mingguan</p>
                  </div>
                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, weekly: !profile.notifications.weekly },
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-all ${profile.notifications.weekly ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.notifications.weekly ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Password */}
            <div className="card">
              <h3 className="text-lg font-bold mb-6">Ubah Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Password Saat Ini</label>
                  <input type="password" placeholder="Masukkan password saat ini" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password Baru</label>
                  <input type="password" placeholder="Masukkan password baru" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Konfirmasi Password Baru</label>
                  <input type="password" placeholder="Konfirmasi password baru" className="input-field" />
                </div>
                <button className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">Ubah Password</button>
              </div>
            </div>

            {/* Two Factor */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Autentikasi Dua Faktor</h3>
                  <p className="text-sm text-[var(--foreground)]/60 mt-1">Tambahkan lapisan keamanan ekstra untuk akun Anda</p>
                </div>
                <button className="px-4 py-2 border border-[var(--primary)] text-[var(--primary)] rounded-xl font-medium hover:bg-[var(--primary)] hover:text-white transition-all">Aktifkan</button>
              </div>
            </div>

            {/* Sessions */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Sesi Aktif</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--background)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <span className="text-xl">💻</span>
                    </div>
                    <div>
                      <p className="font-medium">Windows - Chrome</p>
                      <p className="text-sm text-[var(--foreground)]/60">Jakarta, Indonesia • Saat ini</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">Aktif</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--background)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <p className="font-medium">Android - App</p>
                      <p className="text-sm text-[var(--foreground)]/60">Jakarta, Indonesia • 2 jam lalu</p>
                    </div>
                  </div>
                  <button className="text-red-500 text-sm font-medium hover:underline">Hapus</button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card border-red-300 dark:border-red-700">
              <h3 className="text-lg font-bold text-red-500 mb-4">Zona Bahaya</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Hapus Akun</p>
                  <p className="text-sm text-[var(--foreground)]/60">Tindakan ini tidak dapat dibatalkan. Semua data akan dihapus permanen.</p>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">Hapus Akun</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
