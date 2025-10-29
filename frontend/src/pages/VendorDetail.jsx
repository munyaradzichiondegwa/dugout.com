// VendorDetail.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ReviewList from '../components/ReviewList';

const VendorDetail = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockVendor = {
      id: 1,
      name: "Fresh Groceries",
      businessName: "Fresh Groceries Zimbabwe",
      category: "Food & Groceries",
      rating: 4.5,
      reviewCount: 128,
      deliveryTime: "30-45 min",
      image: "🛒",
      description: "Your one-stop shop for fresh groceries and household essentials. We deliver fresh produce directly from local farms.",
      since: "2022",
      address: "123 Main Street, Harare, Zimbabwe",
      phone: "+263 77 123 4567"
    };

    const mockProducts = [
      {
        id: 1,
        name: "Fresh Tomatoes",
        price: 2.99,
        image: "🍅",
        category: "Vegetables",
        stock: 50,
        rating: 4.8
      },
      {
        id: 2,
        name: "Bananas (Bunch)",
        price: 1.99,
        image: "🍌",
        category: "Fruits",
        stock: 30,
        rating: 4.6
      }
    ];

    setVendor(mockVendor);
    setProducts(mockProducts);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vendor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
            <p className="text-gray-600">The vendor you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        {/* Vendor Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="text-6xl">{vendor.image}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{vendor.businessName}</h1>
              <p className="text-gray-600 mt-1">{vendor.category}</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-medium">{vendor.rating}</span>
                  <span className="text-gray-500">({vendor.reviewCount} reviews)</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-green-600 font-medium">🚚 {vendor.deliveryTime}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Since {vendor.since}</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Follow Store
              </button>
            </div>
          </div>

          {/* Vendor Description */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-700">{vendor.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
              <div>
                <strong>Address:</strong> {vendor.address}
              </div>
              <div>
                <strong>Phone:</strong> {vendor.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({vendor.reviewCount})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                About
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-4xl text-center mb-3">{product.image}</div>
                    <h3 className="font-semibold text-gray-800 text-center">{product.name}</h3>
                    <p className="text-gray-600 text-sm text-center mb-2">{product.category}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mt-3">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewList vendorId={vendor.id} />
            )}

            {activeTab === 'about' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">About {vendor.businessName}</h3>
                  <p className="text-gray-600">{vendor.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Business Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Category:</strong> {vendor.category}</div>
                      <div><strong>Operating Since:</strong> {vendor.since}</div>
                      <div><strong>Delivery Time:</strong> {vendor.deliveryTime}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Address:</strong> {vendor.address}</div>
                      <div><strong>Phone:</strong> {vendor.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VendorDetail;