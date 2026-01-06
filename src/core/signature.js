'use strict';

const NodeRSA = require('node-rsa');
const { MyPOSSignatureError } = require('./errors');

/**
 * Generate RSA signature for IPC parameters
 * @param {Object} params - IPC parameters to sign
 * @param {string} privateKey - RSA private key in PEM format
 * @returns {string} Base64 encoded signature
 * @throws {MyPOSSignatureError} If signature generation fails
 */
function generateSignature(params, privateKey) {
  try {
    // Concatenate all parameter values with '-' separator
    let dataToSign = '';
    
    for (const value of Object.values(params)) {
      dataToSign += `-${value}`;
    }
    
    // Remove leading dash
    dataToSign = dataToSign.substring(1);
    
    // Encode to base64
    const buffer = Buffer.from(dataToSign);
    const base64data = buffer.toString('base64');
    
    // Create RSA key and sign
    const rsaKey = new NodeRSA(privateKey);
    const signature = rsaKey.sign(Buffer.from(base64data), 'base64', 'utf8', 'sha256');
    
    return signature;
  } catch (error) {
    throw new MyPOSSignatureError(
      `Failed to generate signature: ${error.message}`
    );
  }
}

/**
 * Escape HTML attribute value
 * @private
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtmlAttribute(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate HTML form with auto-submit
 * @param {string} url - Action URL for the form
 * @param {Object} params - Form parameters (including signature)
 * @returns {string} HTML form string
 */
function generateForm(url, params) {
  // Escape URL for HTML attribute
  const escapedUrl = escapeHtmlAttribute(url);
  
  let html = '<html><body onload="document.ipcForm.submit()">';
  html += `<form id="ipcForm" name="ipcForm" action="${escapedUrl}" method="post">`;
  
  for (const [key, value] of Object.entries(params)) {
    // Escape HTML special characters in attribute names and values
    const escapedKey = escapeHtmlAttribute(key);
    const escapedValue = escapeHtmlAttribute(value);
    
    html += `<input type="hidden" name="${escapedKey}" value="${escapedValue}"/><br>`;
  }
  
  html += '</form></body></html>';
  return html;
}

module.exports = {
  generateSignature,
  generateForm
};

