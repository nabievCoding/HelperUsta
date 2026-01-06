import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Star, Phone, MapPin, Award } from 'lucide-react';
import { getMasters, updateMaster } from '../services/dataService';
import { supabase } from '../lib/supabase';
import Modal from '../components/Modal';

const Masters = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState(null);

  // Fetch masters from Supabase
  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async () => {
    try {
      setLoading(true);
      const { data, error } = await getMasters();

      if (error) {
        console.error('Error fetching masters:', error);
        return;
      }

      setMasters(data || []);
    } catch (error) {
      console.error('Error in fetchMasters:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMasters = masters.filter((master) => {
    const matchesSearch =
      master.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      master.phone?.includes(searchTerm) ||
      master.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && master.status === 'active' && master.is_available) ||
      (filterStatus === 'inactive' && (master.status !== 'active' || !master.is_available));

    return matchesSearch && matchesStatus;
  });

  const handleViewClick = (master) => {
    setSelectedMaster(master);
    setIsViewModalOpen(true);
  };

  const toggleProStatus = async (masterId, currentStatus) => {
    try {
      const result = await updateMaster(masterId, { is_pro: !currentStatus });

      if (result.success) {
        // Update local state
        setMasters(masters.map(m =>
          m.id === masterId ? { ...m, is_pro: !currentStatus } : m
        ));
      }
    } catch (error) {
      console.error('Error toggling pro status:', error);
    }
  };

  const stats = {
    total: masters.length,
    active: masters.filter(m => m.status === 'active' && m.is_available).length,
    pro: masters.filter(m => m.is_pro).length,
    inactive: masters.filter(m => m.status !== 'active' || !m.is_available).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ustalar Boshqaruvi</h1>
          <p className="text-gray-500 mt-1">
            Ustalar ro'yxati va to'liq ma'lumotlar
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Jami Ustalar</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Faol</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Pro Ustalar</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pro}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Nofaol</p>
          <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Usta qidirish (ism, telefon, username)..."
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
            <option value="active">Faol</option>
            <option value="inactive">Nofaol</option>
          </select>
        </div>
      </div>

      {/* Masters Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kasb</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reyting</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMasters.map((master) => (
                <tr
                  key={master.id}
                  onClick={() => navigate(`/masters/${master.id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {master.avatar_url ? (
                        <img
                          src={master.avatar_url}
                          alt={master.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {master.full_name?.[0] || 'U'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {master.full_name || 'Noma\'lum'}
                          </p>
                          {master.is_pro && (
                            <Award className="text-yellow-500" size={16} title="Pro Usta" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{master.completed_jobs || 0} ta buyurtma</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{master.profession || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{master.phone || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="text-sm font-medium text-gray-900">
                        {parseFloat(master.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {master.status === 'active' && master.is_available ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        Faol
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        Nofaol
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProStatus(master.id, master.is_pro);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          master.is_pro
                            ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title={master.is_pro ? 'Pro ni olib tashlash' : 'Pro qilish'}
                      >
                        <Award size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewClick(master);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ko'rish"
                      >
                        <Search size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMasters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Ustalar topilmadi</p>
          </div>
        )}
      </div>

      {/* View Master Modal */}
      {selectedMaster && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Usta Ma'lumotlari"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              {selectedMaster.avatar_url ? (
                <img
                  src={selectedMaster.avatar_url}
                  alt={selectedMaster.full_name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {selectedMaster.full_name?.[0] || 'U'}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedMaster.full_name || 'Noma\'lum'}
                  </h3>
                  {selectedMaster.is_pro && (
                    <Award className="text-yellow-500" size={20} />
                  )}
                </div>
                <p className="text-gray-600">{selectedMaster.profession || '-'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={16} />
                  <span className="text-sm font-medium">{parseFloat(selectedMaster.rating || 0).toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({selectedMaster.completed_jobs || 0} buyurtma)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Phone size={16} />
                  <span className="text-sm font-medium">Telefon</span>
                </div>
                <p className="font-semibold text-gray-900">{selectedMaster.phone || '-'}</p>
                {selectedMaster.backup_phone && (
                  <p className="text-sm text-gray-600 mt-1">Zaxira: {selectedMaster.backup_phone}</p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">Manzil</span>
                </div>
                <p className="text-sm text-gray-900">{selectedMaster.address || '-'}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Passport Ma'lumotlari</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-gray-600">Seriya va raqam:</span>
                  <p className="font-medium text-gray-900">
                    {selectedMaster.passport_serial} {selectedMaster.passport_number}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Berilgan sana:</span>
                  <p className="font-medium text-gray-900">
                    {selectedMaster.passport_issue_date || '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-600">Kim tomonidan:</span>
                  <p className="font-medium text-gray-900">
                    {selectedMaster.passport_issued_by || '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Login Ma'lumotlari</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Username:</span>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {selectedMaster.username || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ro'yxatdan o'tgan sana:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedMaster.created_at ? new Date(selectedMaster.created_at).toLocaleDateString('uz-UZ') : '-'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsViewModalOpen(false)}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Yopish
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Masters;
