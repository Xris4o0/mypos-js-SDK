'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { buildCartItems, calculateTotal } = require('../utils/cart-builder');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, paymentSessionCreateSchema } = require('../config/checkout-schemas');

/**
 * Payment Session Create Request - Create a payment session
 */
class PaymentSessionCreateRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(paymentSessionCreateSchema, params, 'Payment Session Create');
    
    // Build and validate cart items
    const cartItems = buildCartItems(validatedParams.cart, validatedParams.discount, validatedParams.tip);
    const amount = validatedParams.amount !== undefined ? validatedParams.amount : calculateTotal(cartItems);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPaymentSessionCreate',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      Amount: amount,
      Currency: safeVal(validatedParams.currency, config.currency),
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      URL_OK: safeVal(validatedParams.successUrl, config.successUrl),
      URL_Cancel: safeVal(validatedParams.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(validatedParams.notifyUrl, config.notifyUrl),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      PaymentParametersRequired: safeVal(validatedParams.paymentParametersRequired, config.paymentParametersRequired),
      Note: validatedParams.note,
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
 * Create a payment session
 * @param {Object} params - Parameters
 * @param {Array} params.cart - Cart items
 * @param {Object} params.customer - Customer info
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function paymentSessionCreate(params = {}) {
  const config = loadConfig(params);
  const request = new PaymentSessionCreateRequest(config, params);
  return request.execute();
}

module.exports = paymentSessionCreate;

