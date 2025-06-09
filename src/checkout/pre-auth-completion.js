// src/checkout/pre-auth-completion.js
// User-friendly preAuthCompletion function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPreAuthCompletionRequest = require('../resources/checkout/pre-auth-completion');

/**
 * User-facing preAuthCompletion function
 * @param {Object} params - { transactionId, amount, ...overrides }
 * @returns {Promise<any>}
 */
async function preAuthCompletion(params = {}) {
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
    const req = new CheckoutPreAuthCompletionRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = preAuthCompletion; 