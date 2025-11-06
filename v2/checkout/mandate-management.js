'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal, generateOrderId } = require('../utils/common');

/**
 * Mandate Management Request - Manage payment mandates
 */
class MandateManagementRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate required fields
    if (!params.mandateId) {
      throw new Error('mandateId is required');
    }
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCMandateManagement',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      MandateID: params.mandateId,
      OrderID: safeVal(params.orderId, generateOrderId()),
      OutputFormat: safeVal(params.outputFormat, config.outputFormat),
      Note: params.note
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
  return await request.execute();
}

module.exports = mandateManagement;

