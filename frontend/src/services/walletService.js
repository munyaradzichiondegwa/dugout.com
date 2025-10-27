import { api } from './api';

export const walletService = {
  async getWallets() {
    try {
      const response = await api.get('/wallets');
      return response.wallets || [];
    } catch (error) {
      console.error('Get wallets error:', error);
      throw new Error(error.message || 'Failed to fetch wallets');
    }
  },

  async getWallet(currency) {
    try {
      const response = await api.get(`/wallets/${currency}`);
      return response.wallet;
    } catch (error) {
      console.error('Get wallet error:', error);
      throw new Error(error.message || 'Failed to fetch wallet');
    }
  },

  async topUp(currency, amount, method) {
    try {
      const response = await api.post('/wallets/topup', {
        currency,
        amount,
        method
      });
      return response;
    } catch (error) {
      console.error('Top-up error:', error);
      throw new Error(error.message || 'Failed to process top-up');
    }
  },

  async getTransactions(page = 1, limit = 20, type = null, currency = null) {
    try {
      const params = new URLSearchParams({ page, limit });
      if (type) params.append('type', type);
      if (currency) params.append('currency', currency);
      
      const response = await api.get(`/wallets/transactions?${params}`);
      return response;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw new Error(error.message || 'Failed to fetch transactions');
    }
  },

  async transferFunds(fromCurrency, toCurrency, amount) {
    try {
      const response = await api.post('/wallets/transfer', {
        fromCurrency,
        toCurrency,
        amount
      });
      return response;
    } catch (error) {
      console.error('Transfer funds error:', error);
      throw new Error(error.message || 'Failed to transfer funds');
    }
  },

  async getBalance(currency) {
    try {
      const wallets = await this.getWallets();
      const wallet = wallets.find(w => w.currency === currency);
      return wallet ? wallet.balance : 0;
    } catch (error) {
      console.error('Get balance error:', error);
      return 0;
    }
  },

  async getTotalBalance() {
    try {
      const wallets = await this.getWallets();
      return wallets.reduce((total, wallet) => total + wallet.balance, 0);
    } catch (error) {
      console.error('Get total balance error:', error);
      return 0;
    }
  }
};





