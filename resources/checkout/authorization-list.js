'use strict';

const uuidv4 = require('uuid/v4');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutAuthorizationListRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let sid = utils.safeVal(params.sid, mypos.config.checkout.sid);
        let walletNumber = utils.safeVal(params.sid, mypos.config.checkout.clientNumber);
        let cardToken = utils.safeVal(params.cardToken, utils.safeVal(mypos.config.checkout.cardToken, 0));

        const listParams = {
            IPCmethod: 'IPCAuthorizationList',
            IPCVersion: version,
            IPCLanguage: language,
            SID: sid,
            WalletNumber: walletNumber,
            CardToken: cardToken,
            // OutputFormat: XML, // XML or JSON
        };

        super(mypos, listParams);
    }
}

module.exports = CheckoutAuthorizationListRequest;

// FINISHED