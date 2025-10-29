// WalletBalance.jsx

import { useWallet } from '../hooks/useWallet';

const WalletBalance = () => {
  const { wallets, loading, error } = useWallet();

  const formatBalance = (amount, currency) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: currency === 'ZWL' ? 'ZWL' : 'USD'
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex space-x-4">
        {[1, 2].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg p-3 w-32">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Error loading wallets: {error}</div>;
  }

  return (
    <div className="flex space-x-4">
      {wallets.map((wallet) => (
        <div
          key={wallet.currency}
          className="bg-white border rounded-lg p-3 shadow-sm"
        >
          <div className="text-sm text-gray-600">{wallet.currency} Balance</div>
          <div className="text-lg font-semibold">
            {formatBalance(wallet.balance, wallet.currency)}
          </div>
          {wallet.pendingHold > 0 && (
            <div className="text-xs text-orange-600">
              Hold: {formatBalance(wallet.pendingHold, wallet.currency)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WalletBalance;