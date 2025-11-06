'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateAmount } = require('../config/validator');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Request Money Request - Request money from another wallet
 * Note: Requires a registered mandate. See IPCMandateManagement.
 */
class RequestMoneyRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    if (!params.mandateReference) {
      throw new Error('mandateReference is required');
    }
    if (!params.customerWalletNumber) {
      throw new Error('customerWalletNumber is required');
    }
    if (!params.reason) {
      throw new Error('reason is required');
    }
    validateAmount(params.amount);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCRequestMoney',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      MandateReference: params.mandateReference,
      CustomerWalletNumber: params.customerWalletNumber,
      OrderID: safeVal(params.orderId, generateOrderId()),
      Amount: params.amount,
      Currency: safeVal(params.currency, config.currency),
      Reason: params.reason,
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      OutputFormat: safeVal(params.outputFormat, config.outputFormat)
    };
    
    // Add optional reversal indicator if provided
    if (params.reversalIndicator !== undefined) {
      ipcParams.ReversalIndicator = params.reversalIndicator;
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
  return await request.execute();
}

module.exports = requestMoney;

