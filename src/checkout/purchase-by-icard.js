'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { buildCartItems, calculateTotal } = require('../utils/cart-builder');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, purchaseByIcardSchema } = require('../config/checkout-schemas');

/**
 * Purchase By iCard Request - Purchase using iCard payment method
 */
class PurchaseByIcardRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(purchaseByIcardSchema, params, 'Purchase By iCard');
    
    // Build and validate cart items
    const cartItems = buildCartItems(validatedParams.cart, validatedParams.discount, validatedParams.tip);
    const amount = validatedParams.amount !== undefined ? validatedParams.amount : calculateTotal(cartItems);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPurchaseByIcard',
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
    
    // IPCPurchaseByIcard needs CustomerEmail if no CustomerPhone is provided
    // CustomerPhone is required when CustomerEmail is not provided
    // Must be in International Phone Numbers Format (E.123): (+)(country code)(client number)
    if (validatedParams.customer) {
      if (validatedParams.customer.email) {
        ipcParams.CustomerEmail = validatedParams.customer.email;
        // CustomerPhone is optional when CustomerEmail is provided
        if (validatedParams.customer.phone) {
          ipcParams.CustomerPhone = validatedParams.customer.phone;
        }
      } else if (validatedParams.customer.phone) {
        // CustomerPhone is required when CustomerEmail is not provided
        ipcParams.CustomerPhone = validatedParams.customer.phone;
      }
    }
    
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
 * Purchase using iCard payment method
 * @param {Object} params - Parameters
 * @param {Array} params.cart - Cart items
 * @param {Object} params.customer - Customer info
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function purchaseByIcard(params = {}) {
  const config = loadConfig(params);
  const request = new PurchaseByIcardRequest(config, params);
  return request.execute();
}

module.exports = purchaseByIcard;

