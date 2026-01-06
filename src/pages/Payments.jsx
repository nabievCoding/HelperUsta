import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Download, DollarSign, CreditCard, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const statusNames = {
  completed: 'To\'langan',
  pending: 'Kutilmoqda',
  failed: 'Xato',
  refunded: 'Qaytarilgan',
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalCommission: 0,
    totalMasterEarnings: 0,
    completedCount: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          orders (
            order_number,
            service_name,
            client_name,
            master_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPayments(data || []);

      // Calculate stats
      const completed = data?.filter(p => p.status === 'completed') || [];
      const totalAmount = completed.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      const totalCommission = completed.reduce((sum, p) => sum + parseFloat(p.commission || 0), 0);
      const totalMasterEarnings = completed.reduce((sum, p) => sum + parseFloat(p.master_earnings || 0), 0);

      setStats({
        totalAmount,
        totalCommission,
        totalMasterEarnings,
        completedCount: completed.length,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orders?.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orders?.client_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">To'lovlar</h1>
          <p className="text-gray-600 mt-1">Jami {filteredPayments.length} ta to'lov</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Umumiy summa</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {(stats.totalAmount / 1000000).toFixed(1)}M
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Komissiya</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {(stats.totalCommission / 1000000).toFixed(1)}M
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Usta daromadi</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {(stats.totalMasterEarnings / 1000000).toFixed(1)}M
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">To'langan</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.completedCount}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Transaction ID, buyurtma raqami yoki mijoz..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input md:w-48"
          >
            <option value="all">Barcha statuslar</option>
            <option value="completed">To'langan</option>
            <option value="pending">Kutilmoqda</option>
            <option value="failed">Xato</option>
            <option value="refunded">Qaytarilgan</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Buyurtma
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Mijoz
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Usta
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Summa
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Komissiya
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  To'lov usuli
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Sana
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">
                      {payment.transaction_id || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        #{payment.orders?.order_number || '-'}
                      </div>
                      <div className="text-gray-500">
                        {payment.orders?.service_name || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {payment.orders?.client_name || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {payment.orders?.master_name || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">
                        {((payment.amount || 0) / 1000).toFixed(0)}K so'm
                      </div>
                      <div className="text-xs text-gray-500">
                        Usta: {((payment.master_earnings || 0) / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-red-600">
                      {((payment.commission || 0) / 1000).toFixed(0)}K
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">
                      {payment.payment_method || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.created_at
                        ? format(new Date(payment.created_at), 'dd.MM.yyyy')
                        : '-'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.completed_at
                        ? format(new Date(payment.completed_at), 'HH:mm')
                        : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[payment.status]
                      }`}
                    >
                      {payment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {payment.status === 'pending' && <Clock className="w-3 h-3" />}
                      {payment.status === 'failed' && <XCircle className="w-3 h-3" />}
                      {statusNames[payment.status] || payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">To'lovlar topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
