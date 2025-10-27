// useAuth.js

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('dugout_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await authService.getProfile();
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('dugout_token');
      setUser(null);
      setError('Session expired. Please login again.');
    } finally {
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
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
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
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
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
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'OTP verification failed.';
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
    } catch (err) {
      const errorMessage = err.message || 'Failed to send OTP.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dugout_token');
    setUser(null);
    setError(null);
    
    // Optional: Call backend logout endpoint
    authService.logout().catch(console.error);
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (phoneNumber, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.resetPassword(phoneNumber, newPassword);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Password reset failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user is verified
  const isVerified = useCallback(() => {
    return user?.isVerified === true;
  }, [user]);

  return {
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
    resetPassword,
    checkAuthStatus,
    
    // Helpers
    isAuthenticated: !!user,
    hasRole,
    isVerified,
    
    // Clear error
    clearError: () => setError(null)
  };
};