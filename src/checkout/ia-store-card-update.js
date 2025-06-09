// src/checkout/ia-store-card-update.js
// User-friendly iaStoreCardUpdate function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutIAStoreCardUpdateRequest = require('../resources/checkout/ia-store-card-update');

/**
 * User-facing iaStoreCardUpdate function
 * @param {Object} params - { customerId, ...overrides }
 * @returns {Promise<any>}
 */
async function iaStoreCardUpdate(params = {}) {
  const config = loadConfig(params);
  if (!params.customerId) throw new Error('customerId is required');
  const requestParams = {
    customerId: params.customerId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutIAStoreCardUpdateRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = iaStoreCardUpdate; 