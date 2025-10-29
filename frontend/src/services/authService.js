import { api } from './api';

export const authService = {
  async login(phoneNumber, password) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Register service error:', error);
      throw error;
    }
  },

  async sendOTP(phoneNumber) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      console.error('Send OTP service error:', error);
      throw error;
    }
  },

  async verifyOTP(phoneNumber, otpCode) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otpCode }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      return data;
    } catch (error) {
      console.error('Verify OTP service error:', error);
      throw error;
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem('dugout_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('dugout_token');
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`Failed to get profile: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get profile service error:', error);
      throw error;
    }
  },

  async updateProfile(profileData) {
    try {
      return await api.put('/auth/profile', profileData);
    } catch (error) {
      console.error('Update profile service error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout service error:', error);
      // Don't throw error for logout as it's not critical
    }
  },

  async resetPassword(phoneNumber, newPassword) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      return data;
    } catch (error) {
      console.error('Reset password service error:', error);
      throw error;
    }
  },
};




















