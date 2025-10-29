// walletController.js

import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';

export const getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find({ userId: req.user._id });

    res.json({
      success: true,
      wallets
    });
  } catch (error) {
    console.error('Get wallets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallets'
    });
  }
};

export const getWallet = async (req, res) => {
  try {
    const { currency } = req.params;

    const wallet = await Wallet.findOne({ 
      userId: req.user._id, 
      currency: currency.toUpperCase() 
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.json({
      success: true,
      wallet
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet'
    });
  }
};

export const topUpWallet = async (req, res) => {
  try {
    const { currency, amount, method } = req.body;

    // Validate amount
    if (amount < 100) { // Minimum top-up $1.00
      return res.status(400).json({
        success: false,
        message: 'Minimum top-up amount is $1.00'
      });
    }

    if (amount > 1000000) { // Maximum top-up $10,000.00
      return res.status(400).json({
        success: false,
        message: 'Maximum top-up amount is $10,000.00'
      });
    }

    // Find or create wallet
    let wallet = await Wallet.findOne({ userId: req.user._id, currency });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user._id,
        currency,
        balance: 0,
        pendingHold: 0
      });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      userId: req.user._id,
      type: 'credit',
      method,
      reference: `TOPUP_${uuidv4()}`,
      amount,
      currency,
      status: 'pending',
      metadata: {
        topUpMethod: method,
        initiatedAt: new Date()
      }
    });

    // In a real application, you would integrate with payment gateway here
    // For now, we'll simulate successful payment after 2 seconds

    setTimeout(async () => {
      try {
        // Update wallet balance
        wallet.balance += amount;
        await wallet.save();

        // Update transaction status
        transaction.status = 'success';
        await transaction.save();

        console.log(`Top-up completed: ${amount} ${currency} for user ${req.user._id}`);
      } catch (error) {
        console.error('Top-up completion error:', error);
      }
    }, 2000);

    res.json({
      success: true,
      message: 'Top-up initiated successfully',
      transaction: {
        id: transaction._id,
        reference: transaction.reference,
        amount,
        currency,
        status: transaction.status
      }
    });
  } catch (error) {
    console.error('Top-up wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process top-up'
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, currency } = req.query;

    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (currency) query.currency = currency;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
};

export const transferFunds = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;

    // Find source wallet
    const sourceWallet = await Wallet.findOne({ 
      userId: req.user._id, 
      currency: fromCurrency 
    });

    if (!sourceWallet || sourceWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Find or create target wallet
    let targetWallet = await Wallet.findOne({ 
      userId: req.user._id, 
      currency: toCurrency 
    });

    if (!targetWallet) {
      targetWallet = await Wallet.create({
        userId: req.user._id,
        currency: toCurrency,
        balance: 0,
        pendingHold: 0
      });
    }

    // Simple conversion rate (in real app, use current exchange rates)
    const conversionRates = {
      'USD-ZWL': 500, // 1 USD = 500 ZWL
      'ZWL-USD': 0.002 // 1 ZWL = 0.002 USD
    };

    const rateKey = `${fromCurrency}-${toCurrency}`;
    const conversionRate = conversionRates[rateKey];

    if (!conversionRate) {
      return res.status(400).json({
        success: false,
        message: 'Currency conversion not supported'
      });
    }

    const convertedAmount = Math.round(amount * conversionRate);

    // Perform transfer
    sourceWallet.balance -= amount;
    targetWallet.balance += convertedAmount;

    await Promise.all([sourceWallet.save(), targetWallet.save()]);

    // Create transaction records
    await Transaction.create([
      {
        userId: req.user._id,
        type: 'debit',
        method: 'transfer',
        reference: `XFER_${uuidv4()}`,
        amount,
        currency: fromCurrency,
        status: 'success',
        metadata: {
          transferTo: toCurrency,
          convertedAmount,
          rate: conversionRate
        }
      },
      {
        userId: req.user._id,
        type: 'credit',
        method: 'transfer',
        reference: `XFER_${uuidv4()}`,
        amount: convertedAmount,
        currency: toCurrency,
        status: 'success',
        metadata: {
          transferFrom: fromCurrency,
          originalAmount: amount,
          rate: conversionRate
        }
      }
    ]);

    res.json({
      success: true,
      message: 'Funds transferred successfully',
      transfer: {
        from: { currency: fromCurrency, amount },
        to: { currency: toCurrency, amount: convertedAmount },
        rate: conversionRate
      }
    });
  } catch (error) {
    console.error('Transfer funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transfer funds'
    });
  }
};