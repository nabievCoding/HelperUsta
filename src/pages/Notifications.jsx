import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Bell, Send, Trash2, Users, UserCog } from 'lucide-react';
import { format } from 'date-fns';

const typeColors = {
  order: 'bg-blue-100 text-blue-700',
  payment: 'bg-green-100 text-green-700',
  system: 'bg-purple-100 text-purple-700',
  promo: 'bg-orange-100 text-orange-700',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    user_type: 'all',
    type: 'system',
    title: '',
    message: '',
    priority: 'normal',
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setNotifications(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const sendNotification = async (e) => {
    e.preventDefault();

    try {
      // Create notification
      const { error } = await supabase.from('notifications').insert({
        user_type: formData.user_type,
        type: formData.type,
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        is_read: false,
      });

      if (error) throw error;

      alert('Bildirishnoma muvaffaqiyatli yuborildi!');
      setShowCreateModal(false);
      setFormData({
        user_type: 'all',
        type: 'system',
        title: '',
        message: '',
        priority: 'normal',
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const deleteNotification = async (id) => {
    if (!confirm('Bildirishnomani o\'chirishni xohlaysizmi?')) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Xatolik yuz berdi');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bildirishnomalar</h1>
          <p className="text-gray-600 mt-1">Jami {notifications.length} ta bildirishnoma</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Yangi yuborish
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-primary-50 rounded-xl">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        typeColors[notification.type]
                      }`}
                    >
                      {notification.type}
                    </span>
                    {notification.priority === 'high' && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                        Muhim
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      {notification.user_type === 'user' ? (
                        <>
                          <Users className="w-4 h-4" />
                          Foydalanuvchilar
                        </>
                      ) : notification.user_type === 'master' ? (
                        <>
                          <UserCog className="w-4 h-4" />
                          Ustalar
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          Hammaga
                        </>
                      )}
                    </span>
                    <span>
                      {notification.created_at
                        ? format(new Date(notification.created_at), 'dd.MM.yyyy HH:mm')
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteNotification(notification.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="card text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Bildirishnomalar topilmadi</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Yangi bildirishnoma
            </h2>

            <form onSubmit={sendNotification} className="space-y-4">
              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kimga yuborish
                </label>
                <select
                  value={formData.user_type}
                  onChange={(e) =>
                    setFormData({ ...formData, user_type: e.target.value })
                  }
                  className="input"
                  required
                >
                  <option value="all">Hammaga</option>
                  <option value="user">Foydalanuvchilarga</option>
                  <option value="master">Ustalarga</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Turi
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="input"
                  required
                >
                  <option value="system">Tizim</option>
                  <option value="order">Buyurtma</option>
                  <option value="payment">To'lov</option>
                  <option value="promo">Aksiya</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Muhimlik darajasi
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="input"
                  required
                >
                  <option value="normal">Oddiy</option>
                  <option value="high">Muhim</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sarlavha
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input"
                  placeholder="Bildirishnoma sarlavhasi"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xabar
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="input"
                  rows={4}
                  placeholder="Bildirishnoma matni..."
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Bekor qilish
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
