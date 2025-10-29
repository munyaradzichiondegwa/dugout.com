import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PaymentCheckout = ({ order, onPaymentSuccess, onCancel }) => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('ecocash');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+263');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select'); // select, instructions, success

  const paymentMethods = [
    {
      id: 'ecocash',
      name: 'EcoCash',
      icon: '📱',
      description: 'Pay via EcoCash mobile money'
    },
    {
      id: 'onemoney',
      name: 'OneMoney',
      icon: '💳',
      description: 'Pay via OneMoney mobile money'
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay with cash when order is delivered'
    }
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dugout_token')}`
        },
        body: JSON.stringify({
          orderId: order._id,
          paymentMethod,
          phoneNumber,
          notes
        })
      });

      const data = await response.json();

      if (data.success) {
        if (paymentMethod === 'cash') {
          // For cash payments, go directly to success
          setStep('success');
          clearCart();
          onPaymentSuccess(data.payment);
        } else {
          // For mobile money, show instructions
          setStep('instructions');
        }
      } else {
        alert(data.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    clearCart();
    setStep('success');
    onPaymentSuccess();
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-700 font-medium">Order Reference: {order?.orderNumber}</p>
        </div>
        <button
          onClick={() => window.location.href = '/orders'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200"
        >
          View My Orders
        </button>
      </div>
    );
  }

  if (step === 'instructions') {
    const instructions = {
      ecocash: [
        'Dial *151# on your EcoCash registered phone',
        'Select "Send Money"',
        'Select "To Business"',
        'Enter Merchant Code: 123456',
        `Enter Amount: $${order?.total}`,
        'Enter Reference: Provided in confirmation',
        'Confirm payment with your PIN'
      ],
      onemoney: [
        'Dial *111# on your OneMoney registered phone',
        'Select "Pay Bill"',
        'Enter Business Number: 12345',
        `Enter Amount: $${order?.total}`,
        'Enter Reference: Provided in confirmation',
        'Confirm payment with your PIN'
      ]
    };

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Instructions</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-800 mb-2">Follow these steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            {instructions[paymentMethod]?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-700 text-sm">
            💡 <strong>Note:</strong> Keep the transaction confirmation message as proof of payment.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setStep('select')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition duration-200"
          >
            Back
          </button>
          <button
            onClick={handlePaymentComplete}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition duration-200"
          >
            I've Paid
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Complete Payment</h2>
      
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items total:</span>
          <span>${order?.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery fee:</span>
          <span>${order?.deliveryFee}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-800 border-t pt-2 mt-2">
          <span>Total:</span>
          <span>${order?.total}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === method.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phone Number for Mobile Money */}
      {['ecocash', 'onemoney'].includes(paymentMethod) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+263 XXX XXX XXX"
          />
        </div>
      )}

      {/* Additional Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any special instructions for your payment..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Pay $${order?.total}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentCheckout;