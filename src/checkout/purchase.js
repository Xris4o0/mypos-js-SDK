'use strict';

const CheckoutRequest = require('../core/checkout-request');
const { loadConfig } = require('../config');
const { buildCartItems, calculateTotal } = require('../utils/cart-builder');
const { safeVal, generateOrderId, normalizeCustomer } = require('../utils/common');

/**
 * Purchase Request - Create a payment with cart items
 */
class PurchaseRequest extends CheckoutRequest {
  constructor(config, params) {
    // Build and validate cart items
    const cartItems = buildCartItems(params.cart, params.discount, params.tip);
    const amount = params.amount !== undefined ? params.amount : calculateTotal(cartItems);
    
    // Map to IPC parameters
    const ipcParams = {
      IPCmethod: 'IPCPurchase',
      IPCVersion: safeVal(params.version, config.version),
      IPCLanguage: safeVal(params.lang, config.lang),
      SID: safeVal(params.sid, config.sid),
      WalletNumber: safeVal(params.walletNumber, config.clientNumber),
      Amount: amount,
      Currency: safeVal(params.currency, config.currency),
      OrderID: safeVal(params.orderId, generateOrderId()),
      URL_OK: safeVal(params.successUrl, config.successUrl),
      URL_Cancel: safeVal(params.cancelUrl, config.cancelUrl),
      URL_Notify: safeVal(params.notifyUrl, config.notifyUrl),
      CardTokenRequest: safeVal(params.cardTokenRequest, config.cardTokenRequest),
      KeyIndex: safeVal(params.keyIndex, config.keyIndex),
      PaymentParametersRequired: safeVal(params.paymentParametersRequired, config.paymentParametersRequired),
      PaymentMethod: safeVal(params.paymentMethod, config.paymentMethod),
      Note: params.note,
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
      let customer = params.customer || {};
      
      // Allow direct parameters to override or supplement customer object
      if (params.customerEmail) customer.email = params.customerEmail;
      if (params.customerPhone) customer.phone = params.customerPhone;
      if (params.customerFirstNames || params.customerFirstName) {
        customer.firstNames = params.customerFirstNames || params.customerFirstName;
      }
      if (params.customerFamilyName || params.customerLastName) {
        customer.familyName = params.customerFamilyName || params.customerLastName;
      }
      if (params.customerCountry) customer.country = params.customerCountry;
      if (params.customerCity) customer.city = params.customerCity;
      if (params.customerZIPCode || params.customerZipCode) {
        customer.zipCode = params.customerZIPCode || params.customerZipCode;
      }
      if (params.customerAddress) customer.address = params.customerAddress;
      
      // Normalize customer field names (accept firstName/firstNames and lastName/familyName)
      customer = normalizeCustomer(customer);
      
      if (!customer.email) {
        throw new Error('Customer email is required when PaymentParametersRequired = 1');
      }
      if (!customer.phone) {
        throw new Error('Customer phone is required when PaymentParametersRequired = 1');
      }
      if (!customer.firstNames) {
        throw new Error('Customer firstNames (or firstName) is required when PaymentParametersRequired = 1');
      }
      if (!customer.familyName) {
        throw new Error('Customer familyName (or lastName) is required when PaymentParametersRequired = 1');
      }
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

