'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');
const { validateParams, sendMoneySchema } = require('../config/checkout-schemas');

/**
 * Send Money Request - Send money to another wallet programmatically
 * Note: This functionality must be enabled first. Contact online@mypos.com
 */
class SendMoneyRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(sendMoneySchema, params, 'Send Money');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCSendMoney',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      CustomerWalletNumber: validatedParams.customerWalletNumber,
      Amount: validatedParams.amount,
      Currency: safeVal(validatedParams.currency, config.currency),
      TransactionReference: validatedParams.transactionReference,
      Reason: validatedParams.reason,
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat)
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

