import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Users, ShoppingCart, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCategories(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async (categoryId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', categoryId);

      if (error) throw error;

      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Xatolik yuz berdi');
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Kategoriyalar</h1>
          <p className="text-gray-600 mt-1">Jami {categories.length} ta kategoriya</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`card hover:shadow-lg transition-all ${
              !category.is_active ? 'opacity-60' : ''
            }`}
          >
            {/* Icon and Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                {category.icon ? (
                  <span className="text-2xl">{category.icon}</span>
                ) : (
                  <Package className="w-6 h-6 text-primary" />
                )}
              </div>
              <button
                onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                title={category.is_active ? 'Nofaol qilish' : 'Faol qilish'}
              >
                {category.is_active ? (
                  <ToggleRight className="w-6 h-6 text-green-500" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>

            {/* Category Name */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  🇺🇿 {category.name_uz_latin}
                </p>
                <p className="text-sm text-gray-600">
                  🇷🇺 {category.name_ru}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-lg font-semibold text-gray-900">
                    {category.total_masters || 0}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Ustalar</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                  <span className="text-lg font-semibold text-gray-900">
                    {category.active_orders || 0}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Buyurtmalar</p>
              </div>
            </div>

            {/* Key */}
            {category.key && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-mono">
                  {category.key}
                </span>
              </div>
            )}

            {/* Status Badge */}
            <div className="mt-4">
              {category.is_active ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Faol
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Nofaol
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="card text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Kategoriyalar topilmadi</p>
        </div>
      )}
    </div>
  );
}
