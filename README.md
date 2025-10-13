# myPOS SDK NodeJS

A user-friendly NodeJS SDK for myPOS Checkout API with support for all payment operations including purchase, refund, pre-authorization, and more.

## 🚀 Quick Start

### Installation

```bash
npm install @mypos/JS-checkout-SDK
```

### Basic Usage

```javascript
const { purchase, refund, reversal, getPaymentStatus } = require('@mypos/JS-checkout-SDK');

// Simple purchase with cart
const { redirectUrl } = await purchase({
  cart: [
    { name: 'T-shirt', price: 50, quantity: 1 },
    { name: 'Hat', price: 30, quantity: 2 }
  ],
  customer: { email: 'user@example.com' }
});

// Redirect the user to redirectUrl

// Refund a transaction
await refund({ 
  transactionId: 'TXN123', 
  amount: 50 
});

// Check payment status
const status = await getPaymentStatus({ 
  transactionId: 'TXN123' 
});
```

### 🎮 Interactive Demo

Try all 28 checkout functions with our interactive demo:

```bash
npm run demo
```

This opens a web interface at `http://localhost:3000` where you can:
- Test all checkout functions with pre-filled examples
- See real-time responses
- Copy code examples
- Configure different environments

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
  - [Basic Operations](#basic-operations)
  - [Money Transfer](#money-transfer)
  - [Authorization](#authorization)
  - [Pre-Authorization](#pre-authorization)
  - [iCard Operations](#icard-operations)
  - [Advanced Operations](#advanced-operations)
  - [Callback Handlers](#callback-handlers)
- [Legacy API](#legacy-api)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## ⚙️ Configuration

### Environment Variables (.env)

Copy `example.env.txt` to `.env` and configure:

```env
MYPOS_ENVIRONMENT=sandbox
MYPOS_SID_SANDBOX=000000000000010
MYPOS_CLIENT_NUMBER_SANDBOX=61938166610
MYPOS_PRIVATE_KEY_SANDBOX=-----BEGIN RSA PRIVATE KEY-----...
MYPOS_OK_URL=http://localhost:3000/success
MYPOS_CANCEL_URL=http://localhost:3000/cancel
MYPOS_NOTIFY_URL=http://localhost:3000/notify
```

### Private Key Files (.pem)

Alternatively, use `.pem` files:

```
private_key.pem                    # Default for all environments
private_key_sandbox.pem           # Sandbox-specific
private_key_demo.pem              # Demo-specific
private_key_production.pem        # Production-specific
```

### Configuration File (mypos.config.js)

```javascript
module.exports = {
  environment: 'sandbox',
  checkout: {
    sid: '000000000000010',
    clientNumber: '61938166610',
    currency: 'EUR',
    privateKey: '-----BEGIN RSA PRIVATE KEY-----...',
    successUrl: 'http://localhost:3000/success',
    cancelUrl: 'http://localhost:3000/cancel',
    notifyUrl: 'http://localhost:3000/notify'
  }
};
```

## 📚 API Reference

### Basic Operations

#### Purchase
Create a payment with cart items.

```javascript
const { purchase } = require('@mypos/JS-checkout-SDK');

const result = await purchase({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { 
    email: 'user@example.com',
    firstNames: 'John',
    familyName: 'Doe'
  },
  currency: 'EUR',
  note: 'Order #123'
});

// result contains:
// {
//   redirectUrl: 'https://www.mypos.com/vmp/checkout',
//   rawResponse: '<html><body onload="document.ipcForm.submit()">...'
// }
```

**Handling the Payment Redirect:**

The purchase function returns an auto-submitting HTML form. You have 3 options:

1. **Render the HTML directly** (recommended for server-side):
```javascript
app.post('/checkout', async (req, res) => {
  const result = await purchase({ cart: [...], customer: {...} });
  res.send(result.rawResponse); // Browser will auto-submit to myPOS
});
```

2. **Redirect to the URL**:
```javascript
const result = await purchase({ cart: [...], customer: {...} });
// Use the redirectUrl with the form data
// (Note: You still need to POST the form data)
```

3. **Open in new window** (client-side):
```javascript
const newWindow = window.open('', '_blank');
newWindow.document.write(result.rawResponse);
newWindow.document.close();
```

#### Refund
Refund a completed transaction.

```javascript
const { refund } = require('@mypos-ltd/mypos');

const result = await refund({
  transactionId: 'TXN123',
  amount: 25.50,
  currency: 'EUR',
  note: 'Partial refund'
});
```

#### Reversal
Reverse a transaction.

```javascript
const { reversal } = require('@mypos-ltd/mypos');

const result = await reversal({
  transactionId: 'TXN123',
  note: 'Transaction reversal'
});
```

#### Get Payment Status
Check the status of a payment.

```javascript
const { getPaymentStatus } = require('@mypos-ltd/mypos');

const status = await getPaymentStatus({
  transactionId: 'TXN123'
});
```

### Money Transfer

#### Send Money
Send money to another wallet.

```javascript
const { sendMoney } = require('@mypos-ltd/mypos');

const result = await sendMoney({
  walletNumber: '61938166610',
  amount: 100,
  currency: 'EUR',
  note: 'Payment for services'
});
```

#### Request Money
Request money from another wallet.

```javascript
const { requestMoney } = require('@mypos-ltd/mypos');

const result = await requestMoney({
  walletNumber: '61938166610',
  amount: 100,
  currency: 'EUR',
  note: 'Invoice payment'
});
```

### Authorization

#### Authorization
Create an authorization.

```javascript
const { authorization } = require('@mypos-ltd/mypos');

const result = await authorization({
  amount: 50,
  currency: 'EUR',
  note: 'Authorization for future capture'
});
```

#### Authorization Capture
Capture an authorization.

```javascript
const { authorizationCapture } = require('@mypos-ltd/mypos');

const result = await authorizationCapture({
  transactionId: 'AUTH123',
  amount: 50,
  currency: 'EUR',
  note: 'Capture authorization'
});
```

#### Authorization List
List authorizations.

```javascript
const { authorizationList } = require('@mypos-ltd/mypos');

const result = await authorizationList({
  note: 'List all authorizations'
});
```

#### Authorization Reverse
Reverse an authorization.

```javascript
const { authorizationReverse } = require('@mypos-ltd/mypos');

const result = await authorizationReverse({
  transactionId: 'AUTH123',
  note: 'Reverse authorization'
});
```

### Pre-Authorization

#### Pre-Authorization
Create a pre-authorization.

```javascript
const { preAuthorization } = require('@mypos-ltd/mypos');

const result = await preAuthorization({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { email: 'user@example.com' },
  currency: 'EUR',
  note: 'Pre-authorize payment'
});
```

#### Pre-Auth Status
Check pre-authorization status.

```javascript
const { preAuthStatus } = require('@mypos-ltd/mypos');

const result = await preAuthStatus({
  transactionId: 'PREAUTH123'
});
```

#### Pre-Auth Completion
Complete a pre-authorization.

```javascript
const { preAuthCompletion } = require('@mypos-ltd/mypos');

const result = await preAuthCompletion({
  transactionId: 'PREAUTH123',
  amount: 50,
  currency: 'EUR',
  note: 'Complete pre-auth'
});
```

#### Pre-Auth Cancellation
Cancel a pre-authorization.

```javascript
const { preAuthCancellation } = require('@mypos-ltd/mypos');

const result = await preAuthCancellation({
  transactionId: 'PREAUTH123',
  note: 'Cancel pre-auth'
});
```

### iCard Operations

#### IA Purchase
Purchase with iCard.

```javascript
const { iaPurchase } = require('@mypos-ltd/mypos');

const result = await iaPurchase({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { email: 'user@example.com' },
  currency: 'EUR',
  note: 'iCard purchase'
});
```

#### IA Store Card
Store a card for future use.

```javascript
const { iaStoreCard } = require('@mypos-ltd/mypos');

const result = await iaStoreCard({
  customer: { email: 'user@example.com' },
  currency: 'EUR',
  note: 'Store card for future use'
});
```

#### IA Store Card Update
Update stored card.

```javascript
const { iaStoreCardUpdate } = require('@mypos-ltd/mypos');

const result = await iaStoreCardUpdate({
  cardId: 'CARD123',
  customer: { email: 'user@example.com' },
  currency: 'EUR',
  note: 'Update stored card'
});
```

#### Purchase by iCard
Purchase using stored iCard.

```javascript
const { purchaseByIcard } = require('@mypos-ltd/mypos');

const result = await purchaseByIcard({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { email: 'user@example.com' },
  currency: 'EUR',
  note: 'Purchase with stored iCard'
});
```

### Advanced Operations

#### Payment Session Create
Create a payment session.

```javascript
const { paymentSessionCreate } = require('@mypos-ltd/mypos');

const result = await paymentSessionCreate({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { email: 'user@example.com' },
  currency: 'EUR',
  note: 'Create payment session'
});
```

#### Mandate Management
Manage payment mandates.

```javascript
const { mandateManagment } = require('@mypos-ltd/mypos');

const result = await mandateManagment({
  mandateId: 'MANDATE123',
  note: 'Manage mandate'
});
```

### Callback Handlers

These functions handle callbacks from myPOS:

- `purchaseOK` - Handle successful purchase
- `purchaseCancel` - Handle cancelled purchase  
- `purchaseNotify` - Handle purchase notification
- `purchaseRollback` - Rollback a purchase
- `preAuthorizationOK` - Handle pre-auth success
- `preAuthorizationNotify` - Handle pre-auth notification
- `preAuthorizationCancel` - Handle pre-auth cancellation

## 🔄 Legacy API

The SDK also supports the legacy callback-based API:

```javascript
const mypos = require('@mypos-ltd/mypos')({
  environment: 'sandbox',
  checkout: {
    sid: '000000000000010',
    clientNumber: '61938166610',
    currency: 'EUR',
    privateKey: '-----BEGIN RSA PRIVATE KEY-----...',
    successUrl: 'http://localhost:3000/success',
    cancelUrl: 'http://localhost:3000/cancel',
    notifyUrl: 'http://localhost:3000/notify'
  }
});

// Checkout operations
mypos.checkout.purchase(params, (response) => {
  console.log(response);
});

// Future: Other operations (coming soon)
mypos.transactions.list(params, callback);
mypos.devices.list(params, callback);
mypos.webhooks.list(params, callback);
```

## 🛠️ Development

### Running Tests

```bash
npm test
npm run test:coverage
```

### Running Examples

```bash
# Original example
npm start

# Interactive demo
npm run demo
```

## 🔧 Troubleshooting

### Common Issues

1. **"MYPOS_SID is required"**
   - Make sure you've set the environment variables in `.env`
   - Check that `MYPOS_ENVIRONMENT` is set correctly

2. **"MYPOS_PRIVATE_KEY is required"**
   - Set `MYPOS_PRIVATE_KEY_*` in your `.env` file, or
   - Place your private key in a `.pem` file (see Configuration section)

3. **"Invalid signature"**
   - Verify your private key is correct
   - Ensure the key matches the environment you're using

4. **"Cart must be a non-empty array"**
   - Provide cart items in the correct format: `[{name, price, quantity}]`

### Getting Help

- Check the [myPOS Developer Documentation](https://developers.mypos.eu/)
- Use the interactive demo to test your configuration
- Review the example.env.txt file for proper configuration

## 📄 License

ISC

## 🔗 Links

- [myPOS Website](https://www.mypos.eu/)
- [Developer Documentation](https://developers.mypos.eu/)
- [GitHub Repository](https://github.com/developermypos/mypos-js)