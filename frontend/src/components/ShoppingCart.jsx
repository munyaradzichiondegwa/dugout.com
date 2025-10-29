// ShoppingCart.jsx

import { useState } from 'react';
import { useCartOperations } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';

const ShoppingCart = ({ vendorId, onCheckout }) => {
  const { user } = useAuth();
  const { cart, addToCart, updateQuantity, removeItem } = useCartOperations();
  const [showCart, setShowCart] = useState(false);
  const [addingItem, setAddingItem] = useState(null);

  const handleAddToCart = async (menuItem) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    setAddingItem(menuItem._id);
    try {
      await addToCart(vendorId, menuItem);
      setShowCart(true);
    } catch (error) {
      alert('Error adding item to cart: ' + error.message);
    } finally {
      setAddingItem(null);
    }
  };

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: currency === 'ZWL' ? 'ZWL' : 'USD'
    }).format(amount / 100);
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  if (!showCart && (!cart || cart.items.length === 0)) {
    return (
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        🛒 {cartItemCount > 0 && `(${cartItemCount})`}
      </button>
    );
  }

  return (
    <>
      {/* Add to Cart Button for Menu Items */}
      <button
        onClick={() => handleAddToCart(menuItem)}
        disabled={addingItem === menuItem._id}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {addingItem === menuItem._id ? 'Adding...' : 'Add to Cart'}
      </button>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              {!cart || cart.items.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => (
                      <div key={item.menuItemId._id} className="flex justify-between items-center border-b pb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.menuItemId.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.unitPrice, item.currency)} each
                            {item.menuItemId.unit && ` • ${item.menuItemId.unit}`}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.menuItemId._id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId._id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.menuItemId._id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold">
                        {formatPrice(cart.totalAmount, cart.currency)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => onCheckout(cart)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;