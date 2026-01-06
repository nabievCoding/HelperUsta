import { useState, useEffect } from 'react';
import { Search, Star, CheckCircle, XCircle, Eye, Trash2, User } from 'lucide-react';
import Modal from '../components/Modal';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data, error } = await getReviews();
        if (!error && data) {
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.masterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;

    return matchesSearch && matchesRating && matchesStatus;
  });

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const publishedReviews = reviews.filter((r) => r.status === 'published');
  const pendingReviews = reviews.filter((r) => r.status === 'pending');

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'published' ? (
      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        <CheckCircle size={14} />
        Nashr qilingan
      </span>
    ) : (
      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
        <XCircle size={14} />
        Kutilmoqda
      </span>
    );
  };

  const handleApproveReview = async (reviewId) => {
    try {
      const { success } = await updateReviewStatus(reviewId, 'published');
      if (success) {
        const updatedReviews = reviews.map(review =>
          review.id === reviewId ? { ...review, status: 'published' } : review
        );
        setReviews(updatedReviews);
      }
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteReview = () => {
    const updatedReviews = reviews.filter(review => review.id !== selectedReview.id);
    setReviews(updatedReviews);
    setIsDeleteModalOpen(false);
    setSelectedReview(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Sharhlar</h1>
          <p className="text-gray-500 mt-1">
            Mijozlar sharhlarini boshqarish
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Jami Sharhlar</p>
          <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">O'rtacha Reyting</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-yellow-500">
              {averageRating.toFixed(1)}
            </p>
            <Star className="fill-yellow-400 text-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Nashr qilingan</p>
          <p className="text-3xl font-bold text-green-600">
            {publishedReviews.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Kutilmoqda</p>
          <p className="text-3xl font-bold text-yellow-600">
            {pendingReviews.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Barcha reytinglar</option>
            <option value="5">5 yulduz</option>
            <option value="4">4 yulduz</option>
            <option value="3">3 yulduz</option>
            <option value="2">2 yulduz</option>
            <option value="1">1 yulduz</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Barcha statuslar</option>
            <option value="published">Nashr qilingan</option>
            <option value="pending">Kutilmoqda</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {review.clientName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Usta: {review.masterName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    {renderStars(review.rating)}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.date).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Buyurtma:</span>
                    <span className="text-sm font-medium text-gray-900">
                      #{review.orderId}
                    </span>
                  </div>
                  {getStatusBadge(review.status)}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {review.status === 'pending' && (
                  <button
                    onClick={() => handleApproveReview(review.id)}
                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                    title="Tasdiqlash"
                  >
                    <CheckCircle size={20} />
                  </button>
                )}
                <button
                  onClick={() => handleViewReview(review)}
                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ko'rish"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleDeleteClick(review)}
                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                  title="O'chirish"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">Sharhlar topilmadi</p>
        </div>
      )}

      {/* View Review Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Sharh Tafsilotlari"
      >
        {selectedReview && (
          <div className="space-y-6">
            {/* Rating and Status */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-2">Reyting</p>
                <div className="flex items-center gap-3">
                  {renderStars(selectedReview.rating)}
                  <span className="text-2xl font-bold text-gray-900">
                    {selectedReview.rating}.0
                  </span>
                </div>
              </div>
              {getStatusBadge(selectedReview.status)}
            </div>

            {/* Client Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mijoz Ma'lumotlari</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Mijoz:</p>
                    <p className="font-medium text-gray-900">{selectedReview.clientName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Master Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Usta Ma'lumotlari</h3>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Usta:</p>
                    <p className="font-medium text-gray-900">{selectedReview.masterName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sharh</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{selectedReview.comment}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-yellow-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Buyurtma ID:</span>
                <span className="font-medium text-gray-900">#{selectedReview.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sana:</span>
                <span className="font-medium text-gray-900">
                  {new Date(selectedReview.date).toLocaleDateString('uz-UZ')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {selectedReview.status === 'pending' && (
                <button
                  onClick={() => {
                    handleApproveReview(selectedReview.id);
                    setIsViewModalOpen(false);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Tasdiqlash
                </button>
              )}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Sharhni O'chirish"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Haqiqatan ham <span className="font-semibold text-gray-900">{selectedReview?.clientName}</span> ning sharhini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
          </p>

          {selectedReview && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {renderStars(selectedReview.rating)}
              </div>
              <p className="text-sm text-gray-700 italic">"{selectedReview.comment}"</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteReview}
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

export default Reviews;
