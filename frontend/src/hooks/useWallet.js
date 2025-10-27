// useWallet.js

import { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';

export const useWallet = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const walletData = await walletService.getWallets();
      setWallets(walletData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const topUpWallet = async (currency, amount, method) => {
    try {
      const result = await walletService.topUp(currency, amount, method);
      await fetchWallets(); // Refresh wallets
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    wallets,
    loading,
    error,
    fetchWallets,
    topUpWallet
  };
};