import { useState, useEffect } from 'react';
import { Save, Globe, CreditCard, Bell, Shield, Check } from 'lucide-react';
import { getSettings, updateSetting } from '../services/dataService';

const Settings = () => {
  const [settingsData, setSettingsData] = useState({
    general: {
      siteName: '',
      siteUrl: '',
      contactEmail: '',
      contactPhone: '',
    },
    commission: {
      defaultRate: 10,
      proMasterRate: 8,
      minimumCommission: 50000,
    },
    payment: {
      methods: ['cash', 'card', 'uzum', 'click', 'payme'],
      autoWithdraw: false,
      withdrawalDay: 1,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
    }
  });
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getSettings();

        // getSettings returns an object keyed by setting_key
        const sd = { ...settingsData };

        sd.general.siteName = data?.site_name?.value || sd.general.siteName;
        sd.general.siteUrl = data?.site_url?.value || sd.general.siteUrl;
        sd.general.contactEmail = data?.contact_email?.value || sd.general.contactEmail;
        sd.general.contactPhone = data?.contact_phone?.value || sd.general.contactPhone;

        sd.commission.defaultRate = Number(data?.default_commission_rate?.value) || sd.commission.defaultRate;
        sd.commission.proMasterRate = Number(data?.pro_commission_rate?.value) || sd.commission.proMasterRate;
        sd.commission.minimumCommission = Number(data?.minimum_order_amount?.value) || sd.commission.minimumCommission;

        try {
          sd.payment.methods = JSON.parse(data?.payment_methods?.value || JSON.stringify(sd.payment.methods));
        } catch (e) {
          sd.payment.methods = sd.payment.methods;
        }
        sd.payment.autoWithdraw = (data?.auto_withdraw_enabled?.value === 'true' || data?.auto_withdraw_enabled?.value === true) || sd.payment.autoWithdraw;
        sd.payment.withdrawalDay = Number(data?.withdrawal_day?.value) || sd.payment.withdrawalDay;

        sd.notifications.emailNotifications = (data?.email_notifications?.value === 'true' || data?.email_notifications?.value === true) || sd.notifications.emailNotifications;
        sd.notifications.smsNotifications = (data?.sms_notifications?.value === 'true' || data?.sms_notifications?.value === true) || sd.notifications.smsNotifications;
        sd.notifications.pushNotifications = (data?.push_notifications?.value === 'true' || data?.push_notifications?.value === true) || sd.notifications.pushNotifications;

        setSettingsData(sd);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const { success, error } = await updateSettings(settingsData);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        alert('Xatolik yuz berdi!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sozlamalar</h1>
          <p className="text-gray-500 mt-1">
            Platforma sozlamalarini boshqarish
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            saveSuccess
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-primary hover:bg-blue-700'
          } text-white`}
        >
          {saveSuccess ? (
            <>
              <Check size={20} />
              Saqlandi!
            </>
          ) : (
            <>
              <Save size={20} />
              Saqlash
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="text-green-600" size={20} />
          <p className="text-green-800 font-medium">
            Sozlamalar muvaffaqiyatli saqlandi!
          </p>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Globe className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Umumiy Sozlamalar
            </h2>
            <p className="text-sm text-gray-500">
              Asosiy platforma sozlamalari
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sayt nomi
            </label>
            <input
              type="text"
              value={settingsData.general.siteName}
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  general: { ...settingsData.general, siteName: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sayt URL
            </label>
            <input
              type="text"
              value={settingsData.general.siteUrl}
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  general: { ...settingsData.general, siteUrl: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aloqa Email
              </label>
              <input
                type="email"
                value={settingsData.general.contactEmail}
                onChange={(e) =>
                  setSettingsData({
                    ...settingsData,
                    general: {
                      ...settingsData.general,
                      contactEmail: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aloqa Telefon
              </label>
              <input
                type="tel"
                value={settingsData.general.contactPhone}
                onChange={(e) =>
                  setSettingsData({
                    ...settingsData,
                    general: {
                      ...settingsData.general,
                      contactPhone: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Commission Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-3 rounded-lg">
            <Shield className="text-green-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Komissiya Sozlamalari
            </h2>
            <p className="text-sm text-gray-500">
              To'lov komissiyalari va stavkalari
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standart stavka (%)
            </label>
            <input
              type="number"
              value={settingsData.commission.defaultRate}
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  commission: {
                    ...settingsData.commission,
                    defaultRate: parseInt(e.target.value),
                  },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pro usta stavkasi (%)
            </label>
            <input
              type="number"
              value={settingsData.commission.proMasterRate}
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  commission: {
                    ...settingsData.commission,
                    proMasterRate: parseInt(e.target.value),
                  },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimal komissiya (so'm)
            </label>
            <input
              type="number"
              value={settingsData.commission.minimumCommission}
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  commission: {
                    ...settingsData.commission,
                    minimumCommission: parseInt(e.target.value),
                  },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <CreditCard className="text-purple-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              To'lov Sozlamalari
            </h2>
            <p className="text-sm text-gray-500">
              To'lov usullari va parametrlari
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To'lov usullari
            </label>
            <div className="flex flex-wrap gap-2">
              {['card', 'cash', 'uzum', 'click', 'payme'].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settingsData.payment.methods.includes(method)}
                    onChange={(e) => {
                      const methods = e.target.checked
                        ? [...settingsData.payment.methods, method]
                        : settingsData.payment.methods.filter((m) => m !== method);
                      setSettingsData({
                        ...settingsData,
                        payment: { ...settingsData.payment, methods },
                      });
                    }}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 capitalize">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settingsData.payment.autoWithdraw}
                onChange={(e) =>
                  setSettingsData({
                    ...settingsData,
                    payment: {
                      ...settingsData.payment,
                      autoWithdraw: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Avtomatik pul yechish
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pul yechish kuni (oyning)
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={settingsData.payment.withdrawalDay}
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  payment: {
                    ...settingsData.payment,
                    withdrawalDay: parseInt(e.target.value),
                  },
                })
              }
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Bell className="text-orange-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Bildirishnoma Sozlamalari
            </h2>
            <p className="text-sm text-gray-500">
              Xabarnoma turlari va parametrlari
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settingsData.notifications.emailNotifications}
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  notifications: {
                    ...settingsData.notifications,
                    emailNotifications: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              Email bildirishnomalar
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settingsData.notifications.smsNotifications}
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  notifications: {
                    ...settingsData.notifications,
                    smsNotifications: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              SMS bildirishnomalar
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settingsData.notifications.pushNotifications}
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  notifications: {
                    ...settingsData.notifications,
                    pushNotifications: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              Push bildirishnomalar
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
