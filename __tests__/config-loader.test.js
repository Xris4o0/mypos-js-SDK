const { loadConfig } = require('../src/utils/config-loader');
const fs = require('fs');
const path = require('path');

// Mock fs module
jest.mock('fs');
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('Config Loader', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Reset process.env to default sandbox values
    process.env = {
      MYPOS_ENVIRONMENT: 'sandbox',
      MYPOS_SID_SANDBOX: 'test_sid',
      MYPOS_CLIENT_NUMBER_SANDBOX: 'test_client',
      MYPOS_PRIVATE_KEY_SANDBOX: 'test_key',
      MYPOS_CURRENCY_SANDBOX: 'EUR',
      MYPOS_OK_URL: 'http://test.com/ok',
      MYPOS_CANCEL_URL: 'http://test.com/cancel',
      MYPOS_NOTIFY_URL: 'http://test.com/notify'
    };
    
    // Clear any demo/production env vars
    delete process.env.MYPOS_SID_DEMO;
    delete process.env.MYPOS_CLIENT_NUMBER_DEMO;
    delete process.env.MYPOS_PRIVATE_KEY_DEMO;
    delete process.env.MYPOS_CURRENCY_DEMO;
    delete process.env.MYPOS_SID_PRODUCTION;
    delete process.env.MYPOS_CLIENT_NUMBER_PRODUCTION;
    delete process.env.MYPOS_PRIVATE_KEY_PRODUCTION;
    delete process.env.MYPOS_CURRENCY_PRODUCTION;
  });

  describe('Environment Variable Loading', () => {
    test('should load sandbox environment by default', () => {
      const config = loadConfig();
      
      expect(config.environment).toBe('sandbox');
      expect(config.sid).toBe('test_sid');
      expect(config.clientNumber).toBe('test_client');
      expect(config.privateKey).toBe('test_key');
      expect(config.currency).toBe('EUR');
    });

    test('should load demo environment when specified', () => {
      process.env.MYPOS_ENVIRONMENT = 'demo';
      process.env.MYPOS_SID_DEMO = 'demo_sid';
      process.env.MYPOS_CLIENT_NUMBER_DEMO = 'demo_client';
      process.env.MYPOS_PRIVATE_KEY_DEMO = 'demo_key';

      const config = loadConfig();
      
      expect(config.environment).toBe('demo');
      expect(config.sid).toBe('demo_sid');
      expect(config.clientNumber).toBe('demo_client');
      expect(config.privateKey).toBe('demo_key');
    });

    test('should load production environment when specified', () => {
      process.env.MYPOS_ENVIRONMENT = 'production';
      process.env.MYPOS_SID_PRODUCTION = 'prod_sid';
      process.env.MYPOS_CLIENT_NUMBER_PRODUCTION = 'prod_client';
      process.env.MYPOS_PRIVATE_KEY_PRODUCTION = 'prod_key';

      const config = loadConfig();
      
      expect(config.environment).toBe('production');
      expect(config.sid).toBe('prod_sid');
      expect(config.clientNumber).toBe('prod_client');
      expect(config.privateKey).toBe('prod_key');
    });
  });

  describe('Private Key Loading', () => {
    test('should use environment variable when available', () => {
      const config = loadConfig();
      expect(config.privateKey).toBe('test_key');
    });

    test('should load from .pem file when env var not available', () => {
      // Remove private key from env
      delete process.env.MYPOS_PRIVATE_KEY_SANDBOX;
      
      // Mock file system
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('pem_key_content');

      const config = loadConfig();
      
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining('private_key_sandbox.pem')
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('private_key_sandbox.pem'),
        'utf8'
      );
      expect(config.privateKey).toBe('pem_key_content');
    });

    test('should fallback to generic .pem file', () => {
      // Remove private key from env
      delete process.env.MYPOS_PRIVATE_KEY_SANDBOX;
      
      // Mock file system - env-specific file doesn't exist, but generic does
      fs.existsSync
        .mockReturnValueOnce(false) // mypos.config.js
        .mockReturnValueOnce(false) // private_key_sandbox.pem
        .mockReturnValueOnce(true);  // private_key.pem
      fs.readFileSync.mockReturnValue('generic_pem_key');

      const config = loadConfig();
      
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining('private_key_sandbox.pem')
      );
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining('private_key.pem')
      );
      expect(config.privateKey).toBe('generic_pem_key');
    });

    test('should replace escaped newlines in env keys', () => {
      process.env.MYPOS_PRIVATE_KEY_SANDBOX = '-----BEGIN RSA PRIVATE KEY-----\\nMOCK_KEY\\n-----END RSA PRIVATE KEY-----';
      
      const config = loadConfig();
      
      expect(config.privateKey).toBe('-----BEGIN RSA PRIVATE KEY-----\nMOCK_KEY\n-----END RSA PRIVATE KEY-----');
    });
  });

  describe('Parameter Overrides', () => {
    test('should allow parameter overrides', () => {
      const config = loadConfig({
        environment: 'demo',
        sid: 'override_sid',
        clientNumber: 'override_client'
      });
      
      expect(config.environment).toBe('demo');
      expect(config.sid).toBe('override_sid');
      expect(config.clientNumber).toBe('override_client');
    });

    test('should allow parameter overrides', () => {
      const config = loadConfig({
        sid: 'override_sid',
        clientNumber: 'override_client'
      });
      
      expect(config.sid).toBe('override_sid'); // Override wins
      expect(config.clientNumber).toBe('override_client'); // Override wins
    });
  });

  describe('Validation', () => {
    test('should throw error when SID is missing', () => {
      delete process.env.MYPOS_SID_SANDBOX;
      
      expect(() => loadConfig()).toThrow('MYPOS_SID is required for environment: sandbox');
    });

    test('should throw error when client number is missing', () => {
      delete process.env.MYPOS_CLIENT_NUMBER_SANDBOX;
      
      expect(() => loadConfig()).toThrow('MYPOS_CLIENT_NUMBER is required for environment: sandbox');
    });

    test('should throw error when private key is missing', () => {
      delete process.env.MYPOS_PRIVATE_KEY_SANDBOX;
      fs.existsSync.mockReturnValue(false);
      
      expect(() => loadConfig()).toThrow('MYPOS_PRIVATE_KEY is required for environment: sandbox. Set via .env or .pem file.');
    });

    test('should default currency to EUR when not set', () => {
      delete process.env.MYPOS_CURRENCY_SANDBOX;
      
      const config = loadConfig();
      expect(config.currency).toBe('EUR');
    });
  });

  describe('URL Configuration', () => {
    test('should load callback URLs from environment', () => {
      const config = loadConfig();
      
      expect(config.successUrl).toBe('http://test.com/ok');
      expect(config.cancelUrl).toBe('http://test.com/cancel');
      expect(config.notifyUrl).toBe('http://test.com/notify');
    });

    test('should handle missing URLs gracefully', () => {
      delete process.env.MYPOS_OK_URL;
      delete process.env.MYPOS_CANCEL_URL;
      delete process.env.MYPOS_NOTIFY_URL;
      
      const config = loadConfig();
      
      expect(config.successUrl).toBeUndefined();
      expect(config.cancelUrl).toBeUndefined();
      expect(config.notifyUrl).toBeUndefined();
    });
  });
});
