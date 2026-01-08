'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');
const { validateParams, preAuthorizationCancelSchema } = require('../config/checkout-schemas');

/**
 * Pre-Authorization Cancel Request - Handle canceled pre-authorization callback
 */
class PreAuthorizationCancelRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(preAuthorizationCancelSchema, params, 'Pre-Authorization Cancel');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthorizationCancel',
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
 * Handle pre-authorization cancel callback
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Transaction reference
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function preAuthorizationCancel(params = {}) {
  const config = loadConfig(params);
  const request = new PreAuthorizationCancelRequest(config, params);
  return request.execute();
}

module.exports = preAuthorizationCancel;

