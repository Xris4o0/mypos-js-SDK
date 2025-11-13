# myPOS Checkout SDK for Node.js

Modern, TypeScript-friendly Node.js SDK for myPOS Checkout API. Generate secure HTML forms for all myPOS payment operations including purchases, refunds, pre-authorizations, and more.

[![npm version](https://img.shields.io/npm/v/@mypos/JS-checkout-SDK.svg)](https://www.npmjs.com/package/@mypos/JS-checkout-SDK)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## ✨ Features

- 🚀 **Modern async/await API** - Clean, promise-based interface
- 🔒 **Automatic signature generation** - Built-in RSA signing
- 📝 **28 checkout operations** - Complete myPOS Checkout API coverage
- ⚙️ **Flexible configuration** - Environment variables, files, or programmatic
- 🧪 **Fully tested** - Comprehensive test suite included
- 📚 **Well documented** - Extensive documentation and examples
- 🎯 **Zero dependencies** (except `node-rsa`, `uuid`, `dotenv`)

## 📦 Installation

```bash
npm install @mypos/JS-checkout-SDK
```

## 🚀 Quick Start

### 1. Configuration

Create a `.env` file (copy from `example.env.txt`):

```env
MYPOS_ENVIRONMENT=sandbox
MYPOS_SID_SANDBOX=000000000000010
MYPOS_CLIENT_NUMBER_SANDBOX=61938166610
MYPOS_PRIVATE_KEY_SANDBOX=-----BEGIN RSA PRIVATE KEY-----...
MYPOS_OK_URL=http://localhost:3000/success
MYPOS_CANCEL_URL=http://localhost:3000/cancel
MYPOS_NOTIFY_URL=http://localhost:3000/notify
```

### 2. Basic Usage

```javascript
const { purchase, refund, getPaymentStatus } = require('@mypos/JS-checkout-SDK');

// Create a purchase
const { redirectUrl, formHtml } = await purchase({
  cart: [
    { name: 'T-shirt', price: 29.99, quantity: 2 },
    { name: 'Shipping', price: 5.00, quantity: 1 }
  ],
  customer: {
    email: 'customer@example.com',
    firstNames: 'John',
    familyName: 'Doe'
  }
});

// Redirect user to payment page or render the form
console.log(redirectUrl); // https://mypos.com/vmp/checkout/...
```

## 📋 Table of Contents

- [Configuration](#-configuration)
- [API Reference](#-api-reference)
  - [Purchase Operations](#purchase-operations)
  - [Refund & Reversal](#refund--reversal)
  - [Pre-Authorization](#pre-authorization)
  - [Authorization](#authorization)
  - [In-App (IA) Operations](#in-app-ia-operations)
  - [Money Transfer](#money-transfer)
  - [Payment Status](#payment-status)
  - [Callback Operations](#callback-operations)
  - [Advanced Operations](#advanced-operations)
- [Response Handling](#-response-handling)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Documentation](#-documentation)

## ⚙️ Configuration

### Option 1: Environment Variables (Recommended)

```env
# Environment selection
MYPOS_ENVIRONMENT=sandbox  # or demo, production

# Sandbox credentials
MYPOS_SID_SANDBOX=000000000000010
MYPOS_CLIENT_NUMBER_SANDBOX=61938166610
MYPOS_PRIVATE_KEY_SANDBOX=-----BEGIN RSA PRIVATE KEY-----...
MYPOS_KEY_INDEX_SANDBOX=1
MYPOS_CURRENCY_SANDBOX=EUR

# Callback URLs
MYPOS_OK_URL=https://yourdomain.com/payment/success
MYPOS_CANCEL_URL=https://yourdomain.com/payment/cancel
MYPOS_NOTIFY_URL=https://yourdomain.com/payment/notify
```

### Option 2: Configuration File

Create `mypos.config.js`:

```javascript
module.exports = {
  environment: 'sandbox',
    sid: '000000000000010',
    clientNumber: '61938166610',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----...',
  keyIndex: 1,
    currency: 'EUR',
  successUrl: 'https://yourdomain.com/payment/success',
  cancelUrl: 'https://yourdomain.com/payment/cancel',
  notifyUrl: 'https://yourdomain.com/payment/notify'
};
```

### Option 3: Programmatic Configuration

```javascript
const { purchase } = require('@mypos/JS-checkout-SDK');

await purchase({
  // Payment details
  cart: [...],
  
  // Override configuration
  sid: 'your_sid',
  clientNumber: 'your_wallet',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----...',
  currency: 'EUR'
});
```

### Private Key Files

Alternatively, store private keys in `.pem` files:

```
private_key.pem                    # Fallback for all environments
private_key_sandbox.pem            # Sandbox-specific
private_key_demo.pem               # Demo-specific
private_key_production.pem         # Production-specific
```

The SDK will automatically load the appropriate file based on the environment. It first checks for environment-specific files (e.g., `private_key_sandbox.pem`), then falls back to `private_key.pem` if no environment-specific file is found.

## 📖 API Reference

### Purchase Operations

#### Basic Purchase

Create a standard purchase request.

```javascript
const { purchase } = require('@mypos/JS-checkout-SDK');

const result = await purchase({
  cart: [
    { name: 'Product A', price: 29.99, quantity: 2 },
    { name: 'Product B', price: 15.50, quantity: 1 }
  ],
  customer: { 
    email: 'customer@example.com',
    firstNames: 'John',
    familyName: 'Doe',
    phone: '+1234567890'
  },
  orderId: 'ORDER-12345', // optional - auto-generated if not provided
  currency: 'EUR',
  note: 'Order from website'
});

// Redirect user to payment
response.redirect(result.redirectUrl);
```

#### Purchase with Discount

```javascript
const result = await purchase({
  cart: [
    { name: 'Product', price: 100, quantity: 1 }
  ],
  discount: 10, // 10 EUR discount
  customer: { email: 'customer@example.com' }
});
```

#### Purchase with Tip

```javascript
const result = await purchase({
  cart: [
    { name: 'Service', price: 50, quantity: 1 }
  ],
  tip: 5, // 5 EUR tip
  customer: { email: 'customer@example.com' }
});
```

#### Purchase by iCard

Purchase using iCard payment method.

```javascript
const { purchaseByIcard } = require('@mypos/JS-checkout-SDK');

const result = await purchaseByIcard({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { email: 'customer@example.com' }
});
```

### Refund & Reversal

#### Refund

Refund a completed transaction (full or partial).

```javascript
const { refund } = require('@mypos/JS-checkout-SDK');

const result = await refund({
  transactionId: '12345678923', // IPC_Trnref from original purchase
  amount: 29.99,
  currency: 'EUR',
  orderId: 'REFUND-001', // optional
  note: 'Customer requested refund'
});
```

#### Reversal

Reverse a transaction (before end of day settlement).

```javascript
const { reversal } = require('@mypos/JS-checkout-SDK');

const result = await reversal({
  transactionId: '12345678923'
});
```

#### Purchase Rollback

Rollback a purchase.

```javascript
const { purchaseRollback } = require('@mypos/JS-checkout-SDK');

const result = await purchaseRollback({
  transactionId: '12345678923',
  note: 'Order cancelled'
});
```

### Pre-Authorization

#### Create Pre-Authorization

Reserve funds without capturing them.

```javascript
const { preAuthorization } = require('@mypos/JS-checkout-SDK');

const result = await preAuthorization({
  amount: 100.00,
  currency: 'EUR',
  itemName: 'Hotel Reservation',
  accountSettlement: '1111111111', // optional
  note: 'Reservation #12345'
});
```

#### Complete Pre-Authorization

Capture previously authorized funds.

```javascript
const { preAuthCompletion } = require('@mypos/JS-checkout-SDK');

const result = await preAuthCompletion({
  transactionId: '12345678923', // IPC_Trnref from pre-authorization
  amount: 85.50, // can be less than or equal to pre-auth amount
  currency: 'EUR',
  orderId: 'COMPLETE-001',
  note: 'Final charge for reservation'
});
```

#### Cancel Pre-Authorization

Release reserved funds without capturing.

```javascript
const { preAuthCancellation } = require('@mypos/JS-checkout-SDK');

const result = await preAuthCancellation({
  transactionId: '12345678923',
  orderId: 'CANCEL-001',
  note: 'Reservation cancelled'
});
```

#### Check Pre-Authorization Status

```javascript
const { preAuthStatus } = require('@mypos/JS-checkout-SDK');

const result = await preAuthStatus({
  transactionId: '12345678923'
});
```

### Authorization

#### Create Authorization

```javascript
const { authorization } = require('@mypos/JS-checkout-SDK');

const result = await authorization({
  amount: 50.00,
  currency: 'EUR',
  itemName: 'Authorization for services',
  note: 'Monthly subscription'
});
```

#### Capture Authorization

```javascript
const { authorizationCapture } = require('@mypos/JS-checkout-SDK');

const result = await authorizationCapture({
  transactionId: '12345678923',
  amount: 50.00,
  currency: 'EUR',
  orderId: 'CAPTURE-001'
});
```

#### Reverse Authorization

```javascript
const { authorizationReverse } = require('@mypos/JS-checkout-SDK');

const result = await authorizationReverse({
  transactionId: '12345678923',
  orderId: 'REVERSE-001'
});
```

#### List Authorizations

```javascript
const { authorizationList } = require('@mypos/JS-checkout-SDK');

const result = await authorizationList({
  // Optional filters
});
```

### In-App (IA) Operations

In-App operations use stored card tokens for payments without redirecting the customer.

#### Store Card (In-App)

Securely store card details for future use.

```javascript
const { iaStoreCard } = require('@mypos/JS-checkout-SDK');

const result = await iaStoreCard({
  customer: {
    email: 'customer@example.com',
    firstNames: 'John',
    familyName: 'Doe'
  },
  currency: 'EUR'
});

// After user completes card storage, you'll receive a cardToken
```

#### Update Stored Card

```javascript
const { iaStoreCardUpdate } = require('@mypos/JS-checkout-SDK');

const result = await iaStoreCardUpdate({
  cardToken: 'stored_card_token_here',
  customer: {
    email: 'customer@example.com'
  },
  currency: 'EUR'
});
```

#### Purchase with Stored Card (In-App)

```javascript
const { iaPurchase } = require('@mypos/JS-checkout-SDK');

const result = await iaPurchase({
  cardToken: 'stored_card_token_here',
  cart: [
    { name: 'Subscription', price: 29.99, quantity: 1 }
  ],
  customer: {
    email: 'customer@example.com'
  }
});
```

#### Pre-Authorize with Stored Card (In-App)

```javascript
const { iaPreAuthorization } = require('@mypos/JS-checkout-SDK');

const result = await iaPreAuthorization({
  cardToken: 'stored_card_token_here',
  cart: [
    { name: 'Booking', price: 100, quantity: 1 }
  ],
  customer: {
    email: 'customer@example.com'
  }
});
```

### Money Transfer

#### Request Money

Request money from another myPOS wallet (requires mandate).

```javascript
const { requestMoney } = require('@mypos/JS-checkout-SDK');

const result = await requestMoney({
  mandateReference: '12cca831-93d2-4dfc-ab1f-0cce1d0abe9e',
  customerWalletNumber: '61938166612',
  amount: 50.00,
  currency: 'EUR',
  reason: 'Invoice #12345',
  reversalIndicator: 0 // or 1 for reversal
});
```

#### Send Money

Send money to another myPOS wallet (requires special permission).

```javascript
const { sendMoney } = require('@mypos/JS-checkout-SDK');

const result = await sendMoney({
  customerWalletNumber: '61938166612',
  transactionReference: '12345678923',
  amount: 50.00,
  currency: 'EUR',
  reason: 'Payment for services'
});
```

### Payment Status

#### Get Payment Status

Check the status of any transaction.

```javascript
const { getPaymentStatus } = require('@mypos/JS-checkout-SDK');

const result = await getPaymentStatus({
  transactionId: '12345678923'
});

console.log(result); // Contains transaction status and details
```

### Callback Operations

These operations handle callbacks from myPOS after payment operations. They're typically used to process server-to-server notifications or handle redirect responses.

#### Purchase Callbacks

##### Purchase OK

Handle successful purchase callback.

```javascript
const { purchaseOK } = require('@mypos/JS-checkout-SDK');

const result = await purchaseOK({
  transactionId: '12345678923'
});
```

##### Purchase Cancel

Handle cancelled purchase callback.

```javascript
const { purchaseCancel } = require('@mypos/JS-checkout-SDK');

const result = await purchaseCancel({
  transactionId: '12345678923'
});
```

##### Purchase Notify

Handle purchase notification callback (server-to-server).

```javascript
const { purchaseNotify } = require('@mypos/JS-checkout-SDK');

const result = await purchaseNotify({
  transactionId: '12345678923'
});
```

#### Pre-Authorization Callbacks

##### Pre-Authorization OK

Handle successful pre-authorization callback.

```javascript
const { preAuthorizationOK } = require('@mypos/JS-checkout-SDK');

const result = await preAuthorizationOK({
  transactionId: '12345678923'
});
```

##### Pre-Authorization Cancel

Handle cancelled pre-authorization callback.

```javascript
const { preAuthorizationCancel } = require('@mypos/JS-checkout-SDK');

const result = await preAuthorizationCancel({
  transactionId: '12345678923'
});
```

##### Pre-Authorization Notify

Handle pre-authorization notification callback (server-to-server).

```javascript
const { preAuthorizationNotify } = require('@mypos/JS-checkout-SDK');

const result = await preAuthorizationNotify({
  transactionId: '12345678923'
});
```

### Advanced Operations

#### Mandate Management

Manage payment mandates for recurring payments.

```javascript
const { mandateManagement } = require('@mypos/JS-checkout-SDK');

const result = await mandateManagement({
  mandateId: 'MANDATE-123',
  note: 'Update mandate details'
});
```

#### Payment Session Create

Create a payment session.

```javascript
const { paymentSessionCreate } = require('@mypos/JS-checkout-SDK');

const result = await paymentSessionCreate({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: {
    email: 'customer@example.com'
  }
});
```

## 🔄 Response Handling

All operations return a consistent response object:

```javascript
{
  redirectUrl: 'https://mypos.com/vmp/checkout/...',
  formHtml: '<form method="POST" action="...">...</form>',
  rawResponse: {
    // Raw IPC parameters that were sent
    IPCmethod: 'IPCPurchase',
    Amount: '50.00',
    Currency: 'EUR',
    // ... all other parameters
  }
}
```

### Handling Callbacks

After payment, myPOS redirects the user to your callback URLs:

- **Success URL** (`URL_OK`): Payment successful
- **Cancel URL** (`URL_Cancel`): Payment cancelled by user
- **Notify URL** (`URL_Notify`): Server-to-server notification

```javascript
// Example Express.js route for success callback
app.get('/payment/success', (req, res) => {
  const {
    IPC_Trnref,    // Transaction reference
    Amount,        // Amount paid
    Currency,      // Currency code
    OrderID,       // Your order ID
    // ... other parameters
  } = req.query;
  
  // Verify signature (important!)
  // Process the successful payment
  // Update your database
  
  res.send('Payment successful!');
});
```

**Important:** Always verify the signature of incoming callbacks to prevent fraud. See `src/EXAMPLE_USAGE.md` for signature verification examples.

## ⚠️ Error Handling

The SDK throws custom errors for different scenarios:

```javascript
const {
  MyPOSConfigError,
  MyPOSValidationError,
  MyPOSSignatureError
} = require('@mypos/JS-checkout-SDK');

try {
  await purchase({ cart: [...] });
} catch (error) {
  if (error instanceof MyPOSConfigError) {
    console.error('Configuration error:', error.message);
  } else if (error instanceof MyPOSValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof MyPOSSignatureError) {
    console.error('Signature generation failed:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 🧪 Testing

The SDK includes comprehensive tests:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage
npm run test:coverage
```

### Test with Sandbox

Use the default sandbox credentials for safe testing:

```env
MYPOS_ENVIRONMENT=sandbox
MYPOS_SID_SANDBOX=000000000000010
MYPOS_CLIENT_NUMBER_SANDBOX=61938166610
```

The sandbox environment uses test card numbers and doesn't process real payments.

## 📚 Documentation

- **[src/README.md](src/README.md)** - Detailed SDK documentation
- **[src/DOCUMENTATION.md](src/DOCUMENTATION.md)** - Complete API reference
- **[src/EXAMPLE_USAGE.md](src/EXAMPLE_USAGE.md)** - Real-world examples
- **[src/QUICK_START.md](src/QUICK_START.md)** - Quick start guide
- **[src/FLOW_DOCUMENTATION.md](src/FLOW_DOCUMENTATION.md)** - Request flow explanation

## 🏗️ Architecture

### Functional API (Recommended)

```javascript
const { purchase, refund } = require('@mypos/JS-checkout-SDK');

await purchase({ cart: [...] });
await refund({ transactionId: '...' });
```

### Class-Based API (Alternative)

```javascript
const { MyPOSCheckout } = require('@mypos/JS-checkout-SDK');

const checkout = new MyPOSCheckout({
  sid: '...',
  clientNumber: '...',
  privateKey: '...'
});

await checkout.purchase({ cart: [...] });
await checkout.refund({ transactionId: '...' });
```

## 🌍 Supported Environments

- **Sandbox** - Safe testing environment
- **Demo** - Demo environment for presentations
- **Production** - Live payments

## 🔒 Security Best Practices

1. **Never commit private keys** - Use environment variables
2. **Verify callback signatures** - Always validate incoming data
3. **Use HTTPS** - For callback URLs in production
4. **Store sensitive data securely** - Never log private keys
5. **Validate amounts server-side** - Don't trust client input

## 📋 Requirements

- Node.js >= 14.0.0
- npm or yarn

## 🤝 Support

- **Documentation:** [GitHub Repository](https://github.com/developermypos/mypos-js)
- **Issues:** [GitHub Issues](https://github.com/developermypos/mypos-js/issues)
- **myPOS Support:** [online@mypos.com](mailto:online@mypos.com)

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🎯 Available Operations

Complete list of all 28 checkout operations:

**Purchase:**
- `purchase` - Standard purchase
- `purchaseByIcard` - Purchase via iCard
- `iaPurchase` - Purchase with stored card
- `purchaseRollback` - Rollback a purchase

**Purchase Callbacks:**
- `purchaseOK` - Handle successful purchase callback
- `purchaseCancel` - Handle cancelled purchase callback
- `purchaseNotify` - Handle purchase notification callback

**Refund & Reversal:**
- `refund` - Refund a transaction
- `reversal` - Reverse a transaction

**Pre-Authorization:**
- `preAuthorization` - Create pre-authorization
- `preAuthCompletion` - Complete pre-authorization
- `preAuthCancellation` - Cancel pre-authorization
- `preAuthStatus` - Check pre-authorization status
- `iaPreAuthorization` - Pre-auth with stored card

**Pre-Authorization Callbacks:**
- `preAuthorizationOK` - Handle successful pre-authorization callback
- `preAuthorizationCancel` - Handle cancelled pre-authorization callback
- `preAuthorizationNotify` - Handle pre-authorization notification callback

**Authorization:**
- `authorization` - Create authorization
- `authorizationCapture` - Capture authorization
- `authorizationReverse` - Reverse authorization
- `authorizationList` - List authorizations

**In-App (Stored Cards):**
- `iaStoreCard` - Store card securely
- `iaStoreCardUpdate` - Update stored card

**Money Transfer:**
- `requestMoney` - Request from another wallet
- `sendMoney` - Send to another wallet

**Status & Info:**
- `getPaymentStatus` - Check transaction status

**Advanced:**
- `mandateManagement` - Manage payment mandates
- `paymentSessionCreate` - Create payment session

---

Made with ❤️ by [myPOS](https://www.mypos.com)
