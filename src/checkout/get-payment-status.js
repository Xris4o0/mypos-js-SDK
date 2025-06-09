// src/checkout/get-payment-status.js
// User-friendly getPaymentStatus function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutGetPaymentStatusRequest = require('../resources/checkout/get-payment-status');

/**
 * User-facing getPaymentStatus function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function getPaymentStatus(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    ...params
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutGetPaymentStatusRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = getPaymentStatus; 