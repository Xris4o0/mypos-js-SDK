'use strict';

const uuidv4 = require('uuid/v4');
const utils = require('../../utils/common');
const CheckoutApiRequest = require('../abstract/checkout-api-request');

class CheckoutIAPreAuthorizationeRequest extends CheckoutApiRequest {
    constructor(mypos, params) {
        let language = utils.safeVal(params.lang, utils.safeVal(mypos.config.checkout.lang, 'EN'));
        let version = utils.safeVal(params.version, utils.safeVal(mypos.config.checkout.version, '1.4'));
        let sid = utils.safeVal(params.sid, mypos.config.checkout.sid);
        let walletNumber = utils.safeVal(params.sid, mypos.config.checkout.clientNumber);
        let currency = utils.safeVal(params.currency, mypos.config.checkout.currency);
        let orderId = utils.safeVal(params.orderId, uuidv4());
        let cardToken = utils.safeVal(params.cardToken, utils.safeVal(mypos.config.checkout.cardToken, 0));

        const aiPreAuthParams = {
            IPCmethod: 'IPCIAPreAuthorization',
            IPCVersion: version,
            IPCLanguage: language,
            OrderID: orderId,
            Amount: params.amount,
            Currency: currency,
            SID: sid,
            WalletNumber: walletNumber,
            KeyIndex: mypos.config.checkout.keyIndex,
            // PAN: params.PAN,
            // CardholderName: params.CardholderName,
            // CVC: params.CVC,
            // ECI: params.ECI,
            // AVV: params.AVV,
            // XID: params.XID,
            CardToken: cardToken,
            AccountSettlement: params.AccountSettlement,
            Note: params.note,
            ItemName: params.itemName,
        };

        super(mypos, aiPreAuthParams);
    }
}

module.exports = CheckoutIAPreAuthorizationeRequest;