'use strict';

/**
 * Common utility functions
 */

/**
 * Safe value getter - returns safe default if value is null/undefined/empty
 * @param {*} val - Value to check
 * @param {*} safe - Safe default value
 * @returns {*} Original value or safe default
 */
function safeVal(val, safe) {
  return (val === undefined || val === null || val === '') ? safe : val;
}

/**
 * Generate a unique order ID
 * @returns {string} UUID v4
 */
function generateOrderId() {
  const { v4: uuidv4 } = require('uuid');
  return uuidv4();
}

/**
 * Round amount to 2 decimal places
 * @param {number} amount - Amount to round
 * @returns {number} Rounded amount
 */
function roundAmount(amount) {
  return Math.round(amount * 100) / 100;
}

/**
 * Format amount for display (2 decimal places)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
function formatAmount(amount) {
  return roundAmount(amount).toFixed(2);
}

/**
 * Normalize customer object to use consistent field names
 * Accepts both firstName/firstNames and lastName/familyName
 * @param {Object} customer - Customer object with various field name conventions
 * @returns {Object} Normalized customer object with firstNames and familyName
 */
function normalizeCustomer(customer) {
  if (!customer || typeof customer !== 'object') {
    return customer;
  }
  
  const normalized = { ...customer };
  
  // Normalize first name: accept firstName or firstNames
  if (normalized.firstName && !normalized.firstNames) {
    normalized.firstNames = normalized.firstName;
    delete normalized.firstName;
  }
  
  // Normalize last name: accept lastName or familyName
  if (normalized.lastName && !normalized.familyName) {
    normalized.familyName = normalized.lastName;
    delete normalized.lastName;
  }
  
  return normalized;
}

module.exports = {
  safeVal,
  generateOrderId,
  roundAmount,
  formatAmount,
  normalizeCustomer
};

