import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mb-4">
            You are logged in as a <span className="font-semibold capitalize">{user?.role || 'customer'}</span>
          </p>
          
          {/* Status Card */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-green-700 font-medium">Backend Status: Connected</span>
            </div>
            <p className="text-green-600 text-sm mt-1">http://localhost:3001/api</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">👤</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Profile</h3>
            <p className="text-gray-600 text-sm mb-4">Manage your account settings</p>
            <Link to="/profile" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center">
              Go to Profile
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🏪</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Browse Vendors</h3>
            <p className="text-gray-600 text-sm mb-4">Discover local businesses</p>
            <Link to="/vendors" className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center">
              Browse Vendors
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">📦</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">My Orders</h3>
            <p className="text-gray-600 text-sm mb-4">View your order history</p>
            <Link to="/orders" className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center">
              View Orders
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;




















































































