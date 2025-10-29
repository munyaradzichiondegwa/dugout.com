// Vendor.js 

import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  vendorTypes: [{
    type: String,
    enum: ['food', 'beverage', 'grocery'],
    required: true
  }],
  categories: [{
    type: String,
    trim: true
  }], // e.g., ['Pizza', 'Burger', 'African', 'Italian']
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  logo: {
    type: String,
    trim: true
  },
  banner: {
    type: String,
    trim: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    monday: { open: String, close: String }, // "09:00", "17:00"
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  payoutMethod: {
    type: String,
    enum: ['ecocash', 'onemoney', 'bank', 'cash'],
    default: 'ecocash'
  },
  payoutDetails: mongoose.Schema.Types.Mixed,
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  deliveryRadius: {
    type: Number, // in kilometers
    default: 5
  },
  minimumOrder: {
    type: Number, // in cents
    default: 0
  },
  deliveryFee: {
    type: Number, // in cents
    default: 500 // $5.00
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
vendorSchema.index({ location: '2dsphere' });
vendorSchema.index({ vendorTypes: 1 });
vendorSchema.index({ verificationStatus: 1, isActive: 1 });
vendorSchema.index({ businessName: 'text', description: 'text', categories: 'text' });

// Virtual for isOpen status
vendorSchema.virtual('isOpen').get(function() {
  const now = new Date();
  const day = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
  
  const hours = this.operatingHours[day];
  if (!hours || !hours.open || !hours.close) return false;
  
  return currentTime >= hours.open && currentTime <= hours.close;
});

// Method to check if vendor delivers to location
vendorSchema.methods.canDeliverTo = function(userLocation) {
  if (!userLocation || !userLocation.coordinates) return false;
  
  // Simple distance calculation (in a real app, use proper geospatial query)
  const [vendorLng, vendorLat] = this.location.coordinates;
  const [userLng, userLat] = userLocation.coordinates;
  
  const distance = calculateDistance(vendorLat, vendorLng, userLat, userLng);
  return distance <= this.deliveryRadius;
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;











































































