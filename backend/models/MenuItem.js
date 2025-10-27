// MenuItem.js

import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number, // stored in cents (e.g., 1000 = $10.00)
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'ZWL'],
    default: 'USD'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  itemType: {
    type: String,
    enum: ['food', 'beverage', 'grocery'],
    required: true
  },
  // Grocery specific fields
  unit: {
    type: String,
    required: function() {
      return this.itemType === 'grocery';
    }
  }, // 'kg', 'litre', 'piece', 'pack'
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number, // in grams
    carbs: Number,   // in grams
    fat: Number      // in grams
  },
  allergens: [String],
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'very hot'],
    default: 'mild'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
menuItemSchema.index({ vendorId: 1, itemType: 1 });
menuItemSchema.index({ vendorId: 1, category: 1 });
menuItemSchema.index({ vendorId: 1, isAvailable: 1 });
menuItemSchema.index({ itemType: 1, category: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return (this.price / 100).toFixed(2);
});

// Method to check if item is in stock
menuItemSchema.methods.isInStock = function(quantity = 1) {
  if (this.itemType !== 'grocery') return true;
  return this.stockQuantity >= quantity;
};

// Method to decrease stock
menuItemSchema.methods.decreaseStock = function(quantity) {
  if (this.itemType === 'grocery') {
    if (this.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }
    this.stockQuantity -= quantity;
  }
  return this;
};

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;