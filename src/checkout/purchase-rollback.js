'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, purchaseRollbackSchema } = require('../config/checkout-schemas');

/**
 * Purchase Rollback Request - Rollback a purchase
 */
class PurchaseRollbackRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(purchaseRollbackSchema, params, 'Purchase Rollback');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPurchaseRollback',
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
 * Rollback a purchase
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Transaction reference
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function purchaseRollback(params = {}) {
  const config = loadConfig(params);
  const request = new PurchaseRollbackRequest(config, params);
  return request.execute();
}

module.exports = purchaseRollback;

