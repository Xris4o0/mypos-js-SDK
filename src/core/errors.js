'use strict';

/**
 * Base error class for myPOS SDK errors
 */
class MyPOSError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Configuration-related errors
 * Thrown when SDK configuration is invalid or missing
 */
class MyPOSConfigError extends MyPOSError {
  constructor(message) {
    super(message, 'CONFIG_ERROR');
  }
}

/**
 * Parameter validation errors
 * Thrown when required parameters are missing or invalid
 */
class MyPOSValidationError extends MyPOSError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }
}

/**
 * Signature generation errors
 * Thrown when RSA signature generation fails
 */
class MyPOSSignatureError extends MyPOSError {
  constructor(message) {
    super(message, 'SIGNATURE_ERROR');
  }
}

module.exports = {
  MyPOSError,
  MyPOSConfigError,
  MyPOSValidationError,
  MyPOSSignatureError
};

