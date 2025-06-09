// src/checkout/pre-auth-cancellation.js
// User-friendly preAuthCancellation function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPreAuthCancellationRequest = require('../resources/checkout/pre-auth-cancellation');

/**
 * User-facing preAuthCancellation function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function preAuthCancellation(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutPreAuthCancellationRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = preAuthCancellation; 