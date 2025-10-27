import { api } from './api';

export const orderService = {
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      console.error('Create order error:', error);
      throw new Error(error.message || 'Failed to create order');
    }
  },

  async getOrder(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('Get order error:', error);
      throw new Error(error.message || 'Failed to fetch order');
    }
  },

  async getUserOrders(page = 1, limit = 20, status = null) {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status) params.append('status', status);
      
      const response = await api.get(`/orders/user?${params}`);
      return response;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  async getVendorOrders(page = 1, limit = 20, status = null) {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status) params.append('status', status);
      
      const response = await api.get(`/orders/vendor?${params}`);
      return response;
    } catch (error) {
      console.error('Get vendor orders error:', error);
      throw new Error(error.message || 'Failed to fetch vendor orders');
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response;
    } catch (error) {
      console.error('Update order status error:', error);
      throw new Error(error.message || 'Failed to update order status');
    }
  },

  async cancelOrder(orderId) {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw new Error(error.message || 'Failed to cancel order');
    }
  },

  async getOrderStatus(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/status`);
      return response;
    } catch (error) {
      console.error('Get order status error:', error);
      throw new Error(error.message || 'Failed to fetch order status');
    }
  }
};