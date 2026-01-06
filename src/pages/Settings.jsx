import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Shield,
  User,
  Lock,
  Save,
  DollarSign,
  Percent,
  Key
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('commission');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Commission Settings
  const [commissionSettings, setCommissionSettings] = useState({
    commission_rate: 15,
    min_order_amount: 50000,
    max_order_amount: 10000000,
  });

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      // Parse settings from database
      if (data && data.length > 0) {
        data.forEach(setting => {
          if (setting.setting_key === 'commission_rate') {
            setCommissionSettings(prev => ({ ...prev, commission_rate: parseFloat(setting.setting_value) }));
          }
          if (setting.setting_key === 'min_order_amount') {
            setCommissionSettings(prev => ({ ...prev, min_order_amount: parseInt(setting.setting_value) }));
          }
          if (setting.setting_key === 'max_order_amount') {
            setCommissionSettings(prev => ({ ...prev, max_order_amount: parseInt(setting.setting_value) }));
          }
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };


  const saveCommissionSettings = async () => {
    setLoading(true);
    try {
      await Promise.all([
        supabase.from('settings').upsert({
          setting_key: 'commission_rate',
          setting_value: commissionSettings.commission_rate.toString(),
          setting_type: 'number',
          description: 'Platform komissiya foizi',
          updated_at: new Date().toISOString()
        }),
        supabase.from('settings').upsert({
          setting_key: 'min_order_amount',
          setting_value: commissionSettings.min_order_amount.toString(),
          setting_type: 'number',
          description: 'Minimal buyurtma summasi',
          updated_at: new Date().toISOString()
        }),
        supabase.from('settings').upsert({
          setting_key: 'max_order_amount',
          setting_value: commissionSettings.max_order_amount.toString(),
          setting_type: 'number',
          description: 'Maksimal buyurtma summasi',
          updated_at: new Date().toISOString()
        })
      ]);

      setSuccessMessage('Komissiya sozlamalari saqlandi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving commission settings:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          full_name: profileSettings.full_name,
          email: profileSettings.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccessMessage('Profil yangilandi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (profileSettings.new_password !== profileSettings.confirm_password) {
      alert('Parollar mos emas!');
      return;
    }

    if (profileSettings.new_password.length < 6) {
      alert('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');
      return;
    }

    setLoading(true);
    try {
      // First verify current password
      const { data: userData, error: verifyError } = await supabase
        .from('admin_users')
        .select('password')
        .eq('id', user.id)
        .eq('password', profileSettings.current_password)
        .single();

      if (verifyError || !userData) {
        alert('Joriy parol noto\'g\'ri!');
        setLoading(false);
        return;
      }

      // Update password
      const { error } = await supabase
        .from('admin_users')
        .update({
          password: profileSettings.new_password,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccessMessage('Parol o\'zgartirildi!');
      setProfileSettings({
        ...profileSettings,
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'commission', name: 'Komissiya', icon: Percent },
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Xavfsizlik', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sozlamalar</h1>
        <p className="text-gray-600 mt-1">Tizim sozlamalarini boshqarish</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Commission Settings */}
      {activeTab === 'commission' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Komissiya Sozlamalari</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="w-4 h-4 inline mr-2" />
                Komissiya foizi (%)
              </label>
              <input
                type="number"
                value={commissionSettings.commission_rate}
                onChange={(e) => setCommissionSettings({ ...commissionSettings, commission_rate: parseFloat(e.target.value) })}
                className="input"
                min="0"
                max="100"
                step="0.1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Har bir buyurtmadan olinadigan komissiya foizi
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Minimal buyurtma summasi (so'm)
              </label>
              <input
                type="number"
                value={commissionSettings.min_order_amount}
                onChange={(e) => setCommissionSettings({ ...commissionSettings, min_order_amount: parseInt(e.target.value) })}
                className="input"
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Maksimal buyurtma summasi (so'm)
              </label>
              <input
                type="number"
                value={commissionSettings.max_order_amount}
                onChange={(e) => setCommissionSettings({ ...commissionSettings, max_order_amount: parseInt(e.target.value) })}
                className="input"
                min="0"
                step="1000"
              />
            </div>

            <button
              onClick={saveCommissionSettings}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              <Save className="w-5 h-5 inline mr-2" />
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>
      )}

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil Ma'lumotlari</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'liq ism
              </label>
              <input
                type="text"
                value={profileSettings.full_name}
                onChange={(e) => setProfileSettings({ ...profileSettings, full_name: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileSettings.email}
                onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={user?.username || ''}
                className="input bg-gray-100"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Username o'zgartirib bo'lmaydi</p>
            </div>

            <button
              onClick={updateProfile}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              <Save className="w-5 h-5 inline mr-2" />
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Parolni O'zgartirish</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="w-4 h-4 inline mr-2" />
                Joriy parol
              </label>
              <input
                type="password"
                value={profileSettings.current_password}
                onChange={(e) => setProfileSettings({ ...profileSettings, current_password: e.target.value })}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Yangi parol
              </label>
              <input
                type="password"
                value={profileSettings.new_password}
                onChange={(e) => setProfileSettings({ ...profileSettings, new_password: e.target.value })}
                className="input"
                placeholder="••••••••"
              />
              <p className="text-sm text-gray-500 mt-1">Kamida 6 ta belgi</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Parolni tasdiqlash
              </label>
              <input
                type="password"
                value={profileSettings.confirm_password}
                onChange={(e) => setProfileSettings({ ...profileSettings, confirm_password: e.target.value })}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={changePassword}
              disabled={loading || !profileSettings.current_password || !profileSettings.new_password}
              className="btn-primary disabled:opacity-50"
            >
              <Save className="w-5 h-5 inline mr-2" />
              {loading ? 'O\'zgartirilmoqda...' : 'Parolni O\'zgartirish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
