'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');
const { validateParams, mandateManagementSchema } = require('../config/checkout-schemas');

/**
 * Mandate Management Request - Manage payment mandates
 */
class MandateManagementRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(mandateManagementSchema, params, 'Mandate Management');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCMandateManagement',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      MandateID: validatedParams.mandateId,
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat),
      Note: validatedParams.note
    };
    
    super(config, ipcParams);
  }
}

/**
 * Manage payment mandate
 * @param {Object} params - Parameters
 * @param {string} params.mandateId - Mandate ID
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function mandateManagement(params = {}) {
  const config = loadConfig(params);
  const request = new MandateManagementRequest(config, params);
  return request.execute();
}

module.exports = mandateManagement;

