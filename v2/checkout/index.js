'use strict';

/**
 * Checkout operations index
 * Exports all 28 checkout operations
 */

// Basic operations
const purchase = require('./purchase');
const refund = require('./refund');
const reversal = require('./reversal');
const getPaymentStatus = require('./get-payment-status');

// Money transfer
const sendMoney = require('./send-money');
const requestMoney = require('./request-money');

// Authorization
const authorization = require('./authorization');
const authorizationCapture = require('./authorization-capture');
const authorizationList = require('./authorization-list');
const authorizationReverse = require('./authorization-reverse');

// Pre-authorization
const preAuthorization = require('./pre-authorization');
const preAuthStatus = require('./pre-auth-status');
const preAuthCompletion = require('./pre-auth-completion');
const preAuthCancellation = require('./pre-auth-cancellation');
const preAuthorizationOK = require('./pre-authorization-ok');
const preAuthorizationNotify = require('./pre-authorization-notify');
const preAuthorizationCancel = require('./pre-authorization-cancel');

// iCard operations
const iaStoreCard = require('./ia-store-card');
const iaStoreCardUpdate = require('./ia-store-card-update');
const iaPurchase = require('./ia-purchase');
const iaPreAuthorization = require('./ia-pre-authorization');
const purchaseByIcard = require('./purchase-by-icard');

// Purchase callbacks
const purchaseOK = require('./purchase-ok');
const purchaseCancel = require('./purchase-cancel');
const purchaseNotify = require('./purchase-notify');
const purchaseRollback = require('./purchase-rollback');

// Advanced
const paymentSessionCreate = require('./payment-session-create');
const mandateManagement = require('./mandate-management');

module.exports = {
  // Basic operations
  purchase,
  refund,
  reversal,
  getPaymentStatus,
  
  // Money transfer
  sendMoney,
  requestMoney,
  
  // Authorization
  authorization,
  authorizationCapture,
  authorizationList,
  authorizationReverse,
  
  // Pre-authorization
  preAuthorization,
  preAuthStatus,
  preAuthCompletion,
  preAuthCancellation,
  preAuthorizationOK,
  preAuthorizationNotify,
  preAuthorizationCancel,
  
  // iCard operations
  iaStoreCard,
  iaStoreCardUpdate,
  iaPurchase,
  iaPreAuthorization,
  purchaseByIcard,
  
  // Purchase callbacks
  purchaseOK,
  purchaseCancel,
  purchaseNotify,
  purchaseRollback,
  
  // Advanced
  paymentSessionCreate,
  mandateManagement
};

