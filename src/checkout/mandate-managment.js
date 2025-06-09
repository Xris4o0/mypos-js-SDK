// src/checkout/mandate-managment.js
// User-friendly mandateManagment function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutMandateManagmentRequest = require('../resources/checkout/mandate-managment');

/**
 * User-facing mandateManagment function
 * @param {Object} params - { mandateId, ...overrides }
 * @returns {Promise<any>}
 */
async function mandateManagment(params = {}) {
  const config = loadConfig(params);
  if (!params.mandateId) throw new Error('mandateId is required');
  const requestParams = {
    mandateId: params.mandateId,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutMandateManagmentRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = mandateManagment; 