# V2 Quick Start Guide

Get started with the myPOS Checkout SDK v2 in 5 minutes.

## 📦 Installation

```bash
npm install @mypos/JS-checkout-SDK
```

## ⚙️ Configuration

Create `.env` file:

```env
MYPOS_ENVIRONMENT=sandbox
MYPOS_SID_SANDBOX=000000000000010
MYPOS_CLIENT_NUMBER_SANDBOX=61938166610
MYPOS_PRIVATE_KEY_SANDBOX=-----BEGIN RSA PRIVATE KEY-----
...your private key...
-----END RSA PRIVATE KEY-----
MYPOS_OK_URL=http://localhost:3000/success
MYPOS_CANCEL_URL=http://localhost:3000/cancel
MYPOS_NOTIFY_URL=http://localhost:3000/notify
```

## 🚀 Basic Usage

```javascript
require('dotenv').config();
const { purchase } = require('@mypos/JS-checkout-SDK');

async function createPayment() {
  const result = await purchase({
    cart: [
      { name: 'Product', price: 50, quantity: 1 }
    ],
    customer: {
      email: 'customer@example.com'
    }
  });
  
  // Send form to browser - it will auto-submit to myPOS
  return result.rawResponse;
}
```

## 🌐 Express.js Integration

```javascript
const express = require('express');
const { purchase } = require('@mypos/JS-checkout-SDK');

const app = express();
app.use(express.json());

app.post('/checkout', async (req, res) => {
  try {
    const result = await purchase({
      cart: req.body.cart,
      customer: req.body.customer
    });
    res.send(result.rawResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## 📚 Next Steps

- **Complete API Reference**: See [README.md](README.md)
- **Usage Examples**: See [EXAMPLE_USAGE.md](EXAMPLE_USAGE.md)
- **Technical Documentation**: See [DOCUMENTATION.md](DOCUMENTATION.md)
- **Flow Explanation**: See [FLOW_DOCUMENTATION.md](FLOW_DOCUMENTATION.md)
- **Publishing Guide**: See [PACKAGING_GUIDE.md](PACKAGING_GUIDE.md)

## 🔑 Key Features

- ✅ Modern async/await API
- ✅ 28 checkout operations
- ✅ Automatic cart calculation with discounts/tips
- ✅ Custom error classes
- ✅ Comprehensive test coverage
- ✅ Both functional and class-based APIs
- ✅ Environment-based configuration

## 💡 Common Operations

### Purchase with Discount
```javascript
await purchase({
  cart: [{name: 'Item', price: 100, quantity: 1}],
  customer: {email: 'user@example.com'},
  discount: 10  // 10% off
});
```

### Refund
```javascript
const { refund } = require('@mypos/JS-checkout-SDK');

await refund({
  transactionId: 'TXN123',
  amount: 50
});
```

### Check Status
```javascript
const { getPaymentStatus } = require('@mypos/JS-checkout-SDK');

const status = await getPaymentStatus({
  transactionId: 'TXN123'
});
```

## 🎓 Support

- GitHub Issues: https://github.com/developermypos/mypos-js/issues
- Developer Portal: https://developers.mypos.eu/
- Documentation: See files in this directory

