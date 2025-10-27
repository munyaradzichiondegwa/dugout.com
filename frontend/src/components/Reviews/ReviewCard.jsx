import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ReviewCard = ({ review, onReviewUpdated }) => {
  const { user } = useAuth();
  const [helpfulCount, setHelpfulCount] = useState(review.helpful?.count || 0);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(
    review.helpful?.users?.includes(user?.id) || false
  );
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');

  const handleHelpful = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/reviews/${review._id}/helpful`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dugout_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();
      if (result.success) {
        setHelpfulCount(result.helpfulCount);
        setHasMarkedHelpful(result.hasMarkedHelpful);
      }
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/reviews/${review._id}/response`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dugout_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ response: responseText })
        }
      );

      const result = await response.json();
      if (result.success) {
        setShowResponseForm(false);
        setResponseText('');
        onReviewUpdated();
      }
    } catch (error) {
      console.error('Failed to submit response:', error);
    }
  };

  const canRespond = user && (user.role === 'vendor' || user.role === 'admin');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {review.customer?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {review.customer?.name || 'Anonymous'}
              </h4>
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {review.isVerified && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Verified Purchase
          </span>
        )}
      </div>

      {/* Review Content */}
      {review.title && (
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
      )}
      <p className="text-gray-700 mb-4">{review.comment}</p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Review"
              className="w-20 h-20 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}

      {/* Helpful Section */}
      <div className="flex items-center justify-between border-t pt-4">
        <button
          onClick={handleHelpful}
          disabled={!user}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
            hasMarkedHelpful
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>👍</span>
          <span>Helpful ({helpfulCount})</span>
        </button>

        {canRespond && !review.response && (
          <button
            onClick={() => setShowResponseForm(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Respond
          </button>
        )}
      </div>

      {/* Vendor Response */}
      {review.response && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-blue-900">Vendor Response</span>
            <span className="text-xs text-blue-600">
              {new Date(review.response.respondedAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-blue-800">{review.response.text}</p>
        </div>
      )}

      {/* Response Form */}
      {showResponseForm && (
        <form onSubmit={handleResponseSubmit} className="mt-4">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write your response to this review..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            required
          />
          <div className="flex space-x-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Submit Response
            </button>
            <button
              type="button"
              onClick={() => setShowResponseForm(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewCard;