'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateTransactionId } = require('../config/validator');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Pre-Auth Cancellation Request - Cancel a pre-authorization
 */
class PreAuthCancellationRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    validateTransactionId(params.transactionId);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthCancellation',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      IPC_Trnref: params.transactionId,
      OrderID: safeVal(params.orderId, generateOrderId()),
      OutputFormat: safeVal(params.outputFormat, config.outputFormat),
      Note: params.note
    };
    
    super(config, ipcParams);
  }
}

/**
 * Cancel a pre-authorization
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Pre-auth reference
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function preAuthCancellation(params = {}) {
  const config = loadConfig(params);
  const request = new PreAuthCancellationRequest(config, params);
  return request.execute();
}

module.exports = preAuthCancellation;

