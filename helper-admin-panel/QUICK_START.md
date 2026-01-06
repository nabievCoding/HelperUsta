# Helper Admin Panel - Tezkor Boshlash

## 1️⃣ Database ni sozlash

### Supabase SQL Editor ga kiring
1. [Supabase Dashboard](https://supabase.com/dashboard) ga kiring
2. Helper project ni tanlang
3. Sol menuda **SQL Editor** ni bosing

### SQL Script ni run qiling
1. `SUPABASE_SQL_SETUP.sql` faylini oching
2. Butun kodni copy qiling
3. Supabase SQL Editor ga paste qiling
4. **Run** tugmasini bosing

Bu script quyidagilarni yaratadi:
- ✅ Admin user: `admin@helper.uz` / `admin123`
- ✅ 8 ta kategoriya (Santexnik, Elektrik, va boshqalar)
- ✅ 5 ta test user (mijoz)
- ✅ 5 ta test master
- ✅ 2 ta test buyurtma
- ✅ 5 ta test bildirishnoma

## 2️⃣ Admin Panel ni ishga tushirish

```bash
cd AdminPanel/helper-admin-panel
npm install
npm run dev
```

Server **http://localhost:5173** da ochiladi

## 3️⃣ Login qiling

Login sahifasida:
- **Email:** admin@helper.uz
- **Password:** admin123

Enter ni bosing va dashboard ochiladi! 🎉

## 4️⃣ Tekshiring

### Dashboard sahifasi
- Statistikalar ko'rinishi kerak (users, masters, orders, revenue)
- Grafiklar data bilan to'ldirilishi kerak
- So'nggi faoliyatlar ko'rinishi kerak

### Masters sahifasi
- 5 ta usta ro'yxatda ko'rinishi kerak
- Ularning ma'lumotlari to'liq bo'lishi kerak
- Pro badge ishlashi kerak
- Search va filter ishlashi kerak

### Notifications sahifasi
- 5 ta bildirishnoma ko'rinishi kerak
- O'qilgan/o'qilmagan holatlar ko'rinishi kerak
- Real-time yangilanishlar ishlashi kerak

## 🔧 Muammolarni hal qilish

### "No data" ko'rsatilsa
1. Browser console ni oching (F12)
2. Network tabni tekshiring - Supabase API calls bor mi?
3. Console da xatolar bor mi?
4. Supabase dashboard da table ma'lumotlari bor mi?

### Login ishlamasa
1. Console da xatolarni ko'ring
2. `admin_users` table da user bor mi tekshiring:
   ```sql
   SELECT * FROM admin_users WHERE email = 'admin@helper.uz';
   ```
3. `.env` faylidagi credentials to'g'rimi?

### Realtime ishlamasa
1. Supabase Dashboard → Database → Replication
2. **Realtime** yoqilganligini tekshiring
3. Tables uchun Realtime enabled bo'lishi kerak

## 📊 Qo'shimcha test data qo'shish

Agar ko'proq data kerak bo'lsa, Supabase SQL Editor da:

```sql
-- Ko'proq user qo'shish
INSERT INTO users (id, phone, full_name, is_active, total_orders, total_spent, created_at)
VALUES
  (gen_random_uuid(), '+998901234572', 'Yangi User', true, 0, 0, NOW());

-- Ko'proq master qo'shish
INSERT INTO masters (id, phone, username, password, full_name, category_id, status, is_available, rating, created_at)
SELECT
  gen_random_uuid(),
  '+99890' || FLOOR(RANDOM() * 10000000)::TEXT,
  'master_' || FLOOR(RANDOM() * 1000)::TEXT,
  'pass123',
  'Test Master ' || FLOOR(RANDOM() * 1000)::TEXT,
  (SELECT id FROM categories ORDER BY RANDOM() LIMIT 1),
  'active',
  true,
  4.0 + RANDOM(),
  NOW();
```

## ✨ Features

- ✅ Real-time dashboard statistics
- ✅ Real-time notifications
- ✅ Master management
- ✅ Pro/Regular master toggle
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Browser notifications

## 🎯 Keyingi qadamlar

Hozircha faqat **Dashboard**, **Masters** va **Notifications** to'liq integratsiya qilingan.

Qolgan sahifalar:
- [ ] Users (mijozlar)
- [ ] Orders (buyurtmalar)
- [ ] Categories (kategoriyalar)
- [ ] Payments (to'lovlar)
- [ ] Reviews (sharhlar)
- [ ] Settings (sozlamalar)

Bularni ham xuddi shu tarzda integratsiya qilish mumkin!

---

**Savol yoki muammo bo'lsa:**
1. Browser console ni tekshiring
2. `INTEGRATION_GUIDE.md` ni o'qing
3. GitHub issues yozing

Omad! 🚀
