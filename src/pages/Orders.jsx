import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Filter, Calendar, DollarSign, MapPin, User, UserCog, Package, Star, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusNames = {
  pending: 'Kutilmoqda',
  accepted: 'Qabul qilingan',
  in_progress: 'Bajarilmoqda',
  completed: 'Bajarildi',
  cancelled: 'Bekor qilindi',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all'); // 'all', 'call_center', 'direct'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderReview, setOrderReview] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [masters, setMasters] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [assignPrice, setAssignPrice] = useState('');

  useEffect(() => {
    fetchOrders();

    // Real-time subscription for orders
    const subscription = supabase
      .channel('orders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
      }, (payload) => {
        console.log('Order change received:', payload);

        if (payload.eventType === 'UPDATE') {
          // Update the specific order in the list
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === payload.new.id ? payload.new : order
            )
          );

          // If the updated order is currently selected, update it too
          if (selectedOrder && selectedOrder.id === payload.new.id) {
            setSelectedOrder(payload.new);
          }
        } else if (payload.eventType === 'INSERT') {
          // Add new order to the list
          setOrders(prevOrders => [payload.new, ...prevOrders]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const fetchOrderReview = async (orderId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching review:', error);
      }

      setOrderReview(data || null);
    } catch (error) {
      console.error('Error fetching review:', error);
      setOrderReview(null);
    }
  };

  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    if (order.status === 'completed') {
      await fetchOrderReview(order.id);
    } else {
      setOrderReview(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.master_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    // Call Center filter: check if order_source is 'call_center' or if master_id is null (admin buyurtma)
    const matchesSource =
      filterSource === 'all' ||
      (filterSource === 'call_center' && (order.order_source === 'call_center' || !order.master_id)) ||
      (filterSource === 'direct' && order.order_source !== 'call_center' && order.master_id);

    return matchesSearch && matchesStatus && matchesSource;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    call_center: orders.filter(o => o.order_source === 'call_center' || !o.master_id).length,
  };

  const fetchMasters = async (categoryId) => {
    try {
      const { data, error } = await supabase
        .from('masters')
        .select('id, full_name, phone, hourly_rate, profession, rating')
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setMasters(data || []);
    } catch (error) {
      console.error('Error fetching masters:', error);
      setMasters([]);
    }
  };

  const handleAssignMaster = async () => {
    if (!selectedMaster || !assignPrice || !selectedOrder) return;

    try {
      const priceValue = parseFloat(assignPrice) * 1000;

      // Get master details
      const master = masters.find(m => m.id === selectedMaster);
      if (!master) {
        alert('Usta topilmadi');
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({
          master_id: selectedMaster,
          master_name: master.full_name,
          master_profession: master.profession,
          base_price: priceValue,
          total_price: priceValue,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order =>
        order.id === selectedOrder.id
          ? {
              ...order,
              master_id: selectedMaster,
              master_name: master.full_name,
              master_profession: master.profession,
              base_price: priceValue,
              total_price: priceValue,
              status: 'accepted',
              accepted_at: new Date().toISOString()
            }
          : order
      ));

      setSelectedOrder(null);
      setShowAssignModal(false);
      setSelectedMaster(null);
      setAssignPrice('');

      alert('Usta muvaffaqiyatli biriktirildi!');
    } catch (error) {
      console.error('Error assigning master:', error);
      alert('Ustani biriktrishda xatolik yuz berdi');
    }
  };

  const handleMasterSelect = (masterId) => {
    setSelectedMaster(masterId);
    const master = masters.find(m => m.id === masterId);
    if (master && master.hourly_rate) {
      // Auto-fill price based on master's hourly rate
      setAssignPrice((master.hourly_rate / 1000).toString());
    }
  };

  const openAssignModal = async (order) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
    await fetchMasters(order.category_id);
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
          <h1 className="text-2xl font-bold text-gray-900">Buyurtmalar</h1>
          <p className="text-gray-600 mt-1">Jami {filteredOrders.length} ta buyurtma</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div
          className="card text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 duration-200"
          onClick={() => setFilterStatus('all')}
        >
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600 mt-1">Jami</p>
        </div>
        <div
          className="card text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 duration-200 bg-blue-50"
          onClick={() => { setFilterStatus('all'); setFilterSource('call_center'); }}
        >
          <p className="text-2xl font-bold text-blue-600">{stats.call_center}</p>
          <p className="text-sm text-gray-600 mt-1">Call Center</p>
        </div>
        <div
          className="card text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 duration-200"
          onClick={() => setFilterStatus('pending')}
        >
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600 mt-1">Kutilmoqda</p>
        </div>
        <div
          className="card text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 duration-200"
          onClick={() => setFilterStatus('in_progress')}
        >
          <p className="text-2xl font-bold text-purple-600">{stats.in_progress}</p>
          <p className="text-sm text-gray-600 mt-1">Jarayonda</p>
        </div>
        <div
          className="card text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 duration-200"
          onClick={() => setFilterStatus('completed')}
        >
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-gray-600 mt-1">Bajarildi</p>
        </div>
        <div
          className="card text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 duration-200"
          onClick={() => setFilterStatus('cancelled')}
        >
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-sm text-gray-600 mt-1">Bekor qilindi</p>
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
              placeholder="Buyurtma raqami, mijoz yoki usta bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Source Filter */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="input md:w-48"
          >
            <option value="all">Barcha manba</option>
            <option value="call_center">Call Center</option>
            <option value="direct">To'g'ridan-to'g'ri</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input md:w-48"
          >
            <option value="all">Barcha statuslar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="accepted">Qabul qilingan</option>
            <option value="in_progress">Bajarilmoqda</option>
            <option value="completed">Bajarildi</option>
            <option value="cancelled">Bekor qilindi</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
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
                  Xizmat
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Summa
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
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleOrderClick(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.order_number}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.created_at ? format(new Date(order.created_at), 'dd.MM.yyyy HH:mm') : '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                        {order.client_name?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.client_name || 'Noma\'lum'}
                        </div>
                        <div className="text-xs text-gray-500">{order.client_phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium">
                        {order.master_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.master_name || 'Tayinlanmagan'}
                        </div>
                        <div className="text-xs text-gray-500">{order.master_profession}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {order.service_name}
                      </div>
                      <div className="text-xs text-gray-500">{order.category_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {((order.total_price || 0) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-500">
                      Komissiya: {((order.commission_amount || 0) / 1000).toFixed(0)}K
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.scheduled_date ? format(new Date(order.scheduled_date), 'dd.MM.yyyy') : '-'}
                    </div>
                    <div className="text-xs text-gray-500">{order.scheduled_time || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusNames[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Buyurtmalar topilmadi</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Buyurtma #{selectedOrder.order_number}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                  {statusNames[selectedOrder.status]}
                </span>
                {(selectedOrder.order_source === 'call_center' || !selectedOrder.master_id) && selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => openAssignModal(selectedOrder)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <UserCog className="w-4 h-4" />
                    Usta belgilash
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Service Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Xizmat ma'lumotlari</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Kategoriya:</span> <span className="font-medium">{selectedOrder.category_name}</span></p>
                  <p><span className="text-gray-600">Xizmat:</span> <span className="font-medium">{selectedOrder.service_name}</span></p>
                  {selectedOrder.service_description && (
                    <p><span className="text-gray-600">Tavsif:</span> <span className="font-medium">{selectedOrder.service_description}</span></p>
                  )}
                </div>
              </div>

              {/* Client & Master Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mijoz</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedOrder.client_name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.client_phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Usta</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedOrder.master_name || 'Tayinlanmagan'}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.master_profession}</p>
                  </div>
                </div>
              </div>

              {/* Schedule & Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vaqt va manzil</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Sana:</span> <span className="font-medium">{selectedOrder.scheduled_date ? format(new Date(selectedOrder.scheduled_date), 'dd.MM.yyyy') : '-'}</span></p>
                  <p><span className="text-gray-600">Vaqt:</span> <span className="font-medium">{selectedOrder.scheduled_time || '-'}</span></p>
                  <p><span className="text-gray-600">Davomiyligi:</span> <span className="font-medium">{selectedOrder.duration_hours || 0} soat</span></p>
                  <p><span className="text-gray-600">Manzil:</span> <span className="font-medium">{selectedOrder.address}</span></p>
                  {selectedOrder.apartment_number && (
                    <p><span className="text-gray-600">Xonadon:</span> <span className="font-medium">{selectedOrder.apartment_number}</span></p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Narxlar</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asosiy narx:</span>
                    <span className="font-medium">{((selectedOrder.base_price || 0) / 1000).toFixed(0)}K so'm</span>
                  </div>
                  {selectedOrder.materials_cost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Materiallar:</span>
                      <span className="font-medium">{((selectedOrder.materials_cost || 0) / 1000).toFixed(0)}K so'm</span>
                    </div>
                  )}
                  {selectedOrder.additional_charges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Qo'shimcha to'lovlar:</span>
                      <span className="font-medium">{((selectedOrder.additional_charges || 0) / 1000).toFixed(0)}K so'm</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Komissiya ({selectedOrder.commission_rate}%):</span>
                    <span className="font-medium text-red-600">-{((selectedOrder.commission_amount || 0) / 1000).toFixed(0)}K so'm</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                    <span className="text-lg font-semibold">Jami:</span>
                    <span className="text-lg font-bold text-primary">{((selectedOrder.total_price || 0) / 1000).toFixed(0)}K so'm</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {(selectedOrder.user_notes || selectedOrder.master_notes) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Eslatmalar</h3>
                  {selectedOrder.user_notes && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">Mijoz:</p>
                      <p className="text-sm">{selectedOrder.user_notes}</p>
                    </div>
                  )}
                  {selectedOrder.master_notes && (
                    <div>
                      <p className="text-sm text-gray-600">Usta:</p>
                      <p className="text-sm">{selectedOrder.master_notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Cancellation Reason */}
              {selectedOrder.status === 'cancelled' && selectedOrder.cancellation_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Bekor qilish sababi</h3>
                      <p className="text-red-800">{selectedOrder.cancellation_reason}</p>
                      {selectedOrder.cancelled_by && (
                        <p className="text-sm text-red-600 mt-2">
                          Bekor qilgan: {selectedOrder.cancelled_by === 'user' ? 'Mijoz' : 'Usta'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Review Section */}
              {selectedOrder.status === 'completed' && orderReview && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Sharh</h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < orderReview.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-gray-900">{orderReview.rating}/5</span>
                      </div>

                      {/* Comment */}
                      {orderReview.comment && (
                        <div className="mb-3">
                          <p className="text-gray-800">{orderReview.comment}</p>
                        </div>
                      )}

                      {/* Photos */}
                      {orderReview.photos && orderReview.photos.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <ImageIcon className="w-4 h-4" />
                            Biriktirilgan rasmlar ({orderReview.photos.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {orderReview.photos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={photo}
                                  alt={`Review photo ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(photo, '_blank')}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Review Date */}
                      <p className="text-xs text-gray-600 mt-3">
                        Sharh qoldirilgan: {orderReview.created_at ? format(new Date(orderReview.created_at), 'dd.MM.yyyy HH:mm') : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* No Review Message */}
              {selectedOrder.status === 'completed' && !orderReview && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Bu buyurtma uchun hali sharh qoldirilmagan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Master Modal */}
      {showAssignModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAssignModal(false);
            setSelectedMaster(null);
            setAssignPrice('');
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Usta belgilash</h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedMaster(null);
                  setAssignPrice('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Order Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-black">Buyurtma</p>
                    <p className="font-semibold text-black">#{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black">Xizmat</p>
                    <p className="font-semibold text-black">{selectedOrder.service_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black">Mijoz</p>
                    <p className="font-semibold text-black">{selectedOrder.client_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black">Telefon</p>
                    <p className="font-semibold text-black">{selectedOrder.client_phone}</p>
                  </div>
                </div>
              </div>

              {/* Master Selection */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Usta tanlang
                </label>
                {masters.length === 0 ? (
                  <div className="text-center py-8 text-black">
                    <UserCog className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Bu kategoriya uchun ustalar topilmadi</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {masters.map((master) => (
                      <div
                        key={master.id}
                        onClick={() => handleMasterSelect(master.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedMaster === master.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-black">{master.full_name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm text-black">{master.rating?.toFixed(1) || '0.0'}</span>
                              </div>
                            </div>
                            <p className="text-sm text-black">{master.profession}</p>
                            <p className="text-xs text-black">{master.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-black">Chaqiruv narxi:</p>
                            <p className="text-lg font-bold text-blue-600">
                              {((master.hourly_rate || 0) / 1000).toFixed(0)}K
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Input */}
              {selectedMaster && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Narx (ming so'm)
                  </label>
                  <input
                    type="number"
                    value={assignPrice}
                    onChange={(e) => setAssignPrice(e.target.value)}
                    placeholder="Masalan: 150"
                    className="input w-full text-black"
                    min="0"
                    step="1"
                  />
                  <p className="text-xs text-black mt-1">
                    {assignPrice ? `${parseInt(assignPrice || 0)} ming so'm` : 'Narxni kiriting yoki o\'zgartiring'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedMaster(null);
                    setAssignPrice('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleAssignMaster}
                  disabled={!selectedMaster || !assignPrice}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Qabul qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
