'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { buildCartItems, calculateTotal } = require('../utils/cart-builder');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, iaPreAuthorizationSchema } = require('../config/checkout-schemas');

/**
 * IA Pre-Authorization Request - Pre-authorize with stored card token
 */
class IAPreAuthorizationRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(iaPreAuthorizationSchema, params, 'IA Pre-Authorization');
    
    // Build and validate cart items
    const cartItems = buildCartItems(validatedParams.cart, validatedParams.discount, validatedParams.tip);
    const amount = validatedParams.amount !== undefined ? validatedParams.amount : calculateTotal(cartItems);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCIAPreAuthorization',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      Amount: amount,
      Currency: safeVal(validatedParams.currency, config.currency),
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      CardToken: validatedParams.cardToken,
      Note: validatedParams.note,
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat),
      CartItems: cartItems.length
    };
    
    // Add cart items
    cartItems.forEach((item, index) => {
      const num = index + 1;
      ipcParams[`Article_${num}`] = item.name;
      ipcParams[`Quantity_${num}`] = item.quantity;
      ipcParams[`Price_${num}`] = item.price;
      ipcParams[`Currency_${num}`] = ipcParams.Currency;
      ipcParams[`Amount_${num}`] = item.price * item.quantity;
    });
    
    super(config, ipcParams);
  }
}

/**
 * Pre-authorize with stored card
 * @param {Object} params - Parameters
 * @param {string} params.cardToken - Stored card token
 * @param {Array} params.cart - Cart items
 * @param {Object} params.customer - Customer info
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function iaPreAuthorization(params = {}) {
  const config = loadConfig(params);
  const request = new IAPreAuthorizationRequest(config, params);
  return request.execute();
}

module.exports = iaPreAuthorization;

