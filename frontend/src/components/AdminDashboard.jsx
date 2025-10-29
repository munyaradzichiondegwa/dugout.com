import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import RevenueChart from "../../components/Admin/RevenueChart";
import StatCard from "../../components/Admin/StatCard";
import RecentOrders from "../../components/Admin/RecentOrders";
import TopProducts from "../../components/Admin/TopProducts";

const Dashboard = () => {
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
        setStats(result.data); // Assuming the API returns { success: true, data: {...} }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback to mock data if API fails
      setStats(getMockData());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockData = () => ({
    stats: {
      totals: {
        users: 1243,
        vendors: 89,
        revenue: 45231.89,
        orders: 543
      },
      pending: {
        orders: 23,
        payments: 12
      },
      today: {
        orders: 45,
        revenue: 2890.50
      }
    },
    trends: {
      revenue: [
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 19000 },
        { month: 'Mar', revenue: 15000 },
        { month: 'Apr', revenue: 25000 },
        { month: 'May', revenue: 22000 },
        { month: 'Jun', revenue: 30000 },
        { month: 'Jul', revenue: 28000 },
        { month: 'Aug', revenue: 35000 },
        { month: 'Sep', revenue: 32000 },
        { month: 'Oct', revenue: 40000 },
        { month: 'Nov', revenue: 38000 },
        { month: 'Dec', revenue: 45000 },
      ],
      topProducts: [
        { name: 'Wireless Headphones', sales: 1243, revenue: 24860 },
        { name: 'Smart Watch', sales: 987, revenue: 39480 },
        { name: 'Laptop Backpack', sales: 756, revenue: 15120 },
        { name: 'Phone Case', sales: 654, revenue: 6540 },
        { name: 'USB-C Cable', sales: 543, revenue: 2715 },
      ]
    },
    recentOrders: [
      { id: '#ORD-001', customer: 'John Smith', date: '2024-01-15', amount: 150.00, status: 'Completed' },
      { id: '#ORD-002', customer: 'Sarah Johnson', date: '2024-01-14', amount: 89.99, status: 'Pending' },
      { id: '#ORD-003', customer: 'Mike Wilson', date: '2024-01-14', amount: 245.50, status: 'Completed' },
      { id: '#ORD-004', customer: 'Emily Davis', date: '2024-01-13', amount: 67.25, status: 'Shipped' },
      { id: '#ORD-005', customer: 'Robert Brown', date: '2024-01-13', amount: 189.99, status: 'Completed' },
    ]
  });

  // Access denied for non-admin users
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Loading Dashboard...</div>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
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
          <p className="text-gray-600">Welcome back, {user.name || user.username || 'Admin'}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.stats.totals.users?.toLocaleString() || '0'}
            icon="👥"
            color="blue"
          />
          <StatCard
            title="Total Vendors"
            value={stats?.stats.totals.vendors?.toLocaleString() || '0'}
            icon="🏪"
            color="green"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats?.stats.totals.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
            icon="💰"
            color="yellow"
          />
          <StatCard
            title="Pending Orders"
            value={stats?.stats.pending.orders?.toLocaleString() || '0'}
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
                  ${stats?.stats.today.revenue?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Payments</span>
                <span className="font-semibold text-orange-600">
                  {stats?.stats.pending.payments || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Users</span>
                <span className="font-semibold text-blue-600">
                  {stats?.stats.today.newUsers || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentOrders orders={stats?.recentOrders || []} />
          <TopProducts products={stats?.trends.topProducts || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;