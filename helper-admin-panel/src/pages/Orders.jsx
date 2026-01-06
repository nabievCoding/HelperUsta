import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, Clock, CheckCircle, XCircle, Activity, MapPin, Phone, Mail, User } from 'lucide-react';
import * as dataService from '../services/dataService';
import Modal from '../components/Modal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data, error } = await dataService.getOrders();
        if (!error && data) {
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const q = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (order.clientName || '').toLowerCase().includes(q) ||
      (order.masterName || '').toLowerCase().includes(q) ||
      (order.service || '').toLowerCase().includes(q) ||
      (order.id !== undefined && order.id !== null && order.id.toString().includes(q));

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || order.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-700' },
      in_progress: { label: 'Jarayonda', color: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Bajarilgan', color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Bekor qilingan', color: 'bg-red-100 text-red-700' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'in_progress':
        return <Activity className="text-blue-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const categories = ['all', 'Santexnik', 'Elektrik', 'Ta\'mirlash'];

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    in_progress: orders.filter((o) => o.status === 'in_progress').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleDownloadReport = () => {
    // Create CSV content
    const csvHeaders = ['ID', 'Xizmat', 'Kategoriya', 'Mijoz', 'Usta', 'Sana', 'Vaqt', 'Status', 'Narx', 'Komissiya'];
    const csvRows = filteredOrders.map(order => [
      order.id,
      order.service,
      order.category,
      order.clientName,
      order.masterName,
      order.date,
      order.time,
      order.status,
      order.price,
      order.commission || 0
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `buyurtmalar_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h1 className="text-3xl font-bold text-gray-900">Buyurtmalar</h1>
          <p className="text-gray-500 mt-1">
            Barcha buyurtmalarni kuzatish va boshqarish
          </p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          Hisobotni yuklash
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Jami</p>
          <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Kutilmoqda</p>
          <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Jarayonda</p>
          <p className="text-2xl font-bold text-blue-600">{orderStats.in_progress}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Bajarilgan</p>
          <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Bekor qilingan</p>
          <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
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

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Barcha statuslar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="in_progress">Jarayonda</option>
            <option value="completed">Bajarilgan</option>
            <option value="cancelled">Bekor qilingan</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Barcha kategoriyalar</option>
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xizmat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mijoz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vaqt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Narx
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.service}</div>
                    <div className="text-sm text-gray-500">{order.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.masterName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.date}</div>
                    <div className="text-sm text-gray-500">{order.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.price.toLocaleString()} so'm
                    </div>
                    {order.commission && (
                      <div className="text-xs text-gray-500">
                        Komissiya: {order.commission.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Buyurtmalar topilmadi</p>
          </div>
        )}
      </div>

      {/* View Order Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Buyurtma Tafsilotlari"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order ID and Status */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Buyurtma ID</p>
                <p className="text-xl font-bold text-gray-900">#{selectedOrder.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedOrder.status)}
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>

            {/* Service Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Xizmat Ma'lumotlari</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Xizmat:</span>
                  <span className="font-medium text-gray-900">{selectedOrder.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategoriya:</span>
                  <span className="font-medium text-gray-900">{selectedOrder.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sana:</span>
                  <span className="font-medium text-gray-900">{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vaqt:</span>
                  <span className="font-medium text-gray-900">{selectedOrder.time}</span>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mijoz Ma'lumotlari</h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ism:</p>
                    <p className="font-medium text-gray-900">{selectedOrder.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Telefon:</p>
                    <p className="font-medium text-gray-900">+998 90 123 45 67</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Manzil:</p>
                    <p className="font-medium text-gray-900">Toshkent, Chilonzor tumani</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Master Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Usta Ma'lumotlari</h3>
              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ism:</p>
                    <p className="font-medium text-gray-900">{selectedOrder.masterName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Telefon:</p>
                    <p className="font-medium text-gray-900">+998 91 234 56 78</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email:</p>
                    <p className="font-medium text-gray-900">master@helper.uz</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">To'lov Ma'lumotlari</h3>
              <div className="bg-yellow-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Xizmat narxi:</span>
                  <span className="font-bold text-gray-900">{selectedOrder.price.toLocaleString()} so'm</span>
                </div>
                {selectedOrder.commission && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Komissiya:</span>
                    <span className="font-medium text-orange-600">{selectedOrder.commission.toLocaleString()} so'm</span>
                  </div>
                )}
                <div className="pt-2 border-t border-yellow-200 flex justify-between">
                  <span className="font-semibold text-gray-900">Jami:</span>
                  <span className="font-bold text-xl text-gray-900">
                    {(selectedOrder.price + (selectedOrder.commission || 0)).toLocaleString()} so'm
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
