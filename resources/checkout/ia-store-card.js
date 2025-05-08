'use strict';

const { v4: uuidv4 } = require('uuid');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIPCIAStoreCardRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let outputFormat = utils.safeVal(params.outputFormat, utils.safeVal(mypos.config.checkout.outputFormat, 'JSON'));

        const purchaseParams = {
            IPCmethod: 'IPCIAStoreCard',
            IPCVersion: version,
            IPCLanguage: language,
            CardType: params.CardType,
            PAN: params.PAN,
            CardholderName: params.CardholderName,
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

        super(mypos, purchaseParams);
    }
}

module.exports = CheckoutIPCIAStoreCardRequest;

// FINISHED