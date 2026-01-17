# Setup Fitur Edit Profile

## Langkah-langkah Setup Database

### 1. Jalankan SQL untuk Tabel Profiles

Buka **Supabase Dashboard** → **SQL Editor**, lalu jalankan file `supabase/profiles.sql`:

```sql
-- File sudah tersedia di: supabase/profiles.sql
-- Copy dan paste semua isi file tersebut ke SQL Editor
```

File ini akan:

- Membuat tabel `profiles` dengan kolom:

  - `id` (UUID, foreign key ke auth.users)
  - `full_name` (TEXT)
  - `phone` (TEXT)
  - `avatar_url` (TEXT)
  - `currency` (TEXT, default 'IDR')
  - `language` (TEXT, default 'id')
  - `theme` (TEXT, default 'system')
  - `email_notifications` (BOOLEAN, default true)
  - `push_notifications` (BOOLEAN, default true)
  - `weekly_report` (BOOLEAN, default false)
  - `created_at` & `updated_at` (TIMESTAMPTZ)

- Enable Row Level Security (RLS)
- Membuat policies untuk users dapat:

  - Read own profile
  - Insert own profile
  - Update own profile

- Membuat trigger untuk auto-create profile saat user baru signup

### 2. Verifikasi Tabel Berhasil Dibuat

1. Buka **Table Editor** di Supabase
2. Cek tabel `profiles` sudah ada
3. Cek di **Authentication** → **Policies**, pastikan ada 3 policies untuk `profiles`

### 3. Test Fitur

1. Jalankan aplikasi: `npm run dev`
2. Login atau register user baru
3. Buka halaman **Profile** dari menu
4. Coba edit informasi:
   - ✅ Nama lengkap
   - ✅ Nomor telepon
   - ✅ Mata uang
   - ✅ Bahasa
   - ✅ Tema (Light/Dark/System)
   - ✅ Notifikasi (Email, Push, Weekly Report)

## Fitur yang Tersedia

### Tab: Informasi Pribadi

- **Edit Mode**: Klik tombol "Edit" untuk mengubah data
- **Fields**:
  - Nama Lengkap (editable)
  - Email (read-only, dari Supabase Auth)
  - Nomor Telepon (editable)
- **Actions**: Simpan Perubahan / Batal

### Tab: Pengaturan

- **Preferensi Aplikasi**:
  - Mata Uang (IDR, USD, EUR, SGD)
  - Bahasa (Indonesia, English)
  - Tema (Light ☀️, Dark 🌙, System 💻)
- **Notifikasi**:
  - Email Notifications (toggle)
  - Push Notifications (toggle)
  - Weekly Report (toggle)

### Tab: Keamanan

- Ubah Password (placeholder)
- Two-Factor Authentication (placeholder)
- Active Sessions (placeholder)
- Delete Account (placeholder)

## Integrasi dengan Supabase

### useAuth Hook Updates

Hook `useAuth` sekarang include:

```typescript
interface AuthContextType {
  user: User | null;
  profile: ProfileData | null; // ← NEW
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileData>) => Promise<void>; // ← NEW
  refreshProfile: () => Promise<void>; // ← NEW
}
```

### Cara Penggunaan

```typescript
// Di component
const { user, profile, updateProfile } = useAuth();

// Update profile
await updateProfile({
  full_name: 'John Doe',
  phone: '+62 812 3456 7890',
  currency: 'USD',
});

// Update notifications
await updateProfile({
  email_notifications: true,
  weekly_report: false,
});
```

## Auto-Create Profile on Signup

Trigger database akan otomatis membuat profile entry ketika:

- User baru signup via Supabase Auth
- Profile akan dibuat dengan:
  - `id` = user ID dari auth.users
  - `full_name` = 'User' (default)
  - Semua field lain menggunakan default values

## Troubleshooting

### Profile tidak muncul setelah login

1. Cek di Supabase Table Editor apakah ada entry di `profiles` untuk user ID Anda
2. Jika tidak ada, jalankan manual:

```sql
INSERT INTO profiles (id) VALUES ('YOUR_USER_ID');
```

### Error: "permission denied for table profiles"

1. Cek RLS policies sudah dibuat dengan benar
2. Pastikan user sudah login (auth.uid() harus ada)

### Profile tidak ter-update

1. Buka Browser DevTools → Console, cek error messages
2. Verify RLS policy untuk UPDATE operation
3. Cek apakah `user.id` match dengan `profile.id`

## Next Steps (Future Enhancements)

- [ ] Upload avatar/profile picture
- [ ] Change password integration
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Account deletion flow
- [ ] Export data feature
