// src/checkout/authorization-reverse.js
// User-friendly authorizationReverse function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutAuthorizationReverseRequest = require('../resources/checkout/authorization-reverse');

/**
 * User-facing authorizationReverse function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function authorizationReverse(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutAuthorizationReverseRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = authorizationReverse; 