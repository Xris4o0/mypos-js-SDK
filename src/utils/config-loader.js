// utils/config-loader.js
// Hybrid config loader for myPOS SDK
// Supports environment-specific API keys, SID, Client Number, and URLs
// Usage: const config = loadConfig({ ...overrides })
//
// .env example:
// MYPOS_ENVIRONMENT=sandbox
// MYPOS_API_KEY_SANDBOX=...
// MYPOS_SID_SANDBOX=...
// MYPOS_CLIENT_NUMBER_SANDBOX=...
// MYPOS_SUCCESS_URL_SANDBOX=...
// MYPOS_CANCEL_URL_SANDBOX=...
// (repeat for DEMO and PRODUCTION)

const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Loads .env if present

const DEFAULTS = {
  environment: 'sandbox',
  successUrl: '',
  cancelUrl: ''
};

function loadConfig(override = {}) {
  let fileConfig = {};
  try {
    const configPath = path.resolve(process.cwd(), 'mypos.config.js');
    if (fs.existsSync(configPath)) {
      fileConfig = require(configPath);
    }
  } catch (e) {
    // Ignore file errors, fallback to env
  }

  // Determine environment
  const env = (override.environment || fileConfig.environment || process.env.MYPOS_ENVIRONMENT || 'sandbox').toLowerCase();
  const envKey = env.toUpperCase();

  // Helper to get env var with fallback
  function getEnvVar(base) {
    return process.env[`${base}_${envKey}`] || process.env[base];
  }

  const envConfig = {
    sid: getEnvVar('MYPOS_SID'),
    clientNumber: getEnvVar('MYPOS_CLIENT_NUMBER'),
    currency: getEnvVar('MYPOS_CURRENCY'),
    keyIndex: getEnvVar('MYPOS_KEY_INDEX'),
    privateKey: getEnvVar('MYPOS_PRIVATE_KEY'),
    successUrl: getEnvVar('MYPOS_OK_URL'),
    cancelUrl: getEnvVar('MYPOS_CANCEL_URL'),
    notifyUrl: getEnvVar('MYPOS_NOTIFY_URL'),
    environment: env
  };

  // Merge: defaults < file < env < override
  const merged = {
    ...DEFAULTS,
    ...fileConfig,
    ...envConfig,
    ...override
  };

  // Validate required fields
  if (!merged.sid) throw new Error('MYPOS_SID is required for environment: ' + env);
  if (!merged.clientNumber) throw new Error('MYPOS_CLIENT_NUMBER is required for environment: ' + env);

  // Default currency if not set
  if (!merged.currency) merged.currency = 'EUR';

  return merged;
}

module.exports = { loadConfig }; 