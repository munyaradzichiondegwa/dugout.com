// context/AuthContext.js

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AuthProvider mounted - checking auth status');
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('dugout_token');
      console.log('Auth check - Token found:', !!token);
      
      if (!token) {
        console.log('No token found, setting loading to false');
        setLoading(false);
        return;
      }

      console.log('Calling authService.getProfile()...');
      
      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.log('Auth check timeout - forcing loading to complete');
        setLoading(false);
      }, 5000);

      const response = await authService.getProfile();
      clearTimeout(timeoutId);
      
      console.log('Profile response:', response);
      
      if (response && response.user) {
        setUser(response.user);
      } else {
        console.warn('Unexpected profile response structure:', response);
        localStorage.removeItem('dugout_token');
      }
      
      setError(null);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('dugout_token');
      setUser(null);
      setError(error.message);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (phoneNumber, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.login(phoneNumber, password);
      
      if (result.success) {
        localStorage.setItem('dugout_token', result.token);
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.message || 'Login failed');
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.register(userData);
      
      if (result.success) {
        localStorage.setItem('dugout_token', result.token);
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.message || 'Registration failed');
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (phoneNumber, otpCode) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.verifyOTP(phoneNumber, otpCode);
      
      if (result.success) {
        localStorage.setItem('dugout_token', result.token);
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.message || 'OTP verification failed');
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'OTP verification failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendOTP = useCallback(async (phoneNumber) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.sendOTP(phoneNumber);
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Failed to send OTP.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out user...');
    localStorage.removeItem('dugout_token');
    setUser(null);
    setError(null);
    setLoading(false);
    
    // Optional: Redirect to login page after logout
    // You can also handle this in the component that calls logout
    // window.location.href = '/login';
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.message || 'Profile update failed');
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    // State
    user,
    loading,
    error,
    
    // Actions
    login,
    register,
    verifyOTP,
    sendOTP,
    logout,
    updateProfile,
    clearError,
    
    // Helpers
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role,
    isVerified: () => user?.isVerified === true
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};