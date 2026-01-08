'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, preAuthorizationSchema } = require('../config/checkout-schemas');

/**
 * Pre-Authorization Request - Create a pre-authorization
 * NOTE: PreAuthorization does NOT use cart items, only ItemName and Amount
 */
class PreAuthorizationRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(preAuthorizationSchema, params, 'Pre-Authorization');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthorization',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      Amount: validatedParams.amount,
      Currency: safeVal(validatedParams.currency, config.currency),
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      URL_OK: safeVal(validatedParams.successUrl, config.successUrl),
      URL_Cancel: safeVal(validatedParams.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(validatedParams.notifyUrl, config.notifyUrl),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      ItemName: validatedParams.itemName || validatedParams.ItemName,
      AccountSettlement: validatedParams.accountSettlement || validatedParams.AccountSettlement,
      Note: validatedParams.note
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
  return request.execute();
}

module.exports = preAuthorization;

