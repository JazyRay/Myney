'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface EditProfile {
  full_name: string;
  phone: string;
  avatar_url: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading, updateProfile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<EditProfile>({
    full_name: '',
    phone: '',
    avatar_url: '',
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Password form state
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Initialize editedProfile when profile loads
  useEffect(() => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
      showSuccess('Perubahan berhasil disimpan!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Gagal menyimpan perubahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const supabase = createClient();

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });

      if (uploadError) {
        // If bucket doesn't exist, show a friendly error
        if (uploadError.message.includes('not found')) {
          alert('Fitur upload avatar belum tersedia. Hubungi administrator.');
          return;
        }
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl });
      await refreshProfile();

      showSuccess('Foto profil berhasil diperbarui!');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Gagal mengupload foto. Silakan coba lagi.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);

    // Validation
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Harap isi semua kolom password');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Password baru dan konfirmasi tidak cocok');
      return;
    }

    setIsChangingPassword(true);
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      showSuccess('Password berhasil diubah!');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      setPasswordError(error.message || 'Gagal mengubah password. Silakan coba lagi.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
      });
    }
    setIsEditing(false);
  };

  const handleSettingChange = async (updates: any) => {
    try {
      await updateProfile(updates);
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Gagal menyimpan pengaturan. Silakan coba lagi.');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (authLoading || !profile) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header activePage="profile" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

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
            {successMessage}
          </div>
        )}

        {/* Hidden file input for avatar upload */}
        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />

        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                {isUploadingAvatar ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                ) : profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" fill className="rounded-full object-cover" />
                ) : (
                  getInitials(profile.full_name || user?.email || 'U')
                )}
              </div>
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
              >
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
              <h2 className="text-2xl font-bold">{profile.full_name || user?.email}</h2>
              <p className="text-[var(--foreground)]/60">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">Akun Aktif</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                  Member Sejak {new Date(profile.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                </span>
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
                  <input type="text" value={editedProfile.full_name} onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })} className="input-field" />
                ) : (
                  <p className="py-3 px-4 bg-[var(--background)] rounded-xl">{profile.full_name || '-'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <p className="py-3 px-4 bg-[var(--background)] rounded-xl text-[var(--foreground)]/60">{user?.email}</p>
                <p className="text-xs text-[var(--foreground)]/40 mt-1">Email tidak dapat diubah</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Nomor Telepon</label>
                {isEditing ? (
                  <input type="tel" value={editedProfile.phone} onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })} className="input-field" placeholder="+62 812 3456 7890" />
                ) : (
                  <p className="py-3 px-4 bg-[var(--background)] rounded-xl">{profile.phone || '-'}</p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button onClick={handleCancel} disabled={isSaving} className="px-6 py-3 border border-[var(--border)] rounded-xl font-semibold hover:bg-[var(--background)] transition-colors disabled:opacity-50">
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
                  <select value={profile.currency} onChange={(e) => handleSettingChange({ currency: e.target.value })} className="input-field w-32">
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
                  <select value={profile.language} onChange={(e) => handleSettingChange({ language: e.target.value })} className="input-field w-40">
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
                        onClick={() => handleSettingChange({ theme })}
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
                    onClick={() => handleSettingChange({ email_notifications: !profile.email_notifications })}
                    className={`w-12 h-6 rounded-full transition-all ${profile.email_notifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.email_notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium">Notifikasi Push</p>
                    <p className="text-sm text-[var(--foreground)]/60">Terima notifikasi di perangkat</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange({ push_notifications: !profile.push_notifications })}
                    className={`w-12 h-6 rounded-full transition-all ${profile.push_notifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.push_notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Weekly Report */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Laporan Mingguan</p>
                    <p className="text-sm text-[var(--foreground)]/60">Terima ringkasan keuangan mingguan</p>
                  </div>
                  <button onClick={() => handleSettingChange({ weekly_report: !profile.weekly_report })} className={`w-12 h-6 rounded-full transition-all ${profile.weekly_report ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.weekly_report ? 'translate-x-6' : 'translate-x-0.5'}`} />
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

              {/* Password Error */}
              {passwordError && <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">{passwordError}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Password Baru</label>
                  <input type="password" placeholder="Masukkan password baru (min. 6 karakter)" className="input-field" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Konfirmasi Password Baru</label>
                  <input type="password" placeholder="Konfirmasi password baru" className="input-field" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                </div>
                <button onClick={handleChangePassword} disabled={isChangingPassword} className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isChangingPassword ? 'Mengubah...' : 'Ubah Password'}
                </button>
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
