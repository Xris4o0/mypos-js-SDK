'use strict';

/**
 * Simple logger utility
 * Can be extended with more sophisticated logging in the future
 */

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

let currentLevel = LOG_LEVELS.info;

/**
 * Set log level
 * @param {string} level - Log level (debug, info, warn, error)
 */
function setLogLevel(level) {
  if (LOG_LEVELS[level] !== undefined) {
    currentLevel = LOG_LEVELS[level];
  }
}

/**
 * Log debug message
 * @param {string} message - Message to log
 * @param {*} data - Optional data to log
 */
function debug(message, data) {
  if (currentLevel <= LOG_LEVELS.debug) {
    console.log(`[DEBUG] ${message}`, data !== undefined ? data : '');
  }
}

/**
 * Log info message
 * @param {string} message - Message to log
 * @param {*} data - Optional data to log
 */
function info(message, data) {
  if (currentLevel <= LOG_LEVELS.info) {
    console.log(`[INFO] ${message}`, data !== undefined ? data : '');
  }
}

/**
 * Log warning message
 * @param {string} message - Message to log
 * @param {*} data - Optional data to log
 */
function warn(message, data) {
  if (currentLevel <= LOG_LEVELS.warn) {
    console.warn(`[WARN] ${message}`, data !== undefined ? data : '');
  }
}

/**
 * Log error message
 * @param {string} message - Message to log
 * @param {*} error - Optional error object
 */
function error(message, error) {
  if (currentLevel <= LOG_LEVELS.error) {
    console.error(`[ERROR] ${message}`, error !== undefined ? error : '');
  }
}

module.exports = {
  setLogLevel,
  debug,
  info,
  warn,
  error
};

