# myPOS Checkout SDK v2

A clean, modern SDK for generating myPOS checkout requests with zero code duplication, full async/await support, and comprehensive test coverage.

## 🚀 What's New in v2

- **Zero Code Duplication**: Single implementation per operation (50% fewer files)
- **Modern Async/Await**: Promise-based API throughout
- **Better Performance**: Config caching, optimized signature generation
- **Improved Error Handling**: Custom error classes with helpful messages
- **Dual API**: Functional exports + optional class-based client
- **Comprehensive Tests**: 80%+ code coverage with single test command
- **Fixed Naming**: `mandateManagement` (was `mandateManagment`)

## 📦 Installation

```bash
npm install @mypos/JS-checkout-SDK
```

## ⚙️ Configuration

### Option 1: Environment Variables (.env)

```env
MYPOS_ENVIRONMENT=sandbox
MYPOS_SID_SANDBOX=000000000000010
MYPOS_CLIENT_NUMBER_SANDBOX=61938166610
MYPOS_PRIVATE_KEY_SANDBOX=-----BEGIN RSA PRIVATE KEY-----...
MYPOS_OK_URL=http://localhost:3000/success
MYPOS_CANCEL_URL=http://localhost:3000/cancel
MYPOS_NOTIFY_URL=http://localhost:3000/notify
```

### Option 2: Configuration File (mypos.config.js)

```javascript
module.exports = {
  environment: 'sandbox',
  sid: '000000000000010',
  clientNumber: '61938166610',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----...',
  currency: 'EUR',
  successUrl: 'http://localhost:3000/success',
  cancelUrl: 'http://localhost:3000/cancel',
  notifyUrl: 'http://localhost:3000/notify'
};
```

### Option 3: Private Key File

Place your private key in one of these files:
- `private_key.pem` (default for all environments)
- `private_key_sandbox.pem` (sandbox-specific)
- `private_key_production.pem` (production-specific)

## 🎯 Usage

### Functional API (Recommended)

```javascript
const { purchase, refund, reversal } = require('@mypos/JS-checkout-SDK');

// Create a purchase
const result = await purchase({
  cart: [
    { name: 'T-shirt', price: 50, quantity: 1 },
    { name: 'Hat', price: 30, quantity: 2 }
  ],
  customer: {
    email: 'user@example.com',
    firstNames: 'John',
    familyName: 'Doe'
  },
  discount: 10, // 10% discount
  tip: 5
});

// Send the form to the browser
res.send(result.rawResponse);
// Or redirect to the URL
// res.redirect(result.redirectUrl);
```

### Class-Based API (Optional)

```javascript
const { MyPOSCheckout } = require('@mypos/JS-checkout-SDK');

const checkout = new MyPOSCheckout({
  environment: 'sandbox',
  sid: 'YOUR_SID',
  clientNumber: 'YOUR_CLIENT_NUMBER',
  privateKey: 'YOUR_PRIVATE_KEY'
});

// Use the client for multiple operations
await checkout.purchase({ cart: [...], customer: {...} });
await checkout.refund({ transactionId: 'TXN123', amount: 50 });
```

## 📚 API Reference

### Basic Operations

#### purchase(params)
Create a payment with cart items.

```javascript
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
  discount: 10, // Optional: percentage (0-100)
  tip: 5, // Optional: flat amount
  note: 'Order #123'
});
```

#### refund(params)
Refund a completed transaction.

```javascript
await refund({
  transactionId: 'TXN123',
  amount: 25.50,
  currency: 'EUR',
  note: 'Partial refund'
});
```

#### reversal(params)
Reverse a transaction.

```javascript
await reversal({
  transactionId: 'TXN123',
  note: 'Transaction reversal'
});
```

#### getPaymentStatus(params)
Check the status of a payment.

```javascript
const status = await getPaymentStatus({
  transactionId: 'TXN123'
});
```

### Money Transfer

#### sendMoney(params)
Send money to another wallet.

```javascript
await sendMoney({
  walletNumber: '61938166610',
  amount: 100,
  currency: 'EUR',
  note: 'Payment for services'
});
```

#### requestMoney(params)
Request money from another wallet.

```javascript
await requestMoney({
  walletNumber: '61938166610',
  amount: 100,
  currency: 'EUR',
  note: 'Invoice payment'
});
```

### Authorization

#### authorization(params)
Create an authorization.

```javascript
await authorization({
  amount: 50,
  currency: 'EUR',
  note: 'Authorization for future capture'
});
```

#### authorizationCapture(params)
Capture an authorization.

```javascript
await authorizationCapture({
  transactionId: 'AUTH123',
  amount: 50,
  currency: 'EUR'
});
```

#### authorizationList(params)
List authorizations.

```javascript
await authorizationList({
  note: 'List all authorizations'
});
```

#### authorizationReverse(params)
Reverse an authorization.

```javascript
await authorizationReverse({
  transactionId: 'AUTH123'
});
```

### Pre-Authorization

#### preAuthorization(params)
Create a pre-authorization with cart.

```javascript
await preAuthorization({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { email: 'user@example.com' },
  currency: 'EUR'
});
```

#### preAuthStatus(params)
Check pre-authorization status.

```javascript
await preAuthStatus({
  transactionId: 'PREAUTH123'
});
```

#### preAuthCompletion(params)
Complete a pre-authorization.

```javascript
await preAuthCompletion({
  transactionId: 'PREAUTH123',
  amount: 50,
  currency: 'EUR'
});
```

#### preAuthCancellation(params)
Cancel a pre-authorization.

```javascript
await preAuthCancellation({
  transactionId: 'PREAUTH123'
});
```

### iCard Operations

#### iaStoreCard(params)
Store a card for future use.

```javascript
await iaStoreCard({
  customer: { email: 'user@example.com' },
  currency: 'EUR'
});
```

#### iaStoreCardUpdate(params)
Update a stored card.

```javascript
await iaStoreCardUpdate({
  cardId: 'CARD123',
  customer: { email: 'user@example.com' }
});
```

#### iaPurchase(params)
Purchase with stored card token.

```javascript
await iaPurchase({
  cardToken: 'TOKEN123',
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { email: 'user@example.com' }
});
```

#### iaPreAuthorization(params)
Pre-authorize with stored card token.

```javascript
await iaPreAuthorization({
  cardToken: 'TOKEN123',
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ]
});
```

#### purchaseByIcard(params)
Purchase using iCard.

```javascript
await purchaseByIcard({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { email: 'user@example.com' }
});
```

### Callback Handlers

These handle callbacks from myPOS:

- `purchaseOK(params)` - Handle successful purchase
- `purchaseCancel(params)` - Handle cancelled purchase  
- `purchaseNotify(params)` - Handle purchase notification
- `purchaseRollback(params)` - Rollback a purchase
- `preAuthorizationOK(params)` - Handle pre-auth success
- `preAuthorizationNotify(params)` - Handle pre-auth notification
- `preAuthorizationCancel(params)` - Handle pre-auth cancellation

### Advanced Operations

#### paymentSessionCreate(params)
Create a payment session.

```javascript
await paymentSessionCreate({
  cart: [
    { name: 'Product', price: 50, quantity: 1 }
  ],
  customer: { email: 'user@example.com' }
});
```

#### mandateManagement(params)
Manage payment mandates.

```javascript
await mandateManagement({
  mandateId: 'MANDATE123',
  note: 'Manage mandate'
});
```

## 🧪 Testing

### Run All Tests

```bash
npm run test:v2
```

### Run Unit Tests Only

```bash
npm run test:v2:unit
```

### Run Integration Tests Only

```bash
npm run test:v2:integration
```

### Run with Coverage

```bash
npm run test:v2:coverage
```

## 🎨 Response Format

All operations return a consistent response format:

```javascript
{
  redirectUrl: 'https://www.mypos.com/vmp/checkout',
  rawResponse: '<html><body onload="document.ipcForm.submit()">...</body></html>'
}
```

### Handling the Response

**Option 1: Render HTML (Server-Side)**
```javascript
app.post('/checkout', async (req, res) => {
  const result = await purchase({ cart: [...], customer: {...} });
  res.send(result.rawResponse); // Browser auto-submits to myPOS
});
```

**Option 2: Open in New Window (Client-Side)**
```javascript
const newWindow = window.open('', '_blank');
newWindow.document.write(result.rawResponse);
newWindow.document.close();
```

## 🔧 Error Handling

V2 uses custom error classes for better error handling:

```javascript
const { 
  MyPOSConfigError, 
  MyPOSValidationError,
  MyPOSSignatureError 
} = require('@mypos/JS-checkout-SDK');

try {
  await purchase({...});
} catch (error) {
  if (error instanceof MyPOSConfigError) {
    console.error('Configuration error:', error.message);
  } else if (error instanceof MyPOSValidationError) {
    console.error('Validation error:', error.message, 'Field:', error.field);
  } else if (error instanceof MyPOSSignatureError) {
    console.error('Signature error:', error.message);
  }
}
```

## 📊 Migration from V1

### Key Changes

| V1 | V2 |
|----|-----|
| Callbacks | Async/await |
| `src/checkout/` + `src/resources/checkout/` | `src/checkout/` |
| `mandateManagment` | `mandateManagement` |
| Separate config loading per call | Cached config |
| No error classes | Custom error classes |

### Before (V1)

```javascript
const purchase = require('@mypos/JS-checkout-SDK');

purchase(params, (response) => {
  console.log(response);
});
```

### After (V2)

```javascript
const { purchase } = require('@mypos/JS-checkout-SDK');

const response = await purchase(params);
console.log(response);
```

## 🏗️ Architecture

```
src/
├── index.js              # Main entry point
├── client.js             # MyPOSCheckout class
├── config/               # Configuration management
│   ├── index.js         # Config loader with caching
│   ├── validator.js     # Validation functions
│   └── defaults.js      # Default values
├── core/                 # Core functionality
│   ├── checkout-request.js  # Base request class
│   ├── signature.js     # RSA signature generation
│   └── errors.js        # Custom error classes
├── checkout/             # All 28 checkout operations
│   ├── purchase.js
│   ├── refund.js
│   └── ... (26 more)
└── utils/                # Utility functions
    ├── common.js
    ├── logger.js
    └── cart-builder.js
```

## 🔒 Security

- Private keys are never logged or exposed
- All signatures use RSA SHA-256
- Form values are HTML-escaped
- Config validation prevents common mistakes

## 📝 License

ISC

## 🔗 Links

- [myPOS Website](https://www.mypos.eu/)
- [Developer Documentation](https://developers.mypos.eu/)
- [GitHub Repository](https://github.com/developermypos/mypos-js)
- [Report Issues](https://github.com/developermypos/mypos-js/issues)

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## 💡 Support

For support, please visit the [myPOS Developer Portal](https://developers.mypos.eu/) or open an issue on GitHub.

