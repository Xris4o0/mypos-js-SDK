'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');

/**
 * Purchase Notify Request - Handle purchase notification callback
 */
class PurchaseNotifyRequest extends CheckoutRequest {
  constructor(config, params) {
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPurchaseNotify',
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
 * Handle purchase notify callback
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Transaction reference
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function purchaseNotify(params = {}) {
  const config = loadConfig(params);
  const request = new PurchaseNotifyRequest(config, params);
  return await request.execute();
}

module.exports = purchaseNotify;

