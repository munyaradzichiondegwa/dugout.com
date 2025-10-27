// constants.js

// Application Constants

// Vendor Types
export const VENDOR_TYPES = {
  FOOD: 'food',
  BEVERAGE: 'beverage',
  GROCERY: 'grocery'
};

// Item Types
export const ITEM_TYPES = {
  FOOD: 'food',
  BEVERAGE: 'beverage',
  GROCERY: 'grocery'
};

// Order Types
export const ORDER_TYPES = {
  INSTANT: 'instant',
  SCHEDULED: 'scheduled'
};

// Order Statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  PICKING: 'picking', // For groceries
  PACKED: 'packed',   // For groceries
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
};

// Payment Methods
export const PAYMENT_METHODS = {
  WALLET: 'wallet',
  ECOCASH: 'ecocash',
  ONEMONEY: 'onemoney',
  TELECASH: 'telecash',
  ZIPIT: 'zipit',
  VOUCHER: 'voucher',
  CASH: 'cash'
};

// Currency
export const CURRENCIES = {
  USD: 'USD',
  ZWL: 'ZWL'
};

// Transaction Types
export const TRANSACTION_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit'
};

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  RECONCILED: 'reconciled'
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin'
};

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

// Grocery Units
export const GROCERY_UNITS = [
  'kg',
  'g',
  'lb',
  'litre',
  'ml',
  'piece',
  'pack',
  'bunch',
  'dozen',
  'packet',
  'tin',
  'bottle',
  'jar',
  'box'
];

// Food Categories
export const FOOD_CATEGORIES = [
  'Main Course',
  'Appetizer',
  'Dessert',
  'Side Dish',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Vegetarian',
  'Vegan',
  'Gluten-Free'
];

// Beverage Categories
export const BEVERAGE_CATEGORIES = [
  'Beer',
  'Wine',
  'Spirits',
  'Soft Drinks',
  'Juices',
  'Coffee',
  'Tea',
  'Cocktails',
  'Mocktails',
  'Water'
];

// Grocery Categories
export const GROCERY_CATEGORIES = [
  'Fresh Produce',
  'Dairy & Eggs',
  'Meat & Poultry',
  'Seafood',
  'Bakery',
  'Frozen Foods',
  'Pantry',
  'Beverages',
  'Snacks',
  'Household',
  'Personal Care',
  'Baby Care'
];

// Zimbabwe-specific Constants
export const ZIMBABWE = {
  DEFAULT_LOCATION: {
    lat: -17.8292,
    lng: 31.0333
  },
  CURRENCY_SYMBOLS: {
    USD: 'US$',
    ZWL: 'ZWL$'
  },
  MOBILE_MONEY_PROVIDERS: ['EcoCash', 'OneMoney', 'Telecash'],
  SUPPORTED_BANKS: ['CBZ', 'Stanbic', 'Standard Chartered', 'FBC', 'NMB', 'ZB']
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 12,
  MAX_ZOOM: 18,
  MIN_ZOOM: 8,
  DEFAULT_CENTER: [-17.8292, 31.0333], // Harare, Zimbabwe
  MAP_STYLE: 'mapbox://styles/mapbox/light-v11'
};

// Wallet Configuration
export const WALLET_CONFIG = {
  MIN_TOPUP_AMOUNT: 100, // $1.00 in cents
  MAX_TOPUP_AMOUNT: 1000000, // $10,000.00 in cents
  DAILY_LIMIT: 500000, // $5,000.00 in cents
  TRANSACTION_FEE: 50 // $0.50 in cents
};

// Cart Configuration
export const CART_CONFIG = {
  MAX_ITEMS: 50,
  EXPIRY_HOURS: 24,
  MAX_QUANTITY_PER_ITEM: 99
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INSUFFICIENT_BALANCE: 'Insufficient wallet balance.',
  OUT_OF_STOCK: 'Item is out of stock.',
  CART_EXPIRED: 'Your cart has expired. Please add items again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_PLACED: 'Order placed successfully!',
  PAYMENT_SUCCESS: 'Payment processed successfully!',
  ITEM_ADDED: 'Item added to cart!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  WALLET_TOPUP: 'Wallet topped up successfully!'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'dugout_token',
  USER_DATA: 'dugout_user',
  CART_DATA: 'dugout_cart',
  RECENT_SEARCHES: 'dugout_recent_searches',
  PREFERENCES: 'dugout_preferences'
};

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'DD MMM YYYY',
  DISPLAY_TIME: 'hh:mm A',
  DISPLAY_DATETIME: 'DD MMM YYYY, hh:mm A',
  API_DATE: 'YYYY-MM-DD',
  API_DATETIME: 'YYYY-MM-DDTHH:mm:ssZ'
};

// Export all constants as a single object for easy importing
export default {
  VENDOR_TYPES,
  ITEM_TYPES,
  ORDER_TYPES,
  ORDER_STATUS,
  PAYMENT_METHODS,
  CURRENCIES,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  USER_ROLES,
  VERIFICATION_STATUS,
  GROCERY_UNITS,
  FOOD_CATEGORIES,
  BEVERAGE_CATEGORIES,
  GROCERY_CATEGORIES,
  ZIMBABWE,
  API_CONFIG,
  MAP_CONFIG,
  WALLET_CONFIG,
  CART_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  DATE_FORMATS
};