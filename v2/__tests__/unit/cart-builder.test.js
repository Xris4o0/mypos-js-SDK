'use strict';

const { buildCartItems, calculateTotal } = require('../../utils/cart-builder');
const { MyPOSValidationError } = require('../../core/errors');

describe('Cart Builder', () => {
  test('should build cart items from array', () => {
    const cart = [
      { name: 'Item 1', price: 50, quantity: 1 },
      { name: 'Item 2', price: 30, quantity: 2 }
    ];
    
    const items = buildCartItems(cart);
    
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({ name: 'Item 1', price: 50, quantity: 1 });
    expect(items[1]).toEqual({ name: 'Item 2', price: 30, quantity: 2 });
  });
  
  test('should add discount as negative item', () => {
    const cart = [{ name: 'Item', price: 100, quantity: 1 }];
    const discount = 10; // 10%
    
    const items = buildCartItems(cart, discount);
    
    expect(items).toHaveLength(2);
    expect(items[1].name).toContain('Discount');
    expect(items[1].price).toBe(-10);
    expect(items[1].quantity).toBe(1);
  });
  
  test('should add tip as positive item', () => {
    const cart = [{ name: 'Item', price: 100, quantity: 1 }];
    const tip = 15;
    
    const items = buildCartItems(cart, undefined, tip);
    
    expect(items).toHaveLength(2);
    expect(items[1].name).toBe('Tip');
    expect(items[1].price).toBe(15);
    expect(items[1].quantity).toBe(1);
  });
  
  test('should add both discount and tip', () => {
    const cart = [{ name: 'Item', price: 100, quantity: 1 }];
    const discount = 10;
    const tip = 15;
    
    const items = buildCartItems(cart, discount, tip);
    
    expect(items).toHaveLength(3);
    expect(items[1].price).toBe(-10); // Discount
    expect(items[2].price).toBe(15); // Tip
  });
  
  test('should calculate total correctly', () => {
    const items = [
      { name: 'Item 1', price: 50, quantity: 1 },
      { name: 'Item 2', price: 30, quantity: 2 }
    ];
    
    const total = calculateTotal(items);
    
    expect(total).toBe(110);
  });
  
  test('should handle decimal prices correctly', () => {
    const items = [
      { name: 'Item', price: 10.99, quantity: 2 }
    ];
    
    const total = calculateTotal(items);
    
    expect(total).toBe(21.98);
  });
  
  test('should throw error for empty cart', () => {
    expect(() => buildCartItems([])).toThrow(MyPOSValidationError);
  });
  
  test('should throw error for invalid cart item', () => {
    const invalidCart = [{ name: 'Item' }]; // Missing price and quantity
    
    expect(() => buildCartItems(invalidCart)).toThrow(MyPOSValidationError);
  });
  
  test('should throw error for non-array cart', () => {
    expect(() => buildCartItems('not-array')).toThrow(MyPOSValidationError);
  });
});

