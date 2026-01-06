'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, normalizeCustomer } = require('../utils/common');

/**
 * Purchase OK Request - Handle successful purchase callback
 */
class PurchaseOKRequest extends CheckoutRequest {
  constructor(config, params) {
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPurchaseOK',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      IPC_Trnref: params.transactionId,
      OutputFormat: safeVal(params.outputFormat, config.outputFormat),
      PaymentParametersRequired: safeVal(params.paymentParametersRequired, config.paymentParametersRequired)
    };
    
    // IPCPurchaseOK needs CustomerEmail, CustomerPhone, CustomerFirstNames, and CustomerFamilyName
    // when PaymentParametersRequired = 1 or 2
    const paymentParamsRequired = ipcParams.PaymentParametersRequired;
    if ((paymentParamsRequired === 1 || paymentParamsRequired === 2) && params.customer) {
      // Normalize customer field names (accept firstName/firstNames and lastName/familyName)
      const customer = normalizeCustomer(params.customer);
      
      if (!customer.email) {
        throw new Error('Customer email is required when PaymentParametersRequired = 1 or 2');
      }
      if (!customer.phone) {
        throw new Error('Customer phone is required when PaymentParametersRequired = 1 or 2');
      }
      if (!customer.firstNames) {
        throw new Error('Customer firstNames (or firstName) is required when PaymentParametersRequired = 1 or 2');
      }
      if (!customer.familyName) {
        throw new Error('Customer familyName (or lastName) is required when PaymentParametersRequired = 1 or 2');
      }
      ipcParams.CustomerEmail = customer.email;
      ipcParams.CustomerPhone = customer.phone;
      ipcParams.CustomerFirstNames = customer.firstNames;
      ipcParams.CustomerFamilyName = customer.familyName;
    }
    
    super(config, ipcParams);
  }
}

/**
 * Handle purchase OK callback
 * @param {Object} params - Parameters
 * @param {string} params.transactionId - Transaction reference
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function purchaseOK(params = {}) {
  const config = loadConfig(params);
  const request = new PurchaseOKRequest(config, params);
  return request.execute();
}

module.exports = purchaseOK;

