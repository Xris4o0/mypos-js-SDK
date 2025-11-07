'use strict';

const { MyPOSCheckout } = require('../../index');

describe('Client API Integration', () => {
  let client;
  
  beforeEach(() => {
    client = new MyPOSCheckout(MOCK_CONFIG);
  });
  
  test('should create client instance', () => {
    expect(client).toBeDefined();
    expect(client instanceof MyPOSCheckout).toBe(true);
  });
  
  test('should have all operations available', () => {
    expect(client.purchase).toBeDefined();
    expect(client.refund).toBeDefined();
    expect(client.reversal).toBeDefined();
    expect(client.authorization).toBeDefined();
    expect(client.preAuthorization).toBeDefined();
  });
  
  test('should execute purchase through client', async () => {
    const result = await client.purchase({
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    expect(result.redirectUrl).toBeDefined();
    expect(result.rawResponse).toBeDefined();
    expect(result.rawResponse).toContain('IPCPurchase');
  });
  
  test('should execute refund through client', async () => {
    const result = await client.refund({
      transactionId: 'TEST123',
      amount: 50
    });
    
    expect(result.redirectUrl).toBeDefined();
    expect(result.rawResponse).toContain('IPCRefund');
  });
  
  test('should allow config override per call', async () => {
    const result = await client.purchase({
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER,
      currency: 'USD' // Override default EUR
    });
    
    expect(result.rawResponse).toContain('USD');
  });
  
  test('should get current config', () => {
    const config = client.getConfig();
    
    expect(config.sid).toBe(MOCK_CONFIG.sid);
    expect(config.clientNumber).toBe(MOCK_CONFIG.clientNumber);
    expect(config.environment).toBe(MOCK_CONFIG.environment);
  });
  
  test('should update config', () => {
    client.updateConfig({ currency: 'USD' });
    const config = client.getConfig();
    
    expect(config.currency).toBe('USD');
  });
  
  test('should maintain config between calls', async () => {
    await client.purchase({
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    const config = client.getConfig();
    expect(config.sid).toBe(MOCK_CONFIG.sid);
  });
});

