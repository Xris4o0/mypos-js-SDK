// src/checkout/purchase-notify.js
// User-friendly purchaseNotify function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPurchaseNotifyRequest = require('../resources/checkout/purchase-notify');

/**
 * User-facing purchaseNotify function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function purchaseNotify(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutPurchaseNotifyRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = purchaseNotify; 