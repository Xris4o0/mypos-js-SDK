const MyPOS = require('../mypos');

const checkoutMethods = [
  // method, class, path, minimal params
  ['authorization', 'CheckoutAuthorizationRequest', '../resources/checkout/authorization', { amount: 1, currency: 'EUR' }],
  ['authorizationCapture', 'CheckoutAuthorizationCaptureRequest', '../resources/checkout/authorization-capture', { amount: 1, currency: 'EUR' }],
  ['authorizationList', 'CheckoutAuthorizationListRequest', '../resources/checkout/authorization-list', {}],
  ['authorizationReverse', 'CheckoutAuthorizationReverseRequest', '../resources/checkout/authorization-reverse', { amount: 1, currency: 'EUR' }],
  ['getPaymentStatus', 'CheckoutGetPaymentStatusRequest', '../resources/checkout/get-payment-status', {}],
  ['iaPreAuthorization', 'CheckoutIAPreAuthorizationRequest', '../resources/checkout/ia-pre-authorization', { amount: 1, currency: 'EUR', customer: {}, cartItems: [] }],
  ['iaPurchase', 'CheckoutIAPurchaseRequest', '../resources/checkout/ia-purchase', { amount: 1, currency: 'EUR', customer: {}, cartItems: [] }],
  ['iaStoreCard', 'CheckoutIAStoreCardRequest', '../resources/checkout/ia-store-card', { customer: {} }],
  ['iaStoreCardUpdate', 'CheckoutIAStoreCardUpdateRequest', '../resources/checkout/ia-store-card-update', { CardToken: 'token' }],
  ['mandateManagement', 'CheckoutMandateManagmentRequest', '../resources/checkout/mandate-managment', {}],
  ['paymentSessionCreate', 'CheckoutPaymentSessionCreateRequest', '../resources/checkout/payment-session-create', { amount: 1, currency: 'EUR', cartItems: [], customer: {} }],
  ['preAuthCancellation', 'CheckoutPreAuthCancellationRequest', '../resources/checkout/pre-auth-cancellation', {}],
  ['preAuthCompletion', 'CheckoutPreAuthCompletionRequest', '../resources/checkout/pre-auth-completion', { amount: 1, currency: 'EUR' }],
  ['preAuthStatus', 'CheckoutPreAuthStatusRequest', '../resources/checkout/pre-auth-status', {}],
  ['preAuthorization', 'CheckoutPreAuthorizationRequest', '../resources/checkout/pre-authorization', { amount: 1, currency: 'EUR', customer: {}, cartItems: [] }],
  ['preAuthorizationCancel', 'CheckoutPreAuthorizationCancelRequest', '../resources/checkout/pre-authorization-cancel', { amount: 1, currency: 'EUR' }],
  ['preAuthorizationNotify', 'CheckoutPreAuthorizationNotifyRequest', '../resources/checkout/pre-authorization-notify', { amount: 1, currency: 'EUR' }],
  ['preAuthorizationOK', 'CheckoutPreAuthorizationOKRequest', '../resources/checkout/pre-authorization-ok', { amount: 1, currency: 'EUR' }],
  ['purchase', 'CheckoutPurchaseRequest', '../resources/checkout/purchase', { amount: 1, currency: 'EUR', customer: {}, cartItems: [] }],
  ['purchaseByIcard', 'CheckoutPurchaseByIcardRequest', '../resources/checkout/purchase-by-icard', { amount: 1, currency: 'EUR', customer: {}, cartItems: [] }],
  ['purchaseCancel', 'CheckoutPurchaseCancelRequest', '../resources/checkout/purchase-cancel', { amount: 1, currency: 'EUR' }],
  ['purchaseNotify', 'CheckoutPurchaseNotifyRequest', '../resources/checkout/purchase-notify', { amount: 1, currency: 'EUR', customer: {}, cartItems: [] }],
  ['purchaseOK', 'CheckoutPurchaseOKRequest', '../resources/checkout/purchase-ok', { amount: 1, currency: 'EUR', customer: {}, cartItems: [] }],
  ['purchaseRollback', 'CheckoutPurchaseRollbackRequest', '../resources/checkout/purchase-rollback', { amount: 1, currency: 'EUR' }],
  ['refund', 'CheckoutRefundRequest', '../resources/checkout/refund', { amount: 1, currency: 'EUR', trnRef: 'ref' }],
  ['requestMoney', 'CheckoutIPCRequestMoneyRequest', '../resources/checkout/request-money', { customer: { WalletNumber: 'w' }, amount: 1, currency: 'EUR' }],
  ['reversal', 'CheckoutReversalRequest', '../resources/checkout/reversal', { amount: 1, currency: 'EUR', trnRef: 'ref' }],
  ['sendMoney', 'CheckoutIPCSendMoneyRequest', '../resources/checkout/send-money', { customer: { walletNumber: 'w' }, amount: 1, currency: 'EUR' }],
];

checkoutMethods.forEach(([method, className, classPath, params]) => {
  jest.mock(classPath, () => {
    return jest.fn().mockImplementation(() => ({
      send: jest.fn()
    }));
  });
});

describe('mypos.checkout', () => {
  let mypos;
  let callback;

  beforeEach(() => {
    mypos = MyPOS({
      checkout: {
        privateKey: 'dummy',
        keyIndex: 1,
        lang: 'EN',
        version: '1.4',
        sid: 'sid',
        clientNumber: 'client',
        currency: 'EUR',
        okUrl: 'ok',
        cancelUrl: 'cancel',
        notifyUrl: 'notify',
        cardTokenRequest: 0,
        paymentMethod: 1,
        paymentParametersRequired: 1
      }
    });
    callback = jest.fn();
  });

  checkoutMethods.forEach(([method, className, classPath, params]) => {
    const RequestClass = require(classPath);
    it(`.${method} should instantiate ${className} and call send with callback`, () => {
      mypos.checkout[method](params, callback);
      expect(RequestClass).toHaveBeenCalledWith(mypos, params);
      const instance = RequestClass.mock.results[0].value;
      expect(instance.send).toHaveBeenCalledWith(callback);
    });
  });
}); 