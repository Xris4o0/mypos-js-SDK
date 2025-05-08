'use strict';

const { v4: uuidv4 } = require('uuid');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIPCPreAuthorizationOKRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let orderId = utils.safeVal(params.orderId, uuidv4());

        const purchaseParams = {
            IPCmethod: 'IPCPreAuthorizationOK',
            IPCVersion: version,
            IPCLanguage: language,
            Amount: params.amount,
            Currency: currency,
            OrderID: orderId,
            IPC_Trnref: params.IPC_Trnref,
            RequestDateTime: params.RequestDateTime,
            RequestSTAN: params.RequestSTAN,
            PreAuthExpDate: params.PreAuthExpDate,
            BillingDescriptor: params.BillingDescriptor
        };

        super(mypos, purchaseParams);
    }
}

module.exports = CheckoutIPCPreAuthorizationOKRequest;

// FINISHED