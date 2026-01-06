import { useState, useEffect } from 'react';
import { Search, Download, CreditCard, Banknote, CheckCircle, Clock } from 'lucide-react';
import { getPayments } from '../services/dataService';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const { data, error } = await getPayments();
        if (!error && data) {
          setPayments(data);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const q = (searchTerm || '').toLowerCase();

    const clientName = (payment.userName || payment.clientName || payment.client_name || '').toString();
    const masterName = (payment.masterName || payment.master_name || '').toString();
    const txnId = (payment.transactionId || payment.transaction_id || payment.transaction || '').toString();

    const matchesSearch =
      clientName.toLowerCase().includes(q) ||
      masterName.toLowerCase().includes(q) ||
      txnId.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'all' || (payment.status || '').toString() === filterStatus;
    const method = payment.paymentMethod || payment.payment_method || '';
    const matchesMethod = filterMethod === 'all' || method === filterMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalCommission = payments.reduce((sum, p) => sum + (p.commission || 0), 0);
  const completedPayments = payments.filter((p) => p.status === 'completed');
  const pendingPayments = payments.filter((p) => p.status === 'pending');

  const getStatusBadge = (status) => {
    return status === 'completed' ? (
      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        <CheckCircle size={14} />
        To'landi
      </span>
    ) : (
      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
        <Clock size={14} />
        Kutilmoqda
      </span>
    );
  };

  const getMethodIcon = (method) => {
    return method === 'card' ? (
      <CreditCard className="text-blue-500" size={20} />
    ) : (
      <Banknote className="text-green-500" size={20} />
    );
  };

  const getMethodLabel = (method) => {
    const labels = {
      card: 'Karta',
      cash: 'Naqd',
      uzum: 'Uzum',
      click: 'Click',
      payme: 'Payme',
    };
    return labels[method] || method;
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
          <h1 className="text-3xl font-bold text-gray-900">To'lovlar</h1>
          <p className="text-gray-500 mt-1">
            Barcha to'lovlarni kuzatish va boshqarish
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Download size={20} />
          Hisobotni yuklash
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Jami To'lovlar</p>
          <p className="text-3xl font-bold text-gray-900">
            {(totalAmount / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-gray-500 mt-1">{payments.length} ta to'lov</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Jami Komissiya</p>
          <p className="text-3xl font-bold text-green-600">
            {(totalCommission / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs text-gray-500 mt-1">10% o'rtacha</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">To'langan</p>
          <p className="text-3xl font-bold text-green-600">
            {completedPayments.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Kutilmoqda</p>
          <p className="text-3xl font-bold text-yellow-600">
            {pendingPayments.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Barcha statuslar</option>
            <option value="completed">To'langan</option>
            <option value="pending">Kutilmoqda</option>
          </select>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Barcha usullar</option>
            <option value="card">Karta</option>
            <option value="cash">Naqd</option>
            <option value="uzum">Uzum</option>
            <option value="click">Click</option>
            <option value="payme">Payme</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mijoz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Summa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Komissiya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.transactionId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.masterName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(payment.amount || 0).toLocaleString()} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {(payment.commission || 0).toLocaleString()} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getMethodIcon(payment.paymentMethod || payment.payment_method)}
                      <span className="text-sm text-gray-900">
                        {getMethodLabel(payment.paymentMethod || payment.payment_method)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(payment.date || payment.createdAt || payment.completedAt || payment.created_at).toLocaleString('uz-UZ')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">To'lovlar topilmadi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
