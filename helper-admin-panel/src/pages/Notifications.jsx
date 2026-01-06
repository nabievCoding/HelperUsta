import { useState, useEffect } from 'react';
import {
  Bell,
  ShoppingBag,
  CreditCard,
  Star,
  UserPlus,
  Settings as SettingsIcon,
  CheckCircle,
  Trash2,
  Send,
} from 'lucide-react';
import { getNotifications, markNotificationAsRead } from '../services/dataService';
import { useNotificationsSubscription } from '../hooks/useRealtimeSubscription';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Realtime subscription for new notifications
  useNotificationsSubscription((newNotification) => {
    console.log('New notification received:', newNotification);
    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/logo.png',
      });
    }
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await getNotifications();
        if (!error && data) {
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.priority === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    const icons = {
      new_order: <ShoppingBag size={20} className="text-blue-500" />,
      payment: <CreditCard size={20} className="text-green-500" />,
      review: <Star size={20} className="text-yellow-500" />,
      user_registered: <UserPlus size={20} className="text-purple-500" />,
      system: <SettingsIcon size={20} className="text-gray-500" />,
    };
    return icons[type] || <Bell size={20} className="text-gray-500" />;
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700',
    };
    const labels = {
      high: 'Yuqori',
      medium: 'O\'rtacha',
      low: 'Past',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const formatTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diff = now - notificationDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} daqiqa oldin`;
    if (hours < 24) return `${hours} soat oldin`;
    return `${days} kun oldin`;
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const { success } = await markNotificationAsRead(notificationId);
      if (success) {
        const updatedNotifications = notifications.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true, read: true } : notif
        );
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    setNotifications(updatedNotifications);
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
          <h1 className="text-3xl font-bold text-gray-900">Bildirishnomalar</h1>
          <p className="text-gray-500 mt-1">
            Tizim bildirish nomalarini boshqarish
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Send size={20} />
          Yangi bildirishnoma
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Jami</p>
          <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">O'qilmagan</p>
          <p className="text-3xl font-bold text-blue-600">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Yuqori ustuvorlik</p>
          <p className="text-3xl font-bold text-red-600">
            {notifications.filter((n) => n.priority === 'high').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Bugun</p>
          <p className="text-3xl font-bold text-green-600">
            {
              notifications.filter((n) => {
                const today = new Date().toDateString();
                return new Date(n.date).toDateString() === today;
              }).length
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hammasi
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            O'qilmagan ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'read'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            O'qilgan
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'high'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yuqori ustuvorlik
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'medium'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            O'rtacha ustuvorlik
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow ${
              notification.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                {getIcon(notification.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getPriorityBadge(notification.priority)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {formatTime(notification.date)}
                  </p>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        title="O'qilgan deb belgilash"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Bildirishnomalar topilmadi</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
