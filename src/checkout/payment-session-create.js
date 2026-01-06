'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { buildCartItems, calculateTotal } = require('../utils/cart-builder');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Payment Session Create Request - Create a payment session
 */
class PaymentSessionCreateRequest extends CheckoutRequest {
  constructor(config, params) {
    // Build and validate cart items
    const cartItems = buildCartItems(params.cart, params.discount, params.tip);
    const amount = params.amount !== undefined ? params.amount : calculateTotal(cartItems);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPaymentSessionCreate',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      Amount: amount,
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      URL_OK: safeVal(params.successUrl, config.successUrl),
      URL_Cancel: safeVal(params.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(params.notifyUrl, config.notifyUrl),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      PaymentParametersRequired: safeVal(params.paymentParametersRequired, config.paymentParametersRequired),
      Note: params.note,
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

