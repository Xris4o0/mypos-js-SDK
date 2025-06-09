// src/checkout/purchase-ok.js
// User-friendly purchaseOK function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPurchaseOKRequest = require('../resources/checkout/purchase-ok');

/**
 * User-facing purchaseOK function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function purchaseOK(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutPurchaseOKRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = purchaseOK; 