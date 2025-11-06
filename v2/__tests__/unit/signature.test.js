'use strict';

const { generateSignature, generateForm } = require('../../core/signature');
const { MyPOSSignatureError } = require('../../core/errors');

describe('Signature Generation', () => {
  test('should generate signature from params', () => {
    const params = {
      IPCmethod: 'IPCPurchase',
      SID: '000000000000010',
      Amount: 100
    };
    
    const signature = generateSignature(params, MOCK_PRIVATE_KEY);
    
    expect(signature).toBeDefined();
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(0);
  });
  
  test('should generate consistent signatures for same params', () => {
    const params = {
      IPCmethod: 'IPCPurchase',
      SID: '000000000000010',
      Amount: 100
    };
    
    const sig1 = generateSignature(params, MOCK_PRIVATE_KEY);
    const sig2 = generateSignature(params, MOCK_PRIVATE_KEY);
    
    expect(sig1).toBe(sig2);
  });
  
  test('should generate different signatures for different params', () => {
    const params1 = { IPCmethod: 'IPCPurchase', Amount: 100 };
    const params2 = { IPCmethod: 'IPCPurchase', Amount: 200 };
    
    const sig1 = generateSignature(params1, MOCK_PRIVATE_KEY);
    const sig2 = generateSignature(params2, MOCK_PRIVATE_KEY);
    
    expect(sig1).not.toBe(sig2);
  });
  
  test('should throw error with invalid private key', () => {
    const params = { IPCmethod: 'IPCPurchase' };
    
    expect(() => generateSignature(params, 'invalid-key')).toThrow(MyPOSSignatureError);
  });
});

describe('Form Generation', () => {
  test('should generate HTML form', () => {
    const url = 'https://www.mypos.com/vmp/checkout';
    const params = {
      IPCmethod: 'IPCPurchase',
      SID: '000000000000010',
      Amount: 100
    };
    
    const form = generateForm(url, params);
    
    expect(form).toContain('<html>');
    expect(form).toContain('<form');
    expect(form).toContain('action="https://www.mypos.com/vmp/checkout"');
    expect(form).toContain('method="post"');
    expect(form).toContain('document.ipcForm.submit()');
  });
  
  test('should include all parameters as hidden inputs', () => {
    const url = 'https://www.mypos.com/vmp/checkout';
    const params = {
      IPCmethod: 'IPCPurchase',
      SID: '000000000000010',
      Amount: 100
    };
    
    const form = generateForm(url, params);
    
    expect(form).toContain('name="IPCmethod"');
    expect(form).toContain('value="IPCPurchase"');
    expect(form).toContain('name="SID"');
    expect(form).toContain('value="000000000000010"');
    expect(form).toContain('name="Amount"');
    expect(form).toContain('value="100"');
  });
  
  test('should escape HTML special characters in values', () => {
    const url = 'https://www.mypos.com/vmp/checkout';
    const params = {
      Note: '<script>alert("xss")</script>'
    };
    
    const form = generateForm(url, params);
    
    expect(form).not.toContain('<script>');
    expect(form).toContain('&lt;script&gt;');
  });
});

