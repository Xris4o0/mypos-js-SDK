'use strict';

const path = require('path');
const fs = require('fs');
const defaults = require('./defaults');
const { validateConfig } = require('./validator');

// Load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not required, continue without it
}

// Cache for loaded config to avoid repeated file reads
let cachedConfig = null;

/**
 * Load configuration from multiple sources with priority:
 * defaults < file (mypos.config.js) < env vars < params
 * 
 * @param {Object} params - Override parameters
 * @returns {Object} Merged and validated configuration
 */
function loadConfig(params = {}) {
  // If params include all required fields, skip caching and just merge
  if (params.sid && params.clientNumber && params.privateKey) {
    const merged = {
      ...defaults,
      ...params,
      environment: params.environment || defaults.environment
    };
    validateConfig(merged);
    return merged;
  }
  
  // Check cache first (only for base config without params)
  if (cachedConfig && Object.keys(params).length === 0) {
    return cachedConfig;
  }
  
  // Load from config file
  const fileConfig = loadConfigFile();
  
  // Determine environment
  const environment = (
    params.environment ||
    fileConfig.environment ||
    process.env.MYPOS_ENVIRONMENT ||
    defaults.environment
  ).toLowerCase();
  
  // Load from environment variables
  const envConfig = loadEnvConfig(environment);
  
  // Merge all sources: defaults < file < env < params
  const merged = {
    ...defaults,
    ...fileConfig,
    ...envConfig,
    ...params,
    environment
  };
  
  // Validate the merged config
  validateConfig(merged);
  
  // Cache if no params were provided
  if (Object.keys(params).length === 0) {
    cachedConfig = merged;
  }
  
  return merged;
}

/**
 * Load configuration from mypos.config.js file
 * @returns {Object} Config from file or empty object
 */
function loadConfigFile() {
  try {
    const configPath = path.resolve(process.cwd(), 'mypos.config.js');
    if (fs.existsSync(configPath)) {
      const fileConfig = require(configPath);
      // Handle nested checkout config (for backward compatibility)
      if (fileConfig.checkout) {
        return {
          ...fileConfig,
          ...fileConfig.checkout,
          sid: fileConfig.checkout.sid || fileConfig.sid,
          clientNumber: fileConfig.checkout.clientNumber || fileConfig.clientNumber,
          privateKey: fileConfig.checkout.privateKey || fileConfig.privateKey,
          successUrl: fileConfig.checkout.successUrl || fileConfig.checkout.okUrl || fileConfig.successUrl,
          cancelUrl: fileConfig.checkout.cancelUrl || fileConfig.cancelUrl,
          notifyUrl: fileConfig.checkout.notifyUrl || fileConfig.notifyUrl
        };
      }
      return fileConfig;
    }
  } catch (e) {
    // Config file not found or error loading, continue with env vars
  }
  return {};
}

/**
 * Load configuration from environment variables
 * @param {string} environment - Current environment (sandbox/production/demo)
 * @returns {Object} Config from env vars
 */
function loadEnvConfig(environment) {
  const envKey = environment.toUpperCase();
  
  // Helper to get environment-specific var with fallback to generic
  function getEnvVar(base) {
    return process.env[`${base}_${envKey}`] || process.env[base];
  }
  
  const config = {
    sid: getEnvVar('MYPOS_SID'),
    clientNumber: getEnvVar('MYPOS_CLIENT_NUMBER'),
    currency: getEnvVar('MYPOS_CURRENCY'),
    keyIndex: getEnvVar('MYPOS_KEY_INDEX'),
    privateKey: loadPrivateKey(environment),
    successUrl: getEnvVar('MYPOS_OK_URL') || getEnvVar('MYPOS_SUCCESS_URL'),
    cancelUrl: getEnvVar('MYPOS_CANCEL_URL'),
    notifyUrl: getEnvVar('MYPOS_NOTIFY_URL'),
    lang: getEnvVar('MYPOS_LANG'),
    version: getEnvVar('MYPOS_VERSION')
  };
  
  // Remove undefined values
  Object.keys(config).forEach(key => {
    if (config[key] === undefined) {
      delete config[key];
    }
  });
  
  return config;
}

/**
 * Load private key from env var or .pem file
 * @param {string} environment - Current environment
 * @returns {string|undefined} Private key or undefined
 */
function loadPrivateKey(environment) {
  const envKey = environment.toUpperCase();
  
  // Try environment variable first
  let privateKey = process.env[`MYPOS_PRIVATE_KEY_${envKey}`] || process.env.MYPOS_PRIVATE_KEY;
  
  if (privateKey) {
    // Replace escaped newlines if key is from env
    return privateKey.replace(/\\n/g, '\n');
  }
  
  // Try environment-specific .pem file
  const envPemPath = path.resolve(process.cwd(), `private_key_${environment}.pem`);
  if (fs.existsSync(envPemPath)) {
    return fs.readFileSync(envPemPath, 'utf8');
  }
  
  // Try generic .pem file
  const defaultPemPath = path.resolve(process.cwd(), 'private_key.pem');
  if (fs.existsSync(defaultPemPath)) {
    return fs.readFileSync(defaultPemPath, 'utf8');
  }
  
  return undefined;
}

/**
 * Clear cached configuration (useful for testing)
 */
function clearCache() {
  cachedConfig = null;
}

module.exports = {
  loadConfig,
  clearCache
};

