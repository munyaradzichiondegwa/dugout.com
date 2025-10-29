// Reservation.js

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  reservationTime: {
    type: Date,
    required: true
  },
  partySize: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  specialRequests: String,
  duration: {
    type: Number, // in minutes
    default: 120
  },
  tableNumber: String,
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }
}, {
  timestamps: true
});

reservationSchema.index({ vendorId: 1, reservationTime: 1 });
reservationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Reservation', reservationSchema);