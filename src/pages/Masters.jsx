import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Shield, Award, Clock, Phone, MapPin, Star, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

export default function Masters() {
  const navigate = useNavigate();
  const [masters, setMasters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMasters();
    fetchCategories();
  }, []);

  const fetchMasters = async () => {
    try {
      const { data, error } = await supabase
        .from('masters')
        .select(`
          *,
          categories (
            name,
            key
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMasters(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching masters:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, key')
        .eq('is_active', true);

      if (error) throw error;

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleMasterStatus = async (masterId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

      const { error } = await supabase
        .from('masters')
        .update({ status: newStatus })
        .eq('id', masterId);

      if (error) throw error;

      fetchMasters();
    } catch (error) {
      console.error('Error updating master status:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const toggleVerification = async (masterId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('masters')
        .update({ is_verified: !currentStatus })
        .eq('id', masterId);

      if (error) throw error;

      fetchMasters();
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const togglePro = async (masterId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('masters')
        .update({ is_pro: !currentStatus })
        .eq('id', masterId);

      if (error) throw error;

      fetchMasters();
    } catch (error) {
      console.error('Error updating Pro status:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const filteredMasters = masters.filter(master => {
    const matchesSearch =
      master.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      master.phone?.includes(searchQuery) ||
      master.profession?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || master.category_id === filterCategory;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && master.status === 'active') ||
      (filterStatus === 'inactive' && master.status !== 'active');

    return matchesSearch && matchesCategory && matchesStatus;
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
          <h1 className="text-2xl font-bold text-gray-900">Ustalar</h1>
          <p className="text-gray-600 mt-1">Jami {filteredMasters.length} ta usta</p>
        </div>
        <button
          onClick={() => navigate('/masters/new')}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Yangi usta qo'shish
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input"
          >
            <option value="all">Barcha kategoriyalar</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="all">Barcha statuslar</option>
            <option value="active">Faol</option>
            <option value="inactive">Nofaol</option>
          </select>
        </div>
      </div>

      {/* Masters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMasters.map((master) => (
          <div
            key={master.id}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/masters/${master.id}`)}
          >
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {master.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {master.full_name || 'Noma\'lum'}
                </h3>
                <p className="text-sm text-gray-600">{master.profession}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {master.categories?.name || 'Kategoriyasiz'}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {master.is_verified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  <Shield className="w-3 h-3" />
                  Verified
                </span>
              )}
              {master.is_pro && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  <Award className="w-3 h-3" />
                  Pro
                </span>
              )}
              {master.is_insured && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <Shield className="w-3 h-3" />
                  Insured
                </span>
              )}
              {master.is_24_7_available && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  <Clock className="w-3 h-3" />
                  24/7
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {master.rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Reyting</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {master.completed_jobs || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Bajarilgan</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">
                  {master.review_count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Sharh</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {master.phone}
              </div>
              {master.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{master.address}</span>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mt-4">
              {master.status === 'active' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" />
                  Faol
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  <XCircle className="w-3 h-3" />
                  Nofaol
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVerification(master.id, master.is_verified);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  master.is_verified
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {master.is_verified ? 'Verified' : 'Verify'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePro(master.id, master.is_pro);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  master.is_pro
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {master.is_pro ? 'Pro ✓' : 'Make Pro'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMasterStatus(master.id, master.status);
                }}
                className={`col-span-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  master.status === 'active'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {master.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMasters.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">Ustalar topilmadi</p>
        </div>
      )}
    </div>
  );
}
