'use strict';

const { v4: uuidv4 } = require('uuid');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIPCPurchaseRollbackRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let orderId = utils.safeVal(params.orderId, uuidv4());

        const purchaseParams = {
            IPCmethod: 'IPCPurchaseRollback',
            IPCVersion: version,
            IPCLanguage: language,
            Amount: params.amount,
            Currency: currency,
            OrderID: orderId,
        };

        super(mypos, purchaseParams);
    }
}

module.exports = CheckoutIPCPurchaseRollbackRequest;

// FINISHED