'use strict';

const { validateCart } = require('../config/validator');
const { roundAmount } = require('./common');

/**
 * Build cart items array from user input, including discount and tip
 * @param {Array} cart - Array of cart items
 * @param {number} discount - Optional discount percentage (0-100)
 * @param {number} tip - Optional tip amount
 * @returns {Array} Processed cart items
 */
function buildCartItems(cart, discount, tip) {
  // Validate cart
  validateCart(cart);
  
  // Copy cart items
  const items = cart.map(item => ({
    name: item.name,
    price: roundAmount(item.price),
    quantity: item.quantity
  }));
  
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Add discount as negative item
  if (discount !== undefined && discount > 0) {
    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
      throw new Error('discount must be a number between 0 and 100');
    }
    
    // Calculate discount amount (rounded down to 2 decimals)
    const discountAmount = Math.floor(subtotal * (discount / 100) * 100) / 100;
    
    if (discountAmount > 0) {
      items.push({
        name: `Discount (${discount}%)`,
        price: -discountAmount,
        quantity: 1
      });
    }
  }
  
  // Add tip as positive item
  if (tip !== undefined && tip > 0) {
    if (typeof tip !== 'number') {
      throw new Error('tip must be a number');
    }
    
    items.push({
      name: 'Tip',
      price: roundAmount(tip),
      quantity: 1
    });
  }
  
  return items;
}

/**
 * Calculate total amount from cart items
 * @param {Array} cartItems - Cart items array
 * @returns {number} Total amount
 */
function calculateTotal(cartItems) {
  const total = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  return roundAmount(total);
}

module.exports = {
  buildCartItems,
  calculateTotal
};

