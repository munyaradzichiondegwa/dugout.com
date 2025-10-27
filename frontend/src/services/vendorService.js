import { api } from './api';

export const vendorService = {
  async getVendors(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value);
          }
        }
      });

      const response = await api.get(`/vendors?${params}`);
      return response.vendors || [];
    } catch (error) {
      console.error('Get vendors error:', error);
      throw new Error(error.message || 'Failed to fetch vendors');
    }
  },

  async getVendor(vendorId) {
    try {
      const response = await api.get(`/vendors/${vendorId}`);
      return response.vendor;
    } catch (error) {
      console.error('Get vendor error:', error);
      throw new Error(error.message || 'Failed to fetch vendor');
    }
  },

  async getMenuItems(vendorId, filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/vendors/${vendorId}/menu-items?${params}`);
      return response.menuItems || [];
    } catch (error) {
      console.error('Get menu items error:', error);
      throw new Error(error.message || 'Failed to fetch menu items');
    }
  },

  async createVendor(vendorData) {
    try {
      const response = await api.post('/vendors', vendorData);
      return response;
    } catch (error) {
      console.error('Create vendor error:', error);
      throw new Error(error.message || 'Failed to create vendor profile');
    }
  },

  async updateVendor(vendorId, vendorData) {
    try {
      const response = await api.put(`/vendors/${vendorId}`, vendorData);
      return response;
    } catch (error) {
      console.error('Update vendor error:', error);
      throw new Error(error.message || 'Failed to update vendor profile');
    }
  },

  async searchVendors(query, filters = {}) {
    try {
      const response = await this.getVendors({
        search: query,
        ...filters
      });
      return response;
    } catch (error) {
      console.error('Search vendors error:', error);
      throw new Error(error.message || 'Failed to search vendors');
    }
  },

  async getNearbyVendors(lat, lng, maxDistance = 10) {
    try {
      const response = await this.getVendors({
        lat,
        lng,
        maxDistance
      });
      return response;
    } catch (error) {
      console.error('Get nearby vendors error:', error);
      throw new Error(error.message || 'Failed to fetch nearby vendors');
    }
  }
};