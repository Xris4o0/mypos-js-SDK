'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateAmount, validateTransactionId } = require('../config/validator');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Refund Request - Refund a completed transaction
 */
class RefundRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    validateTransactionId(params.transactionId);
    validateAmount(params.amount);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCRefund',
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
  return await request.execute();
}

module.exports = refund;

