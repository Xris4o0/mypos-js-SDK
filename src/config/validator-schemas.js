'use strict';

const { z } = require('zod');

// Re-export base schemas from validator for use in checkout schemas
const cartItemSchema = z.object({
  name: z.string().min(1, 'Cart item name is required'),
  price: z.number().positive('Cart item price must be greater than 0'),
  quantity: z.number().int().positive('Cart item quantity must be greater than 0')
});

const cartSchema = z
  .array(cartItemSchema)
  .min(1, 'Cart must contain at least one item');

const customerSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  firstNames: z.string().optional(),
  lastName: z.string().optional(),
  familyName: z.string().optional(),
  address: z.string().optional()
}).passthrough();

const amountSchema = z.number().positive('Amount must be greater than 0').finite('Amount must be a finite number');

const currencySchema = z.string().length(3, 'Currency must be a 3-letter code (e.g., EUR, USD)');

const transactionIdSchema = z.string().min(1, 'Transaction ID is required');

module.exports = {
  cartItemSchema,
  cartSchema,
  customerSchema,
  amountSchema,
  currencySchema,
  transactionIdSchema
};

