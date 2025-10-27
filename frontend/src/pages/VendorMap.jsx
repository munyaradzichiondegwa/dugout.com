// src/pages/VendorMap.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import MapView from '../components/MapView';

const VendorMapPage = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/vendors');
      const data = await response.json();
      
      if (data.success) {
        setVendors(data.vendors || []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Find Vendors Near You</h1>
          <p className="text-gray-600">Discover food vendors and restaurants in your area</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-sm text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Near You</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vendors.filter(v => v.distance < 5).length}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Filter Vendors
                </button>
                <button 
                  onClick={fetchVendors}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Refresh Map
                </button>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-[600px] w-full">
              <MapView 
                vendors={vendors} 
                onVendorSelect={handleVendorSelect}
              />
            </div>
          </div>

          {/* Selected Vendor Info */}
          {selectedVendor && (
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Selected Vendor</h3>
              <div className="flex items-center space-x-4">
                {selectedVendor.logo && (
                  <img 
                    src={selectedVendor.logo} 
                    alt={selectedVendor.businessName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedVendor.businessName}</h4>
                  <p className="text-gray-600">{selectedVendor.description}</p>
                  <p className="text-sm text-gray-500">
                    {selectedVendor.vendorTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
                  </p>
                </div>
                <button 
                  onClick={() => window.location.href = `/vendor/${selectedVendor._id}`}
                  className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          )}

          {/* Vendors List */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.slice(0, 6).map(vendor => (
              <div key={vendor._id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  {vendor.logo && (
                    <img 
                      src={vendor.logo} 
                      alt={vendor.businessName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{vendor.businessName}</h4>
                    <p className="text-sm text-gray-500">{vendor.vendorTypes.join(', ')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleVendorSelect(vendor)}
                  className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  View on Map
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorMapPage;
