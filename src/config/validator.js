'use strict';

const { z } = require('zod');
const { MyPOSConfigError, MyPOSValidationError } = require('../core/errors');

// Zod schemas
const environmentSchema = z.enum(['sandbox', 'production', 'demo']);

const configSchema = z.object({
  environment: environmentSchema,
  sid: z.string().min(1, 'MYPOS_SID is required'),
  clientNumber: z.string().min(1, 'MYPOS_CLIENT_NUMBER is required'),
  privateKey: z
    .string()
    .min(1, 'MYPOS_PRIVATE_KEY is required')
    .refine(
      (key) => key.includes('BEGIN') && key.includes('PRIVATE KEY'),
      {
        message: 'Invalid private key format. Expected PEM format starting with -----BEGIN PRIVATE KEY-----'
      }
    ),
  currency: z.string().optional(),
  lang: z.string().optional(),
  version: z.string().optional(),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
  notifyUrl: z.string().optional(),
  keyIndex: z.union([z.number(), z.string().transform((val) => Number(val))]).optional(),
  cardTokenRequest: z.union([z.number(), z.string().transform((val) => Number(val))]).optional(),
  paymentMethod: z.union([z.number(), z.string().transform((val) => Number(val))]).optional(),
  paymentParametersRequired: z.union([z.number(), z.string().transform((val) => Number(val))]).optional(),
  onBeforeSign: z.any().optional(), // Function type - validated at runtime
  onAfterSign: z.any().optional(), // Function type - validated at runtime
  onError: z.any().optional() // Function type - validated at runtime
}).passthrough(); // Allow additional properties

const cartItemSchema = z.object({
  name: z.string().min(1, 'Cart item name is required'),
  price: z.number().positive('Cart item price must be greater than 0'),
  quantity: z.number().int().positive('Cart item quantity must be greater than 0')
});

const cartSchema = z
  .array(cartItemSchema)
  .min(1, 'Cart must contain at least one item');

const customerSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  firstNames: z.string().optional(),
  lastName: z.string().optional(),
  familyName: z.string().optional(),
  address: z.string().optional()
}).passthrough();

const amountSchema = z.number().positive('Amount must be greater than 0').finite('Amount must be a finite number');

const currencySchema = z.string().length(3, 'Currency must be a 3-letter code (e.g., EUR, USD)');

const transactionIdSchema = z.string().min(1, 'Transaction ID is required');

/**
 * Validates the complete configuration object
 * @param {Object} config - Configuration to validate
 * @throws {MyPOSConfigError} If required fields are missing or invalid
 */
function validateConfig(config) {
  try {
    // Validate the config as-is (already merged with defaults)
    configSchema.parse(config);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const environment = config?.environment || 'sandbox';
      const firstError = error.errors[0];
      const field = firstError.path.join('.');
      
      // Provide helpful error messages for required fields
      if (field === 'sid' || field === 'clientNumber' || field === 'privateKey') {
        const fieldName = field === 'sid' ? 'SID' : 
                         field === 'clientNumber' ? 'CLIENT_NUMBER' : 
                         'PRIVATE_KEY';
        // Match test expectations: "SID is required" should be in the message
        throw new MyPOSConfigError(
          `${fieldName} is required for environment: ${environment}. ` +
          `Set it in .env as MYPOS_${fieldName}_${environment.toUpperCase()} or in config file.`
        );
      }
      
      throw new MyPOSConfigError(
        firstError.message || `Invalid configuration: ${field}`
      );
    }
    throw error;
  }
}

/**
 * Validates cart items
 * @param {Array} cart - Cart items array
 * @throws {MyPOSValidationError} If cart is invalid
 */
function validateCart(cart) {
  try {
    cartSchema.parse(cart);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      const path = firstError.path.join('.');
      throw new MyPOSValidationError(
        firstError.message || `Invalid cart: ${path}`,
        path || 'cart'
      );
    }
    throw error;
  }
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

  try {
    const schema = emailRequired
      ? customerSchema.extend({
          email: z.string().email('Invalid email format').min(1, 'Email is required')
        })
      : customerSchema;
    
    schema.parse(customer);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      const field = firstError.path.join('.') || 'customer';
      throw new MyPOSValidationError(
        firstError.message || `Invalid customer: ${field}`,
        field
      );
    }
    throw error;
  }
}

/**
 * Validates amount
 * @param {number} amount - Amount to validate
 * @param {string} field - Field name for error messages
 * @throws {MyPOSValidationError} If amount is invalid
 */
function validateAmount(amount, field = 'amount') {
  try {
    amountSchema.parse(amount);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new MyPOSValidationError(
        firstError.message || `${field} is invalid`,
        field
      );
    }
    throw error;
  }
}

/**
 * Validates currency code
 * @param {string} currency - Currency code (3 letters)
 * @throws {MyPOSValidationError} If currency is invalid
 */
function validateCurrency(currency) {
  try {
    currencySchema.parse(currency);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new MyPOSValidationError(
        firstError.message || 'Currency is invalid',
        'currency'
      );
    }
    throw error;
  }
}

/**
 * Validates transaction ID
 * @param {string} transactionId - Transaction ID to validate
 * @throws {MyPOSValidationError} If transaction ID is invalid
 */
function validateTransactionId(transactionId) {
  try {
    transactionIdSchema.parse(transactionId);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new MyPOSValidationError(
        firstError.message || 'Transaction ID is invalid',
        'transactionId'
      );
    }
    throw error;
  }
}

module.exports = {
  validateConfig,
  validateCart,
  validateCustomer,
  validateAmount,
  validateCurrency,
  validateTransactionId
};
