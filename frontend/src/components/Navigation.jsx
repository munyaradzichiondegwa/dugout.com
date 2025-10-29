<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
=======
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
>>>>>>> origin/main

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< HEAD
  const [mobileOpen, setMobileOpen] = useState(false);

=======

  // Base navigation for all users
>>>>>>> origin/main
  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Vendors', href: '/vendors', icon: '🏪' },
    { name: 'Orders', href: '/orders', icon: '📦' },
    { name: 'Profile', href: '/profile', icon: '👤' },
<<<<<<< HEAD
    { name: 'Find Vendors', href: '/map', icon: '🗺️' },
    { name: 'About', href: '/about', icon: 'ℹ️' }, // Added About link
  ];

=======
    { name: 'Find Vendors', href: '/map', icon: '🗺️' }, // Added vendor map
  ];

  // Admin-specific links
>>>>>>> origin/main
  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: '⚙️' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📊' },
  ];

<<<<<<< HEAD
=======
  // Vendor-specific links
>>>>>>> origin/main
  const vendorNavigation = [
    { name: 'Vendor Dashboard', href: '/vendor/dashboard', icon: '📈' },
    { name: 'My Products', href: '/vendor/products', icon: '📦' },
    { name: 'Vendor Orders', href: '/vendor/orders', icon: '🛒' },
  ];

<<<<<<< HEAD
=======
  // Check if a link is the current path
>>>>>>> origin/main
  const isCurrentPath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

<<<<<<< HEAD
=======
  // Return role-specific navigation
>>>>>>> origin/main
  const getRoleSpecificNavigation = () => {
    if (user?.role === 'admin') return [...navigation, ...adminNavigation];
    if (user?.role === 'vendor') return [...navigation, ...vendorNavigation];
    return navigation;
  };

  const currentNavigation = getRoleSpecificNavigation();

<<<<<<< HEAD
=======
  // Handle direct /logout navigation
>>>>>>> origin/main
  useEffect(() => {
    if (location.pathname === '/logout') {
      logout();
      navigate('/login');
    }
  }, [location.pathname, logout, navigate]);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
<<<<<<< HEAD
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">DO</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DugOut</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Zimbabwe</p>
            </div>
          </Link>
=======
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">DO</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DugOut</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Zimbabwe</p>
              </div>
            </Link>
          </div>
>>>>>>> origin/main

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isCurrentPath(item.href)
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Logout link */}
            <Link
              to="/logout"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>🚪</span>
              <span>Logout</span>
            </Link>
          </div>

          {/* User Info & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-gray-700">
                Welcome, {user?.name || 'User'}!
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {user?.role || 'customer'}
              </span>
            </div>

            <div className="sm:hidden h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>

<<<<<<< HEAD
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
=======
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <span className="text-xl">☰</span>
>>>>>>> origin/main
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
<<<<<<< HEAD
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t pt-4">
            <div className="grid grid-cols-4 gap-2">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex flex-col items-center p-2 rounded-lg text-xs transition-colors ${
                    isCurrentPath(item.href)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg mb-1">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              <Link
                to="/logout"
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center p-2 rounded-lg text-xs text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                <span className="text-lg mb-1">🚪</span>
                <span>Logout</span>
              </Link>
            </div>
          </div>
        )}
=======
        <div className="md:hidden pb-4 border-t pt-4">
          <div className="grid grid-cols-4 gap-2">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center p-2 rounded-lg text-xs transition-colors ${
                  isCurrentPath(item.href)
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Mobile Logout */}
            <Link
              to="/logout"
              className="flex flex-col items-center p-2 rounded-lg text-xs text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              <span className="text-lg mb-1">🚪</span>
              <span>Logout</span>
            </Link>
          </div>
        </div>
>>>>>>> origin/main
      </div>
    </nav>
  );
};

export default Navigation;
