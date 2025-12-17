# Netlify Functions

Bu loyihadagi Netlify serverless funksiyalar.

## Mavjud Funksiyalar

### 1. hello.js
Oddiy test funksiyasi - GET va POST requestlarni qabul qiladi.

**Endpoint:** `/.netlify/functions/hello` yoki `/api/hello`

**Misol:**
```bash
# GET request
curl https://your-site.netlify.app/api/hello

# POST request
curl -X POST https://your-site.netlify.app/api/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

### 2. api.js
Supabase bilan integratsiya uchun funksiya - CRUD operatsiyalar.

**Endpoint:** `/.netlify/functions/api` yoki `/api/api`

**Eslatma:** `your_table_name` ni o'z jadval nomingiz bilan almashtiring.

## Lokal Testlash

```bash
# Netlify Dev muhitida ishga tushirish
npm run dev:netlify
```

Bu sizning loyihangizni `http://localhost:8888` da ishga tushiradi va funksiyalar `http://localhost:8888/.netlify/functions/` da mavjud bo'ladi.

## Deploy qilish

```bash
# Netlify CLI orqali deploy qilish
netlify deploy

# Production ga deploy qilish
netlify deploy --prod
```

## Environment Variables

Netlify dashboard orqali quyidagi environment variables ni sozlang:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
