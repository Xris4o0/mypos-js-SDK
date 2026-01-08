'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, authorizationCaptureSchema } = require('../config/checkout-schemas');

/**
 * Authorization Capture Request - Capture an authorization
 */
class AuthorizationCaptureRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(authorizationCaptureSchema, params, 'Authorization Capture');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCAuthorizationCapture',
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
 * Capture an authorization
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Authorization reference
 * @param {number} params.amount - Amount to capture
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function authorizationCapture(params = {}) {
  const config = loadConfig(params);
  const request = new AuthorizationCaptureRequest(config, params);
  return request.execute();
}

module.exports = authorizationCapture;

