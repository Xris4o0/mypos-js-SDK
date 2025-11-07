'use strict';

/**
 * MyPOS Checkout SDK
 * Modern, clean SDK for generating myPOS checkout requests
 * 
 * @example Functional API (recommended)
 * const { purchase, refund, reversal } = require('@mypos/JS-checkout-SDK');
 * 
 * const result = await purchase({
 *   cart: [{name: 'Product', price: 50, quantity: 1}],
 *   customer: {email: 'user@example.com'}
 * });
 * 
 * @example Class-based API (optional)
 * const { MyPOSCheckout } = require('@mypos/JS-checkout-SDK');
 * const checkout = new MyPOSCheckout(config);
 * await checkout.purchase({...});
 */

// Export all checkout operations (functional API)
const checkout = require('./checkout');

// Export client class (class-based API)
const MyPOSCheckout = require('./client');

// Export utilities for advanced use cases
const { loadConfig, clearCache } = require('./config');
const errors = require('./core/errors');

// Main exports
module.exports = {
  // All checkout operations (functional API)
  ...checkout,
  
  // Client class (class-based API)
  MyPOSCheckout,
  
  // Utilities
  loadConfig,
  clearCache,
  
  // Error classes
  ...errors
};

// Default export for convenience
module.exports.default = module.exports;

