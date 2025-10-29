import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/Admin/StatCard';
import RevenueChart from '../../components/Admin/RevenueChart';
import RecentOrders from '../../components/Admin/RecentOrders';
import TopProducts from '../../components/Admin/TopProducts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dugout_token')}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setStats(result);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.stats.totals.users || 0}
            icon="👥"
            color="blue"
          />
          <StatCard
            title="Total Vendors"
            value={stats?.stats.totals.vendors || 0}
            icon="🏪"
            color="green"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats?.stats.totals.revenue.toFixed(2) || '0.00'}`}
            icon="💰"
            color="yellow"
          />
          <StatCard
            title="Pending Orders"
            value={stats?.stats.pending.orders || 0}
            icon="📦"
            color="red"
          />
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <RevenueChart data={stats?.trends.revenue || []} />
          </div>

          {/* Today's Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Orders</span>
                <span className="font-semibold">{stats?.stats.today.orders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenue</span>
                <span className="font-semibold text-green-600">
                  ${stats?.stats.today.revenue.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Payments</span>
                <span className="font-semibold text-orange-600">
                  {stats?.stats.pending.payments || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentOrders />
          <TopProducts products={stats?.trends.topProducts || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
