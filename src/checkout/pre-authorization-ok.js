'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');

/**
 * Pre-Authorization OK Request - Handle successful pre-authorization callback
 */
class PreAuthorizationOKRequest extends CheckoutRequest {
  constructor(config, params) {
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthorizationOK',
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
 * Handle pre-authorization OK callback
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Transaction reference
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function preAuthorizationOK(params = {}) {
  const config = loadConfig(params);
  const request = new PreAuthorizationOKRequest(config, params);
  return await request.execute();
}

module.exports = preAuthorizationOK;

