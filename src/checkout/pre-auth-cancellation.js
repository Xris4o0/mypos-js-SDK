'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, preAuthCancellationSchema } = require('../config/checkout-schemas');

/**
 * Pre-Auth Cancellation Request - Cancel a pre-authorization
 */
class PreAuthCancellationRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(preAuthCancellationSchema, params, 'Pre-Auth Cancellation');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPreAuthCancellation',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      IPC_Trnref: validatedParams.transactionId,
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat),
      Note: validatedParams.note
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

