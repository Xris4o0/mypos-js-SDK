'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateAmount, validateTransactionId } = require('../config/validator');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Pre-Auth Completion Request - Complete a pre-authorization
 */
class PreAuthCompletionRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    validateTransactionId(params.transactionId);
    validateAmount(params.amount);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthCompletion',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      IPC_Trnref: params.transactionId,
      Amount: params.amount,
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      OutputFormat: safeVal(params.outputFormat, config.outputFormat),
      Note: params.note
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
  return await request.execute();
}

module.exports = preAuthCompletion;

