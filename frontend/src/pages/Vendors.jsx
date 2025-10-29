import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Added for potential navigation in buttons
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Vendors = () => {
  const { user } = useAuth();

  // Mock vendor data - replace with actual API call
  const vendors = [
    {
      id: 1,
      name: "Fresh Groceries",
      category: "Food & Groceries",
      rating: 4.5,
      deliveryTime: "30-45 min",
      image: "🛒"
    },
    {
      id: 2,
      name: "Tech Gadgets ZW",
      category: "Electronics",
      rating: 4.8,
      deliveryTime: "1-2 days",
      image: "📱"
    },
    {
      id: 3,
      name: "Fashion Hub",
      category: "Clothing",
      rating: 4.3,
      deliveryTime: "2-3 days",
      image: "👕"
    },
    {
      id: 4,
      name: "Home Essentials",
      category: "Home & Garden",
      rating: 4.6,
      deliveryTime: "1-2 days",
      image: "🏠"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Vendors</h1>
          <p className="text-gray-600">Discover local businesses in Zimbabwe</p>
          {user && (
            <p className="text-gray-700 mt-2">
              Welcome, {user?.firstName || user?.name || 'User'}! Explore vendors near you.
            </p>
          )}
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{vendor.image}</div>
                <h3 className="font-semibold text-gray-800 text-lg">{vendor.name}</h3>
                <p className="text-gray-600 text-sm">{vendor.category}</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <span className="text-yellow-600 font-medium">⭐ {vendor.rating}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="text-green-600 font-medium">{vendor.deliveryTime}</span>
                </div>
              </div>

              <Link 
                to={`/vendor/${vendor.id}`} // Assuming navigation to VendorDetail
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center"
              >
                Visit Store
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State (if no vendors) */}
        {vendors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Vendors Available</h3>
            <p className="text-gray-600">Check back later for new local businesses.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Vendors;