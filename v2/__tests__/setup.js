'use strict';

/**
 * Test setup and mocks
 * Uses real myPOS Sandbox credentials for testing
 */

// Real Sandbox private key for testing
global.MOCK_PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----MIICXAIBAAKBgQCf0TdcTuphb7X+Zwekt1XKEWZDczSGecfo6vQfqvraf5VPzcnJ2Mc5J72HBm0u98EJHan+nle2WOZMVGItTa/2k1FRWwbt7iQ5dzDh5PEeZASg2UWehoR8L8MpNBqH6h7ZITwVTfRS4LsBvlEfT7Pzhm5YJKfM+CdzDM+L9WVEGwIDAQABAoGAYfKxwUtEbq8ulVrD3nnWhF+hk1k6KejdUq0dLYN29w8WjbCMKb9IaokmqWiQ5iZGErYxh7G4BDP8AW/+M9HXM4oqm5SEkaxhbTlgks+E1s9dTpdFQvL76TvodqSyl2E2BghVgLLgkdhRn9buaFzYta95JKfgyKGonNxsQA39PwECQQDKbG0Kp6KEkNgBsrCq3Cx2od5OfiPDG8g3RYZKx/O9dMy5CM160DwusVJpuywbpRhcWr3gkz0QgRMdIRVwyxNbAkEAyh3sipmcgN7SD8xBG/MtBYPqWP1vxhSVYPfJzuPU3gS5MRJzQHBzsVCLhTBY7hHSoqiqlqWYasi81JzBEwEuQQJBAKw9qGcZjyMH8JU5TDSGllr3jybxFFMPj8TgJs346AB8ozqLL/ThvWPpxHttJbH8QAdNuyWdg6dIfVAa95h7Y+MCQEZgjRDl1Bz7eWGO2c0Fq9OTz3IVLWpnmGwfW+HyaxizxFhV+FOj1GUVir9hylV7V0DUQjIajyv/oeDWhFQ9wQECQCydhJ6NaNQOCZh+6QTrH3TC5MeBA1Yeipoe7+BhsLNrcFG8s9sTxRnltcZl1dXaBSemvpNvBizn0Kzi8G3ZAgc=-----END RSA PRIVATE KEY-----';

// Real Sandbox public key (for reference)
global.MOCK_PUBLIC_KEY = '-----BEGIN CERTIFICATE-----MIIBsTCCARoCCQCCPjNttGNQWDANBgkqhkiG9w0BAQsFADAdMQswCQYDVQQGEwJCRzEOMAwGA1UECgwFbXlQT1MwHhcNMTgxMDEyMDcwOTEzWhcNMjgxMDA5MDcwOTEzWjAdMQswCQYDVQQGEwJCRzEOMAwGA1UECgwFbXlQT1MwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAML+VTmiY4yChoOTMZTXAIG/mk+xf/9mjwHxWzxtBJbNncNK0OLI0VXYKW2GgVklGHHQjvew1hTFkEGjnCJ7f5CDnbgxevtyASDGst92a6xcAedEadP0nFXhUz+cYYIgIcgfDcX3ZWeNEF5kscqy52kpD2O7nFNCV+85vS4duJBNAgMBAAEwDQYJKoZIhvcNAQELBQADgYEACj0xb+tNYERJkL+p+zDcBsBK4RvknPlpk+YPephunG2dBGOmg/WKgoD1PLWD2bEfGgJxYBIg9r1wLYpDC1txhxV+2OBQS86KULh0NEcr0qEY05mI4FlE+D/BpT/+WFyKkZug92rK0Flz71Xy/9mBXbQfm+YK6l9roRYdJ4sHeQc=-----END CERTIFICATE-----';

// Sandbox configuration
global.MOCK_CONFIG = {
  environment: 'sandbox',
  sid: '000000000000010',
  clientNumber: '61938166610',
  privateKey: global.MOCK_PRIVATE_KEY,
  currency: 'EUR',
  keyIndex: 1,
  successUrl: 'http://localhost:3000/success',
  cancelUrl: 'http://localhost:3000/cancel',
  notifyUrl: 'http://localhost:3000/notify',
  lang: 'EN',
  version: '1.4'
};

// Mock cart items
global.MOCK_CART = [
  { name: 'Product 1', price: 50, quantity: 1 },
  { name: 'Product 2', price: 30, quantity: 2 }
];

// Mock customer
global.MOCK_CUSTOMER = {
  email: 'test@example.com',
  firstNames: 'John',
  familyName: 'Doe',
  phone: '+1234567890'
};

// Clear config cache before each test
beforeEach(() => {
  const { clearCache } = require('../config');
  clearCache();
});

