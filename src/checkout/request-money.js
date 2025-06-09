// src/checkout/request-money.js
// User-friendly requestMoney function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutRequestMoneyRequest = require('../resources/checkout/request-money');

/**
 * User-facing requestMoney function
 * @param {Object} params - { recipient, amount, ...overrides }
 * @returns {Promise<any>}
 */
async function requestMoney(params = {}) {
  const config = loadConfig(params);
  if (!params.recipient) throw new Error('recipient is required');
  if (typeof params.amount !== 'number') throw new Error('amount must be a number');

  const requestParams = {
    recipient: params.recipient,
    amount: params.amount,
    currency: params.currency || config.currency || 'EUR',
    note: params.note
    // Add more as needed
  };

  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutRequestMoneyRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = requestMoney; 