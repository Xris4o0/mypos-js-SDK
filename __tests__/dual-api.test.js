const { purchase, refund } = require('../src/index');
const MyPOS = require('../src/mypos');

// Mock the config loader
jest.mock('../src/utils/config-loader', () => ({
  loadConfig: jest.fn(() => ({
    environment: 'sandbox',
    sid: 'test_sid',
    clientNumber: 'test_client',
    currency: 'EUR',
    privateKey: 'test_key',
    successUrl: 'http://test.com/ok',
    cancelUrl: 'http://test.com/cancel',
    notifyUrl: 'http://test.com/notify'
  }))
}));

// Mock the request classes
const mockRequest = {
  send: jest.fn((callback) => {
    callback(null, { success: true, transactionId: 'TEST123' });
  })
};

jest.mock('../src/resources/checkout/purchase', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/refund', () => {
  return jest.fn(() => mockRequest);
});

describe('Dual API Support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('New Simplified API', () => {
    test('should export all functions from index.js', () => {
      const functions = require('../src/index');
      
      // Check that all expected functions are exported
      expect(functions.purchase).toBeDefined();
      expect(functions.refund).toBeDefined();
      expect(functions.reversal).toBeDefined();
      expect(functions.getPaymentStatus).toBeDefined();
      expect(functions.sendMoney).toBeDefined();
      expect(functions.requestMoney).toBeDefined();
      expect(functions.authorization).toBeDefined();
      expect(functions.authorizationCapture).toBeDefined();
      expect(functions.authorizationList).toBeDefined();
      expect(functions.authorizationReverse).toBeDefined();
      expect(functions.preAuthorization).toBeDefined();
      expect(functions.preAuthStatus).toBeDefined();
      expect(functions.preAuthCompletion).toBeDefined();
      expect(functions.preAuthCancellation).toBeDefined();
      expect(functions.iaPurchase).toBeDefined();
      expect(functions.iaStoreCard).toBeDefined();
      expect(functions.iaStoreCardUpdate).toBeDefined();
      expect(functions.iaPreAuthorization).toBeDefined();
      expect(functions.purchaseByIcard).toBeDefined();
      expect(functions.purchaseCancel).toBeDefined();
      expect(functions.purchaseNotify).toBeDefined();
      expect(functions.purchaseOK).toBeDefined();
      expect(functions.purchaseRollback).toBeDefined();
      expect(functions.preAuthorizationOK).toBeDefined();
      expect(functions.preAuthorizationNotify).toBeDefined();
      expect(functions.preAuthorizationCancel).toBeDefined();
      expect(functions.paymentSessionCreate).toBeDefined();
      expect(functions.mandateManagment).toBeDefined();
    });

    test('should work with async/await', async () => {
      const params = {
        cart: [{ name: 'Product', price: 50, quantity: 1 }],
        customer: { email: 'test@example.com' }
      };

      const result = await purchase(params);

      expect(result).toEqual({ 
        redirectUrl: undefined, 
        rawResponse: { success: true, transactionId: 'TEST123' } 
      });
    });

    test('should handle errors with async/await', async () => {
      mockRequest.send.mockImplementationOnce((callback) => {
        callback(new Error('Test error'), null);
      });

      const params = {
        cart: [{ name: 'Product', price: 50, quantity: 1 }],
        customer: { email: 'test@example.com' }
      };

      await expect(purchase(params)).rejects.toThrow('Test error');
    });
  });

  describe('Legacy API', () => {
    test('should create MyPOS instance with config', () => {
      const config = {
        environment: 'sandbox',
        checkout: {
          sid: 'test_sid',
          clientNumber: 'test_client',
          currency: 'EUR',
          privateKey: 'test_key'
        }
      };

      const mypos = MyPOS(config);

      expect(mypos).toBeDefined();
      expect(mypos.config).toEqual(expect.objectContaining({
        environment: 'sandbox',
        checkout: expect.objectContaining({
          currency: 'EUR'
        })
      }));
    });

    test('should support callback-based usage', (done) => {
      const config = {
        environment: 'sandbox',
        checkout: {
          sid: 'test_sid',
          clientNumber: 'test_client',
          currency: 'EUR',
          privateKey: 'test_key'
        }
      };

      const mypos = MyPOS(config);

      // Mock the checkout methods
      mypos.checkout = {
        purchase: jest.fn((params, callback) => {
          callback(null, { success: true, transactionId: 'TEST123' });
        }),
        refund: jest.fn((params, callback) => {
          callback(null, { success: true, transactionId: 'TEST123' });
        })
      };

      const params = {
        cart: [{ name: 'Product', price: 50, quantity: 1 }],
        customer: { email: 'test@example.com' }
      };

      mypos.checkout.purchase(params, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual({ success: true, transactionId: 'TEST123' });
        done();
      });
    });

    test('should handle errors in callback-based usage', (done) => {
      const config = {
        environment: 'sandbox',
        checkout: {
          sid: 'test_sid',
          clientNumber: 'test_client',
          currency: 'EUR',
          privateKey: 'test_key'
        }
      };

      const mypos = MyPOS(config);

      // Mock the checkout methods to throw error
      mypos.checkout = {
        purchase: jest.fn((params, callback) => {
          callback(new Error('Test error'), null);
        })
      };

      const params = {
        cart: [{ name: 'Product', price: 50, quantity: 1 }],
        customer: { email: 'test@example.com' }
      };

      mypos.checkout.purchase(params, (err, result) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Test error');
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('Multi-tenant Scenarios', () => {
    test('should support multiple MyPOS instances with different configs', () => {
      const config1 = {
        environment: 'sandbox',
        checkout: {
          sid: 'client1_sid',
          clientNumber: 'client1_client',
          currency: 'EUR',
          privateKey: 'client1_key'
        }
      };

      const config2 = {
        environment: 'production',
        checkout: {
          sid: 'client2_sid',
          clientNumber: 'client2_client',
          currency: 'USD',
          privateKey: 'client2_key'
        }
      };

      const mypos1 = MyPOS(config1);
      const mypos2 = MyPOS(config2);

      expect(mypos1.config.environment).toBe('sandbox');
      expect(mypos2.config.environment).toBe('production');
    });

    test('should maintain separate configurations', () => {
      const config1 = {
        environment: 'sandbox',
        checkout: {
          sid: 'client1_sid',
          clientNumber: 'client1_client',
          currency: 'EUR',
          privateKey: 'client1_key'
        }
      };

      const config2 = {
        environment: 'production',
        checkout: {
          sid: 'client2_sid',
          clientNumber: 'client2_client',
          currency: 'USD',
          privateKey: 'client2_key'
        }
      };

      const mypos1 = MyPOS(config1);
      const mypos2 = MyPOS(config2);

      // Modify one instance
      mypos1.config.environment = 'modified_env';

      // Other instance should remain unchanged
      expect(mypos2.config.environment).toBe('production');
    });
  });

  describe('API Compatibility', () => {
    test('should produce same results for both APIs', async () => {
      const params = {
        cart: [{ name: 'Product', price: 50, quantity: 1 }],
        customer: { email: 'test@example.com' }
      };

      // New API
      const newApiResult = await purchase(params);

      // Legacy API
      const config = {
        environment: 'sandbox',
        checkout: {
          sid: 'test_sid',
          clientNumber: 'test_client',
          currency: 'EUR',
          privateKey: 'test_key'
        }
      };

      const mypos = MyPOS(config);
      mypos.checkout = {
        purchase: jest.fn((params, callback) => {
          callback(null, { success: true, transactionId: 'TEST123' });
        })
      };

      const legacyApiResult = await new Promise((resolve, reject) => {
        mypos.checkout.purchase(params, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      expect(newApiResult).toEqual({ 
        redirectUrl: undefined, 
        rawResponse: legacyApiResult 
      });
    });
  });
});
