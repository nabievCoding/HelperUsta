import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Star,
  Calendar,
  User,
  Shield,
  Trophy,
  Heart,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const MasterProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [master, setMaster] = useState(null);
  const [availableBadges, setAvailableBadges] = useState([
    {
      id: 'pro',
      name: 'Pro',
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'Professional ustalar uchun',
    },
    {
      id: 'our_pride',
      name: 'Bizning Faxrimiz',
      icon: '🏆',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: "Eng yaxshi va ishonchli ustalar uchun",
    },
    {
      id: 'verified',
      name: 'Tasdiqlangan',
      icon: '✓',
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Identifikatsiya tasdiqlangan',
    },
    {
      id: 'expert',
      name: 'Mutaxassis',
      icon: '💎',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: '5+ yillik tajriba',
    },
    {
      id: 'top_rated',
      name: "Top Reyting",
      icon: '🌟',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: '4.8+ reyting',
    },
    {
      id: 'fast_worker',
      name: 'Tezkor',
      icon: '⚡',
      color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      description: 'Tez va sifatli xizmat',
    },
    {
      id: 'reliable',
      name: 'Ishonchli',
      icon: '🛡️',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description: 'Yuqori ishonch darajasi',
    },
    {
      id: 'customer_favorite',
      name: 'Mijozlar Sevimchisi',
      icon: '❤️',
      color: 'bg-pink-100 text-pink-800 border-pink-300',
      description: "Ko'p takroriy mijozlar",
    },
  ]);

  // Load master data from localStorage
  useEffect(() => {
    const savedMasters = localStorage.getItem('masters');
    if (savedMasters) {
      const mastersData = JSON.parse(savedMasters);
      const foundMaster = mastersData.find((m) => m.id === parseInt(id));
      if (foundMaster) {
        // Initialize badges array if not exists
        if (!foundMaster.badges) {
          foundMaster.badges = [];
        }
        setMaster(foundMaster);
      } else {
        navigate('/masters');
      }
    } else {
      navigate('/masters');
    }
  }, [id, navigate]);

  const handleToggleBadge = (badgeId) => {
    if (!master) return;

    const updatedMaster = { ...master };
    if (!updatedMaster.badges) {
      updatedMaster.badges = [];
    }

    const badgeIndex = updatedMaster.badges.indexOf(badgeId);
    if (badgeIndex > -1) {
      // Remove badge
      updatedMaster.badges.splice(badgeIndex, 1);
    } else {
      // Add badge
      updatedMaster.badges.push(badgeId);
    }

    // Update state
    setMaster(updatedMaster);

    // Update localStorage
    const savedMasters = localStorage.getItem('masters');
    if (savedMasters) {
      const mastersData = JSON.parse(savedMasters);
      const masterIndex = mastersData.findIndex((m) => m.id === parseInt(id));
      if (masterIndex > -1) {
        mastersData[masterIndex] = updatedMaster;
        localStorage.setItem('masters', JSON.stringify(mastersData));
      }
    }
  };

  const hasBadge = (badgeId) => {
    return master?.badges?.includes(badgeId) || false;
  };

  if (!master) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/masters')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Usta Profili
            </h1>
            <p className="text-gray-500 mt-1">
              To'liq ma'lumot va ko'rsatkichlar
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {master.isPro && (
            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium border border-yellow-300">
              <Award size={16} />
              PRO
            </span>
          )}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              master.status === 'active'
                ? 'bg-green-100 text-green-800'
                : master.status === 'inactive'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {master.status === 'active'
              ? 'Faol'
              : master.status === 'inactive'
              ? 'Nofaol'
              : 'Bloklangan'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-6">
              <img
                src={master.avatar || `https://i.pravatar.cc/150?u=${master.id}`}
                alt={master.name}
                className="w-32 h-32 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {master.firstName} {master.lastName}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={18} />
                    <span>{master.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={18} />
                    <span>{master.phone}</span>
                  </div>
                  {master.backupPhone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={18} />
                      <span>{master.backupPhone} (Zaxira)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={18} />
                    <span>{master.email || 'Email ko\'rsatilmagan'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>{master.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Kirish ma'lumotlari
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Login</p>
                  <p className="font-mono font-medium text-gray-900">
                    {master.username}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Parol</p>
                  <p className="font-mono font-medium text-gray-900">
                    {master.password}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Passport Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CreditCard className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Pasport ma'lumotlari
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Seria va raqam</p>
                <p className="font-medium text-gray-900">
                  {master.passportSerial} {master.passportNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Berilgan sana</p>
                <p className="font-medium text-gray-900">
                  {master.passportIssueDate}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Kim tomonidan berilgan</p>
                <p className="font-medium text-gray-900">
                  {master.passportIssuedBy}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Statistika
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Buyurtmalar</span>
                  <CheckCircle className="text-blue-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {master.totalOrders || 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Reyting</span>
                  <Star className="text-yellow-500" size={20} fill="currentColor" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {master.rating || '5.0'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Sharhlar</span>
                  <Star className="text-purple-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {master.reviews || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Badges */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Trophy className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Nishonlar va yutuqlar
                </h3>
                <p className="text-sm text-gray-500">
                  {master.badges?.length || 0} ta nishon berilgan
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {availableBadges.map((badge) => {
                const isActive = hasBadge(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                      isActive
                        ? `${badge.color} border-opacity-100`
                        : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleToggleBadge(badge.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{badge.name}</h4>
                          {isActive ? (
                            <CheckCircle size={18} className="flex-shrink-0" />
                          ) : (
                            <XCircle size={18} className="flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs opacity-80">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Nishonni berish yoki olib tashlash uchun ustiga bosing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterProfile;
