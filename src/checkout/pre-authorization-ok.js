'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');
const { validateParams, preAuthorizationOkSchema } = require('../config/checkout-schemas');

/**
 * Pre-Authorization OK Request - Handle successful pre-authorization callback
 */
class PreAuthorizationOKRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(preAuthorizationOkSchema, params, 'Pre-Authorization OK');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthorizationOK',
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
 * Handle pre-authorization OK callback
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Transaction reference
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function preAuthorizationOK(params = {}) {
  const config = loadConfig(params);
  const request = new PreAuthorizationOKRequest(config, params);
  return request.execute();
}

module.exports = preAuthorizationOK;

