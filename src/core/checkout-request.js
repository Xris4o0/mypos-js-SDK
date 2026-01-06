'use strict';

const { generateSignature, generateForm } = require('./signature');
const { MyPOSError, MyPOSConfigError } = require('./errors');

const ENVIRONMENT_URLS = {
  demo: 'https://demo.mypos.eu/vmp/checkout',
  sandbox: 'https://www.mypos.com/vmp/checkout-test',
  production: 'https://www.mypos.com/vmp/checkout'
};

/**
 * Base class for all checkout operations
 * Handles form generation, signature, and environment routing
 */
class CheckoutRequest {
  /**
   * @param {Object} config - Configuration object
   * @param {Object} ipcParams - IPC parameters for the request
   */
  constructor(config, ipcParams) {
    // Validate config
    if (!config || typeof config !== 'object') {
      throw new MyPOSConfigError('Config must be an object');
    }
    if (!config.environment) {
      throw new MyPOSConfigError('Config must include environment');
    }
    if (!config.privateKey) {
      throw new MyPOSConfigError('Config must include privateKey');
    }

    // Validate ipcParams
    if (!ipcParams || typeof ipcParams !== 'object') {
      throw new MyPOSConfigError('IPC parameters must be an object');
    }
    if (!ipcParams.IPCmethod) {
      throw new MyPOSConfigError('IPC parameters must include IPCmethod');
    }

    this.config = config;
    this.params = ipcParams;
  }

  /**
   * Extract human-readable operation name from IPC method
   * @private
   * @param {string} ipcMethod - IPC method name (e.g., "IPCPurchase")
   * @returns {string} Human-readable operation name (e.g., "purchase")
   */
  _getOperationName(ipcMethod) {
    if (!ipcMethod) return 'unknown';
    // Remove "IPC" prefix and convert to lowercase
    // "IPCPurchase" -> "purchase", "IPCRefund" -> "refund"
    return ipcMethod.replace(/^IPC/, '').toLowerCase();
  }

  /**
   * Get the appropriate myPOS checkout URL based on environment
   * @returns {string} Checkout URL
   */
  getHost() {
    const env = this.config.environment;
    const url = ENVIRONMENT_URLS[env];

    if (!url) {
      throw new MyPOSConfigError(
        `Unknown environment: ${env}. Valid options: ${Object.keys(ENVIRONMENT_URLS).join(', ')}`
      );
    }

    return url;
  }

  /**
   * Execute the request - generate signature and form
   * @returns {Promise<Object>} Object with redirectUrl and rawResponse
   */
  async execute() {
    const method = this.params.IPCmethod;
    const operation = this._getOperationName(method);
    const createdAt = new Date().toISOString();
    const metadata = { operation, createdAt };

    try {
      // onBeforeSign callback
      if (this.config.onBeforeSign && typeof this.config.onBeforeSign === 'function') {
        await this.config.onBeforeSign({
          method,
          params: { ...this.params }, // Copy to prevent mutation
          metadata: { ...metadata }
        });
      }

      // Generate signature
      const signature = generateSignature(this.params, this.config.privateKey);

      // Create new object with signature (don't mutate this.params)
      const paramsWithSignature = {
        ...this.params,
        Signature: signature
      };

      // Get redirect URL
      const redirectUrl = this.getHost();

      // Generate HTML form
      const rawResponse = generateForm(redirectUrl, paramsWithSignature);

      // onAfterSign callback
      if (this.config.onAfterSign && typeof this.config.onAfterSign === 'function') {
        await this.config.onAfterSign({
          method,
          redirectUrl,
          signature: signature.substring(0, 20) + '...', // Truncated for security
          metadata: { ...metadata, completedAt: new Date().toISOString() }
        });
      }

      return {
        redirectUrl,
        rawResponse
      };
    } catch (error) {
      // onError callback
      if (this.config.onError && typeof this.config.onError === 'function') {
        await this.config.onError({
          method,
          error,
          metadata: { ...metadata, failedAt: new Date().toISOString() }
        });
      }

      // Re-throw if it's already a MyPOS error
      if (error instanceof MyPOSError) {
        throw error;
      }
      // Wrap other errors
      throw new MyPOSConfigError(`Request execution failed: ${error.message}`);
    }
  }
}

module.exports = CheckoutRequest;
