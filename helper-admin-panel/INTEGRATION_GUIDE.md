# Helper Admin Panel - Supabase Integration Guide

## Integratsiya haqida

Admin panel endi to'liq Supabase bilan integratsiya qilingan. Mock datalar o'rniga haqiqiy ma'lumotlar Supabase dan olinadi.

## O'zgarishlar

### 1. Environment Variables (.env)
- `.env` fayli yaratildi va Supabase credentials qo'shildi
- `VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY` sozlandi

### 2. Supabase Client (src/lib/supabase.js)
- Environment variable nomlari to'g'rilandi: `EXPO_PUBLIC_*` → `VITE_*`
- Vite uchun to'g'ri konfiguratsiya qo'shildi

### 3. Dashboard.jsx
- `useState` va `useEffect` orqali real-time data fetching qo'shildi
- `getDashboardStats`, `getMonthlyChartData`, `getRecentActivity` funksiyalari ishlatildi
- Loading state qo'shildi
- Mock datalar o'rniga Supabase dan data olinadi

### 4. Masters.jsx
- LocalStorage o'rniga Supabase integratsiya qilindi
- `getMasters` va `updateMaster` service funksiyalari ishlatildi
- Real-time master list yangilanadi
- Pro status toggle funksiyasi Supabase bilan ishlaydi

### 5. Notifications.jsx
- Real-time subscriptions qo'shildi
- Yangi bildirishnomalar avtomatik ko'rsatiladi
- Browser notifications integratsiya qilindi

### 6. Realtime Subscriptions Hook
- `src/hooks/useRealtimeSubscription.js` yaratildi
- Orders, Notifications, Chat messages uchun subscriptions
- Real-time o'zgarishlarni kuzatadi

## Realtime Features

### Notifications
- Yangi bildirishnomalar avtomatik ko'rsatiladi
- Browser notification support
- Admin faqat o'z bildirishnomalarini ko'radi (`user_type=admin` filter)

### Orders (kelajakda)
- Yangi buyurtmalar real-time ko'rsatiladi
- Buyurtma statuslari avtomatik yangilanadi

### Chat Messages (kelajakda)
- Real-time chat xabarlari
- Room-based subscriptions

## Foydalanish

### Serverni ishga tushirish
```bash
cd AdminPanel/helper-admin-panel
npm install
npm run dev
```

Server http://localhost:5173 da ochiladi

### Supabase Connection
- .env faylidagi credentials to'g'riligini tekshiring
- Browser console da Supabase connection statusini ko'ring
- "✅ Supabase connected successfully!" xabari ko'rinishi kerak

## Qo'shimcha sozlamalar kerak bo'lgan joylar

### Orders Page
- `Orders.jsx` ni Supabase bilan integratsiya qilish
- Realtime order updates qo'shish

### Users Page
- `Users.jsx` ni Supabase bilan integratsiya qilish
- User management funksiyalari

### Categories Page
- `Categories.jsx` ni Supabase bilan integratsiya qilish
- Category CRUD operatsiyalari

### Payments Page
- `Payments.jsx` ni Supabase bilan integratsiya qilish
- Payment history va reports

### Reviews Page
- `Reviews.jsx` ni Supabase bilan integratsiya qilish
- Review moderation

## Texnik tafsilotlar

### Data Service Functions
- `getDashboardStats()` - Dashboard statistikasi
- `getMonthlyChartData(months)` - Oylik grafik ma'lumotlari
- `getRecentActivity(limit)` - So'nggi faoliyatlar
- `getMasters(options)` - Ustalar ro'yxati
- `updateMaster(id, updates)` - Usta ma'lumotlarini yangilash
- `getNotifications(options)` - Bildirishnomalar
- `markNotificationAsRead(id)` - Bildirishnomani o'qilgan qilish

### Realtime Subscriptions
```javascript
// Notifications uchun
useNotificationsSubscription((newNotification) => {
  // Yangi bildirishnoma kelganda
});

// Orders uchun
useOrdersSubscription(
  (newOrder) => { /* Yangi buyurtma */ },
  (updatedOrder) => { /* Yangilanishi */ }
);
```

## Muammolarni hal qilish

### Supabase not connected
- `.env` faylida credentials borligini tekshiring
- Browser console da xatolarni o'qing
- Supabase dashboard da RLS (Row Level Security) sozlamalarini tekshiring

### Real-time ishlamayapti
- Supabase dashboard da Realtime yoqilganligini tekshiring
- Database Replication sozlamalarini tekshiring
- Browser console da subscription statusini ko'ring

### Ma'lumotlar yuklanmayapti
- Network tab da API so'rovlarini tekshiring
- Supabase dashboard da table ma'lumotlari borligini tekshiring
- RLS policies to'g'ri sozlanganligini tekshiring

## Keyingi qadamlar

1. Qolgan sahifalarni (Users, Orders, Categories, Payments, Reviews) integratsiya qilish
2. Image upload funksiyasini Supabase Storage bilan qo'shish
3. Role-based access control (RBAC) qo'shish
4. Advanced filtering va search funksiyalari
5. Export to Excel/PDF funksiyalari
6. Analytics va reporting sahifalari

---

**Muallif:** Claude Sonnet 4.5
**Sana:** 2024-12-16
**Version:** 1.0.0
