'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');
const { validateParams, getPaymentStatusSchema } = require('../config/checkout-schemas');

/**
 * Get Payment Status Request - Check status of a payment
 */
class GetPaymentStatusRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(getPaymentStatusSchema, params, 'Get Payment Status');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCGetPaymentStatus',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      IPC_Trnref: validatedParams.transactionId,
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat)
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
  return request.execute();
}

module.exports = getPaymentStatus;

