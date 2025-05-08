const express = require('express')
const app = express();
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const environment = process.env.MYPOS_ENVIRONMENT || 'sandbox';

function getPrivateKey(env) {
  const envVar = {
    demo: 'MYPOS_PRIVATE_KEY_DEMO',
    sandbox: 'MYPOS_PRIVATE_KEY_SANDBOX',
    production: 'MYPOS_PRIVATE_KEY_PRODUCTION'
  }[env];
  let key = process.env[envVar];
  if (!key) {
    // fallback to private_key.txt
    key = fs.readFileSync(path.resolve(process.cwd(), 'private_key.txt'), 'utf8');
  } else {
    key = key.replace(/\\n/g, '\n');
  }
  return key;
}

function getEnvConfig(env) {
  if (env === 'sandbox') {
    return {
      sid: process.env.MYPOS_SID_SANDBOX || '000000000000010',
      clientNumber: process.env.MYPOS_CLIENT_NUMBER_SANDBOX || '61938166610',
      currency: process.env.MYPOS_CURRENCY_SANDBOX || 'EUR',
      keyIndex: parseInt(process.env.MYPOS_KEY_INDEX_SANDBOX || '1', 10),
      privateKey: getPrivateKey('sandbox')
    };
  } else if (env === 'demo') {
    return {
      sid: process.env.MYPOS_SID_DEMO,
      clientNumber: process.env.MYPOS_CLIENT_NUMBER_DEMO,
      currency: process.env.MYPOS_CURRENCY_DEMO,
      keyIndex: parseInt(process.env.MYPOS_KEY_INDEX_DEMO || '1', 10),
      privateKey: getPrivateKey('demo')
    };
  } else {
    return {
      sid: process.env.MYPOS_SID_PRODUCTION,
      clientNumber: process.env.MYPOS_CLIENT_NUMBER_PRODUCTION,
      currency: process.env.MYPOS_CURRENCY_PRODUCTION,
      keyIndex: parseInt(process.env.MYPOS_KEY_INDEX_PRODUCTION || '1', 10),
      privateKey: getPrivateKey('production')
    };
  }
}

const envConfig = getEnvConfig(environment);

const mypos = require('../mypos')({
    environment,
    logLevel: 'debug',
    checkout: {
        sid: envConfig.sid,
        lang: 'EN',
        currency: envConfig.currency,
        clientNumber: envConfig.clientNumber,
        okUrl: process.env.MYPOS_OK_URL,
        cancelUrl: process.env.MYPOS_CANCEL_URL,
        notifyUrl: process.env.MYPOS_NOTIFY_URL,
        cardTokenRequest: 0,
        paymentMethod: 1,
        paymentParametersRequired: 3,
        keyIndex: envConfig.keyIndex,
        privateKeys: {
          demo: getPrivateKey('demo'),
          sandbox: getPrivateKey('sandbox'),
          production: getPrivateKey('production')
        }
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/examples.html'));
});
app.post('/purchase', (req, res) => {
    mypos.checkout.purchase(purchaseParams, res);
});
app.post('/iapurchase', (req, res) => {
    mypos.checkout.iapurchase(purchaseParams, res);
});
app.post('/refund', (req, res) => {
    mypos.checkout.refund(refundParams(req.body.trnRef), (result) => {
        res.send(result);
    });
});
app.post('/reversal', (req, res) => {
    mypos.checkout.reversal({ trnRef: req.body.trnRef }, (result) => {
        res.send(result);
    });
});
app.post('/getPaymentStatus', (req, res) => {
    mypos.checkout.getPaymentStatus({ orderId: req.body.orderId }, (result) => {
        res.send(result);
    });
});

const purchaseParams = {
    orderId: uuidv4(),
    amount: 23.45,
    cartItems: [
        {
            name: 'HP ProBook 6360b sticker',
            quantity: 2,
            price: 10.00
        },
        {
            name: 'Delivery',
            quantity: 1,
            price: 3.45
        }
    ],
    customer: {
        email: 'name@website.com',
        firstNames: 'John',
        familyName: 'Smith',
        phone: '+23568956958',
        country: 'DEU',
        city: 'Hamburg',
        zipCode: '20095',
        address: 'Kleine Bahnstr. 41'
    },
    note: 'Some note'
};

refundParams = (trnRef) => {
    return {
        orderId: uuidv4(),
        amount: 9.99,
        trnRef: trnRef
    };
};

const server = http.createServer(app);
server.listen(8080, '127.0.0.1');
