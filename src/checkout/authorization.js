// src/checkout/authorization.js
// User-friendly authorization function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutAuthorizationRequest = require('../resources/checkout/authorization');

/**
 * User-facing authorization function
 * @param {Object} params - { amount, currency, ...overrides }
 * @returns {Promise<any>}
 */
async function authorization(params = {}) {
  const config = loadConfig(params);
  if (typeof params.amount !== 'number') throw new Error('amount must be a number');
  const requestParams = {
    amount: params.amount,
    currency: params.currency || config.currency || 'EUR',
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutAuthorizationRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = authorization; 