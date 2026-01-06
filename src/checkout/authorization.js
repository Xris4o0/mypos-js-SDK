'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateAmount } = require('../config/validator');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Authorization Request - Create an authorization
 */
class AuthorizationRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    validateAmount(params.amount);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCAuthorization',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      Amount: params.amount,
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      Note: params.note,
      URL_OK: safeVal(params.successUrl, config.successUrl),
      URL_Cancel: safeVal(params.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(params.notifyUrl, config.notifyUrl),
      CardTokenRequest: safeVal(params.cardTokenRequest, config.cardTokenRequest),
      PaymentParametersRequired: safeVal(params.paymentParametersRequired, config.paymentParametersRequired)
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

