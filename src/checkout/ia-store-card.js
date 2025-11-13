'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * IA Store Card Request - Store a card for future use
 */
class IAStoreCardRequest extends CheckoutRequest {
  constructor(config, params) {
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCIAStoreCard',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      URL_OK: safeVal(params.successUrl, config.successUrl),
      URL_Cancel: safeVal(params.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(params.notifyUrl, config.notifyUrl),
      Note: params.note
    };
    
    super(config, ipcParams);
  }
}

/**
 * Store a card for future use
 * @param {Object} params - Parameters
 * @param {Object} params.customer - Customer info
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function iaStoreCard(params = {}) {
  const config = loadConfig(params);
  const request = new IAStoreCardRequest(config, params);
  return await request.execute();
}

module.exports = iaStoreCard;

