// src/checkout/purchase-rollback.js
// User-friendly purchaseRollback function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPurchaseRollbackRequest = require('../resources/checkout/purchase-rollback');

/**
 * User-facing purchaseRollback function
 * @param {Object} params - { transactionId, ...overrides }
 * @returns {Promise<any>}
 */
async function purchaseRollback(params = {}) {
  const config = loadConfig(params);
  if (!params.transactionId) throw new Error('transactionId is required');
  const requestParams = {
    transactionId: params.transactionId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutPurchaseRollbackRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = purchaseRollback; 