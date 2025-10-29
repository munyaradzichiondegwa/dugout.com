// useCart.js

import { useCart } from '../context/CartContext';
import { cartService } from '../services/cartService';

export const useCartOperations = () => {
  const { cart, dispatch } = useCart();

  const fetchCart = async (vendorId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cartData = await cartService.getCart(vendorId);
      dispatch({ type: 'SET_CART', payload: cartData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (vendorId, menuItem) => {
    try {
      let updatedCart;
      
      if (!cart) {
        updatedCart = await cartService.createCart(vendorId, [{
          menuItemId: menuItem._id,
          quantity: 1,
          specialInstructions: ''
        }]);
      } else {
        const existingItem = cart.items.find(
          item => item.menuItemId._id === menuItem._id
        );

        const updatedItems = existingItem
          ? cart.items.map(item =>
              item.menuItemId._id === menuItem._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [
              ...cart.items,
              {
                menuItemId: menuItem._id,
                quantity: 1,
                specialInstructions: '',
                unitPrice: menuItem.price,
                currency: menuItem.currency
              }
            ];

        updatedCart = await cartService.updateCart(cart._id, updatedItems);
      }

      dispatch({ type: 'ADD_ITEM', payload: updatedCart });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (menuItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const updatedItems = cart.items.map(item =>
        item.menuItemId._id === menuItemId
          ? { ...item, quantity: newQuantity }
          : item
      );

      const updatedCart = await cartService.updateCart(cart._id, updatedItems);
      dispatch({ type: 'UPDATE_ITEM', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const removeItem = async (menuItemId) => {
    try {
      const updatedItems = cart.items.filter(
        item => item.menuItemId._id !== menuItemId
      );

      if (updatedItems.length === 0) {
        await cartService.deleteCart(cart._id);
        dispatch({ type: 'CLEAR_CART' });
      } else {
        const updatedCart = await cartService.updateCart(cart._id, updatedItems);
        dispatch({ type: 'REMOVE_ITEM', payload: updatedCart });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const clearCart = async () => {
    if (cart) {
      await cartService.deleteCart(cart._id);
    }
    dispatch({ type: 'CLEAR_CART' });
  };

  return {
    cart,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  };
};