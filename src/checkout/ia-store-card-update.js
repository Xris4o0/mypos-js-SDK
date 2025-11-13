'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * IA Store Card Update Request - Update a stored card
 */
class IAStoreCardUpdateRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    if (!params.cardId) {
      throw new Error('cardId is required');
    }
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCIAStoreCardUpdate',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      CardToken: params.cardId,
      URL_OK: safeVal(params.successUrl, config.successUrl),
      URL_Cancel: safeVal(params.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(params.notifyUrl, config.notifyUrl),
      Note: params.note
    };
    
    super(config, ipcParams);
  }
}

/**
 * Update a stored card
 * @param {Object} params - Parameters
 * @param {string} params.cardId - Card token to update
 * @param {Object} params.customer - Customer info
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function iaStoreCardUpdate(params = {}) {
  const config = loadConfig(params);
  const request = new IAStoreCardUpdateRequest(config, params);
  return await request.execute();
}

module.exports = iaStoreCardUpdate;

