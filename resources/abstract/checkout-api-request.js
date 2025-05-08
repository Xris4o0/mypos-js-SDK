'use strict';

const NodeRSA = require('node-rsa');
const logger = require('../../utils/logger');

class CheckoutApiRequest {
    constructor(mypos, params) {
        this._mypos = mypos;
        this._params = params;
    }

    get mypos() {
        return this._mypos;
    }

    get params() {
        return this._params;
    }

    get host() {
        const env = this.mypos.config.environment;
        if (env === 'demo') {
            return 'https://demo.mypos.eu/vmp/checkout';
        } else if (env === 'sandbox') {
            return 'https://www.mypos.com/vmp/checkout-test';
        } else {
            return 'https://www.mypos.com/vmp/checkout';
        }
    }

    send = (handler) => {
        // Select private key based on environment
        const env = this.mypos.config.environment;
        let privateKey = this.mypos.config.checkout.privateKey;
        if (this.mypos.config.checkout.privateKeys && this.mypos.config.checkout.privateKeys[env]) {
            privateKey = this.mypos.config.checkout.privateKeys[env];
        }
        console.log('Using private key:', privateKey);
        const rsaKey = new NodeRSA(privateKey);
        this._params['Signature'] = generateSignature(this.params, rsaKey);
        logger.debug(`Sending request to myPOS Checkout API with params: ${JSON.stringify(this.params)}`);
        const data = generateForm(this.host, this.params);

        if (isFunction(handler)) {
            handler(data);
        }
        else {
            handler.write(data);
            handler.end();
        }
    };
}

const generateSignature = (params, privateKey) => {
    let dataToSign = '';

    for (const value of Object.values(params)) {
        dataToSign += `-${value}`
    }

    dataToSign = dataToSign.substr(1);

    let buff = Buffer.from(dataToSign);
    let base64data = buff.toString('base64');

    // Debug logs for signature troubleshooting
    console.log('String to sign:', dataToSign);
    console.log('Base64 to sign:', base64data);

    return privateKey.sign(Buffer.from(base64data), 'base64', 'utf8', 'sha256');
};

const generateForm = (host, params) => {
    let rawHtml = '<html><body onload="document.ipcForm.submit()">';
    rawHtml += `<form id="ipcForm" name="ipcForm" action="${host}" method="post">`;

    for (const [key, value] of Object.entries(params)) {
        rawHtml += `<input type="hidden" name="${key}" value="${value}"/><br>`;
    }

    rawHtml += `</form></body></html>`;
    return rawHtml;
};

const isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

module.exports = CheckoutApiRequest;
