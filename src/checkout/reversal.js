'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');
const { validateParams, reversalSchema } = require('../config/checkout-schemas');

/**
 * Reversal Request - Reverse a transaction
 */
class ReversalRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(reversalSchema, params, 'Reversal');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCReversal',
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

