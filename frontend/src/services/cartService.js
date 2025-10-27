import { api } from './api';

export const cartService = {
  async getCart(vendorId) {
    try {
      const response = await api.get(`/carts/${vendorId}`);
      return response.cart;
    } catch (error) {
      console.error('Get cart error:', error);
      throw new Error(error.message || 'Failed to fetch cart');
    }
  },

  async getCarts() {
    try {
      const response = await api.get('/carts');
      return response.carts || [];
    } catch (error) {
      console.error('Get carts error:', error);
      throw new Error(error.message || 'Failed to fetch carts');
    }
  },

  async createCart(vendorId, items) {
    try {
      const response = await api.post('/carts', { vendorId, items });
      return response.cart;
    } catch (error) {
      console.error('Create cart error:', error);
      throw new Error(error.message || 'Failed to create cart');
    }
  },

  async updateCart(cartId, items) {
    try {
      const response = await api.put(`/carts/${cartId}`, { items });
      return response.cart;
    } catch (error) {
      console.error('Update cart error:', error);
      throw new Error(error.message || 'Failed to update cart');
    }
  },

  async deleteCart(cartId) {
    try {
      const response = await api.delete(`/carts/${cartId}`);
      return response;
    } catch (error) {
      console.error('Delete cart error:', error);
      throw new Error(error.message || 'Failed to delete cart');
    }
  },

  async clearCart(vendorId) {
    try {
      const response = await api.delete(`/carts/vendor/${vendorId}`);
      return response;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw new Error(error.message || 'Failed to clear cart');
    }
  },

  async addItemToCart(vendorId, menuItem, quantity = 1, specialInstructions = '') {
    try {
      // First get existing cart
      let cart;
      try {
        cart = await this.getCart(vendorId);
      } catch (error) {
        // Cart doesn't exist, create new one
        cart = await this.createCart(vendorId, [{
          menuItemId: menuItem._id,
          quantity,
          specialInstructions
        }]);
        return cart;
      }

      // Check if item already exists in cart
      const existingItem = cart.items.find(item => 
        item.menuItemId._id === menuItem._id
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = cart.items.map(item =>
          item.menuItemId._id === menuItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [
          ...cart.items,
          {
            menuItemId: menuItem._id,
            quantity,
            specialInstructions
          }
        ];
      }

      return await this.updateCart(cart._id, updatedItems);
    } catch (error) {
      console.error('Add item to cart error:', error);
      throw new Error(error.message || 'Failed to add item to cart');
    }
  },

  async removeItemFromCart(vendorId, menuItemId) {
    try {
      const cart = await this.getCart(vendorId);
      const updatedItems = cart.items.filter(item => 
        item.menuItemId._id !== menuItemId
      );

      if (updatedItems.length === 0) {
        return await this.deleteCart(cart._id);
      } else {
        return await this.updateCart(cart._id, updatedItems);
      }
    } catch (error) {
      console.error('Remove item from cart error:', error);
      throw new Error(error.message || 'Failed to remove item from cart');
    }
  },

  async updateItemQuantity(vendorId, menuItemId, quantity) {
    try {
      const cart = await this.getCart(vendorId);
      const updatedItems = cart.items.map(item =>
        item.menuItemId._id === menuItemId
          ? { ...item, quantity }
          : item
      );

      return await this.updateCart(cart._id, updatedItems);
    } catch (error) {
      console.error('Update item quantity error:', error);
      throw new Error(error.message || 'Failed to update item quantity');
    }
  }
};


















