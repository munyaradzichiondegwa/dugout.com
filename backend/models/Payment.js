import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'ZWL']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['ecocash', 'onemoney', 'cash', 'bank_transfer', 'card']
  },
  // EcoCash/OneMoney specific fields
  phoneNumber: {
    type: String,
    required: function() {
      return ['ecocash', 'onemoney'].includes(this.paymentMethod);
    }
  },
  reference: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  gatewayResponse: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // For manual verification (common in Zim)
  proofOfPayment: {
    image: String,
    notes: String,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  }
}, {
  timestamps: true
});

// Generate reference before saving
paymentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Payment').countDocuments();
    this.reference = `PAY-${Date.now()}-${count + 1}`;
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;