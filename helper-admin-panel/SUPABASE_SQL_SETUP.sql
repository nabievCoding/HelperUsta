-- Helper Platform - Supabase Test Data Setup
-- Run these queries in Supabase SQL Editor to populate the database with test data

-- ================================================
-- 1. CREATE ADMIN USER
-- ================================================
INSERT INTO admin_users (id, username, email, password, full_name, role, is_active, created_at)
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@helper.uz',
  'admin123',  -- In production, this should be hashed!
  'Admin User',
  'super_admin',
  true,
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ================================================
-- 2. CREATE CATEGORIES
-- ================================================
INSERT INTO categories (id, name, name_uz_latin, name_uz_cyrillic, name_ru, icon, key, is_active, total_masters, active_orders, created_at)
VALUES
  (gen_random_uuid(), 'Plumber', 'Santexnik', 'Сантехник', 'Сантехник', 'droplet', 'plumber', true, 25, 8, NOW()),
  (gen_random_uuid(), 'Electrician', 'Elektrik', 'Электрик', 'Электрик', 'zap', 'electrician', true, 20, 5, NOW()),
  (gen_random_uuid(), 'Repair', 'Ta''mirlash', 'Таъмирлаш', 'Ремонт', 'wrench', 'repair', true, 30, 12, NOW()),
  (gen_random_uuid(), 'Cleaning', 'Tozalash', 'Тозалаш', 'Уборка', 'sparkles', 'cleaning', true, 15, 6, NOW()),
  (gen_random_uuid(), 'Gardening', 'Bog''bonchilik', 'Боғбончилик', 'Садоводство', 'leaf', 'gardening', true, 10, 3, NOW()),
  (gen_random_uuid(), 'Chef', 'Oshpaz', 'Ошпаз', 'Повар', 'chef-hat', 'chef', true, 12, 4, NOW()),
  (gen_random_uuid(), 'Carpenter', 'Duradgor', 'Дурадгор', 'Плотник', 'hammer', 'carpenter', true, 18, 7, NOW()),
  (gen_random_uuid(), 'Painter', 'Bo''yoqchi', 'Бўёқчи', 'Маляр', 'paintbrush', 'painter', true, 22, 9, NOW())
ON CONFLICT (key) DO NOTHING;

-- ================================================
-- 3. CREATE TEST USERS (Clients)
-- ================================================
INSERT INTO users (id, phone, full_name, is_active, is_blocked, total_orders, total_spent, registration_date, created_at)
VALUES
  (gen_random_uuid(), '+998901234567', 'Alisher Karimov', true, false, 5, 850000, NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months'),
  (gen_random_uuid(), '+998901234568', 'Nodira Rahimova', true, false, 3, 450000, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
  (gen_random_uuid(), '+998901234569', 'Jasur Toshmatov', true, false, 8, 1200000, NOW() - INTERVAL '4 months', NOW() - INTERVAL '4 months'),
  (gen_random_uuid(), '+998901234570', 'Dilnoza Azimova', true, false, 2, 300000, NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month'),
  (gen_random_uuid(), '+998901234571', 'Sardor Qodirov', true, false, 12, 2100000, NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months')
ON CONFLICT (phone) DO NOTHING;

-- ================================================
-- 4. CREATE TEST MASTERS
-- ================================================
-- Get category IDs
DO $$
DECLARE
  cat_plumber_id UUID;
  cat_electrician_id UUID;
  cat_repair_id UUID;
  cat_cleaning_id UUID;
  cat_chef_id UUID;
BEGIN
  SELECT id INTO cat_plumber_id FROM categories WHERE key = 'plumber' LIMIT 1;
  SELECT id INTO cat_electrician_id FROM categories WHERE key = 'electrician' LIMIT 1;
  SELECT id INTO cat_repair_id FROM categories WHERE key = 'repair' LIMIT 1;
  SELECT id INTO cat_cleaning_id FROM categories WHERE key = 'cleaning' LIMIT 1;
  SELECT id INTO cat_chef_id FROM categories WHERE key = 'chef' LIMIT 1;

  INSERT INTO masters (id, phone, username, password, full_name, profession, category_id,
                       is_verified, is_insured, is_pro, is_24_7_available, rating, review_count,
                       completed_jobs, total_earned, status, is_available, created_at)
  VALUES
    (gen_random_uuid(), '+998901111111', 'aziz_santexnik', 'pass123', 'Aziz Yusupov', 'Santexnik',
     cat_plumber_id, true, true, true, true, 4.9, 156, 320, 8500000, 'active', true, NOW() - INTERVAL '10 months'),

    (gen_random_uuid(), '+998901111112', 'jahongir_elektrik', 'pass123', 'Jahongir Alimov', 'Elektrik',
     cat_electrician_id, true, true, true, false, 4.8, 142, 280, 6800000, 'active', true, NOW() - INTERVAL '8 months'),

    (gen_random_uuid(), '+998901111113', 'rustam_tamir', 'pass123', 'Rustam Xamidov', 'Ta''mirlash',
     cat_repair_id, true, false, false, false, 4.6, 98, 210, 4200000, 'active', true, NOW() - INTERVAL '6 months'),

    (gen_random_uuid(), '+998901111114', 'madina_tozalash', 'pass123', 'Madina Ismoilova', 'Tozalash',
     cat_cleaning_id, true, true, false, true, 4.7, 124, 265, 3900000, 'active', true, NOW() - INTERVAL '7 months'),

    (gen_random_uuid(), '+998901111115', 'dilshod_oshpaz', 'pass123', 'Dilshod Rahmonov', 'Oshpaz',
     cat_chef_id, true, true, true, true, 5.0, 234, 456, 15600000, 'active', true, NOW() - INTERVAL '12 months')
  ON CONFLICT (phone) DO NOTHING;
END $$;

-- ================================================
-- 5. CREATE TEST ORDERS
-- ================================================
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  master1_id UUID;
  master2_id UUID;
  cat1_id UUID;
BEGIN
  SELECT id INTO user1_id FROM users WHERE phone = '+998901234567' LIMIT 1;
  SELECT id INTO user2_id FROM users WHERE phone = '+998901234568' LIMIT 1;
  SELECT id INTO master1_id FROM masters WHERE username = 'aziz_santexnik' LIMIT 1;
  SELECT id INTO master2_id FROM masters WHERE username = 'jahongir_elektrik' LIMIT 1;
  SELECT id INTO cat1_id FROM categories WHERE key = 'plumber' LIMIT 1;

  INSERT INTO orders (id, order_number, user_id, master_id, category_id,
                     service_name, scheduled_date, scheduled_time, status, payment_status,
                     base_price, total_price, commission_rate, commission_amount,
                     address, created_at)
  VALUES
    (gen_random_uuid(), 'HLP-2024-00001', user1_id, master1_id, cat1_id,
     'Santexnika ta''mirlash', CURRENT_DATE + 1, '10:00', 'new', 'pending',
     150000, 150000, 10.00, 15000,
     'Toshkent, Yunusobod 5-mavze 12-uy', NOW()),

    (gen_random_uuid(), 'HLP-2024-00002', user2_id, master2_id, cat1_id,
     'Elektr simlarini almashtirish', CURRENT_DATE + 2, '14:00', 'accepted', 'pending',
     200000, 200000, 10.00, 20000,
     'Toshkent, Chilonzor 9-kvartal 3-uy', NOW())
  ON CONFLICT (order_number) DO NOTHING;
END $$;

-- ================================================
-- 6. CREATE TEST NOTIFICATIONS
-- ================================================
INSERT INTO notifications (id, user_type, type, title, message, priority, is_read, created_at)
VALUES
  (gen_random_uuid(), 'admin', 'new_order', 'Yangi buyurtma',
   'Alisher Karimov yangi buyurtma yaratdi', 'high', false, NOW() - INTERVAL '5 minutes'),

  (gen_random_uuid(), 'admin', 'payment', 'To''lov qabul qilindi',
   '150,000 so''m to''lov qabul qilindi', 'medium', false, NOW() - INTERVAL '1 hour'),

  (gen_random_uuid(), 'admin', 'review', 'Yangi sharh',
   'Alisher Karimov 5 yulduzli sharh qoldirdi', 'low', true, NOW() - INTERVAL '2 hours'),

  (gen_random_uuid(), 'admin', 'user_registration', 'Yangi foydalanuvchi',
   'Yangi usta ro''yxatdan o''tdi: Aziz Yusupov', 'medium', true, NOW() - INTERVAL '1 day'),

  (gen_random_uuid(), 'admin', 'system', 'Tizim yangilanishi',
   'Tizim yangilanishi rejalashtirilgan', 'high', true, NOW() - INTERVAL '2 days');

-- ================================================
-- 7. VERIFY DATA
-- ================================================
SELECT 'Admin Users' as table_name, COUNT(*) as count FROM admin_users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Masters', COUNT(*) FROM masters
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;

-- ================================================
-- NOTES:
-- ================================================
-- After running this script, you can login with:
-- Email: admin@helper.uz
-- Password: admin123
--
-- WARNING: In production, passwords should be properly hashed using bcrypt or similar!
-- This is just for testing purposes.
