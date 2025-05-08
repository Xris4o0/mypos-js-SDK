'use strict';

const { v4: uuidv4 } = require('uuid');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIPCPurchaseByIcardRequest extends CheckoutApiRequest {
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
        
        const purchaseParams = {
            IPCmethod: 'IPCPurchaseByIcard',
            IPCVersion: version,
            IPCLanguage: language,
            Amount: params.amount,
            Currency: currency,
            OrderID: orderId,
            SID: sid,
            WalletNumber: walletNumber,
            KeyIndex: mypos.config.checkout.keyIndex,
            URL_OK: okUrl,
            URL_Cancel: cancelUrl,
            URL_Notify: notifyUrl,
            customeremail: params.customer.email,
            customerphone: params.customer.phone,
            customeraddress: params.customer.address,
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

        super(mypos, purchaseParams);
    }
}

module.exports = CheckoutIPCPurchaseByIcardRequest;

// FINISHED