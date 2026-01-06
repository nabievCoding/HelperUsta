import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getDashboardStats, getMonthlyChartData, getRecentActivity } from '../services/dataService';
import Modal from '../components/Modal';

const Dashboard = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, monthly, activity] = await Promise.all([
          getDashboardStats(),
          getMonthlyChartData(12),
          getRecentActivity(10),
        ]);

        setDashboardStats(stats);
        setMonthlyData(monthly);
        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  // Show loading state
  if (loading || !dashboardStats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      id: 'users',
      title: 'Jami Foydalanuvchilar',
      value: dashboardStats.totalUsers.toLocaleString(),
      change: dashboardStats.usersChange || '+12%',
      icon: Users,
      color: 'bg-blue-500',
      details: {
        total: dashboardStats.totalUsers,
        clients: dashboardStats.totalClients,
        masters: dashboardStats.totalMasters,
        activeToday: dashboardStats.activeMasters || 0,
        newThisMonth: 45,
      }
    },
    {
      id: 'masters',
      title: 'Jami Ustalar',
      value: dashboardStats.totalMasters.toLocaleString(),
      change: dashboardStats.mastersChange || '+8%',
      icon: UserCheck,
      color: 'bg-green-500',
      details: {
        total: dashboardStats.totalMasters,
        active: dashboardStats.activeMasters || 0,
        pro: dashboardStats.proMasters || 0,
        newThisMonth: 12,
        avgRating: dashboardStats.avgMasterRating || 0,
      }
    },
    {
      id: 'orders',
      title: 'Faol Buyurtmalar',
      value: dashboardStats.activeOrders.toLocaleString(),
      change: dashboardStats.ordersChange || '+23%',
      icon: ShoppingBag,
      color: 'bg-orange-500',
      details: {
        total: dashboardStats.totalOrders,
        active: dashboardStats.activeOrders,
        completed: dashboardStats.completedOrders,
        cancelled: dashboardStats.cancelledOrders,
        pending: dashboardStats.activeOrders,
      }
    },
    {
      id: 'revenue',
      title: 'Oylik Daromad',
      value: `${(dashboardStats.monthlyRevenue / 1000000).toFixed(1)}M`,
      change: dashboardStats.revenueChange || '+15%',
      icon: DollarSign,
      color: 'bg-purple-500',
      details: {
        monthly: dashboardStats.monthlyRevenue,
        total: dashboardStats.totalRevenue,
        commission: dashboardStats.totalCommission || 0,
        avgOrder: dashboardStats.avgOrderValue || 0,
        todayRevenue: dashboardStats.todayRevenue || 0,
      }
    },
  ];

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setIsStatModalOpen(true);
  };

  const formatCurrency = (value) => {
    return `${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Platformaning umumiy ko'rinishi va statistikasi
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => handleStatClick(stat)}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp size={16} />
                  {stat.change}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <Eye size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Oylik Daromad
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis tickFormatter={formatCurrency} stroke="#6b7280" />
              <Tooltip
                formatter={(value) => `${value.toLocaleString()} so'm`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0B3CB4"
                strokeWidth={2}
                name="Daromad"
              />
              <Line
                type="monotone"
                dataKey="commission"
                stroke="#39A053"
                strokeWidth={2}
                name="Komissiya"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Oylik Buyurtmalar
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill="#0B3CB4" name="Buyurtmalar" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={20} />
            So'nggi Faoliyat
          </h3>
          <button className="text-sm text-primary hover:underline">
            Hammasini ko'rish
          </button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Activity className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Jami Buyurtmalar
          </h4>
          <p className="text-3xl font-bold text-gray-900">
            {dashboardStats.totalOrders.toLocaleString()}
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bajarilgan</span>
              <span className="font-medium text-green-600">
                {dashboardStats.completedOrders.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bekor qilingan</span>
              <span className="font-medium text-red-600">
                {dashboardStats.cancelledOrders.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Jami Daromad
          </h4>
          <p className="text-3xl font-bold text-gray-900">
            {(dashboardStats.totalRevenue / 1000000).toFixed(1)}M
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Komissiya</span>
              <span className="font-medium text-primary">
                {(dashboardStats.commission / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Foydalanuvchilar
          </h4>
          <p className="text-3xl font-bold text-gray-900">
            {dashboardStats.totalUsers.toLocaleString()}
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mijozlar</span>
              <span className="font-medium text-blue-600">
                {dashboardStats.totalClients.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ustalar</span>
              <span className="font-medium text-green-600">
                {dashboardStats.totalMasters.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Details Modal */}
      <Modal
        isOpen={isStatModalOpen}
        onClose={() => setIsStatModalOpen(false)}
        title={selectedStat ? `${selectedStat.title} - To'liq Hisobot` : ''}
      >
        {selectedStat && (
          <div className="space-y-6">
            {/* Summary */}
            <div className={`${selectedStat.color} bg-opacity-10 rounded-lg p-6`}>
              <div className="flex items-center gap-4">
                <div className={`${selectedStat.color} p-4 rounded-lg`}>
                  <selectedStat.icon className="text-white" size={32} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{selectedStat.title}</p>
                  <h3 className="text-4xl font-bold text-gray-900">{selectedStat.value}</h3>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    {selectedStat.change} bu oyda
                  </p>
                </div>
              </div>
            </div>

            {/* Users Details */}
            {selectedStat.id === 'users' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Foydalanuvchilar Tafsiloti</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Jami</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedStat.details.total}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Mijozlar</p>
                    <p className="text-2xl font-bold text-green-600">{selectedStat.details.clients}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Ustalar</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedStat.details.masters}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Bugun faol</p>
                    <p className="text-2xl font-bold text-yellow-600">{selectedStat.details.activeToday}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Bu oy yangi foydalanuvchilar</span>
                    <span className="font-bold text-gray-900">+{selectedStat.details.newThisMonth}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Masters Details */}
            {selectedStat.id === 'masters' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Ustalar Tafsiloti</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Jami Ustalar</p>
                    <p className="text-2xl font-bold text-green-600">{selectedStat.details.total}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Faol</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedStat.details.active}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Pro Ustalar</p>
                    <p className="text-2xl font-bold text-yellow-600">{selectedStat.details.pro}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">O'rtacha Reyting</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedStat.details.avgRating}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Bu oy yangi ustalar</span>
                    <span className="font-bold text-gray-900">+{selectedStat.details.newThisMonth}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Details */}
            {selectedStat.id === 'orders' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Buyurtmalar Tafsiloti</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag size={16} className="text-gray-600" />
                      <p className="text-sm text-gray-600">Jami</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedStat.details.total}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-blue-600" />
                      <p className="text-sm text-gray-600">Faol</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{selectedStat.details.active}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <p className="text-sm text-gray-600">Bajarilgan</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{selectedStat.details.completed}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle size={16} className="text-red-600" />
                      <p className="text-sm text-gray-600">Bekor qilingan</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{selectedStat.details.cancelled}</p>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Kutilmoqda</span>
                    <span className="font-bold text-yellow-600">{selectedStat.details.pending}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Details */}
            {selectedStat.id === 'revenue' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Daromad Tafsiloti</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Oylik Daromad</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {(selectedStat.details.monthly / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Jami Daromad</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(selectedStat.details.total / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Komissiya</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(selectedStat.details.commission / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">O'rtacha Buyurtma</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {(selectedStat.details.avgOrder / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Bugungi daromad</span>
                    <span className="font-bold text-gray-900">
                      {selectedStat.details.todayRevenue.toLocaleString()} so'm
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsStatModalOpen(false)}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Yopish
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
