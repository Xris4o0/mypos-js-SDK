'use strict';

const { generateSignature, generateForm } = require('./signature');
const { MyPOSConfigError } = require('./errors');

/**
 * Base class for all checkout operations
 * Handles form generation, signature, and environment routing
 */
class CheckoutRequest {
  /**
   * @param {Object} config - Configuration object
   * @param {Object} ipcParams - IPC parameters for the request
   */
  constructor(config, ipcParams) {
    this.config = config;
    this.params = ipcParams;
  }
  
  /**
   * Get the appropriate myPOS checkout URL based on environment
   * @returns {string} Checkout URL
   */
  getHost() {
    const env = this.config.environment;
    
    switch (env) {
      case 'demo':
        return 'https://demo.mypos.eu/vmp/checkout';
      case 'sandbox':
        return 'https://www.mypos.com/vmp/checkout-test';
      case 'production':
        return 'https://www.mypos.com/vmp/checkout';
      default:
        throw new MyPOSConfigError(`Unknown environment: ${env}`);
    }
  }
  
  /**
   * Execute the request - generate signature and form
   * @returns {Promise<Object>} Object with redirectUrl and rawResponse
   */
  async execute() {
    try {
      // Generate signature
      const signature = generateSignature(this.params, this.config.privateKey);
      this.params.Signature = signature;
      
      // Generate HTML form
      const redirectUrl = this.getHost();
      const rawResponse = generateForm(redirectUrl, this.params);
      
      return {
        redirectUrl,
        rawResponse
      };
    } catch (error) {
      // Re-throw if it's already a MyPOS error
      if (error.name && error.name.startsWith('MyPOS')) {
        throw error;
      }
      // Wrap other errors
      throw new MyPOSConfigError(`Request execution failed: ${error.message}`);
    }
  }
}

module.exports = CheckoutRequest;

