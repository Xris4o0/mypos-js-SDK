'use strict';

const { loadConfig } = require('./config');
const checkout = require('./checkout');

/**
 * MyPOS Checkout Client
 * Optional class-based API for checkout operations
 * 
 * @example
 * const client = new MyPOSCheckout({
 *   environment: 'sandbox',
 *   sid: 'YOUR_SID',
 *   clientNumber: 'YOUR_CLIENT_NUMBER',
 *   privateKey: 'YOUR_PRIVATE_KEY'
 * });
 * 
 * await client.purchase({
 *   cart: [{name: 'Product', price: 50, quantity: 1}],
 *   customer: {email: 'user@example.com'}
 * });
 */
class MyPOSCheckout {
  /**
   * Create a MyPOS Checkout client
   * @param {Object} config - Configuration object
   */
  constructor(config = {}) {
    // Load and validate config
    this.config = loadConfig(config);
    
    // Bind all checkout operations to this instance
    // This allows: client.purchase(), client.refund(), etc.
    Object.keys(checkout).forEach(operation => {
      this[operation] = async (params = {}) => {
        // Merge instance config with call params
        const mergedParams = { ...this.config, ...params };
        return await checkout[operation](mergedParams);
      };
    });
  }
  
  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...this.config };
  }
  
  /**
   * Update configuration
   * @param {Object} newConfig - Configuration to merge
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

module.exports = MyPOSCheckout;

