'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, authorizationSchema } = require('../config/checkout-schemas');

/**
 * Authorization Request - Create an authorization
 */
class AuthorizationRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(authorizationSchema, params, 'Authorization');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCAuthorization',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      Amount: validatedParams.amount,
      Currency: safeVal(validatedParams.currency, config.currency),
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      Note: validatedParams.note,
      URL_OK: safeVal(validatedParams.successUrl, config.successUrl),
      URL_Cancel: safeVal(validatedParams.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(validatedParams.notifyUrl, config.notifyUrl),
      CardTokenRequest: safeVal(validatedParams.cardTokenRequest, config.cardTokenRequest),
      PaymentParametersRequired: safeVal(validatedParams.paymentParametersRequired, config.paymentParametersRequired)
    };
    
    super(config, ipcParams);
  }
}

/**
 * Create an authorization
 * @param {Object} params - Parameters
 * @param {number} params.amount - Amount to authorize
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function authorization(params = {}) {
  const config = loadConfig(params);
  const request = new AuthorizationRequest(config, params);
  return request.execute();
}

module.exports = authorization;

