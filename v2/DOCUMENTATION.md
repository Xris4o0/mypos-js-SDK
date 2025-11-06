# V2 Complete Technical Documentation

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Configuration System](#configuration-system)
4. [Request Lifecycle](#request-lifecycle)
5. [Error Handling](#error-handling)
6. [Testing Strategy](#testing-strategy)
7. [API Reference](#api-reference)
8. [Best Practices](#best-practices)

---

## Architecture Overview

### Design Principles

The v2 SDK is built on these core principles:

1. **Single Responsibility**: Each file has one clear purpose
2. **Zero Duplication**: One implementation per operation
3. **Composition Over Inheritance**: Base class provides common functionality
4. **Explicit Over Implicit**: Clear parameter mapping and validation
5. **Promise-Based**: Modern async/await throughout

### Directory Structure

```
v2/
├── config/              # Configuration management
│   ├── index.js        # Main config loader with caching
│   ├── validator.js    # Input validation functions
│   └── defaults.js     # Default configuration values
│
├── core/                # Core SDK functionality
│   ├── checkout-request.js   # Base class for all operations
│   ├── signature.js          # RSA signature generation
│   └── errors.js             # Custom error classes
│
├── checkout/            # All 28 checkout operations
│   ├── index.js        # Barrel export of all operations
│   ├── purchase.js     # Purchase operation
│   └── ... (27 more)   # Other operations
│
├── utils/               # Utility functions
│   ├── common.js       # Common helpers
│   ├── logger.js       # Logging utility
│   └── cart-builder.js # Cart manipulation
│
├── __tests__/           # Test suite
│   ├── setup.js        # Test configuration
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
│
├── index.js             # Main entry point (functional API)
├── client.js            # MyPOSCheckout class (class-based API)
├── jest.config.js       # Jest test configuration
└── README.md            # User-facing documentation
```

---

## Core Components

### 1. CheckoutRequest Base Class

**File**: `v2/core/checkout-request.js`

**Purpose**: Provides common functionality for all checkout operations

**Responsibilities**:
- Environment-based URL routing
- Signature generation orchestration
- HTML form generation
- Error handling

**Key Methods**:

```javascript
class CheckoutRequest {
  constructor(config, ipcParams)
  getHost()           // Returns myPOS URL based on environment
  async execute()     // Generates signature and form, returns response
}
```

**Usage Pattern**:
```javascript
// All operations extend this class
class PurchaseRequest extends CheckoutRequest {
  constructor(config, params) {
    // Map user params to IPC format
    const ipcParams = {...};
    super(config, ipcParams);
  }
}
```

### 2. Configuration System

**File**: `v2/config/index.js`

**Purpose**: Centralized configuration management with multi-source loading

**Configuration Sources** (priority order):
1. Default values (`defaults.js`)
2. Config file (`mypos.config.js`)
3. Environment variables (`.env`)
4. Function parameters (highest)

**Key Features**:
- Caching for performance
- Environment-specific values
- Private key file loading
- Validation on load

**Functions**:

```javascript
loadConfig(params)    // Load and merge config from all sources
clearCache()          // Clear cached configuration
```

**Example Configuration Flow**:
```javascript
// 1. Defaults
{ environment: 'sandbox', currency: 'EUR', ... }

// 2. + Config file
{ environment: 'production', currency: 'USD', ... }

// 3. + Environment variables
{ environment: 'production', currency: 'USD', sid: '123', ... }

// 4. + Function params
{ environment: 'production', currency: 'EUR', sid: '123', ... }
```

### 3. Signature Generation

**File**: `v2/core/signature.js`

**Purpose**: Generate RSA signatures for request authentication

**Functions**:

```javascript
generateSignature(params, privateKey)  // Generate RSA SHA-256 signature
generateForm(url, params)              // Generate auto-submit HTML form
```

**Signature Algorithm**:
1. Concatenate all parameter values with `-` separator
2. Base64 encode the concatenated string
3. Sign with RSA private key using SHA-256
4. Return Base64 encoded signature

**Security Features**:
- SHA-256 hashing
- RSA encryption
- HTML escaping in forms
- Private key never exposed

### 4. Error Classes

**File**: `v2/core/errors.js`

**Purpose**: Provide descriptive, catchable errors

**Error Hierarchy**:
```
MyPOSError (base)
├── MyPOSConfigError        # Configuration issues
├── MyPOSValidationError    # Parameter validation failures
└── MyPOSSignatureError     # Signature generation problems
```

**Usage**:
```javascript
try {
  await purchase({...});
} catch (error) {
  if (error instanceof MyPOSConfigError) {
    // Handle configuration error
  } else if (error instanceof MyPOSValidationError) {
    // Handle validation error
    console.log(error.field); // Which field failed
  }
}
```

### 5. Cart Builder

**File**: `v2/utils/cart-builder.js`

**Purpose**: Cart manipulation and calculation

**Functions**:

```javascript
buildCartItems(cart, discount, tip)  // Build final cart with discount/tip
calculateTotal(cartItems)             // Calculate total amount
```

**Features**:
- Validates cart structure
- Rounds prices to 2 decimals
- Applies percentage discounts
- Adds flat tips
- Calculates totals correctly

**Example**:
```javascript
const items = buildCartItems(
  [{ name: 'Item', price: 100, quantity: 1 }],
  10,  // 10% discount
  15   // $15 tip
);

// Result:
// [
//   { name: 'Item', price: 100, quantity: 1 },
//   { name: 'Discount (10%)', price: -10, quantity: 1 },
//   { name: 'Tip', price: 15, quantity: 1 }
// ]

const total = calculateTotal(items); // 105
```

---

## Configuration System

### Configuration Loading Priority

**Priority Order** (lowest to highest):

1. **Defaults** (`v2/config/defaults.js`)
   ```javascript
   {
     environment: 'sandbox',
     lang: 'EN',
     version: '1.4',
     currency: 'EUR',
     // ... other defaults
   }
   ```

2. **Config File** (`mypos.config.js`)
   ```javascript
   module.exports = {
     environment: 'production',
     sid: 'YOUR_SID',
     clientNumber: 'YOUR_CLIENT_NUMBER',
     // ... other config
   }
   ```

3. **Environment Variables** (`.env`)
   ```env
   MYPOS_ENVIRONMENT=sandbox
   MYPOS_SID_SANDBOX=000000000000010
   MYPOS_CLIENT_NUMBER_SANDBOX=61938166610
   ```

4. **Function Parameters** (highest priority)
   ```javascript
   purchase({
     ...params,
     currency: 'USD' // Overrides all others
   })
   ```

### Environment-Specific Configuration

The SDK supports environment-specific values:

```env
# Generic (fallback)
MYPOS_SID=default_sid
MYPOS_PRIVATE_KEY=default_key

# Environment-specific (used when environment matches)
MYPOS_SID_SANDBOX=sandbox_sid
MYPOS_SID_PRODUCTION=production_sid
MYPOS_PRIVATE_KEY_SANDBOX=sandbox_key
MYPOS_PRIVATE_KEY_PRODUCTION=production_key
```

**Loading Logic**:
```javascript
// If environment is 'sandbox', tries:
// 1. MYPOS_SID_SANDBOX (specific)
// 2. MYPOS_SID (fallback)
```

### Private Key Loading

**Priority Order**:

1. Environment variable: `MYPOS_PRIVATE_KEY_[ENV]`
2. Environment variable: `MYPOS_PRIVATE_KEY`
3. Environment-specific file: `private_key_[env].pem`
4. Generic file: `private_key.pem`

**Example**:
```bash
# For sandbox environment
private_key_sandbox.pem    # Checked first
private_key.pem           # Checked if above not found
```

### Configuration Caching

**How it Works**:

```javascript
// First call - loads from all sources
const config1 = loadConfig(params);

// Second call - returns cached config (if no params)
const config2 = loadConfig();

// Clear cache
clearCache();

// Next call - loads again
const config3 = loadConfig();
```

**Benefits**:
- ~50% faster on subsequent calls
- Reduces file I/O
- Consistent configuration across operations

**Cache Invalidation**:
- Automatic when params are provided
- Manual via `clearCache()`
- Useful for testing

---

## Request Lifecycle

### Complete Request Flow

```
User Call
  ↓
Load Config (with caching)
  ↓
Validate Parameters
  ↓
Build Cart Items
  ↓
Calculate Amounts
  ↓
Map to IPC Parameters
  ↓
Create Request Instance
  ↓
Execute Request
  ├─ Get Environment URL
  ├─ Generate Signature
  └─ Generate HTML Form
  ↓
Return Response
  ↓
Application Sends to Browser
  ↓
Browser Auto-Submits to myPOS
```

### Parameter Mapping

**User Parameters → IPC Parameters**

```javascript
// User friendly
{
  cart: [{name, price, quantity}],
  customer: {email, firstName, ...},
  discount: 10,
  tip: 15
}

// Mapped to IPC format
{
  IPCmethod: 'IPCPurchase',
  SID: '...',
  WalletNumber: '...',
  Amount: 105,
  CartItems: 3,
  Article_1: 'Item',
  Price_1: 100,
  Quantity_1: 1,
  Article_2: 'Discount (10%)',
  Price_2: -10,
  Quantity_2: 1,
  Article_3: 'Tip',
  Price_3: 15,
  Quantity_3: 1,
  CustomerEmail: '...',
  // ... other params
}
```

### Response Format

All operations return consistent response:

```javascript
{
  redirectUrl: 'https://www.mypos.com/vmp/checkout-test',
  rawResponse: '<html><body onload="document.ipcForm.submit()">...</body></html>'
}
```

**Response Properties**:
- `redirectUrl`: myPOS endpoint URL (for reference)
- `rawResponse`: Auto-submitting HTML form (send to browser)

---

## Error Handling

### Error Types

#### 1. MyPOSConfigError

**Thrown When**:
- Required config missing (SID, clientNumber, privateKey)
- Invalid environment value
- Invalid private key format
- Request execution fails

**Example**:
```javascript
throw new MyPOSConfigError(
  'MYPOS_SID is required for environment: sandbox'
);
```

**Catching**:
```javascript
try {
  await purchase({...});
} catch (error) {
  if (error instanceof MyPOSConfigError) {
    console.error('Configuration issue:', error.message);
    // Prompt user to check configuration
  }
}
```

#### 2. MyPOSValidationError

**Thrown When**:
- Invalid cart structure
- Missing required parameters
- Invalid parameter types
- Invalid parameter values

**Example**:
```javascript
throw new MyPOSValidationError(
  'Cart item at index 0 must have numeric "price"',
  'cart[0].price'
);
```

**Properties**:
- `message`: Error description
- `field`: Which field failed (e.g., 'cart[0].price')

**Catching**:
```javascript
try {
  await purchase({...});
} catch (error) {
  if (error instanceof MyPOSValidationError) {
    console.error(`Invalid ${error.field}: ${error.message}`);
    // Show validation error to user
  }
}
```

#### 3. MyPOSSignatureError

**Thrown When**:
- RSA key format invalid
- Signature generation fails
- Encryption error

**Example**:
```javascript
throw new MyPOSSignatureError(
  'Failed to generate signature: Invalid key format'
);
```

**Catching**:
```javascript
try {
  await purchase({...});
} catch (error) {
  if (error instanceof MyPOSSignatureError) {
    console.error('Signature error:', error.message);
    // Check private key configuration
  }
}
```

### Error Handling Best Practices

1. **Always Use Try-Catch**:
   ```javascript
   try {
     const result = await purchase({...});
     res.send(result.rawResponse);
   } catch (error) {
     // Handle error appropriately
     res.status(500).json({ error: error.message });
   }
   ```

2. **Check Error Types**:
   ```javascript
   catch (error) {
     if (error instanceof MyPOSConfigError) {
       // Configuration issue - log and alert admin
     } else if (error instanceof MyPOSValidationError) {
       // User input issue - show to user
     } else {
       // Unknown error - log and investigate
     }
   }
   ```

3. **Provide User Feedback**:
   ```javascript
   catch (error) {
     if (error instanceof MyPOSValidationError) {
       return res.status(400).json({
         error: 'Invalid input',
         field: error.field,
         message: error.message
       });
     }
   }
   ```

---

## Testing Strategy

### Test Structure

```
v2/__tests__/
├── setup.js                 # Global test configuration
├── unit/                    # Unit tests
│   ├── config.test.js      # Config loading
│   ├── signature.test.js   # Signature generation
│   ├── cart-builder.test.js # Cart manipulation
│   └── operations/
│       └── purchase.test.js # Purchase operation
└── integration/             # Integration tests
    ├── functional-api.test.js  # Functional exports
    └── client-api.test.js      # Class-based client
```

### Running Tests

```bash
# All v2 tests
npm run test:v2

# Unit tests only
npm run test:v2:unit

# Integration tests only
npm run test:v2:integration

# With coverage
npm run test:v2:coverage
```

### Test Coverage Goals

- **Core modules**: 90%+ coverage
- **Operations**: 80%+ coverage
- **Utils**: 85%+ coverage
- **Overall**: 80%+ coverage

### Writing Tests

**Unit Test Example**:
```javascript
describe('Cart Builder', () => {
  test('should build cart items from array', () => {
    const cart = [
      { name: 'Item', price: 50, quantity: 1 }
    ];
    
    const items = buildCartItems(cart);
    
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({ name: 'Item', price: 50, quantity: 1 });
  });
});
```

**Integration Test Example**:
```javascript
describe('Functional API', () => {
  test('should execute purchase operation', async () => {
    const result = await purchase({
      ...MOCK_CONFIG,
      cart: MOCK_CART,
      customer: MOCK_CUSTOMER
    });
    
    expect(result.redirectUrl).toBeDefined();
    expect(result.rawResponse).toContain('IPCPurchase');
  });
});
```

---

## API Reference

### Functional API

**Import**:
```javascript
const { purchase, refund, reversal } = require('@mypos/JS-checkout-SDK/v2');
```

**All Operations** (28 total):

#### Basic Operations
- `purchase(params)` - Create payment with cart
- `refund(params)` - Refund transaction
- `reversal(params)` - Reverse transaction
- `getPaymentStatus(params)` - Check payment status

#### Money Transfer
- `sendMoney(params)` - Send money to wallet
- `requestMoney(params)` - Request money from wallet

#### Authorization
- `authorization(params)` - Create authorization
- `authorizationCapture(params)` - Capture authorization
- `authorizationList(params)` - List authorizations
- `authorizationReverse(params)` - Reverse authorization

#### Pre-Authorization
- `preAuthorization(params)` - Create pre-authorization
- `preAuthStatus(params)` - Check pre-auth status
- `preAuthCompletion(params)` - Complete pre-auth
- `preAuthCancellation(params)` - Cancel pre-auth
- `preAuthorizationOK(params)` - Handle pre-auth success
- `preAuthorizationNotify(params)` - Handle pre-auth notification
- `preAuthorizationCancel(params)` - Handle pre-auth cancellation

#### iCard Operations
- `iaStoreCard(params)` - Store card
- `iaStoreCardUpdate(params)` - Update stored card
- `iaPurchase(params)` - Purchase with stored card
- `iaPreAuthorization(params)` - Pre-auth with stored card
- `purchaseByIcard(params)` - Purchase using iCard

#### Purchase Callbacks
- `purchaseOK(params)` - Handle purchase success
- `purchaseCancel(params)` - Handle purchase cancellation
- `purchaseNotify(params)` - Handle purchase notification
- `purchaseRollback(params)` - Rollback purchase

#### Advanced
- `paymentSessionCreate(params)` - Create payment session
- `mandateManagement(params)` - Manage payment mandate

### Class-Based API

**Import**:
```javascript
const { MyPOSCheckout } = require('@mypos/JS-checkout-SDK/v2');
```

**Usage**:
```javascript
const checkout = new MyPOSCheckout(config);

// All 28 operations available as methods
await checkout.purchase({...});
await checkout.refund({...});
// ... etc
```

**Methods**:
- `getConfig()` - Get current configuration
- `updateConfig(newConfig)` - Update configuration

---

## Best Practices

### 1. Configuration Management

**DO**:
```javascript
// Use environment variables for secrets
MYPOS_PRIVATE_KEY_PRODUCTION=...

// Use config file for non-secrets
module.exports = {
  currency: 'EUR',
  lang: 'EN'
}
```

**DON'T**:
```javascript
// Don't hardcode private keys
const config = {
  privateKey: '-----BEGIN RSA...'
}
```

### 2. Error Handling

**DO**:
```javascript
try {
  const result = await purchase({...});
  res.send(result.rawResponse);
} catch (error) {
  logger.error('Purchase failed:', error);
  res.status(500).json({ error: 'Payment processing failed' });
}
```

**DON'T**:
```javascript
// Don't ignore errors
const result = await purchase({...}).catch(() => null);
```

### 3. Cart Building

**DO**:
```javascript
// Let SDK calculate total
await purchase({
  cart: [
    { name: 'Item', price: 50, quantity: 1 }
  ],
  discount: 10,
  tip: 5
});
```

**DON'T**:
```javascript
// Don't manually calculate and override
await purchase({
  cart: [...],
  amount: 45 // Manual calculation prone to errors
});
```

### 4. Response Handling

**DO**:
```javascript
// Server-side: Send HTML to browser
app.post('/checkout', async (req, res) => {
  const result = await purchase({...});
  res.send(result.rawResponse);
});
```

**DON'T**:
```javascript
// Don't try to parse or modify the HTML
const result = await purchase({...});
const modified = result.rawResponse.replace(...);
res.send(modified); // May break signature
```

### 5. Testing

**DO**:
```javascript
// Use sandbox for development
const config = {
  environment: 'sandbox',
  ...
};
```

**DON'T**:
```javascript
// Don't test with production credentials
const config = {
  environment: 'production',
  ...
};
```

### 6. Security

**DO**:
- Store private keys securely
- Use environment variables
- Never commit keys to git
- Validate user input
- Use HTTPS in production

**DON'T**:
- Log private keys
- Expose keys in client-side code
- Use HTTP for sensitive operations
- Trust user input without validation

---

## Additional Resources

- **User Documentation**: See `v2/README.md`
- **Flow Documentation**: See `v2/FLOW_DOCUMENTATION.md`
- **Implementation Summary**: See `v2/IMPLEMENTATION_SUMMARY.md`
- **Tests**: See `v2/__tests__/`
- **myPOS Developer Portal**: https://developers.mypos.eu/

---

## Support

For issues or questions:
1. Check the documentation files
2. Review test examples
3. Open an issue on GitHub
4. Contact myPOS developer support

