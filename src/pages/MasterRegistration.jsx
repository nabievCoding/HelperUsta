import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Upload, Save } from 'lucide-react';

export default function MasterRegistration() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    phone: '',
    backup_phone: '',
    full_name: '',
    bio: '',

    // Professional Info
    category_id: '',
    profession: '',
    experience_years: '',
    hourly_rate: '',

    // Passport Info
    passport_serial: '',
    passport_number: '',
    passport_issue_date: '',
    passport_issued_by: '',

    // Address
    address: '',
    latitude: '',
    longitude: '',

    // Status & Features
    is_verified: false,
    is_insured: false,
    is_pro: false,
    is_24_7_available: false,
    is_available: true,
    status: 'active',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateUsername = (fullName) => {
    // Generate username from full name
    return fullName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  };

  const generatePassword = () => {
    // Generate random 8-character password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate username and password
      const username = generateUsername(formData.full_name);
      const password = generatePassword();

      // Prepare master data
      const masterData = {
        ...formData,
        username,
        password, // Note: In production, hash this password!
        experience_years: parseInt(formData.experience_years) || 0,
        hourly_rate: parseFloat(formData.hourly_rate) || 0,
        rating: 0,
        review_count: 0,
        completed_jobs: 0,
        response_rate: 0,
        completion_rate: 0,
        total_earned: 0,
        availability_status: 'available',
        registration_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert master
      const { data, error } = await supabase
        .from('masters')
        .insert(masterData)
        .select()
        .single();

      if (error) throw error;

      // Show credentials to admin
      alert(
        `Usta muvaffaqiyatli ro'yxatdan o'tkazildi!\n\n` +
        `Username: ${username}\n` +
        `Parol: ${password}\n\n` +
        `Bu ma'lumotlarni ustaga yuboring!`
      );

      navigate('/masters');
    } catch (error) {
      console.error('Error creating master:', error);
      alert('Xatolik yuz berdi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yangi Usta Ro'yxatdan O'tkazish</h1>
          <p className="text-gray-600 mt-1">Barcha ma'lumotlarni to'ldiring</p>
        </div>
        <button
          onClick={() => navigate('/masters')}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Bekor qilish
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Shaxsiy Ma'lumotlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'liq ism <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="input"
                placeholder="Ism Familiya"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon raqam <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="+998 90 123 45 67"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qo'shimcha telefon
              </label>
              <input
                type="tel"
                name="backup_phone"
                value={formData.backup_phone}
                onChange={handleChange}
                className="input"
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio (qisqacha ma'lumot)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input"
                rows={3}
                placeholder="Usta haqida qisqacha..."
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kasbiy Ma'lumotlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Kategoriyani tanlang</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kasbi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="input"
                placeholder="Masalan: Santexnik"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tajriba (yil) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                className="input"
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soatlik tarif (so'm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                className="input"
                placeholder="100000"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Passport Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Passport Ma'lumotlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport seriya <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="passport_serial"
                value={formData.passport_serial}
                onChange={handleChange}
                className="input"
                placeholder="AA"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport raqam <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="passport_number"
                value={formData.passport_number}
                onChange={handleChange}
                className="input"
                placeholder="1234567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Berilgan sana <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="passport_issue_date"
                value={formData.passport_issue_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kim tomonidan berilgan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="passport_issued_by"
                value={formData.passport_issued_by}
                onChange={handleChange}
                className="input"
                placeholder="IIB"
                required
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Manzil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'liq manzil <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input"
                placeholder="Shahar, tuman, ko'cha..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude (kenglik)
              </label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="input"
                placeholder="41.2995"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude (uzunlik)
              </label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="input"
                placeholder="69.2401"
              />
            </div>
          </div>
        </div>

        {/* Status & Features */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status va Xususiyatlar</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_verified"
                checked={formData.is_verified}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Tasdiqlangan (Verified)
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_pro"
                checked={formData.is_pro}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Pro usta
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_insured"
                checked={formData.is_insured}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Sug'urtalangan (Insured)
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_24_7_available"
                checked={formData.is_24_7_available}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                24/7 mavjud
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Hozir mavjud
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/masters')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary py-3 text-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saqlanmoqda...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Saqlash
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
