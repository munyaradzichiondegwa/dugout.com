import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ReviewForm = ({ product, order, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dugout_token')}`
        },
        body: JSON.stringify({
          productId: product._id,
          orderId: order._id,
          rating,
          title,
          comment
        })
      });

      const data = await response.json();

      if (data.success) {
        onReviewSubmitted(data.review);
        // Reset form
        setRating(5);
        setTitle('');
        setComment('');
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                {star <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{rating} out of 5 stars</p>
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Review Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Summarize your experience..."
            maxLength={100}
          />
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share details of your experience with this product..."
            maxLength={1000}
          />
          <p className="text-sm text-gray-500 mt-1">{comment.length}/1000 characters</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !comment.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting Review...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;