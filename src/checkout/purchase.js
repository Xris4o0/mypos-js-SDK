'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { buildCartItems, calculateTotal } = require('../utils/cart-builder');
const { safeVal, generateOrderId, normalizeCustomer } = require('../utils/common');
const { validateParams, purchaseSchema } = require('../config/checkout-schemas');

/**
 * Purchase Request - Create a payment with cart items
 */
class PurchaseRequest extends CheckoutRequest {
  constructor(config, params) {
    // Validate params with Zod schema
    const validatedParams = validateParams(purchaseSchema, params, 'Purchase');
    
    // Build and validate cart items
    const cartItems = buildCartItems(validatedParams.cart, validatedParams.discount, validatedParams.tip);
    const amount = validatedParams.amount !== undefined ? validatedParams.amount : calculateTotal(cartItems);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPurchase',
      IPCVersion: safeVal(validatedParams.version, config.version),
      IPCLanguage: safeVal(validatedParams.lang, config.lang),
      SID: safeVal(validatedParams.sid, config.sid),
      WalletNumber: safeVal(validatedParams.walletNumber, config.clientNumber),
      Amount: amount,
      Currency: safeVal(validatedParams.currency, config.currency),
      OrderID: safeVal(validatedParams.orderId, generateOrderId()),
      URL_OK: safeVal(validatedParams.successUrl, config.successUrl),
      URL_Cancel: safeVal(validatedParams.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(validatedParams.notifyUrl, config.notifyUrl),
      CardTokenRequest: safeVal(validatedParams.cardTokenRequest, config.cardTokenRequest),
      KeyIndex: safeVal(validatedParams.keyIndex, config.keyIndex),
      PaymentParametersRequired: safeVal(validatedParams.paymentParametersRequired, config.paymentParametersRequired),
      PaymentMethod: safeVal(validatedParams.paymentMethod, config.paymentMethod),
      Note: validatedParams.note,
      CartItems: cartItems.length
    };
    
    // Add customer details only if PaymentParametersRequired = 1
    // IPCPurchase needs CustomerEmail, CustomerPhone, CustomerFirstNames, and CustomerFamilyName when PaymentParametersRequired = 1
    // Customer fields can be provided either:
    // 1. As nested object: params.customer = {email, phone, firstNames, familyName, ...}
    // 2. As direct parameters: params.customerEmail, params.customerPhone, params.customerFirstNames, params.customerFamilyName, etc.
    const paymentParamsRequired = ipcParams.PaymentParametersRequired;
    if (paymentParamsRequired === 1) {
      // Build customer object from either nested customer object or direct parameters
      let customer = validatedParams.customer || {};
      
      // Allow direct parameters to override or supplement customer object
      if (validatedParams.customerEmail) customer.email = validatedParams.customerEmail;
      if (validatedParams.customerPhone) customer.phone = validatedParams.customerPhone;
      if (validatedParams.customerFirstNames || validatedParams.customerFirstName) {
        customer.firstNames = validatedParams.customerFirstNames || validatedParams.customerFirstName;
      }
      if (validatedParams.customerFamilyName || validatedParams.customerLastName) {
        customer.familyName = validatedParams.customerFamilyName || validatedParams.customerLastName;
      }
      if (validatedParams.customerCountry) customer.country = validatedParams.customerCountry;
      if (validatedParams.customerCity) customer.city = validatedParams.customerCity;
      if (validatedParams.customerZIPCode || validatedParams.customerZipCode) {
        customer.zipCode = validatedParams.customerZIPCode || validatedParams.customerZipCode;
      }
      if (validatedParams.customerAddress) customer.address = validatedParams.customerAddress;
      
      // Normalize customer field names (accept firstName/firstNames and lastName/familyName)
      customer = normalizeCustomer(customer);
      
      // Validation is already done by Zod schema, so we can safely use the values
      ipcParams.CustomerEmail = customer.email;
      ipcParams.CustomerPhone = customer.phone;
      ipcParams.CustomerFirstNames = customer.firstNames;
      ipcParams.CustomerFamilyName = customer.familyName;
      // Optional customer fields
      if (customer.country) ipcParams.CustomerCountry = customer.country;
      if (customer.city) ipcParams.CustomerCity = customer.city;
      if (customer.zipCode) ipcParams.CustomerZIPCode = customer.zipCode;
      if (customer.address) ipcParams.CustomerAddress = customer.address;
    }
    
    // Add cart items
    cartItems.forEach((item, index) => {
      const num = index + 1;
      ipcParams[`Article_${num}`] = item.name;
      ipcParams[`Quantity_${num}`] = item.quantity;
      ipcParams[`Price_${num}`] = item.price;
      ipcParams[`Currency_${num}`] = ipcParams.Currency;
      ipcParams[`Amount_${num}`] = item.price * item.quantity;
    });
    
    super(config, ipcParams);
  }
}

/**
 * Create a purchase request
 * @param {Object} params - Purchase parameters
 * @param {Array} params.cart - Array of cart items [{name, price, quantity}]
 * @param {Object} [params.customer] - Customer information (nested object)
 *   Accepts: {email, phone, firstNames/firstName, familyName/lastName, ...}
 *   When PaymentParametersRequired = 1: email, phone, firstNames (or firstName), and familyName (or lastName) are required
 * @param {string} [params.customerEmail] - Customer email (direct parameter, overrides params.customer.email)
 * @param {string} [params.customerPhone] - Customer phone (direct parameter, overrides params.customer.phone)
 * @param {string} [params.customerFirstNames] - Customer first names (direct parameter, overrides params.customer.firstNames)
 * @param {string} [params.customerFirstName] - Customer first name (direct parameter, normalized to firstNames)
 * @param {string} [params.customerFamilyName] - Customer family name (direct parameter, overrides params.customer.familyName)
 * @param {string} [params.customerLastName] - Customer last name (direct parameter, normalized to familyName)
 * @param {string} [params.customerCountry] - Customer country (direct parameter)
 * @param {string} [params.customerCity] - Customer city (direct parameter)
 * @param {string} [params.customerZIPCode] - Customer ZIP code (direct parameter)
 * @param {string} [params.customerAddress] - Customer address (direct parameter)
 * @param {number} params.discount - Optional discount percentage (0-100)
 * @param {number} params.tip - Optional tip amount
 * @param {string} params.currency - Currency code (defaults to config)
 * @param {string} params.note - Optional note
 * @returns {Promise<Object>} {redirectUrl, rawResponse}
 */
async function purchase(params = {}) {
  const config = loadConfig(params);
  const request = new PurchaseRequest(config, params);
  return request.execute();
}

module.exports = purchase;

