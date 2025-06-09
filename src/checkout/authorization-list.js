// src/checkout/authorization-list.js
// User-friendly authorizationList function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutAuthorizationListRequest = require('../resources/checkout/authorization-list');

/**
 * User-facing authorizationList function
 * @param {Object} params - { ...overrides }
 * @returns {Promise<any>}
 */
async function authorizationList(params = {}) {
  const config = loadConfig(params);
  const requestParams = {
    ...params
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutAuthorizationListRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = authorizationList; 