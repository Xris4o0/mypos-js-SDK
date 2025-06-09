// src/index.js
// Main entry point for the new user-friendly myPOS SDK interface

module.exports = {
  purchase: require('./checkout/purchase'),
  refund: require('./checkout/refund'),
  sendMoney: require('./checkout/send-money'),
  reversal: require('./checkout/reversal'),
  requestMoney: require('./checkout/request-money'),
  purchaseByIcard: require('./checkout/purchase-by-icard'),
  purchaseCancel: require('./checkout/purchase-cancel'),
  purchaseNotify: require('./checkout/purchase-notify'),
  purchaseOK: require('./checkout/purchase-ok'),
  purchaseRollback: require('./checkout/purchase-rollback'),
  preAuthorization: require('./checkout/pre-authorization'),
  preAuthorizationOK: require('./checkout/pre-authorization-ok'),
  preAuthorizationNotify: require('./checkout/pre-authorization-notify'),
  preAuthorizationCancel: require('./checkout/pre-authorization-cancel'),
  preAuthStatus: require('./checkout/pre-auth-status'),
  preAuthCompletion: require('./checkout/pre-auth-completion'),
  preAuthCancellation: require('./checkout/pre-auth-cancellation'),
  paymentSessionCreate: require('./checkout/payment-session-create'),
  mandateManagment: require('./checkout/mandate-managment'),
  iaStoreCard: require('./checkout/ia-store-card'),
  iaStoreCardUpdate: require('./checkout/ia-store-card-update'),
  iaPurchase: require('./checkout/ia-purchase'),
  iaPreAuthorization: require('./checkout/ia-pre-authorization'),
  authorization: require('./checkout/authorization'),
  authorizationCapture: require('./checkout/authorization-capture'),
  authorizationReverse: require('./checkout/authorization-reverse'),
  authorizationList: require('./checkout/authorization-list'),
  getPaymentStatus: require('./checkout/get-payment-status'),
};

// Default export for convenience
module.exports.default = module.exports; 