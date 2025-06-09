// src/checkout/authorization-capture.js
// User-friendly authorizationCapture function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutAuthorizationCaptureRequest = require('../resources/checkout/authorization-capture');

/**
 * User-facing authorizationCapture function
 * @param {Object} params - { transactionId, amount, ...overrides }
 * @returns {Promise<any>}
 */
async function authorizationCapture(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  if (typeof params.amount !== 'number') throw new Error('amount must be a number');
  const requestParams = {
    transactionId: params.transactionId,
    amount: params.amount,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutAuthorizationCaptureRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = authorizationCapture; 