import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const EcoCashPayment = ({ amount, onPaymentSubmit, loading }) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+263');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    onPaymentSubmit({ phoneNumber });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-3xl">📱</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">EcoCash Payment</h3>
          <p className="text-sm text-gray-600">Pay using your EcoCash wallet</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            EcoCash Registered Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="+263 XXX XXX XXX"
            required
          />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Payment Instructions:</h4>
          <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
            <li>Dial *151# on your EcoCash registered phone</li>
            <li>Select "Send Money"</li>
            <li>Select "To Business"</li>
            <li>Enter Merchant Code: <strong>123456</strong></li>
            <li>Enter Amount: <strong>${amount}</strong></li>
            <li>Enter Reference: <strong>DugOut-{Date.now()}</strong></li>
            <li>Confirm payment with your PIN</li>
          </ol>
          <p className="text-xs text-green-600 mt-2">
            Keep the transaction confirmation message as proof of payment.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="agreeTerms" className="text-sm text-gray-600">
            I agree to the <a href="/terms" className="text-green-600 hover:text-green-500">terms and conditions</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !agreeTerms}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay $${amount} with EcoCash`
          )}
        </button>
      </form>
    </div>
  );
};

export default EcoCashPayment;