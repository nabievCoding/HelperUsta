# Helper Admin Panel 🚀

Supabase bilan integratsiya qilingan zamonaviy admin panel

## 📋 Tayyor Sahifalar

### ✅ Authentication
- Login sahifasi (admin_users jadvalidagi ma'lumotlar bilan)
- Protected routes
- Session management (localStorage)

### ✅ Dashboard
- Real-time statistika (Users, Masters, Orders, Revenue)
- 6 oylik grafik (Orders va Revenue)
- Supabase'dan to'g'ridan-to'g'ri ma'lumot olish

### ✅ Foydalanuvchilar (Users)
- Barcha foydalanuvchilarni ko'rish
- Qidirish (ism, telefon)
- Status bo'yicha filtrlash (Faol/Bloklangan)
- Block/Unblock funksiyasi
- Real-time CRUD

### ✅ Ustalar (Masters)
- Barcha ustalarni ko'rish
- Grid layout (card view)
- Kategoriya va status filtrlari
- Verify/Unverify funksiyasi
- Activate/Deactivate
- Badge'lar (Verified, Pro, Insured, 24/7)

### ✅ Kategoriyalar (Categories)
- Grid layout
- Toggle active/inactive status
- Ustalar va buyurtmalar statistikasi
- Multi-language support (uz, uz-cyrillic, ru)

### ✅ Buyurtmalar (Orders)
- Barcha buyurtmalar jadvali
- Status bo'yicha statistika
- Qidirish va filtrlash
- Buyurtma tafsilotlari modal
- Narxlar va komissiya ko'rsatish

### 🔜 Keyingi Sahifalar
- Payments - To'lovlar tarixi
- Reviews - Sharhlar moderatsiya
- Chat - Chat xonalari
- Notifications - Bildirishnomalar
- Settings - Sozlamalar

## 🛠️ Texnologiyalar

- **React 19** - Frontend framework
- **Vite 7** - Build tool
- **Tailwind CSS 3** - Styling
- **React Router 7** - Routing
- **Supabase** - Backend (PostgreSQL database)
- **Recharts** - Charts va grafiklar
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 🚀 Ishga Tushirish

### 1. Dependencies o'rnatish
```bash
npm install
```

### 2. Environment variables (.env)
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Development server
```bash
npm run dev
```

Server http://localhost:5173 da ochiladi

### 4. Production build
```bash
npm run build
npm run preview
```

## 📊 Database Schema

Loyihada quyidagi jadvallar ishlatilgan:

1. **admin_users** - Admin panelga kirish
2. **users** - Mijozlar
3. **masters** - Ustalar
4. **categories** - Xizmat kategoriyalari
5. **orders** - Buyurtmalar
6. **payments** - To'lovlar
7. **reviews** - Sharhlar
8. **chat_rooms** - Chat xonalari
9. **chat_messages** - Chat xabarlari
10. **notifications** - Bildirishnomalar
11. **settings** - Tizim sozlamalari
12. Va boshqalar...

## 🎨 Design Features

- **Responsive** - Mobile, Tablet, Desktop
- **Modern UI** - Zamonaviy dizayn
- **Color Scheme**:
  - Primary: #0B3CB4 (Blue)
  - Secondary: #39A053 (Green)
- **Smooth animations** - Tailwind transitions
- **Intuitive UX** - Foydalanuvchi uchun qulay

## 📱 Features

✅ Real-time data updates (Supabase)
✅ Advanced search and filters
✅ Responsive tables and grids
✅ Modal windows for details
✅ Status management (Block, Verify, Activate)
✅ Statistics and charts
✅ Professional UI/UX

## 🔐 Authentication

Login sahifasida `admin_users` jadvalidagi ma'lumotlar bilan kirish mumkin:
- Username va password
- Session localStorage'da saqlanadi
- Protected routes orqali xavfsizlik

## 📝 Notes

- Parol hozircha plain text (production'da bcrypt ishlatish kerak)
- Real-time subscriptions qo'shish mumkin
- Export funksiyalari (CSV/Excel) qo'shish mumkin
- Multi-language support kengaytirish mumkin
- Dark mode qo'shish mumkin

---

**Version**: 1.0.0
**Date**: 2025-12-16
**Status**: MVP Ready ✅
