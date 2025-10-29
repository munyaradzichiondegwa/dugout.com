import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [ratingStats, setRatingStats] = useState({});
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, filterRating]);

  const fetchReviews = async () => {
    try {
      const url = `http://localhost:3001/api/reviews/product/${productId}?${
        filterRating ? `rating=${filterRating}` : ''
      }`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setReviews(result.reviews);
        setRatingStats(result.ratingStats);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
    setShowForm(false);
    fetchReviews(); // Refresh stats
  };

  if (loading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          productId={productId}
          onReviewAdded={handleReviewAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Rating Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilterRating(0)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            filterRating === 0
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Reviews
        </button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => setFilterRating(rating)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              filterRating === rating
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {rating} ⭐
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600">
              Be the first to review this product!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onReviewUpdated={fetchReviews}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;