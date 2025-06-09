// Integration test for myPOS Checkout (real server)
// Requires a .env file with the following variables:
// MYPOS_SID, MYPOS_CLIENT_NUMBER, MYPOS_CURRENCY, MYPOS_OK_URL, MYPOS_CANCEL_URL, MYPOS_NOTIFY_URL
// Optionally, you can store your private key in private_key.txt in the project root.
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const MyPOS = require('../mypos');

describe('Integration: mypos.checkout.purchase (real server)', () => {
  let mypos;

  beforeAll(() => {
    // Prefer env var, fallback to file
    let privateKey = process.env.MYPOS_PRIVATE_KEY;
    if (!privateKey) {
      const keyPath = path.resolve(process.cwd(), 'private_key.txt');
      privateKey = fs.readFileSync(keyPath, 'utf8');
    } else {
      // If using \\n in env, convert to real newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    // DEBUG LOG
    //console.log('Loaded private key:', JSON.stringify(privateKey));
    //console.log('Private key length:', privateKey.length);
    
    mypos = MyPOS({
      isSandbox: true,
      checkout: {
        sid: process.env.MYPOS_SID,
        lang: 'EN',
        currency: process.env.MYPOS_CURRENCY,
        clientNumber: process.env.MYPOS_CLIENT_NUMBER,
        okUrl: process.env.MYPOS_OK_URL,
        cancelUrl: process.env.MYPOS_CANCEL_URL,
        notifyUrl: process.env.MYPOS_NOTIFY_URL,
        cardTokenRequest: 0,
        paymentMethod: 1,
        paymentParametersRequired: 1,
        keyIndex: 1,
        privateKey
      }
    });
  });

  it('should return a real response from the test server', done => {
    const params = {
      amount: 1,
      currency: process.env.MYPOS_CURRENCY,
      customer: {
        email: 'test@example.com',
        firstNames: 'John',
        familyName: 'Doe',
        phone: '1234567890',
        country: 'BG',
        city: 'Sofia',
        zipCode: '1000',
        address: 'Test St 1'
      },
      cartItems: [
        { name: 'Item1', quantity: 1, price: 1 }
      ]
    };

    mypos.checkout.purchase(params, (response) => {
      expect(response).toBeDefined();
      // Add more assertions based on your expected response structure
      done();
    });
  });
}); 