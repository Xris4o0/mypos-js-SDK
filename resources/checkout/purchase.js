'use strict';

const { v4: uuidv4 } = require('uuid');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutPurchaseRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let sid = utils.safeVal(params.sid, mypos.config.checkout.sid);
        let walletNumber = utils.safeVal(params.sid, mypos.config.checkout.clientNumber);
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let orderId = utils.safeVal(params.orderId, uuidv4());
        let okUrl = utils.safeVal(params.okUrl, mypos.config.checkout.okUrl);
        let cancelUrl = utils.safeVal(params.cancelUrl, mypos.config.checkout.cancelUrl);
        let notifyUrl = utils.safeVal(params.notifyUrl, mypos.config.checkout.notifyUrl);
        let cardTokenRequest = utils.safeVal(params.cardTokenRequest, utils.safeVal(mypos.config.checkout.cardTokenRequest, 0));
        let paymentMethod = utils.safeVal(params.paymentMethod, utils.safeVal(mypos.config.checkout.paymentMethod, 1));
        let paymentParametersRequired = utils.safeVal(params.paymentParametersRequired, utils.safeVal(mypos.config.checkout.paymentParametersRequired, 1));

        const purchaseParams = {
            IPCmethod: 'IPCPurchase',
            IPCVersion: version,
            IPCLanguage: language,
            SID: sid,
            WalletNumber: walletNumber,
            Amount: params.amount,
            Currency: currency,
            OrderID: orderId,
            URL_OK: okUrl,
            URL_Cancel: cancelUrl,
            URL_Notify: notifyUrl,
            CardTokenRequest: cardTokenRequest,
            KeyIndex: mypos.config.checkout.keyIndex,
            PaymentParametersRequired: paymentParametersRequired,
            PaymentMethod: paymentMethod,
            CustomerEmail: params.customer.email,
            CustomerFirstNames: params.customer.firstNames,
            CustomerFamilyName: params.customer.familyName,
            CustomerPhone: params.customer.phone,
            CustomerCountry: params.customer.country,
            CustomerCity: params.customer.city,
            CustomerZIPCode: params.customer.zipCode,
            CustomerAddress: params.customer.address,
            Note: params.note,
            CartItems: params.cartItems.length
        };

        for (let i = 0; i < params.cartItems.length; i++) {
            let num = i + 1;
            purchaseParams[`Article_${num}`] = params.cartItems[i].name;
            purchaseParams[`Quantity_${num}`] = params.cartItems[i].quantity;
            purchaseParams[`Price_${num}`] = params.cartItems[i].price;
            purchaseParams[`Currency_${num}`] = currency;
            purchaseParams[`Amount_${num}`] = params.cartItems[i].quantity * params.cartItems[i].price;
        }

        // Debug log for final POST data
        console.log('Final POST data:', JSON.stringify(purchaseParams, null, 2));

        super(mypos, purchaseParams);
    }
}

module.exports = CheckoutPurchaseRequest;

// FINISHED