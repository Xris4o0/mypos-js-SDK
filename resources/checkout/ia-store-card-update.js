'use strict';

const uuidv4 = require('uuid/v4');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIAPurchaseRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let cardToken = utils.safeVal(params.cardToken, utils.safeVal(mypos.config.checkout.cardToken, 0));
        let outputFormat = utils.safeVal(params.outputFormat, utils.safeVal(mypos.config.checkout.outputFormat, 'JSON'));

        const purchaseParams = {
            IPCmethod: 'IPCIAStoredCardUpdate',
            IPCVersion: version,
            IPCLanguage: language,
            CardToken: cardToken,
            CardholderName: params.CardholderName,
            CardType: params.CardType,
            ExpDate: params.ExpDate,
            CVC: params.CVC,
            ECI: params.ECI,
            AVV: params.AVV,
            XID: params.XID,
            CardVerification: params.CardVerification,
            Amount: params.amount,
            Currency: currency,
            OutputFormat: outputFormat
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

module.exports = CheckoutIAPurchaseRequest;

// FINISHED