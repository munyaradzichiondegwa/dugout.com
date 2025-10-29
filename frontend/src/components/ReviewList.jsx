import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ReviewList = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/reviews/product/${productId}?page=${page}&limit=5`
      );
      const data = await response.json();

      if (data.success) {
        if (page === 1) {
          setReviews(data.reviews);
        } else {
          setReviews(prev => [...prev, ...data.reviews]);
        }
        setHasMore(data.pages > page);
      }
    } catch (error) {
      console.error('Fetch reviews error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/reviews/${reviewId}/helpful`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dugout_token')}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        // Update local state
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { 
                ...review, 
                helpful: { 
                  count: data.helpfulCount,
                  users: data.hasMarkedHelpful 
                    ? [...review.helpful.users, user.id]
                    : review.helpful.users.filter(id => id !== user.id)
                }
              }
            : review
        ));
      }
    } catch (error) {
      console.error('Mark helpful error:', error);
    }
  };

  if (loading && reviews.length === 0) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          Customer Reviews ({reviews.length})
        </h3>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
            {/* Review Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{review.customer.name}</h4>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-yellow-500">
                    {'⭐'.repeat(review.rating)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {review.rating}.0
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Review Title & Content */}
            {review.title && (
              <h5 className="font-medium text-gray-800 mb-2">{review.title}</h5>
            )}
            <p className="text-gray-600 mb-4">{review.comment}</p>

            {/* Helpful Section */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => markHelpful(review._id)}
                className={`flex items-center space-x-1 text-sm ${
                  review.helpful.users.includes(user?.id)
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>👍</span>
                <span>Helpful ({review.helpful.count})</span>
              </button>
            </div>

            {/* Vendor Response */}
            {review.response && (
              <div className="mt-4 pl-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-800">Vendor Response</span>
                  <span className="text-sm text-blue-600">
                    {new Date(review.response.respondedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-blue-700">{review.response.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review this product!
        </div>
      )}
    </div>
  );
};

export default ReviewList;