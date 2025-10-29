import { useState } from 'react';

const PaymentMethodSelector = ({ onMethodSelect, selectedMethod }) => {
  const paymentMethods = [
    {
      id: 'ecocash',
      name: 'EcoCash',
      icon: '📱',
      description: 'Pay with your EcoCash wallet',
      color: 'green'
    },
    {
      id: 'onemoney',
      name: 'OneMoney',
      icon: '💜',
      description: 'Pay with your OneMoney wallet',
      color: 'purple'
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay with cash when order arrives',
      color: 'blue'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Transfer directly to our bank account',
      color: 'indigo'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onMethodSelect(method.id)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              {selectedMethod === method.id && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;