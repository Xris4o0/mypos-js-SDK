'use strict';

const uuidv4 = require('uuid/v4');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutAuthorizationReverseRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let sid = utils.safeVal(params.sid, mypos.config.checkout.sid);
        let walletNumber = utils.safeVal(params.sid, mypos.config.checkout.clientNumber);
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let orderId = utils.safeVal(params.orderId, uuidv4());
        let okUrl = utils.safeVal(params.okUrl, mypos.config.checkout.okUrl);
        let cancelUrl = utils.safeVal(params.cancelUrl, mypos.config.checkout.cancelUrl);
        let notifyUrl = utils.safeVal(params.notifyUrl, mypos.config.checkout.notifyUrl);
        let cardToken = utils.safeVal(params.cardToken, utils.safeVal(mypos.config.checkout.cardToken, 0));
        let paymentMethod = utils.safeVal(params.paymentMethod, utils.safeVal(mypos.config.checkout.paymentMethod, 1));
        let paymentParametersRequired = utils.safeVal(params.paymentParametersRequired, utils.safeVal(mypos.config.checkout.paymentParametersRequired, 1));

        const reverseParams = {
            IPCmethod: 'IPCAuthorizationReverse',
            IPCVersion: version,
            IPCLanguage: language,
            OrderID: orderId,
            SID: sid,
            WalletNumber: walletNumber,
            KeyIndex: mypos.config.checkout.keyIndex,
            OutputFormat: XML, // XML or JSON
        };

        super(mypos, reverseParams);
    }
}

module.exports = CheckoutAuthorizationReverseRequest;

// FINISHED