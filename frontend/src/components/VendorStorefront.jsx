// VendorStorefront.jsx

import { useState, useEffect } from 'react';
import { vendorService } from '../services/vendorService';
import { useCartOperations } from '../hooks/useCart';
import MenuItemCard from './MenuItemCard';
import ShoppingCart from './ShoppingCart';
import LoadingSpinner from './LoadingSpinner';

const VendorStorefront = ({ vendorId, onCheckout }) => {
  const [vendor, setVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { cart, addToCart } = useCartOperations();

  useEffect(() => {
    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const [vendorData, menuData] = await Promise.all([
        vendorService.getVendor(vendorId),
        vendorService.getMenuItems(vendorId)
      ]);
      
      setVendor(vendorData);
      setMenuItems(menuData);
      setError(null);
    } catch (err) {
      setError('Failed to load vendor. Please try again.');
      console.error('Error fetching vendor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = new Set();
    menuItems.forEach(item => {
      if (item.category && (activeTab === 'all' || item.itemType === activeTab)) {
        categories.add(item.category);
      }
    });
    return ['all', ...Array.from(categories)];
  };

  const getVendorTypes = () => {
    if (!vendor) return [];
    return ['all', ...vendor.vendorTypes];
  };

  const getFilteredItems = () => {
    let filtered = menuItems;

    // Filter by vendor type tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.itemType === activeTab);
    }

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    return filtered;
  };

  const handleAddToCart = async (menuItem) => {
    const result = await addToCart(vendorId, menuItem);
    if (!result.success) {
      alert('Failed to add item to cart: ' + result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner text="Loading vendor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Vendor</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchVendorData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-400 text-6xl mb-4">🏪</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
        <p className="text-gray-600">The vendor you're looking for doesn't exist.</p>
      </div>
    );
  }

  const vendorTypes = getVendorTypes();
  const categories = getCategories();
  const filteredItems = getFilteredItems();

  return (
    <div className="bg-white rounded-lg shadow-lg border">
      {/* Vendor Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center space-x-4">
          {vendor.logo && (
            <img
              src={vendor.logo}
              alt={vendor.businessName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{vendor.businessName}</h1>
            <p className="text-blue-100 text-lg opacity-90">{vendor.description}</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                ✓ Verified
              </span>
              <span className="text-blue-100">
                {vendor.vendorTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(' • ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {vendorTypes.map(type => (
            <button
              key={type}
              onClick={() => {
                setActiveTab(type);
                setActiveCategory('all');
              }}
              className={`flex-shrink-0 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === type
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {type === 'all' ? 'All Items' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-b">
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Menu Items Grid */}
      <div className="p-6">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <MenuItemCard
                key={item._id}
                item={item}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              {activeTab === 'food' ? '🍽️' : activeTab === 'beverage' ? '🍹' : '🛒'}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              No {activeTab === 'all' ? '' : activeTab} items available in this category.
            </p>
          </div>
        )}
      </div>

      {/* Shopping Cart */}
      <ShoppingCart
        vendorId={vendorId}
        onCheckout={onCheckout}
      />
    </div>
  );
};

export default VendorStorefront;