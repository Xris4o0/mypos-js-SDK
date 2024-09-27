'use strict';

const uuidv4 = require('uuid/v4');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIPCMandateManagementRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let outputFormat = utils.safeVal(params.outputFormat, utils.safeVal(mypos.config.checkout.outputFormat, 'JSON'));

        const purchaseParams = {
            IPCmethod: 'IPCMandateManagement',
            IPCVersion: version,
            IPCLanguage: language,
            MandateReference: params.MandateReference,
            CustomerWalletNumber: params.CustomerWalletNumber,
            Action: params.Action,
            MandateText: params.MandateText,
            OutputFormat: outputFormat
        };

        super(mypos, purchaseParams);
    }
}

module.exports = CheckoutIPCMandateManagementRequest;

// FINISHED