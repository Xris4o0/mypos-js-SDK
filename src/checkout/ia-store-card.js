'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, iaStoreCardSchema } = require('../config/checkout-schemas');

/**
 * IA Store Card Request - Store a card for future use
 */
class IAStoreCardRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(iaStoreCardSchema, params, 'IA Store Card');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCIAStoreCard',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      Currency: safeVal(validatedParams.currency, config.currency),
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      URL_OK: safeVal(validatedParams.successUrl, config.successUrl),
      URL_Cancel: safeVal(validatedParams.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(validatedParams.notifyUrl, config.notifyUrl),
      Note: validatedParams.note
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
  return request.execute();
}

module.exports = iaStoreCard;

