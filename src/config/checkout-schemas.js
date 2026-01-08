'use strict';

const { z } = require('zod');
const { MyPOSValidationError } = require('../core/errors');
const {
  cartSchema,
  customerSchema,
  amountSchema,
  currencySchema,
  transactionIdSchema
} = require('./validator-schemas');

/**
 * Helper to validate params with Zod schema and throw MyPOSValidationError
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Object} params - Parameters to validate
 * @param {string} operation - Operation name for error messages
 * @returns {Object} Validated and parsed params
 * @throws {MyPOSValidationError} If validation fails
 */
function validateParams(schema, params, operation = 'operation') {
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      const field = firstError.path.join('.') || 'params';
      throw new MyPOSValidationError(
        `${operation}: ${firstError.message}`,
        field
      );
    }
    throw error;
  }
}

// Base schema for common optional fields
const baseOptionalSchema = {
  version: z.string().optional(),
  lang: z.string().optional(),
  sid: z.string().optional(),
  walletNumber: z.string().optional(),
  currency: currencySchema.optional(),
  orderId: z.string().optional(),
  successUrl: z.string().url().optional().or(z.literal('')),
  cancelUrl: z.string().url().optional().or(z.literal('')),
  notifyUrl: z.string().url().optional().or(z.literal('')),
  keyIndex: z.union([z.number(), z.string()]).optional(),
  note: z.string().optional(),
  outputFormat: z.string().optional()
};

// Purchase schemas
const purchaseSchema = z.object({
  ...baseOptionalSchema,
  cart: cartSchema,
  amount: amountSchema.optional(),
  discount: z.number().min(0).max(100).optional(),
  tip: amountSchema.optional(),
  customer: customerSchema.optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  customerFirstNames: z.string().optional(),
  customerFirstName: z.string().optional(),
  customerFamilyName: z.string().optional(),
  customerLastName: z.string().optional(),
  customerCountry: z.string().optional(),
  customerCity: z.string().optional(),
  customerZIPCode: z.string().optional(),
  customerZipCode: z.string().optional(),
  customerAddress: z.string().optional(),
  cardTokenRequest: z.number().optional(),
  paymentMethod: z.number().optional(),
  paymentParametersRequired: z.number().optional()
}).refine(
  (data) => {
    // If PaymentParametersRequired = 1, customer fields are required
    if (data.paymentParametersRequired === 1) {
      const customer = data.customer || {};
      const email = data.customerEmail || customer.email;
      const phone = data.customerPhone || customer.phone;
      const firstNames = data.customerFirstNames || data.customerFirstName || customer.firstNames || customer.firstName;
      const familyName = data.customerFamilyName || data.customerLastName || customer.familyName || customer.lastName;
      
      return email && phone && firstNames && familyName;
    }
    return true;
  },
  {
    message: 'When PaymentParametersRequired = 1, customer email, phone, firstNames, and familyName are required',
    path: ['customer']
  }
);

const purchaseByIcardSchema = z.object({
  ...baseOptionalSchema,
  cart: cartSchema,
  amount: amountSchema.optional(),
  discount: z.number().min(0).max(100).optional(),
  tip: amountSchema.optional(),
  customer: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional()
  }).optional(),
  paymentParametersRequired: z.number().optional()
}).refine(
  (data) => {
    // Must have either customerEmail or customerPhone
    if (data.customer) {
      return data.customer.email || data.customer.phone;
    }
    return true;
  },
  {
    message: 'IPCPurchaseByIcard requires either CustomerEmail or CustomerPhone',
    path: ['customer']
  }
);

// Refund/Reversal schemas
const refundSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema,
  amount: amountSchema
});

const reversalSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema
});

// Pre-authorization schemas
const preAuthorizationSchema = z.object({
  ...baseOptionalSchema,
  amount: amountSchema,
  itemName: z.string().min(1, 'itemName is required'),
  ItemName: z.string().optional(), // Alternative field name
  accountSettlement: z.string().optional(),
  AccountSettlement: z.string().optional()
}).refine(
  (data) => data.itemName || data.ItemName,
  {
    message: 'itemName is required for pre-authorization',
    path: ['itemName']
  }
);

// IA (In-App) schemas
const iaPurchaseSchema = z.object({
  ...baseOptionalSchema,
  cardToken: z.string().min(1, 'cardToken is required'),
  cart: cartSchema,
  amount: amountSchema.optional(),
  discount: z.number().min(0).max(100).optional(),
  tip: amountSchema.optional()
});

const iaPreAuthorizationSchema = z.object({
  ...baseOptionalSchema,
  cardToken: z.string().min(1, 'cardToken is required'),
  cart: cartSchema,
  amount: amountSchema.optional(),
  discount: z.number().min(0).max(100).optional(),
  tip: amountSchema.optional()
});

const iaStoreCardSchema = z.object({
  ...baseOptionalSchema
});

const iaStoreCardUpdateSchema = z.object({
  ...baseOptionalSchema,
  cardId: z.string().min(1, 'cardId is required')
});

// Authorization schemas
const authorizationSchema = z.object({
  ...baseOptionalSchema,
  amount: amountSchema
});

const authorizationCaptureSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema,
  amount: amountSchema
});

const authorizationReverseSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema
});

const authorizationListSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema.optional()
});

// Money transfer schemas
const sendMoneySchema = z.object({
  ...baseOptionalSchema,
  customerWalletNumber: z.string().min(1, 'customerWalletNumber is required'),
  amount: amountSchema,
  transactionReference: z.string().min(1, 'transactionReference is required'),
  reason: z.string().min(1, 'reason is required')
});

const requestMoneySchema = z.object({
  ...baseOptionalSchema,
  mandateReference: z.string().min(1, 'mandateReference is required'),
  customerWalletNumber: z.string().min(1, 'customerWalletNumber is required'),
  amount: amountSchema,
  reason: z.string().min(1, 'reason is required'),
  reversalIndicator: z.number().optional()
});

// Other operation schemas
const mandateManagementSchema = z.object({
  ...baseOptionalSchema,
  mandateId: z.string().min(1, 'mandateId is required')
});

const paymentSessionCreateSchema = z.object({
  ...baseOptionalSchema,
  cart: cartSchema,
  amount: amountSchema.optional(),
  discount: z.number().min(0).max(100).optional(),
  tip: amountSchema.optional()
});

const getPaymentStatusSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema
});

const preAuthStatusSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema
});

const preAuthCancellationSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema
});

const preAuthCompletionSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema,
  amount: amountSchema
});

// Purchase callback operations (purchase-notify, purchase-ok, etc.)
const purchaseNotifySchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema.optional(),
  customer: customerSchema.optional(),
  paymentParametersRequired: z.number().optional()
}).refine(
  (data) => {
    // If PaymentParametersRequired = 1 or 2, customer fields are required
    if ((data.paymentParametersRequired === 1 || data.paymentParametersRequired === 2) && data.customer) {
      return data.customer.email && data.customer.phone && 
             (data.customer.firstNames || data.customer.firstName) &&
             (data.customer.familyName || data.customer.lastName);
    }
    return true;
  },
  {
    message: 'When PaymentParametersRequired = 1 or 2, customer email, phone, firstNames, and familyName are required',
    path: ['customer']
  }
);

const purchaseOkSchema = purchaseNotifySchema;

// Pre-authorization callback operations
const preAuthorizationNotifySchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema.optional()
});

const preAuthorizationOkSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema.optional()
});

const preAuthorizationCancelSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema.optional()
});

const purchaseCancelSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema.optional()
});

const purchaseRollbackSchema = z.object({
  ...baseOptionalSchema,
  transactionId: transactionIdSchema
});

module.exports = {
  validateParams,
  purchaseSchema,
  purchaseByIcardSchema,
  refundSchema,
  reversalSchema,
  preAuthorizationSchema,
  iaPurchaseSchema,
  iaPreAuthorizationSchema,
  iaStoreCardSchema,
  iaStoreCardUpdateSchema,
  authorizationSchema,
  authorizationCaptureSchema,
  authorizationReverseSchema,
  authorizationListSchema,
  sendMoneySchema,
  requestMoneySchema,
  mandateManagementSchema,
  paymentSessionCreateSchema,
  getPaymentStatusSchema,
  preAuthStatusSchema,
  preAuthCancellationSchema,
  preAuthCompletionSchema,
  purchaseNotifySchema,
  purchaseOkSchema,
  preAuthorizationNotifySchema,
  preAuthorizationOkSchema,
  preAuthorizationCancelSchema,
  purchaseCancelSchema,
  purchaseRollbackSchema
};

