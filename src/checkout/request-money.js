'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, requestMoneySchema } = require('../config/checkout-schemas');

/**
 * Request Money Request - Request money from another wallet
 * Note: Requires a registered mandate. See IPCMandateManagement.
 */
class RequestMoneyRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(requestMoneySchema, params, 'Request Money');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCRequestMoney',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      MandateReference: validatedParams.mandateReference,
      CustomerWalletNumber: validatedParams.customerWalletNumber,
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      Amount: validatedParams.amount,
      Currency: safeVal(validatedParams.currency, config.currency),
      Reason: validatedParams.reason,
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat)
    };
    
    // Add optional reversal indicator if provided
    if (validatedParams.reversalIndicator !== undefined) {
      ipcParams.ReversalIndicator = validatedParams.reversalIndicator;
    }
    
    super(config, ipcParams);
  }
}

/**
 * Request money from another wallet (requires registered mandate)
 * @param {Object} params - Parameters
 * @param {string} params.mandateReference - Unique identifier of the agreement (mandate) between merchant and client (debtor)
 * @param {string} params.customerWalletNumber - Client's (debtor's) myPOS account identifier
 * @param {number} params.amount - Amount to request
 * @param {string} params.currency - Currency code
 * @param {string} params.reason - The reason for the transfer
 * @param {number} [params.reversalIndicator] - Set to 1 for reversal of previously executed request money transaction
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function requestMoney(params = {}) {
  const config = loadConfig(params);
  const request = new RequestMoneyRequest(config, params);
  return request.execute();
}

module.exports = requestMoney;

