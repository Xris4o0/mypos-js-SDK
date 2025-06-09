// src/checkout/pre-authorization-cancel.js
// User-friendly preAuthorizationCancel function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPreAuthorizationCancelRequest = require('../resources/checkout/pre-authorization-cancel');

/**
 * User-facing preAuthorizationCancel function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function preAuthorizationCancel(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutPreAuthorizationCancelRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = preAuthorizationCancel; 