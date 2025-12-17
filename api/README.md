# Vercel Serverless Functions

Bu loyihadagi Vercel serverless funksiyalar.

## Mavjud Funksiyalar

### 1. hello.js
Oddiy test funksiyasi - GET va POST requestlarni qabul qiladi.

**Endpoint:** `/api/hello`

**Misol:**
```bash
# GET request
curl https://your-site.vercel.app/api/hello

# POST request
curl -X POST https://your-site.vercel.app/api/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

### 2. supabase.js
Supabase bilan integratsiya uchun funksiya - CRUD operatsiyalar.

**Endpoint:** `/api/supabase`

**CRUD Operatsiyalar:**
- GET - Ma'lumotlarni olish
- POST - Yangi yozuv yaratish
- PUT - Yozuvni yangilash
- DELETE - Yozuvni o'chirish

**Eslatma:** `your_table_name` ni o'z jadval nomingiz bilan almashtiring.

## Lokal Testlash

```bash
# Vercel CLI o'rnatish (agar o'rnatilmagan bo'lsa)
npm i -g vercel

# Development server
vercel dev
```

## Deploy qilish

### GitHub orqali (tavsiya etiladi):

1. GitHub repository yaratish va code push qilish
2. [Vercel Dashboard](https://vercel.com/dashboard) ga kirish
3. "Add New Project" tugmasini bosish
4. GitHub repository ni tanlash
5. Environment Variables qo'shish:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. "Deploy" tugmasini bosish

### CLI orqali:

```bash
# Vercel CLI orqali deploy qilish
vercel

# Production ga deploy qilish
vercel --prod
```

## Environment Variables

Vercel dashboard → Settings → Environment Variables da quyidagilarni sozlang:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key

## Frontend da Ishlatish

```javascript
import { testHelloFunction, getData, createRecord } from './utils/api';

// Test function
const result = await testHelloFunction();

// Get data from Supabase
const data = await getData();

// Create new record
const newRecord = await createRecord({ name: 'John', email: 'john@example.com' });
```
