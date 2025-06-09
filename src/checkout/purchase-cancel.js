// src/checkout/purchase-cancel.js
// User-friendly purchaseCancel function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPurchaseCancelRequest = require('../resources/checkout/purchase-cancel');

/**
 * User-facing purchaseCancel function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function purchaseCancel(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutPurchaseCancelRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = purchaseCancel; 