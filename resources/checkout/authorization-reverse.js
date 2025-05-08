'use strict';

const { v4: uuidv4 } = require('uuid');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutAuthorizationReverseRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let sid = utils.safeVal(params.sid, mypos.config.checkout.sid);
        let walletNumber = utils.safeVal(params.sid, mypos.config.checkout.clientNumber);
        let orderId = utils.safeVal(params.orderId, uuidv4());
        let outputFormat = utils.safeVal(params.outputFormat, utils.safeVal(mypos.config.checkout.outputFormat, 'JSON'));

        const reverseParams = {
            IPCmethod: 'IPCAuthorizationReverse',
            IPCVersion: version,
            IPCLanguage: language,
            OrderID: orderId,
            SID: sid,
            WalletNumber: walletNumber,
            KeyIndex: mypos.config.checkout.keyIndex,
            OutputFormat: outputFormat
        };

        super(mypos, reverseParams);
    }
}

module.exports = CheckoutAuthorizationReverseRequest;

// FINISHED