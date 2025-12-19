import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Users,
  UserCog,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Activity,
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
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMasters: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
    newMastersThisMonth: 0,
    ordersThisMonth: 0,
    revenueThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get current month start date
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch all data in parallel
      const [
        { count: usersCount },
        { count: newUsersCount },
        { count: mastersCount },
        { count: newMastersCount },
        { count: ordersCount },
        { data: revenueData },
        { count: ordersThisMonthCount },
        { data: revenueThisMonthData },
      ] = await Promise.all([
        // Users
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),

        // Masters
        supabase.from('masters').select('*', { count: 'exact', head: true }),
        supabase.from('masters').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),

        // Orders
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price').eq('status', 'completed'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
        supabase.from('orders').select('total_price').eq('status', 'completed').gte('created_at', monthStart.toISOString()),
      ]);

      const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) || 0;
      const revenueThisMonth = revenueThisMonthData?.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalMasters: mastersCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue: totalRevenue,
        newUsersThisMonth: newUsersCount || 0,
        newMastersThisMonth: newMastersCount || 0,
        ordersThisMonth: ordersThisMonthCount || 0,
        revenueThisMonth: revenueThisMonth,
      });

      // Fetch monthly data for charts (in parallel with stats)
      await fetchMonthlyChartData();

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchMonthlyChartData = async () => {
    try {
      const now = new Date();
      const monthsData = [];

      // Prepare all month ranges
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        monthsData.push({
          name: date.toLocaleString('uz-UZ', { month: 'short' }),
          date,
          nextDate,
        });
      }

      // Fetch all months data in parallel
      const results = await Promise.all(
        monthsData.map(async ({ name, date, nextDate }) => {
          const [
            { count: ordersCount },
            { data: revenueData },
          ] = await Promise.all([
            supabase
              .from('orders')
              .select('*', { count: 'exact', head: true })
              .gte('created_at', date.toISOString())
              .lt('created_at', nextDate.toISOString()),
            supabase
              .from('orders')
              .select('total_price')
              .eq('status', 'completed')
              .gte('created_at', date.toISOString())
              .lt('created_at', nextDate.toISOString()),
          ]);

          const revenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) || 0;

          return {
            month: name,
            orders: ordersCount || 0,
            revenue: Math.round(revenue),
          };
        })
      );

      setMonthlyData(results);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const statCards = [
    {
      title: 'Foydalanuvchilar',
      value: stats.totalUsers,
      change: `+${stats.newUsersThisMonth} bu oy`,
      icon: Users,
      color: 'bg-blue-500',
      trend: stats.newUsersThisMonth > 0 ? 'up' : 'neutral',
      link: '/users',
    },
    {
      title: 'Ustalar',
      value: stats.totalMasters,
      change: `+${stats.newMastersThisMonth} bu oy`,
      icon: UserCog,
      color: 'bg-green-500',
      trend: stats.newMastersThisMonth > 0 ? 'up' : 'neutral',
      link: '/masters',
    },
    {
      title: 'Buyurtmalar',
      value: stats.totalOrders,
      change: `${stats.ordersThisMonth} bu oy`,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      trend: stats.ordersThisMonth > 0 ? 'up' : 'neutral',
      link: '/orders',
    },
    {
      title: 'Daromad',
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      change: `${(stats.revenueThisMonth / 1000000).toFixed(1)}M bu oy`,
      icon: DollarSign,
      color: 'bg-purple-500',
      trend: stats.revenueThisMonth > 0 ? 'up' : 'neutral',
      link: '/orders',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="card hover:shadow-lg transition-all cursor-pointer hover:scale-105 duration-200"
            onClick={() => navigate(stat.link)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <Activity className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-4 rounded-xl`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyurtmalar Statistikasi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#0B3CB4" strokeWidth={2} name="Buyurtmalar" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daromad Statistikasi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#39A053" name="Daromad (so'm)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
