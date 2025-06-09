// src/checkout/ia-store-card.js
// User-friendly iaStoreCard function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutIAStoreCardRequest = require('../resources/checkout/ia-store-card');

/**
 * User-facing iaStoreCard function
 * @param {Object} params - { customerId, ...overrides }
 * @returns {Promise<any>}
 */
async function iaStoreCard(params = {}) {
  const config = loadConfig(params);
  if (!params.customerId) throw new Error('customerId is required');
  const requestParams = {
    customerId: params.customerId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutIAStoreCardRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = iaStoreCard; 