// src/checkout/pre-authorization-ok.js
// User-friendly preAuthorizationOK function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPreAuthorizationOKRequest = require('../resources/checkout/pre-authorization-ok');

/**
 * User-facing preAuthorizationOK function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function preAuthorizationOK(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutPreAuthorizationOKRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = preAuthorizationOK; 