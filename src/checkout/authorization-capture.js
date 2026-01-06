'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateAmount, validateTransactionId } = require('../config/validator');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Authorization Capture Request - Capture an authorization
 */
class AuthorizationCaptureRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    validateTransactionId(params.transactionId);
    validateAmount(params.amount);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCAuthorizationCapture',
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

