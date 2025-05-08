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
    this.config = Object.assign(defaultConfig, config, { environment });

    this.setToken = (token) => {
        this.token = token;
    };

    require('./resources')(this);
    return this;
}

module.exports = MyPOS;
