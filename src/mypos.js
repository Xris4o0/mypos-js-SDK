'use strict';

const defaultConfig = {
    logLevel: 'info',
    isSandbox: false
};

function MyPOS(config) {
    if (!(this instanceof MyPOS)) {
        return new MyPOS(config);
    }

    this.token = undefined;
    // Support environment selection
    let environment = config.environment;
    if (!environment) {
        // Backward compatibility: map isSandbox
        environment = config.isSandbox ? 'sandbox' : 'production';
    }
    this.config = Object.assign({}, defaultConfig, config, { environment });

    // Ensure mypos.config.checkout exists and is populated
    this.config.checkout = {
        lang: this.config.lang || 'EN',
        version: this.config.version || '1.4',
        sid: this.config.sid,
        clientNumber: this.config.clientNumber,
        currency: this.config.currency || 'EUR',
        okUrl: this.config.successUrl,
        cancelUrl: this.config.cancelUrl,
        notifyUrl: this.config.notifyUrl,
        keyIndex: this.config.keyIndex,
        privateKey: this.config.privateKey,
        cardTokenRequest: this.config.cardTokenRequest,
        paymentMethod: this.config.paymentMethod,
        paymentParametersRequired: this.config.paymentParametersRequired,
        // ...add any other needed properties
    };

    this.setToken = (token) => {
        this.token = token;
    };

    require('./resources')(this);
    return this;
}

module.exports = MyPOS;
