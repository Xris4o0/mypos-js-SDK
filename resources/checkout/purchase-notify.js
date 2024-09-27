'use strict';

const uuidv4 = require('uuid/v4');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIPCPurchaseNotifyRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let orderId = utils.safeVal(params.orderId, uuidv4());
        let cardToken = utils.safeVal(params.cardToken, utils.safeVal(mypos.config.checkout.cardToken, 0));
        
        const purchaseParams = {
            IPCmethod: 'IPCPurchaseNotify',
            IPCVersion: version,
            IPCLanguage: language,
            Amount: params.amount,
            Currency: currency,
            OrderID: orderId,
            IPC_Trnref: params.IPC_Trnref,
            RequestDateTime: params.RequestDateTime,
            RequestSTAN: params.RequestSTAN,
            CardToken: cardToken,
            PAN: params.PAN,
            ExpDate: params.ExpDate,
            CardType: params.CardType,
            customeremail: params.customer.email,
            customerphone: params.customer.phone,
            customerfirstnames: params.customer.firstNames,
            customerfamilyname: params.customer.familyName,
            BillingDescriptor: params.BillingDescriptor,
        };

        super(mypos, purchaseParams);
    }
}

module.exports = CheckoutIPCPurchaseNotifyRequest;

// FINISHED