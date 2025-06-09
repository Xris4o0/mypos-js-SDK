// src/checkout/ia-purchase.js
// User-friendly iaPurchase function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutIAPurchaseRequest = require('../resources/checkout/ia-purchase');

/**
 * User-facing iaPurchase function
 * @param {Object} params - { cart, tip, currency, ...overrides }
 * @returns {Promise<any>}
 */
async function iaPurchase(params = {}) {
  const config = loadConfig(params);
  if (!Array.isArray(params.cart) || params.cart.length === 0) {
    throw new Error('cart must be a non-empty array of items');
  }
  let amount = 0;
  const cartItems = params.cart.map(item => {
    if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      throw new Error('Each cart item must have numeric price and quantity');
    }
    amount += item.price * item.quantity;
    return {
      name: item.name,
      price: item.price,
      quantity: item.quantity
    };
  });
  if (params.tip) {
    if (typeof params.tip !== 'number') throw new Error('tip must be a number');
    amount += params.tip;
  }
  amount = typeof params.amount === 'number' ? params.amount : amount;
  const customer = params.customer || {};
  const requestParams = {
    amount,
    currency: params.currency || config.currency || 'EUR',
    cartItems,
    okUrl: params.successUrl || config.successUrl,
    cancelUrl: params.cancelUrl || config.cancelUrl,
    notifyUrl: params.notifyUrl || config.notifyUrl,
    customer,
    note: params.note
  };
  const mypos = MyPOS(config);
  return new Promise((resolve, reject) => {
    const req = new CheckoutIAPurchaseRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = iaPurchase; 