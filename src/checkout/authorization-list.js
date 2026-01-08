'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { safeVal } = require('../utils/common');
const { validateParams, authorizationListSchema } = require('../config/checkout-schemas');

/**
 * Authorization List Request - List authorizations
 */
class AuthorizationListRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(authorizationListSchema, params, 'Authorization List');
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCAuthorizationList',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      OutputFormat: safeVal(validatedParams.outputFormat, config.outputFormat),
      Note: validatedParams.note
    };
    
    super(config, ipcParams);
  }
}

/**
 * List authorizations
 * @param {Object} params - Parameters
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function authorizationList(params = {}) {
  const config = loadConfig(params);
  const request = new AuthorizationListRequest(config, params);
  return request.execute();
}

module.exports = authorizationList;

