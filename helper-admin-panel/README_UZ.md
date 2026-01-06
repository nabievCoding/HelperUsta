# Helper Admin Panel 🚀

Helper platformasi uchun zamonaviy admin panel. Desktop dagi Helper1.0 (Client app) va Helper_Usta1.0 (Service provider app) loyihalariga asoslangan.

## 📋 Loyiha haqida

Bu admin panel Helper ekotizimini boshqarish uchun mo'ljallangan. U mijozlar, ustalar, buyurtmalar, kategoriyalar va to'lovlarni boshqarish imkonini beradi.

## 🎯 Asosiy Funksiyalar

### ✅ Tayyor Sahifalar

1. **Dashboard** 📊
   - Umumiy statistika (foydalanuvchilar, ustalar, buyurtmalar, daromad)
   - Oylik daromad va buyurtmalar grafiklari (Recharts)
   - So'nggi faoliyatlar ro'yxati
   - Tezkor statistika kartalari

2. **Foydalanuvchilar** 👥
   - Mijozlar va ustalarni ko'rish
   - Qidirish va filtrlash (tur, status)
   - Usta badge'lari (Verified, Pro, Insured)
   - Foydalanuvchi statistikasi
   - CRUD operatsiyalari

3. **Buyurtmalar** 📦
   - Barcha buyurtmalarni ko'rish
   - Status bo'yicha filtrlash (pending, in_progress, completed, cancelled)
   - Kategoriya bo'yicha filtrlash
   - Buyurtma tafsilotlari
   - Komissiya hisoblash

4. **Kategoriyalar** 🏷️
   - Xizmat kategoriyalarini boshqarish
   - Har bir kategoriya statistikasi
   - Grid ko'rinish
   - CRUD operatsiyalari

### 🔜 Rejalashtirilgan Sahifalar

- **To'lovlar** - To'lovlar tarixi, komissiya tracking
- **Sharhlar** - Ustalar reytinglari va mijoz sharhlari
- **Bildirishnomalar** - Push notifications boshqaruvi
- **Sozlamalar** - Platforma sozlamalari

## 🛠️ Texnologiyalar

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 7.2.6
- **Routing**: React Router DOM 7.1.2
- **Styling**: Tailwind CSS 3.4.17
- **Charts**: Recharts 2.15.0
- **Icons**: Lucide React 0.468.0
- **Language**: JavaScript (ES6+)

## 📁 Loyiha Strukturasi

```
helper-admin-panel/
├── src/
│   ├── components/        # Reusable UI components
│   ├── layouts/          # Layout components
│   │   └── DashboardLayout.jsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Orders.jsx
│   │   └── Categories.jsx
│   ├── data/             # Mock data
│   │   └── mockData.js
│   ├── contexts/         # React contexts
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles (Tailwind)
├── public/               # Static assets
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 O'rnatish va Ishga Tushirish

### 1. Repository'ni clone qilish yoki papkaga o'tish

```bash
cd /Users/furb-x/AdminPanel/helper-admin-panel
```

### 2. Dependencies o'rnatish

```bash
npm install
```

### 3. Development serverini ishga tushirish

```bash
npm run dev
```

Server [http://localhost:5173/](http://localhost:5173/) manzilida ochiladi

### 4. Production build

```bash
npm run build
```

### 5. Production preview

```bash
npm run preview
```

## 📊 Mock Data

Loyihada quyidagi mock datalar mavjud:

- **categories**: 9 ta xizmat kategoriyasi
- **users**: 4 ta foydalanuvchi (2 mijoz, 2 usta)
- **orders**: 4 ta buyurtma (turli statuslar)
- **dashboardStats**: Umumiy statistika
- **monthlyData**: 12 oylik data (grafiklar uchun)
- **recentActivity**: So'nggi faoliyatlar

## 🎨 Dizayn Tizimi

### Ranglar

Helper platformasidan olingan ranglar:

- **Primary**: `#0B3CB4` (Blue) - Asosiy rang
- **Secondary**: `#39A053` (Green) - Ikkinchi darajali rang
- **Warning**: `#F59E0B` (Orange) - Ogohlantirish
- **Danger**: `#EF4444` (Red) - Xatolik

### Tailwind Konfiguratsiyasi

```js
colors: {
  primary: '#0B3CB4',
  secondary: '#39A053',
  warning: '#F59E0B',
  danger: '#EF4444',
}
```

## 🔗 Helper Ekotizimi

Bu admin panel quyidagi loyihalar bilan integratsiya qilinadi:

1. **Helper1.0** (Client App)
   - Mijozlar ilovasi
   - React Native + Expo
   - Desktop: `/Users/furb-x/Desktop/Helper1.0`

2. **Helper_Usta1.0** (Service Provider App)
   - Ustalar ilovasi
   - React Native + Expo
   - Desktop: `/Users/furb-x/Desktop/Helper_Usta1.0`

3. **Helper Admin Panel** (Bu loyiha)
   - Web-based admin panel
   - React + Vite
   - AdminPanel: `/Users/furb-x/AdminPanel/helper-admin-panel`

## 📱 Responsive Dizayn

Admin panel barcha qurilmalarda ishlaydi:
- 📱 Mobile (320px+)
- 📲 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🔐 Keyingi Qadamlar

- [ ] Backend API integratsiyasi
- [ ] Authentication (JWT)
- [ ] Real-time updates (WebSocket)
- [ ] To'lovlar sahifasi
- [ ] Sharhlar boshqaruvi
- [ ] Analytics va hisobotlar
- [ ] Export funksiyalari (Excel, PDF)
- [ ] Multi-language support
- [ ] Dark mode

## 👨‍💻 Muallif

Helper Admin Panel - Helper Platform Team

---

**Versiya**: 1.0.0
**Sana**: 2025-12-06
**Status**: MVP (Minimum Viable Product)
