const express = require('express');
const path = require('path');
const { loadConfig } = require('../src/utils/config-loader');

// Import all checkout functions
const {
  purchase, refund, reversal, getPaymentStatus,
  sendMoney, requestMoney,
  authorization, authorizationCapture, authorizationList, authorizationReverse,
  preAuthorization, preAuthorizationOK, preAuthorizationNotify, preAuthorizationCancel,
  preAuthStatus, preAuthCompletion, preAuthCancellation,
  iaPurchase, iaPreAuthorization, iaStoreCard, iaStoreCardUpdate,
  purchaseByIcard, purchaseCancel, purchaseNotify, purchaseOK, purchaseRollback,
  paymentSessionCreate, mandateManagment
} = require('../src/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/api', express.json());

// Function categories for organization
const functionCategories = {
  basic: {
    title: 'Basic Operations',
    functions: [
      { name: 'purchase', title: 'Purchase', description: 'Create a payment with cart items' },
      { name: 'refund', title: 'Refund', description: 'Refund a completed transaction' },
      { name: 'reversal', title: 'Reversal', description: 'Reverse a transaction' },
      { name: 'getPaymentStatus', title: 'Get Payment Status', description: 'Check the status of a payment' }
    ]
  },
  money: {
    title: 'Money Transfer',
    functions: [
      { name: 'sendMoney', title: 'Send Money', description: 'Send money to another wallet' },
      { name: 'requestMoney', title: 'Request Money', description: 'Request money from another wallet' }
    ]
  },
  authorization: {
    title: 'Authorization',
    functions: [
      { name: 'authorization', title: 'Authorization', description: 'Create an authorization' },
      { name: 'authorizationCapture', title: 'Authorization Capture', description: 'Capture an authorization' },
      { name: 'authorizationList', title: 'Authorization List', description: 'List authorizations' },
      { name: 'authorizationReverse', title: 'Authorization Reverse', description: 'Reverse an authorization' }
    ]
  },
  preAuth: {
    title: 'Pre-Authorization',
    functions: [
      { name: 'preAuthorization', title: 'Pre-Authorization', description: 'Create a pre-authorization' },
      { name: 'preAuthStatus', title: 'Pre-Auth Status', description: 'Check pre-auth status' },
      { name: 'preAuthCompletion', title: 'Pre-Auth Completion', description: 'Complete a pre-auth' },
      { name: 'preAuthCancellation', title: 'Pre-Auth Cancellation', description: 'Cancel a pre-auth' },
      { name: 'preAuthorizationOK', title: 'Pre-Auth OK', description: 'Handle pre-auth success' },
      { name: 'preAuthorizationNotify', title: 'Pre-Auth Notify', description: 'Handle pre-auth notification' },
      { name: 'preAuthorizationCancel', title: 'Pre-Auth Cancel', description: 'Handle pre-auth cancellation' }
    ]
  },
  icard: {
    title: 'iCard Operations',
    functions: [
      { name: 'iaPurchase', title: 'IA Purchase', description: 'Purchase with iCard' },
      { name: 'iaPreAuthorization', title: 'IA Pre-Authorization', description: 'Pre-authorize with iCard' },
      { name: 'iaStoreCard', title: 'IA Store Card', description: 'Store a card for future use' },
      { name: 'iaStoreCardUpdate', title: 'IA Store Card Update', description: 'Update stored card' },
      { name: 'purchaseByIcard', title: 'Purchase by iCard', description: 'Purchase using stored iCard' }
    ]
  },
  advanced: {
    title: 'Advanced Operations',
    functions: [
      { name: 'paymentSessionCreate', title: 'Payment Session Create', description: 'Create a payment session' },
      { name: 'mandateManagment', title: 'Mandate Management', description: 'Manage payment mandates' }
    ]
  },
  callbacks: {
    title: 'Callback Handlers',
    functions: [
      { name: 'purchaseOK', title: 'Purchase OK', description: 'Handle successful purchase' },
      { name: 'purchaseCancel', title: 'Purchase Cancel', description: 'Handle cancelled purchase' },
      { name: 'purchaseNotify', title: 'Purchase Notify', description: 'Handle purchase notification' },
      { name: 'purchaseRollback', title: 'Purchase Rollback', description: 'Rollback a purchase' }
    ]
  }
};

// Helper function to execute checkout functions
async function executeFunction(functionName, params) {
  try {
    console.log(`[executeFunction] Executing ${functionName} with params:`, params);
    
    const functions = {
      purchase, refund, reversal, getPaymentStatus,
      sendMoney, requestMoney,
      authorization, authorizationCapture, authorizationList, authorizationReverse,
      preAuthorization, preAuthorizationOK, preAuthorizationNotify, preAuthorizationCancel,
      preAuthStatus, preAuthCompletion, preAuthCancellation,
      iaPurchase, iaPreAuthorization, iaStoreCard, iaStoreCardUpdate,
      purchaseByIcard, purchaseCancel, purchaseNotify, purchaseOK, purchaseRollback,
      paymentSessionCreate, mandateManagment
    };

    const func = functions[functionName];
    if (!func) {
      throw new Error(`Function ${functionName} not found`);
    }

    console.log(`[executeFunction] Function found, calling...`);
    const result = await func(params);
    console.log(`[executeFunction] Result:`, result);
    return { success: true, data: result };
  } catch (error) {
    console.error(`[executeFunction] Error:`, error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'demo.html'));
});

app.get('/api/functions', (req, res) => {
  res.json(functionCategories);
});

app.post('/api/execute/:functionName', async (req, res) => {
  const { functionName } = req.params;
  const params = req.body;

  console.log(`[API] Executing function: ${functionName}`);
  console.log(`[API] Params:`, params);

  try {
    const result = await executeFunction(functionName, params);
    console.log(`[API] Result:`, result);
    res.json(result);
  } catch (error) {
    console.error(`[API] Error:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/config', (req, res) => {
  try {
    const config = loadConfig();
    // Don't expose private keys in the response
    const safeConfig = {
      environment: config.environment,
      sid: config.sid,
      clientNumber: config.clientNumber,
      currency: config.currency,
      keyIndex: config.keyIndex,
      successUrl: config.successUrl,
      cancelUrl: config.cancelUrl,
      notifyUrl: config.notifyUrl
    };
    res.json(safeConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 myPOS SDK Demo App running at http://localhost:${PORT}`);
  console.log(`📚 Try the interactive demo with all 28 checkout functions!`);
  console.log(`⚙️  Make sure to set up your .env file or .pem files for configuration.`);
});
