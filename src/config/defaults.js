'use strict';

/**
 * Default configuration values for myPOS Checkout SDK
 */
module.exports = {
  // Default environment
  environment: 'sandbox',
  
  // Default IPC parameters
  lang: 'EN',
  version: '1.4',
  currency: 'EUR',
  
  // Default card token request (0 = no, 1 = yes)
  cardTokenRequest: 0,
  
  // Default payment method (1 = standard)
  paymentMethod: 1,
  
  // Default payment parameters required (1 = yes, 3 = no)
  paymentParametersRequired: 1,
  
  // Default output format for API responses
  outputFormat: 'JSON',
  
  // Log level
  logLevel: 'info',
  
  // URLs (should be overridden by user)
  successUrl: '',
  cancelUrl: '',
  notifyUrl: ''
};

