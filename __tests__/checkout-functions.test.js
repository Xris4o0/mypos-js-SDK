const {
  purchase, refund, reversal, getPaymentStatus,
  sendMoney, requestMoney,
  authorization, authorizationCapture, authorizationList, authorizationReverse,
  preAuthorization, preAuthStatus, preAuthCompletion, preAuthCancellation,
  iaPurchase, iaStoreCard, purchaseByIcard,
  paymentSessionCreate, mandateManagment
} = require('../src/index');

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

// Mock the MyPOS class
jest.mock('../src/mypos', () => {
  return jest.fn(() => ({
    config: {
      environment: 'sandbox',
      checkout: {
        sid: 'test_sid',
        clientNumber: 'test_client',
        currency: 'EUR',
        privateKey: 'test_key'
      }
    }
  }));
});

// Mock the request classes
const mockRequest = {
  send: jest.fn((callback) => {
    // Simulate successful response
    callback(null, { success: true, transactionId: 'TEST123' });
  })
};

jest.mock('../src/resources/checkout/purchase', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/refund', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/reversal', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/get-payment-status', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/send-money', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/request-money', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/authorization', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/authorization-capture', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/authorization-list', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/authorization-reverse', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/pre-authorization', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/pre-auth-status', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/pre-auth-completion', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/pre-auth-cancellation', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/ia-purchase', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/ia-store-card', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/purchase-by-icard', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/payment-session-create', () => {
  return jest.fn(() => mockRequest);
});

jest.mock('../src/resources/checkout/mandate-managment', () => {
  return jest.fn(() => mockRequest);
});

describe('Checkout Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Purchase Function', () => {
    test('should execute purchase with valid cart', async () => {
      const params = {
        cart: [
          { name: 'Product', price: 50, quantity: 1 }
        ],
        customer: { email: 'test@example.com' }
      };

      const result = await purchase(params);

      expect(result).toEqual({ 
        redirectUrl: undefined, 
        rawResponse: { success: true, transactionId: 'TEST123' } 
      });
    });

    test('should throw error for invalid cart', async () => {
      const params = {
        cart: [],
        customer: { email: 'test@example.com' }
      };

      await expect(purchase(params)).rejects.toThrow('cart must be a non-empty array of items');
    });

    test('should throw error for invalid cart item', async () => {
      const params = {
        cart: [
          { name: 'Product', price: 'invalid', quantity: 1 }
        ],
        customer: { email: 'test@example.com' }
      };

      await expect(purchase(params)).rejects.toThrow('Each cart item must have numeric price and quantity');
    });
  });

  describe('Refund Function', () => {
    test('should execute refund with valid parameters', async () => {
      const params = {
        transactionId: 'TXN123',
        amount: 25.50
      };

      const result = await refund(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should throw error when transactionId is missing', async () => {
      const params = {
        amount: 25.50
      };

      await expect(refund(params)).rejects.toThrow('transactionId is required');
    });

    test('should throw error when amount is not a number', async () => {
      const params = {
        transactionId: 'TXN123',
        amount: 'invalid'
      };

      await expect(refund(params)).rejects.toThrow('amount must be a number');
    });
  });

  describe('Reversal Function', () => {
    test('should execute reversal with valid parameters', async () => {
      const params = {
        transactionId: 'TXN123',
        amount: 50
      };

      const result = await reversal(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });
  });

  describe('Get Payment Status Function', () => {
    test('should execute getPaymentStatus with valid parameters', async () => {
      const params = {
        transactionId: 'TXN123'
      };

      const result = await getPaymentStatus(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });
  });

  describe('Send Money Function', () => {
    test('should execute sendMoney with valid parameters', async () => {
      const params = {
        walletNumber: '61938166610',
        amount: 100
      };

      const result = await sendMoney(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should throw error when walletNumber is missing', async () => {
      const params = {
        amount: 100
      };

      await expect(sendMoney(params)).rejects.toThrow('walletNumber (recipient client number) is required');
    });
  });

  describe('Request Money Function', () => {
    test('should execute requestMoney with valid parameters', async () => {
      const params = {
        recipient: '61938166610',
        amount: 100
      };

      const result = await requestMoney(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });
  });

  describe('Authorization Functions', () => {
    test('should execute authorization with valid parameters', async () => {
      const params = {
        amount: 50
      };

      const result = await authorization(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should execute authorizationCapture with valid parameters', async () => {
      const params = {
        transactionId: 'AUTH123',
        amount: 50
      };

      const result = await authorizationCapture(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should execute authorizationList', async () => {
      const params = {};

      const result = await authorizationList(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should execute authorizationReverse with valid parameters', async () => {
      const params = {
        transactionId: 'AUTH123'
      };

      const result = await authorizationReverse(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });
  });

  describe('Pre-Authorization Functions', () => {
    test('should execute preAuthorization with valid cart', async () => {
      const params = {
        cart: [
          { name: 'Product', price: 50, quantity: 1 }
        ],
        customer: { email: 'test@example.com' }
      };

      const result = await preAuthorization(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should execute preAuthStatus with valid parameters', async () => {
      const params = {
        transactionId: 'PREAUTH123'
      };

      const result = await preAuthStatus(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should execute preAuthCompletion with valid parameters', async () => {
      const params = {
        transactionId: 'PREAUTH123',
        amount: 50
      };

      const result = await preAuthCompletion(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should execute preAuthCancellation with valid parameters', async () => {
      const params = {
        transactionId: 'PREAUTH123'
      };

      const result = await preAuthCancellation(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });
  });

  describe('iCard Functions', () => {
    test('should execute iaPurchase with valid cart', async () => {
      const params = {
        cart: [
          { name: 'Product', price: 50, quantity: 1 }
        ],
        customer: { email: 'test@example.com' }
      };

      const result = await iaPurchase(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should execute iaStoreCard with valid parameters', async () => {
      const params = {
        customerId: 'CUSTOMER123'
      };

      const result = await iaStoreCard(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should execute purchaseByIcard with valid cart', async () => {
      const params = {
        cart: [
          { name: 'Product', price: 50, quantity: 1 }
        ],
        customer: { email: 'test@example.com' }
      };

      const result = await purchaseByIcard(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });
  });

  describe('Advanced Functions', () => {
    test('should execute paymentSessionCreate with valid cart', async () => {
      const params = {
        cart: [
          { name: 'Product', price: 50, quantity: 1 }
        ],
        customer: { email: 'test@example.com' }
      };

      const result = await paymentSessionCreate(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should execute mandateManagment with valid parameters', async () => {
      const params = {
        mandateId: 'MANDATE123'
      };

      const result = await mandateManagment(params);

      expect(result).toEqual({ success: true, transactionId: 'TEST123' });
    });

    test('should throw error when mandateId is missing', async () => {
      const params = {};

      await expect(mandateManagment(params)).rejects.toThrow('mandateId is required');
    });
  });

  describe('Error Handling', () => {
    test('should handle request errors', async () => {
      // Mock request to throw error
      mockRequest.send.mockImplementationOnce((callback) => {
        callback(new Error('Network error'), null);
      });

      const params = {
        cart: [{ name: 'Product', price: 50, quantity: 1 }],
        customer: { email: 'test@example.com' }
      };

      await expect(purchase(params)).rejects.toThrow('Network error');
    });
  });
});
