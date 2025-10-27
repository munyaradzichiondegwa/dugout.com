import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutHandler = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call the logout function from AuthContext
        await logout();
        
        // Optional: Clear any other local storage items
        localStorage.removeItem('dugout_cart');
        
        // Redirect to login page after a brief delay
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } catch (error) {
        console.error('Logout error:', error);
        // Still redirect to login even if there's an error
        navigate('/login');
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Logging out...</h2>
        <p className="text-gray-600">Please wait while we securely log you out.</p>
      </div>
    </div>
  );
};

export default LogoutHandler;