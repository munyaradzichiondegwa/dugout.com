import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// ✅ Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import OTPVerification from './pages/OTPVerification';
import Profile from './pages/Profile';
import Vendors from './pages/Vendors';
import VendorDetail from './pages/VendorDetail';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import VendorDashboardPage from './pages/VendorDashboard';
import VendorMapPage from './pages/VendorMap';
import AdminDashboard from './pages/admin/Dashboard';
import ReviewList from './components/ReviewList';

// ✅ Profile-related Pages
import OrderHistory from './pages/OrderHistory';
import PaymentMethods from './pages/PaymentMethods';
import SecuritySettings from './pages/SecuritySettings';

// ✅ Vendor-specific Pages
import VendorProducts from './pages/VendorProducts';
import VendorOrders from './pages/VendorOrders';
import VendorAnalytics from './pages/VendorAnalytics';

// ✅ Components
import PaymentCheckout from './components/PaymentCheckout';
import VendorDashboard from './components/VendorDashboard';
import LogoutHandler from './components/LogoutHandler';
import LoadingSpinner from './components/LoadingSpinner';

import './App.css';

// =========================================================
// 🔒 Route Protection Components
// =========================================================

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return !isAuthenticated ? children : <Navigate to="/" />;
};

const VendorRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user.role !== 'vendor') return <Navigate to="/" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

// =========================================================
// 🌍 Main Application Content
// =========================================================

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <div className="ml-4 text-gray-600">Loading application...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* ====================== Public Routes ====================== */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><OTPVerification /></PublicRoute>} />
        <Route path="/map" element={<VendorMapPage />} />
        <Route path="/vendors/map" element={<VendorMapPage />} />

        {/* ====================== Protected Routes ====================== */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Profile-related Routes */}
        <Route path="/profile/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/profile/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
        <Route path="/profile/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />

        <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
        <Route path="/vendor/:id" element={<ProtectedRoute><VendorDetail /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        <Route
          path="/checkout/payment"
          element={
            <ProtectedRoute>
              <PaymentCheckout
                order={location.state?.order}
                onPaymentSuccess={() => navigate('/order-success')}
                onCancel={() => navigate('/checkout')}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

        {/* Public Routes - Add About to public routes */}
       <Route path="/about" element={<About />} />

{/* Or if you want it in protected routes, add it here: */}
{/* <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} */}

        {/* ====================== Dashboards ====================== */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/vendor/dashboard" element={<VendorRoute><VendorDashboardPage /></VendorRoute>} />

        {/* ====================== Vendor Routes ====================== */}
        <Route path="/vendor/products" element={<VendorRoute><VendorProducts /></VendorRoute>} />
        <Route path="/vendor/orders" element={<VendorRoute><VendorOrders /></VendorRoute>} />
        <Route path="/vendor/analytics" element={<VendorRoute><VendorAnalytics /></VendorRoute>} />

        {/* ====================== Reviews ====================== */}
        <Route path="/reviews" element={<ProtectedRoute><ReviewList /></ProtectedRoute>} />

        {/* ====================== Logout ====================== */}
        <Route path="/logout" element={<ProtectedRoute><LogoutHandler /></ProtectedRoute>} />

        {/* ====================== Fallback ====================== */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

// =========================================================
// 🧩 Root App Wrapper
// =========================================================

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
