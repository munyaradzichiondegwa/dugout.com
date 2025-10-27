// Transaction.js

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  method: {
    type: String,
    enum: ['EcoCash', 'OneMoney', 'Telecash', 'ZIPIT', 'Voucher', 'Mock', 'Manual', 'Wallet', 'Refund'],
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number, // in cents
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'ZWL'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'reconciled', 'cancelled'],
    default: 'pending'
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  description: String,
  metadata: mongoose.Schema.Types.Mixed,
  processedAt: Date,
  failureReason: String
}, {
  timestamps: true
});

// Indexes for efficient querying
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ orderId: 1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return (this.amount / 100).toFixed(2);
});

// Pre-save middleware to set processedAt for successful transactions
transactionSchema.pre('save', function(next) {
  if (this.status === 'success' && !this.processedAt) {
    this.processedAt = new Date();
  }
  next();
});

// Static method to generate reference
transactionSchema.statics.generateReference = function(prefix = 'TXN') {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Method to mark as successful
transactionSchema.methods.markAsSuccess = function() {
  this.status = 'success';
  this.processedAt = new Date();
};

// Method to mark as failed
transactionSchema.methods.markAsFailed = function(reason) {
  this.status = 'failed';
  this.failureReason = reason;
};

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;