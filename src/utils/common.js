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

module.exports = {
  safeVal,
  generateOrderId,
  roundAmount,
  formatAmount
};

