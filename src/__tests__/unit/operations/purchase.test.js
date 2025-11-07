'use strict';

const purchase = require('../../../checkout/purchase');

describe('Purchase Operation', () => {
  test('should create purchase request successfully', async () => {
    const result = await purchase({
      ...MOCK_CONFIG,
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    expect(result).toBeDefined();
    expect(result.redirectUrl).toBeDefined();
    expect(result.rawResponse).toBeDefined();
    expect(result.redirectUrl).toContain('mypos.com');
    expect(result.rawResponse).toContain('<form');
    expect(result.rawResponse).toContain('IPCPurchase');
  });
  
  test('should include cart items in request', async () => {
    const result = await purchase({
      ...MOCK_CONFIG,
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    expect(result.rawResponse).toContain('Product 1');
    expect(result.rawResponse).toContain('Product 2');
    expect(result.rawResponse).toContain('CartItems');
  });
  
  test('should include customer details', async () => {
    const result = await purchase({
      ...MOCK_CONFIG,
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    expect(result.rawResponse).toContain('test@example.com');
    expect(result.rawResponse).toContain('CustomerEmail');
  });
  
  test('should calculate total amount from cart', async () => {
    const result = await purchase({
      ...MOCK_CONFIG,
      cart: [
        { name: 'Item 1', price: 50, quantity: 1 },
        { name: 'Item 2', price: 30, quantity: 2 }
      ],
      customer: MOCK_CUSTOMER
    });
    
    // Total should be 50 + (30 * 2) = 110
    expect(result.rawResponse).toContain('name="Amount" value="110"');
  });
  
  test('should apply discount correctly', async () => {
    const result = await purchase({
      ...MOCK_CONFIG,
      cart: [{ name: 'Item', price: 100, quantity: 1 }],
      discount: 10, // 10%
      customer: MOCK_CUSTOMER
    });
    
    // Should include discount item
    expect(result.rawResponse).toContain('Discount');
    // Total should be 90 (100 - 10)
    expect(result.rawResponse).toContain('name="Amount" value="90"');
  });
  
  test('should add tip correctly', async () => {
    const result = await purchase({
      ...MOCK_CONFIG,
      cart: [{ name: 'Item', price: 100, quantity: 1 }],
      tip: 15,
      customer: MOCK_CUSTOMER
    });
    
    // Should include tip item
    expect(result.rawResponse).toContain('Tip');
    // Total should be 115 (100 + 15)
    expect(result.rawResponse).toContain('name="Amount" value="115"');
  });
  
  test('should use correct environment URL', async () => {
    const sandboxResult = await purchase({
      ...MOCK_CONFIG,
      environment: 'sandbox',
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    expect(sandboxResult.redirectUrl).toContain('checkout-test');
    
    const prodResult = await purchase({
      ...MOCK_CONFIG,
      environment: 'production',
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    expect(prodResult.redirectUrl).toContain('mypos.com/vmp/checkout');
    expect(prodResult.redirectUrl).not.toContain('test');
  });
  
  test('should throw error for missing cart', async () => {
    await expect(purchase({
      ...MOCK_CONFIG,
      customer: MOCK_CUSTOMER
    })).rejects.toThrow();
  });
});

