'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateAmount } = require('../config/validator');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Send Money Request - Send money to another wallet
 */
class SendMoneyRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    if (!params.walletNumber) {
      throw new Error('walletNumber is required');
    }
    validateAmount(params.amount);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCSendMoney',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: params.walletNumber,
      Amount: params.amount,
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      Note: params.note,
      OutputFormat: safeVal(params.outputFormat, config.outputFormat)
    };
    
    super(config, ipcParams);
  }
}

/**
 * Send money to another wallet
 * @param {Object} params - Parameters
 * @param {string} params.walletNumber - Recipient wallet number
 * @param {number} params.amount - Amount to send
 * @param {string} params.currency - Currency code
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function sendMoney(params = {}) {
  const config = loadConfig(params);
  const request = new SendMoneyRequest(config, params);
  return await request.execute();
}

module.exports = sendMoney;

