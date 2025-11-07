'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { buildCartItems, calculateTotal } = require('../utils/cart-builder');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * IA Purchase Request - Purchase with stored card token (In-App)
 */
class IAPurchaseRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    if (!params.cardToken) {
      throw new Error('cardToken is required');
    }
    
    // Build and validate cart items
    const cartItems = buildCartItems(params.cart, params.discount, params.tip);
    const amount = params.amount !== undefined ? params.amount : calculateTotal(cartItems);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCIAPurchase',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      Amount: amount,
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      CardToken: params.cardToken,
      Note: params.note,
      OutputFormat: safeVal(params.outputFormat, config.outputFormat),
      CartItems: cartItems.length
    };
    
    // Add customer details if provided
    if (params.customer) {
      ipcParams.CustomerEmail = params.customer.email;
      ipcParams.CustomerFirstNames = params.customer.firstNames;
      ipcParams.CustomerFamilyName = params.customer.familyName;
      ipcParams.CustomerPhone = params.customer.phone;
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
 * Purchase with stored card
 * @param {Object} params - Parameters
 * @param {string} params.cardToken - Stored card token
 * @param {Array} params.cart - Cart items
 * @param {Object} params.customer - Customer info
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function iaPurchase(params = {}) {
  const config = loadConfig(params);
  const request = new IAPurchaseRequest(config, params);
  return await request.execute();
}

module.exports = iaPurchase;

