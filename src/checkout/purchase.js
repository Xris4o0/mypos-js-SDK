// purchase.js
// User-friendly purchase function for myPOS SDK

const { loadConfig } = require('../utils/config-loader');
const MyPOS = require('../mypos');
const CheckoutPurchaseRequest = require('../resources/checkout/purchase');

/**
 * User-facing purchase function
 * @param {Object} params - { cart, tip, currency, ...overrides }
 * @returns {Promise<{ redirectUrl: string, rawResponse: any }>}
 */
async function purchase(params = {}) {
  // Load config (merge order: defaults < file < env < params)
  const config = loadConfig(params);

  // Validate and sum cart
  if (!Array.isArray(params.cart) || params.cart.length === 0) {
    throw new Error('cart must be a non-empty array of items');
  }

  // Calculate cart subtotal and build cartItems
  let cartSubtotal = 0;
  let cartItems = params.cart.map(item => {
    if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      throw new Error('Each cart item must have numeric price and quantity');
    }
    cartSubtotal += item.price * item.quantity;
    return {
      name: item.name,
      price: item.price,
      quantity: item.quantity
    };
  });

  // Add discount as a negative cart item (if present)
  if (params.discount !== undefined && params.discount > 0) {
    if (typeof params.discount !== 'number' || params.discount < 0 || params.discount > 100) {
      throw new Error('discount must be a number between 0 and 100');
    }
    // Always round down discount to two decimal points
    const discountAmount = Math.floor(cartSubtotal * (params.discount / 100) * 100) / 100;
    cartItems.push({ name: 'Discount', price: -discountAmount, quantity: 1 });
  }

  // Add tip as a positive cart item (if present)
  if (params.tip !== undefined && params.tip > 0) {
    if (typeof params.tip !== 'number') throw new Error('tip must be a number');
    cartItems.push({ name: 'Tip', price: params.tip, quantity: 1 });
  }

  // Amount is always the sum of all cart items
  let amount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Allow amount override
  amount = typeof params.amount === 'number' ? params.amount : amount;

  // Prepare customer info (optional)
  const customer = params.customer || {};

  // Build request params for CheckoutPurchaseRequest
  const requestParams = {
    amount,
    currency: params.currency || config.currency || 'EUR',
    cartItems,
    okUrl: params.successUrl || config.successUrl,
    cancelUrl: params.cancelUrl || config.cancelUrl,
    notifyUrl: params.notifyUrl || config.notifyUrl,
    customer,
    note: params.note
    // Add more as needed
  };

  // Create MyPOS instance
  const mypos = MyPOS(config);

  // Call the existing CheckoutPurchaseRequest
  return new Promise((resolve, reject) => {
    const req = new CheckoutPurchaseRequest(mypos, requestParams);
    req.send((err, response) => {
      if (err) return reject(err);
      // Assume redirect URL is in response.URL or similar (adjust as needed)
      resolve({ redirectUrl: response.URL, rawResponse: response });
    });
  });
}

module.exports = purchase; 