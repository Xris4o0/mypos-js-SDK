'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Pre-Authorization Request - Create a pre-authorization
 * NOTE: PreAuthorization does NOT use cart items, only ItemName and Amount
 */
class PreAuthorizationRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    if (!params.amount && typeof params.amount !== 'number') {
      throw new Error('amount is required for pre-authorization');
    }
    
    if (!params.itemName && !params.ItemName) {
      throw new Error('itemName is required for pre-authorization');
    }
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthorization',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      Amount: params.amount,
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      URL_OK: safeVal(params.successUrl, config.successUrl),
      URL_Cancel: safeVal(params.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(params.notifyUrl, config.notifyUrl),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      ItemName: params.itemName || params.ItemName,
      AccountSettlement: params.accountSettlement || params.AccountSettlement,
      Note: params.note
    };
    
    super(config, ipcParams);
  }
}

/**
 * Create a pre-authorization
 * @param {Object} params - Parameters
 * @param {number} params.amount - Amount to pre-authorize (REQUIRED)
 * @param {string} params.itemName - Description of item (REQUIRED)
 * @param {string} params.currency - Currency code
 * @param {string} params.accountSettlement - Optional account settlement
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function preAuthorization(params = {}) {
  const config = loadConfig(params);
  const request = new PreAuthorizationRequest(config, params);
  return await request.execute();
}

module.exports = preAuthorization;

