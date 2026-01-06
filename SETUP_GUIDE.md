# Setup Guide - Admin Panel

## 1. Supabase Database Setup

### A. Row Level Security (RLS) ni o'chirish

Admin panel uchun barcha jadvallardan RLS ni o'chirish kerak:

```sql
-- Disable RLS for all tables
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE masters DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE earnings DISABLE ROW LEVEL SECURITY;
ALTER TABLE master_availability DISABLE ROW LEVEL SECURITY;
ALTER TABLE master_portfolio DISABLE ROW LEVEL SECURITY;
ALTER TABLE master_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE spent_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses DISABLE ROW LEVEL SECURITY;
```

### B. Test Admin foydalanuvchi yaratish

```sql
-- Create test admin user
INSERT INTO admin_users (
  id,
  username,
  email,
  password,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin',
  'admin@helper.uz',
  'admin123',
  'Super Admin',
  'super_admin',
  true,
  NOW(),
  NOW()
);
```

**Login ma'lumotlari:**
- Username: `admin`
- Password: `admin123`

## 2. Loyihani Ishga Tushirish

### A. Dependencies o'rnatish
```bash
cd /Users/furb-x/Desktop/admin-panel
npm install
```

### B. .env faylini tekshirish
`.env` faylida Supabase credentials bor ekanligiga ishonch hosil qiling:
```env
VITE_SUPABASE_URL=https://lrzdihsgufmzdryfwecv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### C. Development server ishga tushirish
```bash
npm run dev
```

Server http://localhost:5174/ da ochiladi

## 3. Login qilish

1. Brauzerda http://localhost:5174/ ochiladi
2. Avtomatik `/login` ga redirect bo'ladi
3. Username: `admin`, Password: `admin123` kiriting
4. "Kirish" tugmasini bosing
5. Muvaffaqiyatli bo'lsa `/dashboard` ga o'tadi

## 4. Xatoliklarni Hal Qilish

### Xatolik: "Invalid credentials"
**Sabab:** `admin_users` jadvalida foydalanuvchi yo'q
**Yechim:** Yuqoridagi SQL bilan test foydalanuvchi yarating

### Xatolik: "Missing Supabase environment variables"
**Sabab:** `.env` fayli yo'q yoki noto'g'ri
**Yechim:** `.env` faylini tekshiring

### Xatolik: Ma'lumotlar yuklanmayapti
**Sabab:** Row Level Security (RLS) yoqilgan
**Yechim:** RLS ni o'chiring (yuqoridagi SQL)

### Xatolik: "Failed to fetch"
**Sabab:** Supabase credentials noto'g'ri
**Yechim:** Supabase dashboard'dan yangi credentials oling

## 5. Production uchun

### A. Parollarni hash qilish
Production'da parollarni bcrypt bilan hash qilish kerak:

```bash
npm install bcryptjs
```

AuthContext.jsx ni yangilang:
```javascript
import bcrypt from 'bcryptjs';

// Login function'da:
const isPasswordValid = await bcrypt.compare(password, data.password);
```

### B. RLS Policies qo'shish
Production'da RLS policies qo'shish kerak:

```sql
-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated admins
CREATE POLICY "Admins can view all"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);
```

### C. Build va Deploy
```bash
# Build qilish
npm run build

# Preview
npm run preview

# Deploy (Vercel, Netlify, yoki boshqa platform)
# dist/ papkasini deploy qiling
```

## 6. Qo'shimcha Xususiyatlar

### Test ma'lumotlar qo'shish
Agar jadvallaringiz bo'sh bo'lsa, test ma'lumotlar qo'shing:

```sql
-- Test category
INSERT INTO categories (id, name, name_uz_latin, name_ru, icon, key, is_active)
VALUES (gen_random_uuid(), 'Santexnik', 'Santexnik', 'Сантехник', '🔧', 'plumber', true);

-- Test user
INSERT INTO users (id, phone, full_name, is_active)
VALUES (gen_random_uuid(), '+998901234567', 'Test User', true);

-- Test master
INSERT INTO masters (id, phone, full_name, profession, status, is_verified)
VALUES (gen_random_uuid(), '+998907654321', 'Test Master', 'Santexnik', 'active', true);
```

## Yordam

Muammolar yuzaga kelsa:
1. Browser console'ni tekshiring (F12)
2. Network tab'da Supabase requestlarni ko'ring
3. Supabase dashboard'da logs'ni tekshiring

**Omad!** 🚀
