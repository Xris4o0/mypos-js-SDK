'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');
const { validateParams, purchaseCancelSchema } = require('../config/checkout-schemas');

/**
 * Purchase Cancel Request - Handle canceled purchase callback
 */
class PurchaseCancelRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(purchaseCancelSchema, params, 'Purchase Cancel');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPurchaseCancel',
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
 * Handle purchase cancel callback
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Transaction reference
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function purchaseCancel(params = {}) {
  const config = loadConfig(params);
  const request = new PurchaseCancelRequest(config, params);
  return request.execute();
}

module.exports = purchaseCancel;

