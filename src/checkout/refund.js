'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, refundSchema } = require('../config/checkout-schemas');

/**
 * Refund Request - Refund a completed transaction
 */
class RefundRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(refundSchema, params, 'Refund');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCRefund',
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
 * Create a refund request
 * @param {Object} params - Refund parameters
 * @param {string} params.transactionId - Transaction reference to refund
 * @param {number} params.amount - Amount to refund
 * @param {string} params.currency - Currency code (defaults to config)
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function refund(params = {}) {
  const config = loadConfig(params);
  const request = new RefundRequest(config, params);
  return request.execute();
}

module.exports = refund;

