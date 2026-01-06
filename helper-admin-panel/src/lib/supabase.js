// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are configured
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn('⚠️ Supabase URL yoki Key topilmadi! Mock data ishlatiladi.');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'Yo\'q');
}

// Create Supabase client
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Test connection function
export const testSupabaseConnection = async () => {
  if (!supabase) {
    return { connected: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return { connected: false, error: error.message };
    }
    
    console.log('✅ Supabase connected successfully!');
    return { connected: true, error: null };
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return { connected: false, error: error.message };
  }
};

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabase);
};

// Helper function to safely execute Supabase queries
export const safeSupabaseQuery = async (queryFn, fallbackValue = []) => {
  if (!supabase) {
    console.warn('Supabase not configured, returning fallback value');
    return fallbackValue;
  }

  try {
    return await queryFn();
  } catch (error) {
    console.error('Supabase query error:', error);
    return fallbackValue;
  }
};

// Default export
export default {
  supabase,
  testSupabaseConnection,
  isSupabaseConfigured,
  safeSupabaseQuery,
};