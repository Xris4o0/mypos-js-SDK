'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');
const { validateParams, preAuthorizationNotifySchema } = require('../config/checkout-schemas');

/**
 * Pre-Authorization Notify Request - Handle pre-authorization notification
 */
class PreAuthorizationNotifyRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(preAuthorizationNotifySchema, params, 'Pre-Authorization Notify');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthorizationNotify',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      IPC_Trnref: validatedParams.transactionId,
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat)
    };
    
    super(config, ipcParams);
  }
}

/**
 * Handle pre-authorization notify callback
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Transaction reference
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function preAuthorizationNotify(params = {}) {
  const config = loadConfig(params);
  const request = new PreAuthorizationNotifyRequest(config, params);
  return request.execute();
}

module.exports = preAuthorizationNotify;

