'use strict';

const { MyPOSConfigError, MyPOSValidationError } = require('../core/errors');

/**
 * Validates the complete configuration object
 * @param {Object} config - Configuration to validate
 * @throws {MyPOSConfigError} If required fields are missing
 */
function validateConfig(config) {
  const environment = config.environment || 'sandbox';
  
  // Required fields
  if (!config.sid) {
    throw new MyPOSConfigError(
      `MYPOS_SID is required for environment: ${environment}. ` +
      `Set it in .env as MYPOS_SID_${environment.toUpperCase()} or in config file.`
    );
  }
  
  if (!config.clientNumber) {
    throw new MyPOSConfigError(
      `MYPOS_CLIENT_NUMBER is required for environment: ${environment}. ` +
      `Set it in .env as MYPOS_CLIENT_NUMBER_${environment.toUpperCase()} or in config file.`
    );
  }
  
  if (!config.privateKey) {
    throw new MyPOSConfigError(
      `MYPOS_PRIVATE_KEY is required for environment: ${environment}. ` +
      `Set it in .env, mypos.config.js, or create a private_key.pem file.`
    );
  }
  
  // Validate environment
  const validEnvironments = ['sandbox', 'production', 'demo'];
  if (!validEnvironments.includes(config.environment)) {
    throw new MyPOSConfigError(
      `Invalid environment: ${config.environment}. Must be one of: ${validEnvironments.join(', ')}`
    );
  }
  
  // Validate private key format (should start with BEGIN RSA PRIVATE KEY or BEGIN PRIVATE KEY)
  if (!config.privateKey.includes('BEGIN') || !config.privateKey.includes('PRIVATE KEY')) {
    throw new MyPOSConfigError(
      'Invalid private key format. Expected PEM format starting with -----BEGIN PRIVATE KEY-----'
    );
  }
  
  return true;
}

/**
 * Validates cart items
 * @param {Array} cart - Cart items array
 * @throws {MyPOSValidationError} If cart is invalid
 */
function validateCart(cart) {
  if (!Array.isArray(cart)) {
    throw new MyPOSValidationError('cart must be an array', 'cart');
  }
  
  if (cart.length === 0) {
    throw new MyPOSValidationError('cart must contain at least one item', 'cart');
  }
  
  cart.forEach((item, index) => {
    if (!item.name) {
      throw new MyPOSValidationError(
        `Cart item at index ${index} is missing "name"`,
        `cart[${index}].name`
      );
    }
    
    if (typeof item.price !== 'number') {
      throw new MyPOSValidationError(
        `Cart item at index ${index} must have numeric "price"`,
        `cart[${index}].price`
      );
    }
    
    if (typeof item.quantity !== 'number') {
      throw new MyPOSValidationError(
        `Cart item at index ${index} must have numeric "quantity"`,
        `cart[${index}].quantity`
      );
    }
    
    if (item.quantity <= 0) {
      throw new MyPOSValidationError(
        `Cart item at index ${index} quantity must be greater than 0`,
        `cart[${index}].quantity`
      );
    }
  });
  
  return true;
}

/**
 * Validates customer object
 * @param {Object} customer - Customer data
 * @param {boolean} emailRequired - Whether email is required
 * @throws {MyPOSValidationError} If customer data is invalid
 */
function validateCustomer(customer, emailRequired = false) {
  if (!customer) {
    if (emailRequired) {
      throw new MyPOSValidationError('customer object is required', 'customer');
    }
    return true;
  }
  
  if (emailRequired && !customer.email) {
    throw new MyPOSValidationError('customer.email is required', 'customer.email');
  }
  
  // Validate email format if provided
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    throw new MyPOSValidationError('customer.email has invalid format', 'customer.email');
  }
  
  return true;
}

/**
 * Validates amount
 * @param {number} amount - Amount to validate
 * @param {string} field - Field name for error messages
 * @throws {MyPOSValidationError} If amount is invalid
 */
function validateAmount(amount, field = 'amount') {
  if (typeof amount !== 'number') {
    throw new MyPOSValidationError(`${field} must be a number`, field);
  }
  
  if (amount <= 0) {
    throw new MyPOSValidationError(`${field} must be greater than 0`, field);
  }
  
  if (!Number.isFinite(amount)) {
    throw new MyPOSValidationError(`${field} must be a finite number`, field);
  }
  
  return true;
}

/**
 * Validates currency code
 * @param {string} currency - Currency code (3 letters)
 * @throws {MyPOSValidationError} If currency is invalid
 */
function validateCurrency(currency) {
  if (typeof currency !== 'string') {
    throw new MyPOSValidationError('currency must be a string', 'currency');
  }
  
  if (currency.length !== 3) {
    throw new MyPOSValidationError('currency must be a 3-letter code (e.g., EUR, USD)', 'currency');
  }
  
  return true;
}

/**
 * Validates transaction ID
 * @param {string} transactionId - Transaction ID to validate
 * @throws {MyPOSValidationError} If transaction ID is invalid
 */
function validateTransactionId(transactionId) {
  if (!transactionId) {
    throw new MyPOSValidationError('transactionId is required', 'transactionId');
  }
  
  if (typeof transactionId !== 'string') {
    throw new MyPOSValidationError('transactionId must be a string', 'transactionId');
  }
  
  return true;
}

module.exports = {
  validateConfig,
  validateCart,
  validateCustomer,
  validateAmount,
  validateCurrency,
  validateTransactionId
};

