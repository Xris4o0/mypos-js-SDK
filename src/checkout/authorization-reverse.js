'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, authorizationReverseSchema } = require('../config/checkout-schemas');

/**
 * Authorization Reverse Request - Reverse an authorization
 */
class AuthorizationReverseRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(authorizationReverseSchema, params, 'Authorization Reverse');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCAuthorizationReverse',
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
 * Reverse an authorization
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Authorization reference
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function authorizationReverse(params = {}) {
  const config = loadConfig(params);
  const request = new AuthorizationReverseRequest(config, params);
  return request.execute();
}

module.exports = authorizationReverse;

