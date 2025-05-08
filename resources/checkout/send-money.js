'use strict';

const { v4: uuidv4 } = require('uuid');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIPCSendMoneyRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let outputFormat = utils.safeVal(params.outputFormat, utils.safeVal(mypos.config.checkout.outputFormat, 'JSON'));

        const purchaseParams = {
            IPCmethod: 'IPCSendMoney',
            IPCVersion: version,
            IPCLanguage: language,
            CustomerWalletNumber: params.customer.walletNumber,
            Amount: params.amount,
            Currency: currency,
            TransactionReference: params.TransactionReference,
            Reason: params.Reason,
            OutputFormat: outputFormat
        };

        super(mypos, purchaseParams);
    }
}

module.exports = CheckoutIPCSendMoneyRequest;