'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { validateAmount } = require('../config/validator');
const { safeVal } = require('../utils/common');

/**
 * Send Money Request - Send money to another wallet programmatically
 * Note: This functionality must be enabled first. Contact online@mypos.com
 */
class SendMoneyRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    if (!params.customerWalletNumber) {
      throw new Error('customerWalletNumber is required');
    }
    if (!params.transactionReference) {
      throw new Error('transactionReference is required');
    }
    if (!params.reason) {
      throw new Error('reason is required');
    }
    validateAmount(params.amount);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCSendMoney',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      CustomerWalletNumber: params.customerWalletNumber,
      Amount: params.amount,
      Currency: safeVal(params.currency, config.currency),
      TransactionReference: params.transactionReference,
      Reason: params.reason,
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      OutputFormat: safeVal(params.outputFormat, config.outputFormat)
    };
    
    super(config, ipcParams);
  }
}

/**
 * Send money to another wallet programmatically
 * @param {Object} params - Parameters
 * @param {string} params.customerWalletNumber - myPOS Account number (recipient)
 * @param {number} params.amount - Amount to send
 * @param {string} params.currency - Currency code
 * @param {string} params.transactionReference - Used to uniquely identify a transaction in IPC
 * @param {string} params.reason - The reason for the transfer
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function sendMoney(params = {}) {
  const config = loadConfig(params);
  const request = new SendMoneyRequest(config, params);
  return request.execute();
}

module.exports = sendMoney;

