'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateTransactionId } = require('../config/validator');
const { safeVal } = require('../utils/common');

/**
 * Reversal Request - Reverse a transaction
 */
class ReversalRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    validateTransactionId(params.transactionId);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCReversal',
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
 * Create a reversal request
 * @param {Object} params - Reversal parameters
 * @param {string} params.transactionId - Transaction reference to reverse
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function reversal(params = {}) {
  const config = loadConfig(params);
  const request = new ReversalRequest(config, params);
  return request.execute();
}

module.exports = reversal;

