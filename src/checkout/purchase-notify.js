'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, normalizeCustomer } = require('../utils/common');
const { validateParams, purchaseNotifySchema } = require('../config/checkout-schemas');

/**
 * Purchase Notify Request - Handle purchase notification callback
 */
class PurchaseNotifyRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(purchaseNotifySchema, params, 'Purchase Notify');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPurchaseNotify',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      IPC_Trnref: validatedParams.transactionId,
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat),
      PaymentParametersRequired: safeVal(validatedParams.paymentParametersRequired, config.paymentParametersRequired)
    };
    
    // IPCPurchaseNotify needs CustomerEmail, CustomerPhone, CustomerFirstNames, and CustomerFamilyName
    // when PaymentParametersRequired = 1 or 2
    const paymentParamsRequired = ipcParams.PaymentParametersRequired;
    if ((paymentParamsRequired === 1 || paymentParamsRequired === 2) && validatedParams.customer) {
      // Normalize customer field names (accept firstName/firstNames and lastName/familyName)
      const customer = normalizeCustomer(validatedParams.customer);
      
      ipcParams.CustomerEmail = customer.email;
      ipcParams.CustomerPhone = customer.phone;
      ipcParams.CustomerFirstNames = customer.firstNames;
      ipcParams.CustomerFamilyName = customer.familyName;
    }
    
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
  return request.execute();
}

module.exports = purchaseNotify;

