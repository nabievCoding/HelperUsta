import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, TrendingUp } from 'lucide-react';
import { categories as initialCategories } from '../data/mockData';
import Modal from '../components/Modal';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'wrench',
    totalMasters: 0,
    activeOrders: 0
  });

  // Load categories from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(initialCategories);
      localStorage.setItem('categories', JSON.stringify(initialCategories));
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMasters = categories.reduce((sum, cat) => sum + cat.totalMasters, 0);
  const totalActiveOrders = categories.reduce((sum, cat) => sum + cat.activeOrders, 0);

  const iconOptions = [
    { value: 'droplet', label: '💧 Suv', emoji: '💧' },
    { value: 'zap', label: '⚡ Elektr', emoji: '⚡' },
    { value: 'wrench', label: '🔧 Ta\'mirlash', emoji: '🔧' },
    { value: 'sparkles', label: '✨ Tozalash', emoji: '✨' },
    { value: 'leaf', label: '🌿 Bog\'bon', emoji: '🌿' },
    { value: 'chef-hat', label: '👨‍🍳 Oshpaz', emoji: '👨‍🍳' },
    { value: 'hammer', label: '🔨 Duradgorlik', emoji: '🔨' },
    { value: 'paintbrush', label: '🎨 Bo\'yash', emoji: '🎨' },
    { value: 'snowflake', label: '❄️ Konditsioner', emoji: '❄️' }
  ];

  const getIconEmoji = (iconValue) => {
    const icon = iconOptions.find(i => i.value === iconValue);
    return icon ? icon.emoji : '🔧';
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: formData.name,
      icon: formData.icon,
      totalMasters: parseInt(formData.totalMasters) || 0,
      activeOrders: parseInt(formData.activeOrders) || 0
    };

    setCategories([...categories, newCategory]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      totalMasters: category.totalMasters,
      activeOrders: category.activeOrders
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = () => {
    const updatedCategories = categories.map(cat =>
      cat.id === selectedCategory.id
        ? {
            ...cat,
            name: formData.name,
            icon: formData.icon,
            totalMasters: parseInt(formData.totalMasters) || 0,
            activeOrders: parseInt(formData.activeOrders) || 0
          }
        : cat
    );

    setCategories(updatedCategories);
    setIsEditModalOpen(false);
    resetForm();
    setSelectedCategory(null);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = () => {
    const updatedCategories = categories.filter(cat => cat.id !== selectedCategory.id);
    setCategories(updatedCategories);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: 'wrench',
      totalMasters: 0,
      activeOrders: 0
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategoriyalar</h1>
          <p className="text-gray-500 mt-1">
            Xizmat kategoriyalarini boshqarish
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Yangi kategoriya
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Jami Kategoriyalar</p>
          <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Jami Ustalar</p>
          <p className="text-3xl font-bold text-green-600">{totalMasters}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Faol Buyurtmalar</p>
          <p className="text-3xl font-bold text-blue-600">{totalActiveOrders}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Kategoriya qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-2xl">
                  {getIconEmoji(category.icon)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(category)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(category)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {category.name}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ustalar soni</span>
                <span className="text-sm font-medium text-gray-900">
                  {category.totalMasters}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Faol buyurtmalar</span>
                <span className="text-sm font-medium text-blue-600">
                  {category.activeOrders}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp size={16} />
                  <span>+12% o'sish</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">Kategoriyalar topilmadi</p>
        </div>
      )}

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yangi Kategoriya Qo'shish"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategoriya nomi *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masalan: Elektr xizmati"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ustalar soni
            </label>
            <input
              type="number"
              value={formData.totalMasters}
              onChange={(e) => setFormData({ ...formData, totalMasters: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faol buyurtmalar
            </label>
            <input
              type="number"
              value={formData.activeOrders}
              onChange={(e) => setFormData({ ...formData, activeOrders: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddCategory}
              disabled={!formData.name}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Qo'shish
            </button>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Kategoriyani Tahrirlash"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategoriya nomi *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ustalar soni
            </label>
            <input
              type="number"
              value={formData.totalMasters}
              onChange={(e) => setFormData({ ...formData, totalMasters: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faol buyurtmalar
            </label>
            <input
              type="number"
              value={formData.activeOrders}
              onChange={(e) => setFormData({ ...formData, activeOrders: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleUpdateCategory}
              disabled={!formData.name}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Saqlash
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Kategoriyani O'chirish"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Haqiqatan ham <span className="font-semibold text-gray-900">{selectedCategory?.name}</span> kategoriyasini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
          </p>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteCategory}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              O'chirish
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
