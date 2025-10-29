// src/pages/VendorDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const VendorDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorStats();
  }, []);

  const fetchVendorStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analytics/vendor-dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dugout_token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error('Fetch vendor stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load dashboard data</p>
          <button 
            onClick={fetchVendorStats}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.businessName || user?.name}!</p>
            </div>
            <div className="text-sm text-gray-500">
              Business: {user?.businessName || 'Your Store'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={stats.stats.totals.products}
            icon="📦"
            color="bg-blue-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.stats.totals.orders}
            icon="🛒"
            color="bg-green-500"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.stats.totals.revenue}`}
            icon="💰"
            color="bg-yellow-500"
          />
          <StatCard
            title="Today's Revenue"
            value={`$${stats.stats.today.revenue}`}
            icon="📈"
            color="bg-purple-500"
          />
        </div>

        {/* Inventory & Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Inventory Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Stock Items:</span>
                <span className="font-semibold">{stats.stats.inventory.totalStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Stock Items:</span>
                <span className={`font-semibold ${
                  stats.stats.inventory.lowStockItems > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {stats.stats.inventory.lowStockItems}
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  {stats.stats.inventory.lowStockItems > 0 
                    ? `⚠️ You have ${stats.stats.inventory.lowStockItems} items running low on stock`
                    : '✅ All items have sufficient stock'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
            <div className="space-y-3">
              {stats.stats.orders.statusBreakdown && stats.stats.orders.statusBreakdown.map((status) => (
                <div key={status._id} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{status._id}:</span>
                  <span className="font-semibold">{status.count}</span>
                </div>
              ))}
              <div className="bg-blue-50 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-700">
                  📊 You have {stats.stats.orders.pending} orders needing attention
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => window.location.href = '/vendor/products'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <span>📦</span>
              <span>Manage Products</span>
            </button>
            <button 
              onClick={() => window.location.href = '/vendor/orders'}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <span>🛒</span>
              <span>View Orders</span>
            </button>
            <button 
              onClick={() => window.location.href = '/vendor/analytics'}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <span>📈</span>
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Performance</h3>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Monthly revenue chart will be displayed here
              <br />
              <span className="text-sm">Data for {stats.trends.monthlyRevenue?.length || 0} days</span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorDashboardPage;