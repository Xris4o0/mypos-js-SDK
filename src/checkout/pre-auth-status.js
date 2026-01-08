'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');
const { validateParams, preAuthStatusSchema } = require('../config/checkout-schemas');

/**
 * Pre-Auth Status Request - Get status of pre-authorization
 */
class PreAuthStatusRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(preAuthStatusSchema, params, 'Pre-Auth Status');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthStatus',
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
 * Get pre-authorization status
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Pre-auth reference
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function preAuthStatus(params = {}) {
  const config = loadConfig(params);
  const request = new PreAuthStatusRequest(config, params);
  return request.execute();
}

module.exports = preAuthStatus;

