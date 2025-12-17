import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Users,
  UserCog,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
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

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: newUsersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      // Fetch masters count
      const { count: mastersCount } = await supabase
        .from('masters')
        .select('*', { count: 'exact', head: true });

      const { count: newMastersCount } = await supabase
        .from('masters')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      // Fetch orders count and revenue
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) || 0;

      const { count: ordersThisMonthCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      const { data: revenueThisMonthData } = await supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'completed')
        .gte('created_at', monthStart.toISOString());

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

      // Fetch monthly data for charts (last 6 months)
      await fetchMonthlyChartData();

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchMonthlyChartData = async () => {
    try {
      const months = [];
      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

        const monthName = date.toLocaleString('uz-UZ', { month: 'short' });

        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        const { data: revenueData } = await supabase
          .from('orders')
          .select('total_price')
          .eq('status', 'completed')
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        const revenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) || 0;

        months.push({
          month: monthName,
          orders: ordersCount || 0,
          revenue: Math.round(revenue),
        });
      }

      setMonthlyData(months);
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
    },
    {
      title: 'Ustalar',
      value: stats.totalMasters,
      change: `+${stats.newMastersThisMonth} bu oy`,
      icon: UserCog,
      color: 'bg-green-500',
      trend: stats.newMastersThisMonth > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Buyurtmalar',
      value: stats.totalOrders,
      change: `${stats.ordersThisMonth} bu oy`,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      trend: stats.ordersThisMonth > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Daromad',
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      change: `${(stats.revenueThisMonth / 1000000).toFixed(1)}M bu oy`,
      icon: DollarSign,
      color: 'bg-purple-500',
      trend: stats.revenueThisMonth > 0 ? 'up' : 'neutral',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card hover:shadow-lg transition-shadow">
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
