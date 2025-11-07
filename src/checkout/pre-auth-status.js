'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateTransactionId } = require('../config/validator');
const { safeVal } = require('../utils/common');

/**
 * Pre-Auth Status Request - Get status of pre-authorization
 */
class PreAuthStatusRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    validateTransactionId(params.transactionId);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthStatus',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      IPC_Trnref: params.transactionId,
      OutputFormat: safeVal(params.outputFormat, config.outputFormat)
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
  return await request.execute();
}

module.exports = preAuthStatus;

