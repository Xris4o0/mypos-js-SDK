# V2 SDK Example Usage

Complete examples showing how to use the v2 SDK in real applications.

## 🚀 Quick Start Example

### Simple Purchase

```javascript
const { purchase } = require('@mypos/JS-checkout-SDK/v2');

async function createPayment() {
  try {
    const result = await purchase({
      cart: [
        { name: 'Product 1', price: 50, quantity: 1 },
        { name: 'Product 2', price: 30, quantity: 2 }
      ],
      customer: {
        email: 'customer@example.com',
        firstNames: 'John',
        familyName: 'Doe'
      }
    });
    
    return result.rawResponse;
  } catch (error) {
    console.error('Payment creation failed:', error.message);
    throw error;
  }
}
```

---

## 🌐 Express.js Integration

### Complete E-commerce Checkout Flow

```javascript
require('dotenv').config();
const express = require('express');
const { 
  purchase, 
  refund, 
  getPaymentStatus 
} = require('@mypos/JS-checkout-SDK/v2');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Checkout page - initiate payment
app.post('/api/checkout', async (req, res) => {
  try {
    const { cart, customer } = req.body;
    
    // Validate input
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid cart' 
      });
    }
    
    // Create payment request
    const result = await purchase({
      cart,
      customer,
      discount: req.body.discount || 0,
      tip: req.body.tip || 0,
      note: `Order #${Date.now()}`
    });
    
    // Send auto-submit form to browser
    res.send(result.rawResponse);
    
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      error: 'Payment processing failed',
      message: error.message 
    });
  }
});

// Success callback - user returned after successful payment
app.get('/payment/success', async (req, res) => {
  // myPOS sends transaction details in query params
  const { IPC_Trnref, OrderID } = req.query;
  
  try {
    // Verify payment status
    const status = await getPaymentStatus({
      transactionId: IPC_Trnref
    });
    
    // Update your database
    // await db.orders.update(OrderID, { 
    //   status: 'paid', 
    //   transactionId: IPC_Trnref 
    // });
    
    res.send(`
      <h1>Payment Successful!</h1>
      <p>Transaction ID: ${IPC_Trnref}</p>
      <p>Order ID: ${OrderID}</p>
    `);
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).send('Error verifying payment');
  }
});

// Cancel callback - user cancelled payment
app.get('/payment/cancel', (req, res) => {
  const { OrderID } = req.query;
  
  // Update your database
  // await db.orders.update(OrderID, { status: 'cancelled' });
  
  res.send(`
    <h1>Payment Cancelled</h1>
    <p>Order ID: ${OrderID}</p>
    <a href="/checkout">Try Again</a>
  `);
});

// Notification callback - myPOS server-to-server notification
app.post('/payment/notify', express.raw({ type: 'application/x-www-form-urlencoded' }), async (req, res) => {
  // myPOS sends POST notification with payment details
  const { IPC_Trnref, OrderID, Status } = req.body;
  
  try {
    // Verify payment status (important for security)
    const status = await getPaymentStatus({
      transactionId: IPC_Trnref
    });
    
    // Update your database with final status
    // await db.orders.update(OrderID, {
    //   status: Status,
    //   transactionId: IPC_Trnref,
    //   verifiedAt: new Date()
    // });
    
    // Respond with OK (myPOS expects this)
    res.status(200).send('OK');
  } catch (error) {
    console.error('Notification processing failed:', error);
    res.status(500).send('ERROR');
  }
});

// Refund endpoint
app.post('/api/refund', async (req, res) => {
  try {
    const { transactionId, amount, reason } = req.body;
    
    const result = await refund({
      transactionId,
      amount,
      note: reason || 'Customer refund'
    });
    
    res.json({ 
      success: true, 
      message: 'Refund processed' 
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ 
      error: 'Refund failed',
      message: error.message 
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## 🏗️ Using Class-Based API

### Reusable Client Instance

```javascript
const { MyPOSCheckout } = require('@mypos/JS-checkout-SDK/v2');

// Create client once with your configuration
const checkout = new MyPOSCheckout({
  environment: process.env.MYPOS_ENVIRONMENT || 'sandbox',
  sid: process.env.MYPOS_SID,
  clientNumber: process.env.MYPOS_CLIENT_NUMBER,
  privateKey: process.env.MYPOS_PRIVATE_KEY,
  currency: 'EUR'
});

// Payment service class
class PaymentService {
  constructor() {
    this.checkout = checkout;
  }
  
  async createPayment(cart, customer) {
    return await this.checkout.purchase({
      cart,
      customer
    });
  }
  
  async refundPayment(transactionId, amount) {
    return await this.checkout.refund({
      transactionId,
      amount
    });
  }
  
  async checkStatus(transactionId) {
    return await this.checkout.getPaymentStatus({
      transactionId
    });
  }
}

// Usage in your app
const paymentService = new PaymentService();

app.post('/checkout', async (req, res) => {
  const result = await paymentService.createPayment(
    req.body.cart,
    req.body.customer
  );
  res.send(result.rawResponse);
});
```

---

## 💰 Advanced Cart Operations

### With Discount and Tip

```javascript
const { purchase } = require('@mypos/JS-checkout-SDK/v2');

async function checkoutWithDiscounts() {
  const result = await purchase({
    cart: [
      { name: 'Premium Subscription', price: 100, quantity: 1 },
      { name: 'Extra Features', price: 25, quantity: 2 }
    ],
    customer: {
      email: 'premium@example.com'
    },
    discount: 15,  // 15% discount
    tip: 10,       // $10 tip
    note: 'Premium customer discount applied'
  });
  
  // Cart total calculation:
  // Subtotal: $150 (100 + 25*2)
  // Discount: -$22.50 (15% of 150)
  // Tip: +$10
  // Final: $137.50
  
  return result;
}
```

### Dynamic Cart Building

```javascript
async function buildDynamicCart(orderItems, promoCode) {
  // Build cart from database items
  const cart = orderItems.map(item => ({
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity
  }));
  
  // Apply promo code discount
  let discount = 0;
  if (promoCode === 'SAVE20') {
    discount = 20;
  } else if (promoCode === 'SAVE10') {
    discount = 10;
  }
  
  // Calculate delivery fee as cart item
  const hasDelivery = orderItems.some(item => item.requiresDelivery);
  if (hasDelivery) {
    cart.push({
      name: 'Delivery Fee',
      price: 5.99,
      quantity: 1
    });
  }
  
  return await purchase({
    cart,
    discount,
    customer: {
      email: orderItems[0].customer.email
    }
  });
}
```

---

## 🔐 Authorization Flow

### Two-Step Payment (Authorize then Capture)

```javascript
const { 
  authorization, 
  authorizationCapture 
} = require('@mypos/JS-checkout-SDK/v2');

// Step 1: Authorize payment (reserve funds)
async function authorizePayment(amount) {
  const result = await authorization({
    amount,
    currency: 'EUR',
    note: 'Authorization for order verification'
  });
  
  // Store authorization ID
  return result;
}

// Step 2: Capture payment (charge the card)
async function capturePayment(authorizationId, amount) {
  const result = await authorizationCapture({
    transactionId: authorizationId,
    amount,
    currency: 'EUR',
    note: 'Capture after goods shipped'
  });
  
  return result;
}

// Usage in e-commerce flow
app.post('/order/authorize', async (req, res) => {
  // Authorize when order is placed
  const auth = await authorizePayment(req.body.total);
  
  // Store authorization ID in database
  // await db.orders.create({
  //   authorizationId: auth.transactionId,
  //   status: 'authorized'
  // });
  
  res.json({ success: true });
});

app.post('/order/:id/ship', async (req, res) => {
  // Capture when goods are shipped
  const order = await db.orders.findById(req.params.id);
  
  const capture = await capturePayment(
    order.authorizationId,
    order.total
  );
  
  // Update order status
  // await db.orders.update(req.params.id, {
  //   status: 'captured',
  //   transactionId: capture.transactionId
  // });
  
  res.json({ success: true });
});
```

---

## 🔄 Pre-Authorization Flow

### Hotel Booking Example

```javascript
const { 
  preAuthorization,
  preAuthCompletion,
  preAuthCancellation 
} = require('@mypos/JS-checkout-SDK/v2');

// Pre-authorize for hotel booking
async function bookHotel(roomDetails, customer) {
  const cart = [{
    name: `${roomDetails.type} - ${roomDetails.nights} nights`,
    price: roomDetails.pricePerNight,
    quantity: roomDetails.nights
  }];
  
  const result = await preAuthorization({
    cart,
    customer,
    note: `Booking: ${roomDetails.confirmationCode}`
  });
  
  return result;
}

// Complete pre-auth after checkout
async function completeBooking(preAuthId, finalAmount) {
  const result = await preAuthCompletion({
    transactionId: preAuthId,
    amount: finalAmount,
    currency: 'EUR',
    note: 'Booking completed, final charge'
  });
  
  return result;
}

// Cancel pre-auth if booking cancelled
async function cancelBooking(preAuthId) {
  const result = await preAuthCancellation({
    transactionId: preAuthId,
    note: 'Booking cancelled by customer'
  });
  
  return result;
}
```

---

## 🎫 Subscription Payment

### Recurring Card Storage and Charging

```javascript
const { 
  iaStoreCard,
  iaPurchase 
} = require('@mypos/JS-checkout-SDK/v2');

// Step 1: Store customer's card
async function storeCustomerCard(customer) {
  const result = await iaStoreCard({
    customer: {
      email: customer.email,
      firstNames: customer.firstName,
      familyName: customer.lastName
    },
    currency: 'EUR',
    note: 'Card storage for subscription'
  });
  
  // Save card token in your database
  // await db.customers.update(customer.id, {
  //   cardToken: result.cardToken
  // });
  
  return result;
}

// Step 2: Charge stored card for subscription
async function chargeSubscription(customer, subscriptionAmount) {
  const cart = [{
    name: 'Monthly Subscription',
    price: subscriptionAmount,
    quantity: 1
  }];
  
  const result = await iaPurchase({
    cardToken: customer.cardToken,
    cart,
    customer: {
      email: customer.email
    },
    note: `Subscription charge - ${new Date().toISOString()}`
  });
  
  return result;
}

// Subscription service
class SubscriptionService {
  async setupSubscription(customer) {
    // Store card
    const cardResult = await storeCustomerCard(customer);
    
    // Charge first month
    const chargeResult = await chargeSubscription(
      { ...customer, cardToken: cardResult.cardToken },
      29.99
    );
    
    return { cardResult, chargeResult };
  }
  
  async renewSubscription(customer) {
    // Charge stored card
    return await chargeSubscription(customer, 29.99);
  }
}
```

---

## 🛡️ Error Handling Patterns

### Comprehensive Error Handling

```javascript
const { 
  purchase,
  MyPOSConfigError,
  MyPOSValidationError,
  MyPOSSignatureError
} = require('@mypos/JS-checkout-SDK/v2');

async function handlePayment(req, res) {
  try {
    const result = await purchase({
      cart: req.body.cart,
      customer: req.body.customer
    });
    
    res.send(result.rawResponse);
    
  } catch (error) {
    // Configuration errors (setup issues)
    if (error instanceof MyPOSConfigError) {
      console.error('Configuration error:', error.message);
      // Alert admin - configuration needs fixing
      // Don't expose to user
      return res.status(500).json({
        error: 'Payment system configuration error',
        message: 'Please contact support'
      });
    }
    
    // Validation errors (user input issues)
    if (error instanceof MyPOSValidationError) {
      console.error('Validation error:', error.field, error.message);
      // Show to user - they can fix it
      return res.status(400).json({
        error: 'Invalid input',
        field: error.field,
        message: error.message
      });
    }
    
    // Signature errors (key issues)
    if (error instanceof MyPOSSignatureError) {
      console.error('Signature error:', error.message);
      // Alert admin - private key issue
      return res.status(500).json({
        error: 'Payment security error',
        message: 'Please contact support'
      });
    }
    
    // Unknown errors
    console.error('Unknown error:', error);
    return res.status(500).json({
      error: 'Payment processing failed',
      message: 'Please try again'
    });
  }
}
```

---

## 🧪 Testing in Your Application

### Mock for Unit Tests

```javascript
// test/mocks/mypos.mock.js
const mockPurchase = jest.fn().mockResolvedValue({
  redirectUrl: 'https://www.mypos.com/vmp/checkout-test',
  rawResponse: '<html>Mock form</html>'
});

const mockRefund = jest.fn().mockResolvedValue({
  redirectUrl: 'https://www.mypos.com/vmp/checkout-test',
  rawResponse: '<html>Mock form</html>'
});

module.exports = {
  purchase: mockPurchase,
  refund: mockRefund
};

// Your test
const checkout = require('../mocks/mypos.mock');

test('should create payment', async () => {
  const result = await checkout.purchase({
    cart: [{name: 'Test', price: 10, quantity: 1}],
    customer: {email: 'test@example.com'}
  });
  
  expect(result.redirectUrl).toBeDefined();
  expect(checkout.purchase).toHaveBeenCalled();
});
```

### Integration Test with Sandbox

```javascript
// test/integration/payment.test.js
require('dotenv').config();
const { purchase } = require('@mypos/JS-checkout-SDK/v2');

describe('Payment Integration', () => {
  test('should create purchase request', async () => {
    const result = await purchase({
      cart: [
        { name: 'Test Product', price: 0.01, quantity: 1 }
      ],
      customer: {
        email: 'test@example.com'
      }
    });
    
    expect(result.redirectUrl).toContain('mypos.com');
    expect(result.rawResponse).toContain('IPCPurchase');
    expect(result.rawResponse).toContain('Test Product');
  });
});
```

---

## 📝 Complete Example Application

See [examples/](../examples/) directory for complete working applications including:
- Express.js e-commerce checkout
- Subscription payment system
- Hotel booking with pre-authorization
- Multi-currency payment gateway

---

## 🔗 Additional Resources

- [API Reference](README.md#api-reference)
- [Configuration Guide](README.md#configuration)
- [Error Handling](DOCUMENTATION.md#error-handling)
- [Testing Guide](README.md#testing)
- [Flow Documentation](FLOW_DOCUMENTATION.md)

