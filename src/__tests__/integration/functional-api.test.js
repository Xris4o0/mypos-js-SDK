'use strict';

const {
  purchase,
  refund,
  reversal,
  authorization,
  preAuthorization,
  getPaymentStatus
} = require('../../index');

describe('Functional API Integration', () => {
  test('should export all operations', () => {
    expect(purchase).toBeDefined();
    expect(typeof purchase).toBe('function');
    expect(refund).toBeDefined();
    expect(typeof refund).toBe('function');
    expect(reversal).toBeDefined();
    expect(typeof reversal).toBe('function');
  });
  
  test('should execute purchase operation', async () => {
    const result = await purchase({
      ...MOCK_CONFIG,
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    expect(result.redirectUrl).toBeDefined();
    expect(result.rawResponse).toBeDefined();
  });
  
  test('should execute refund operation', async () => {
    const result = await refund({
      ...MOCK_CONFIG,
      transactionId: 'TEST123',
      amount: 50
    });
    
    expect(result.redirectUrl).toBeDefined();
    expect(result.rawResponse).toContain('IPCRefund');
  });
  
  test('should execute authorization operation', async () => {
    const result = await authorization({
      ...MOCK_CONFIG,
      amount: 100
    });
    
    expect(result.redirectUrl).toBeDefined();
    expect(result.rawResponse).toContain('IPCAuthorization');
  });
  
  test('should execute pre-authorization operation', async () => {
    const result = await preAuthorization({
      ...MOCK_CONFIG,
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    expect(result.redirectUrl).toBeDefined();
    expect(result.rawResponse).toContain('IPCPreAuthorization');
  });
  
  test('should handle errors properly', async () => {
    await expect(purchase({
      ...MOCK_CONFIG,
      cart: [], // Empty cart should fail
      customer: MOCK_CUSTOMER
    })).rejects.toThrow();
  });
});

