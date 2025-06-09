// src/checkout/reversal.js
// User-friendly reversal function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutReversalRequest = require('../resources/checkout/reversal');

/**
 * User-facing reversal function
 * @param {Object} params - { transactionId, amount, ...overrides }
 * @returns {Promise<any>}
 */
async function reversal(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  if (typeof params.amount !== 'number') throw new Error('amount must be a number');

  const requestParams = {
    transactionId: params.transactionId,
    amount: params.amount,
    currency: params.currency || config.currency || 'EUR',
    note: params.note
    // Add more as needed
  };

  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutReversalRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = reversal; 