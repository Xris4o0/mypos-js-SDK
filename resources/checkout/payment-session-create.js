'use strict';

const uuidv4 = require('uuid/v4');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIPCPaymentSessionCreateRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let sid = utils.safeVal(params.sid, mypos.config.checkout.sid);
        let walletNumber = utils.safeVal(params.sid, mypos.config.checkout.clientNumber);
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let orderId = utils.safeVal(params.orderId, uuidv4());
        let outputFormat = utils.safeVal(params.outputFormat, utils.safeVal(mypos.config.checkout.outputFormat, 'JSON'));

        const purchaseParams = {
            IPCmethod: 'IPCPaymentSessionCreate',
            IPCVersion: version,
            IPCLanguage: language,
            OrderID: orderId,
            Amount: params.amount,
            Currency: currency,
            SID: sid,
            WalletNumber: walletNumber,
            KeyIndex: mypos.config.checkout.keyIndex,
            AccountSettlement: params.AccountSettlement,
            Note: params.note,
            CartItems: params.cartItems.length,
            OutputFormat: outputFormat,
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

module.exports = CheckoutIPCPaymentSessionCreateRequest;

// FINISHED