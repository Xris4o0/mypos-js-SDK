'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, iaStoreCardUpdateSchema } = require('../config/checkout-schemas');

/**
 * IA Store Card Update Request - Update a stored card
 */
class IAStoreCardUpdateRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(iaStoreCardUpdateSchema, params, 'IA Store Card Update');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCIAStoreCardUpdate',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      Currency: safeVal(validatedParams.currency, config.currency),
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      CardToken: validatedParams.cardId,
      URL_OK: safeVal(validatedParams.successUrl, config.successUrl),
      URL_Cancel: safeVal(validatedParams.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(validatedParams.notifyUrl, config.notifyUrl),
      Note: validatedParams.note
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
  return request.execute();
}

module.exports = iaStoreCardUpdate;

