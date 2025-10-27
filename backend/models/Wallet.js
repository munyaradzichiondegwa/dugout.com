// Wallet.js

import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number, // in cents
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'ZWL'],
    required: true
  },
  pendingHold: {
    type: Number, // in cents
    default: 0,
    min: 0
  },
  metadata: {
    lastTopUpMethod: String,
    lastTopUpAmount: Number,
    lastTopUpDate: Date,
    dailyLimit: { type: Number, default: 500000 }, // $5,000.00
    monthlyLimit: { type: Number, default: 10000000 } // $100,000.00
  }
}, {
  timestamps: true
});

// Index for user queries
walletSchema.index({ userId: 1 });
walletSchema.index({ currency: 1 });

// Virtual for available balance (balance - pending holds)
walletSchema.virtual('availableBalance').get(function() {
  return Math.max(0, this.balance - this.pendingHold);
});

// Virtual for formatted balance
walletSchema.virtual('formattedBalance').get(function() {
  return (this.balance / 100).toFixed(2);
});

// Method to check if sufficient balance
walletSchema.methods.hasSufficientBalance = function(amount) {
  return this.availableBalance >= amount;
};

// Method to add funds
walletSchema.methods.addFunds = function(amount, method = 'manual') {
  this.balance += amount;
  
  // Update metadata
  this.metadata.lastTopUpMethod = method;
  this.metadata.lastTopUpAmount = amount;
  this.metadata.lastTopUpDate = new Date();
};

// Method to deduct funds
walletSchema.methods.deductFunds = function(amount) {
  if (!this.hasSufficientBalance(amount)) {
    throw new Error('Insufficient balance');
  }
  this.balance -= amount;
};

// Method to place hold on funds
walletSchema.methods.placeHold = function(amount) {
  if (!this.hasSufficientBalance(amount)) {
    throw new Error('Insufficient balance for hold');
  }
  this.pendingHold += amount;
};

// Method to release hold
walletSchema.methods.releaseHold = function(amount) {
  this.pendingHold = Math.max(0, this.pendingHold - amount);
};

// Method to complete hold (convert hold to actual deduction)
walletSchema.methods.completeHold = function(amount) {
  this.pendingHold = Math.max(0, this.pendingHold - amount);
  this.balance -= amount;
};

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;