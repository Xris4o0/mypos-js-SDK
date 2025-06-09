// src/checkout/pre-auth-status.js
// User-friendly preAuthStatus function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPreAuthStatusRequest = require('../resources/checkout/pre-auth-status');

/**
 * User-facing preAuthStatus function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function preAuthStatus(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutPreAuthStatusRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = preAuthStatus; 