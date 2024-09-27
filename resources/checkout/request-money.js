'use strict';

const uuidv4 = require('uuid/v4');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIPCRequestMoneyRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let orderId = utils.safeVal(params.orderId, uuidv4());
        let outputFormat = utils.safeVal(params.outputFormat, utils.safeVal(mypos.config.checkout.outputFormat, 'JSON'));

        const purchaseParams = {
            IPCmethod: 'IPCRequestMoney',
            IPCVersion: version,
            IPCLanguage: language,
            MandateReference: params.MandateReference,
            CustomerWalletNumber: params.customer.WalletNumber,
            OrderID: orderId,
            ReversalIndicator: params.ReversalIndicator,
            Amount: params.amount,
            Currency: currency,
            Reason: params.Reason,
            OutputFormat: outputFormat            
        };

        super(mypos, purchaseParams);
    }
}

module.exports = CheckoutIPCRequestMoneyRequest;

// FINISHED