'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, preAuthCompletionSchema } = require('../config/checkout-schemas');

/**
 * Pre-Auth Completion Request - Complete a pre-authorization
 */
class PreAuthCompletionRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(preAuthCompletionSchema, params, 'Pre-Auth Completion');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthCompletion',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      IPC_Trnref: validatedParams.transactionId,
      Amount: validatedParams.amount,
      Currency: safeVal(validatedParams.currency, config.currency),
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat),
      Note: validatedParams.note
    };
    
    super(config, ipcParams);
  }
}

/**
 * Complete a pre-authorization
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Pre-auth reference
 * @param {number} params.amount - Amount to complete
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function preAuthCompletion(params = {}) {
  const config = loadConfig(params);
  const request = new PreAuthCompletionRequest(config, params);
  return request.execute();
}

module.exports = preAuthCompletion;

