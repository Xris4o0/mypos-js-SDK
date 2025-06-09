// src/checkout/send-money.js
// User-friendly sendMoney function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutSendMoneyRequest = require('../resources/checkout/send-money');

/**
 * User-facing sendMoney function
 * @param {Object} params - { walletNumber, amount, ...overrides }
 * @returns {Promise<any>}
 */
async function sendMoney(params = {}) {
  const config = loadConfig(params);
  if (!params.walletNumber) throw new Error('walletNumber (recipient client number) is required');
  if (typeof params.amount !== 'number') throw new Error('amount must be a number');

  const requestParams = {
    walletNumber: params.walletNumber,
    amount: params.amount,
    currency: params.currency || config.currency || 'EUR',
    note: params.note
    // Add more as needed
  };

  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutSendMoneyRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = sendMoney; 