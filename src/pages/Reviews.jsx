import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Star, Eye, Trash2, CheckCircle, XCircle, Image } from 'lucide-react';
import { format } from 'date-fns';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            full_name,
            phone
          ),
          masters (
            full_name,
            profession
          ),
          orders (
            order_number,
            service_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, status) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', reviewId);

      if (error) throw error;

      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('Sharhni o\'chirishni xohlaysizmi?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.masters?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      filterRating === 'all' || review.rating === parseInt(filterRating);

    return matchesSearch && matchesRating;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0).toFixed(1),
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
          <h1 className="text-2xl font-bold text-gray-900">Sharhlar</h1>
          <p className="text-gray-600 mt-1">Jami {filteredReviews.length} ta sharh</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600 mt-1">Jami sharhlar</p>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">O'rtacha reyting</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-gray-600 mt-1">Tasdiqlangan</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600 mt-1">Kutilmoqda</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="input md:w-48"
          >
            <option value="all">Barcha reytinglar</option>
            <option value="5">5 yulduz</option>
            <option value="4">4 yulduz</option>
            <option value="3">3 yulduz</option>
            <option value="2">2 yulduz</option>
            <option value="1">1 yulduz</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="card hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {review.users?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.users?.full_name || 'Noma\'lum'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {review.created_at
                      ? format(new Date(review.created_at), 'dd.MM.yyyy HH:mm')
                      : '-'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Master Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium">
                  {review.masters?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {review.masters?.full_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {review.masters?.profession}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Buyurtma: #{review.orders?.order_number}
              </p>
            </div>

            {/* Comment */}
            {review.comment && (
              <div className="mb-4">
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            )}

            {/* Photos */}
            {review.photos && review.photos.length > 0 && (
              <div className="mb-4 flex gap-2">
                {review.photos.slice(0, 3).map((photo, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center"
                  >
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
                {review.photos.length > 3 && (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-sm text-gray-600">
                      +{review.photos.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Status */}
            <div className="mb-4">
              {review.status === 'approved' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" />
                  Tasdiqlangan
                </span>
              ) : review.status === 'pending' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  Kutilmoqda
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  <XCircle className="w-3 h-3" />
                  Rad etilgan
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {review.status !== 'approved' && (
                <button
                  onClick={() => updateReviewStatus(review.id, 'approved')}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  Tasdiqlash
                </button>
              )}
              {review.status !== 'rejected' && (
                <button
                  onClick={() => updateReviewStatus(review.id, 'rejected')}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Rad etish
                </button>
              )}
              <button
                onClick={() => deleteReview(review.id)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">Sharhlar topilmadi</p>
        </div>
      )}
    </div>
  );
}
