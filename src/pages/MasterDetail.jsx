import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Star,
  Briefcase,
  Clock,
  DollarSign,
  Shield,
  Award,
  CheckCircle,
  Image as ImageIcon,
  Calendar,
  User,
  Mail,
  CreditCard,
  TrendingUp,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
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

export default function MasterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [master, setMaster] = useState(null);
  const [category, setCategory] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderReview, setOrderReview] = useState(null);

  useEffect(() => {
    fetchMasterData();
  }, [id]);

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

  const fetchMasterData = async () => {
    try {
      // Fetch master details
      const { data: masterData, error: masterError } = await supabase
        .from('masters')
        .select('*')
        .eq('id', id)
        .single();

      if (masterError) throw masterError;
      setMaster(masterData);

      // Fetch category
      if (masterData.category_id) {
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', masterData.category_id)
          .single();
        setCategory(catData);
      }

      // Fetch portfolio
      const { data: portfolioData } = await supabase
        .from('master_portfolio')
        .select('*')
        .eq('master_id', id)
        .order('created_at', { ascending: false });
      setPortfolio(portfolioData || []);

      // Fetch services
      const { data: servicesData } = await supabase
        .from('master_services')
        .select('*')
        .eq('master_id', id)
        .eq('is_active', true);
      setServices(servicesData || []);

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('master_id', id)
        .order('created_at', { ascending: false })
        .limit(10);
      setReviews(reviewsData || []);

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('master_id', id)
        .order('created_at', { ascending: false })
        .limit(10);
      setOrders(ordersData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching master data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!master) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Usta topilmadi</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Umumiy', icon: User },
    { id: 'services', name: 'Xizmatlar', icon: Briefcase },
    { id: 'portfolio', name: 'Portfolio', icon: ImageIcon },
    { id: 'reviews', name: 'Sharhlar', icon: MessageSquare },
    { id: 'orders', name: 'Buyurtmalar', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/masters')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Orqaga
      </button>

      {/* Master Header Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {master.profile_photo ? (
              <img
                src={master.profile_photo}
                alt={master.full_name}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold">
                {master.full_name?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          {/* Master Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {master.full_name}
                </h1>
                <p className="text-lg text-gray-600 mb-3">{master.profession}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {master.is_verified && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Tasdiqlangan
                    </span>
                  )}
                  {master.is_pro && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      PRO
                    </span>
                  )}
                  {master.is_insured && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Sug'urtalangan
                    </span>
                  )}
                  {master.is_24_7_available && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      24/7
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className={`px-4 py-2 rounded-lg font-medium ${
                master.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {master.status === 'active' ? 'Faol' : 'Nofaol'}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{master.rating || 0}</p>
                  <p className="text-xs text-gray-600">{master.review_count || 0} sharh</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{master.completed_jobs || 0}</p>
                  <p className="text-xs text-gray-600">Bajarilgan</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{master.experience_years || 0}</p>
                  <p className="text-xs text-gray-600">Yillik tajriba</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{master.response_rate || 0}%</p>
                  <p className="text-xs text-gray-600">Javob berish</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                {master.phone}
              </div>
              {master.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {master.email}
                </div>
              )}
              {master.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {master.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {master.bio && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Haqida</h3>
            <p className="text-gray-700">{master.bio}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Professional Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kasbiy Ma'lumotlar</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Kategoriya:</span>
                <span className="font-medium text-gray-900">{category?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kasb:</span>
                <span className="font-medium text-gray-900">{master.profession || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tajriba:</span>
                <span className="font-medium text-gray-900">{master.experience_years || 0} yil</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Soatlik tarif:</span>
                <span className="font-medium text-gray-900">{master.hourly_rate?.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bajarilgan ishlar:</span>
                <span className="font-medium text-gray-900">{master.completed_jobs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Javob berish tezligi:</span>
                <span className="font-medium text-gray-900">{master.response_rate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bajarish tezligi:</span>
                <span className="font-medium text-gray-900">{master.completion_rate || 0}%</span>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Moliyaviy Ma'lumotlar</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Jami daromad:</span>
                <span className="font-medium text-green-600 text-lg">
                  {master.total_earned?.toLocaleString() || 0} so'm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium text-gray-900">{master.username || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ro'yxatdan o'tgan sana:</span>
                <span className="font-medium text-gray-900">
                  {master.registration_date ? format(new Date(master.registration_date), 'dd.MM.yyyy') : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Passport Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Passport Ma'lumotlari</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Seriya va raqam:</span>
                <span className="font-medium text-gray-900">
                  {master.passport_serial} {master.passport_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Berilgan sana:</span>
                <span className="font-medium text-gray-900">
                  {master.passport_issue_date ? format(new Date(master.passport_issue_date), 'dd.MM.yyyy') : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kim tomonidan:</span>
                <span className="font-medium text-gray-900">{master.passport_issued_by || '-'}</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bog'lanish Ma'lumotlari</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Telefon:</span>
                <span className="font-medium text-gray-900">{master.phone}</span>
              </div>
              {master.backup_phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Qo'shimcha telefon:</span>
                  <span className="font-medium text-gray-900">{master.backup_phone}</span>
                </div>
              )}
              {master.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{master.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Manzil:</span>
                <span className="font-medium text-gray-900 text-right">{master.address || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service.id} className="card">
                <h3 className="font-semibold text-gray-900 mb-2">{service.service_name}</h3>
                {service.description && (
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {service.price?.toLocaleString()} so'm
                  </span>
                  {service.duration && (
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration} daqiqa
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              Xizmatlar topilmadi
            </div>
          )}
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.length > 0 ? (
            portfolio.map((item) => (
              <div key={item.id} className="card p-0 overflow-hidden">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  {item.photo_url ? (
                    <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  {item.title && <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>}
                  {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              Portfolio topilmadi
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">{review.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {review.created_at ? format(new Date(review.created_at), 'dd.MM.yyyy HH:mm') : ''}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    review.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : review.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {review.status === 'approved' ? 'Tasdiqlangan' : review.status === 'pending' ? 'Kutilmoqda' : 'Rad etilgan'}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              Sharhlar topilmadi
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Buyurtma #{order.order_number}
                    </h3>
                    <p className="text-sm text-gray-600">{order.service_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.created_at ? format(new Date(order.created_at), 'dd.MM.yyyy HH:mm') : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {order.total_price?.toLocaleString()} so'm
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {order.status === 'completed' ? 'Bajarilgan' :
                       order.status === 'in_progress' ? 'Jarayonda' :
                       order.status === 'pending' ? 'Kutilmoqda' : 'Bekor qilingan'}
                    </span>
                  </div>
                </div>
                {order.client_name && (
                  <p className="text-sm text-gray-600">
                    Mijoz: {order.client_name}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              Buyurtmalar topilmadi
            </div>
          )}
        </div>
      )}

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
              <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                {statusNames[selectedOrder.status]}
              </span>
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
    </div>
  );
}
