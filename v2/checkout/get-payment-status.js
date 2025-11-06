'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateTransactionId } = require('../config/validator');
const { safeVal } = require('../utils/common');

/**
 * Get Payment Status Request - Check status of a payment
 */
class GetPaymentStatusRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    validateTransactionId(params.transactionId);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCGetPaymentStatus',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      IPC_Trnref: params.transactionId,
      OutputFormat: safeVal(params.outputFormat, config.outputFormat)
    };
    
    super(config, ipcParams);
  }
}

/**
 * Get payment status
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Transaction reference
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function getPaymentStatus(params = {}) {
  const config = loadConfig(params);
  const request = new GetPaymentStatusRequest(config, params);
  return await request.execute();
}

module.exports = getPaymentStatus;

