'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateAmount } = require('../config/validator');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Request Money Request - Request money from another wallet
 */
class RequestMoneyRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    if (!params.walletNumber) {
      throw new Error('walletNumber is required');
    }
    validateAmount(params.amount);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCRequestMoney',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: params.walletNumber,
      Amount: params.amount,
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      Note: params.note,
      OutputFormat: safeVal(params.outputFormat, config.outputFormat),
      URL_OK: safeVal(params.successUrl, config.successUrl),
      URL_Cancel: safeVal(params.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(params.notifyUrl, config.notifyUrl)
    };
    
    super(config, ipcParams);
  }
}

/**
 * Request money from another wallet
 * @param {Object} params - Parameters
 * @param {string} params.walletNumber - Payer wallet number
 * @param {number} params.amount - Amount to request
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function requestMoney(params = {}) {
  const config = loadConfig(params);
  const request = new RequestMoneyRequest(config, params);
  return await request.execute();
}

module.exports = requestMoney;

