'use strict';

// Checkout
const CheckoutAuthorizationCaptureRequest = require('./resources/checkout/authorization-capture');
const CheckoutAuthorizationListRequest = require('./resources/checkout/authorization-list');
const CheckoutAuthorizationReverseRequest = require('./resources/checkout/authorization-reverse');
const CheckoutAuthorizationRequest = require('./resources/checkout/authorization');
const CheckoutGetPaymentStatusRequest = require('./resources/checkout/get-payment-status');
const CheckoutIAPreAuthorizationRequest = require('./resources/checkout/ia-pre-authorization');
const CheckoutIAPurchaseRequest = require('./resources/checkout/ia-purchase');
const CheckoutIAStoreCardUpdateRequest = require('./resources/checkout/ia-store-card-update');
const CheckoutIAStoreCardRequest = require('./resources/checkout/ia-store-card');
const CheckoutMandateManagmentRequest = require('./resources/checkout/mandate-managment');
const CheckoutPaymentSessionCreateRequest = require('./resources/checkout/payment-session-create');
const CheckoutPreAuthCancellationRequest = require('./resources/checkout/pre-auth-cancellation');
const CheckoutPreAuthCompletionRequest = require('./resources/checkout/pre-auth-completion');
const CheckoutPreAuthStatusRequest = require('./resources/checkout/pre-auth-status');
const CheckoutPreAuthorizationCancelRequest = require('./resources/checkout/pre-authorization-cancel');
const CheckoutPreAuthorizationNotifyRequest = require('./resources/checkout/pre-authorization-notify');
const CheckoutPreAuthorizationOKRequest = require('./resources/checkout/pre-authorization-ok');
const CheckoutPreAuthorizationRequest = require('./resources/checkout/pre-authorization');
const CheckoutPurchaseByIcardRequest = require('./resources/checkout/purchase-by-icard');
const CheckoutPurchaseCancelRequest = require('./resources/checkout/purchase-cancel');
const CheckoutPurchaseNotifyRequest = require('./resources/checkout/purchase-notify');
const CheckoutPurchaseOKRequest = require('./resources/checkout/purchase-ok');
const CheckoutPurchaseRollbackRequest = require('./resources/checkout/purchase-rollback');
const CheckoutPurchaseRequest = require('./resources/checkout/purchase');
const CheckoutRefundRequest = require('./resources/checkout/refund');
const CheckoutRequestMoneyRequest = require('./resources/checkout/request-money');
const CheckoutReversalRequest = require('./resources/checkout/reversal');
const CheckoutSendMoneyRequest = require('./resources/checkout/send-money');

// Devices
const ListDevicesRequest = require('./resources/devices/list-devices');
const GetDeviceDetailsRequest = require('./resources/devices/get-device-details');

// Device Transactions
const ListDeviceTransactionsRequest = require('./resources/devices/transactions/list-device-transactions');
const ListDevicesTransactionsRequest = require('./resources/devices/transactions/list-devices-transactions');

// Transactions
const ListTransactionsRequest = require('./resources/transactions/list-transactions');
const GetTransactionDetailsRequest = require('./resources/transactions/get-transaction-details');

// Accounts
const ListAccountsRequest = require('./resources/accounts/list-accounts');

// Web Hooks (CRUD)
const ListWebHooksRequest = require('./resources/webHooks/list-webhooks');
const GetWebHooksDetailsRequest = require('./resources/webHooks/get-webhook-details');
const CreateWebHookRequest = require('./resources/webHooks/create-webhook');
const UpdateWebHookRequest = require('./resources/webHooks/update-webhook');
const DeleteWebHookRequest = require('./resources/webHooks/delete-webhook');

// Web Hook Events
const ListWebHookEventsRequest = require('./resources/webHooks/events/list-webhook-events');

// Web Hook Event Subscriptions
const ListWebHookSubscriptionsRequest = require('./resources/webHooks/subscriptions/list-webhook-subscriptions');
const GetWebHookSubscriptionDetailsRequest = require('./resources/webHooks/subscriptions/get-webhook-subscription-details');
const CreateWebHookSubscriptionsRequest = require('./resources/webHooks/subscriptions/create-webhook-subscription');
const DeleteWebHookSubscriptionsRequest = require('./resources/webHooks/subscriptions/delete-webhook-subscription');


module.exports = (mypos) => {
    mypos.checkout = {
        authorizationCapture: (params, response) => {
            new CheckoutAuthorizationCaptureRequest(mypos, params).send(response);
        },
        
        authorizationList: (params, response) => {
            new CheckoutAuthorizationListRequest(mypos, params).send(response);
        },
        
        authorizationReverse: (params, response) => {
            new CheckoutAuthorizationReverseRequest(mypos, params).send(response);
        },
        
        authorization: (params, response) => {
            new CheckoutAuthorizationRequest(mypos, params).send(response);
        },

        getPaymentStatus: (params, callback) => {
            new CheckoutGetPaymentStatusRequest(mypos, params).send(callback);
        },

        iaPreAuthorization: (params, response) => {
            new CheckoutIAPreAuthorizationRequest(mypos, params).send(response);
        },

        iaPurchase: (params, response) => {
            new CheckoutIAPurchaseRequest(mypos, params).send(response);
        },

        iaStoreCardUpdate: (params, response) => {
            new CheckoutIAStoreCardUpdateRequest(mypos, params).send(response);
        },

        iaStoreCard: (params, response) => {
            new CheckoutIAStoreCardRequest(mypos, params).send(response);
        },

        mandateManagment: (params, response) => {
            new CheckoutMandateManagmentRequest(mypos, params).send(response);
        },

        paymentSessionCreate: (params, response) => {
            new CheckoutPaymentSessionCreateRequest(mypos, params).send(response);
        },

        preAuthCancellation: (params, response) => {
            new CheckoutPreAuthCancellationRequest(mypos, params).send(response);
        },

        preAuthCompletion: (params, response) => {
            new CheckoutPreAuthCompletionRequest(mypos, params).send(response);
        },

        preAuthStatus: (params, response) => {
            new CheckoutPreAuthStatusRequest(mypos, params).send(response);
        },
        
        preAuthorizationCancel: (params, response) => {
            new CheckoutPreAuthorizationCancelRequest(mypos, params).send(response);
        },
        
        preAuthorizationNotify: (params, response) => {
            new CheckoutPreAuthorizationNotifyRequest(mypos, params).send(response);
        },
        
        preAuthorizationOK: (params, response) => {
            new CheckoutPreAuthorizationOKRequest(mypos, params).send(response);
        },
        
        preAuthorization: (params, response) => {
            new CheckoutPreAuthorizationRequest(mypos, params).send(response);
        },
        
        purchaseByIcard: (params, response) => {
            new CheckoutPurchaseByIcardRequest(mypos, params).send(response);
        },
        
        purchaseCancel: (params, response) => {
            new CheckoutPurchaseCancelRequest(mypos, params).send(response);
        },

        preAuthorization: (params, response) => {
            new CheckoutPurchaseNotifyRequest(mypos, params).send(response);
        },

        purchaseOK: (params, response) => {
            new CheckoutPurchaseOKRequest(mypos, params).send(response);
        },

        purchaseRollback: (params, response) => {
            new CheckoutPurchaseRollbackRequest(mypos, params).send(response);
        },

        purchase: (params, response) => {
            new CheckoutPurchaseRequest(mypos, params).send(response);
        },

        refund: (params, callback) => {
            new CheckoutRefundRequest(mypos, params).send(callback);
        },

        requestMoney: (params, callback) => {
            new CheckoutRequestMoneyRequest(mypos, params).send(callback);
        },

        reversal: (params, callback) => {
            new CheckoutReversalRequest(mypos, params).send(callback);
        },

        sendMoney: (params, callback) => {
            new CheckoutSendMoneyRequest(mypos, params).send(callback);
        },

    };

    mypos.devices = {
        list: (params, callback) => {
            new ListDevicesRequest(mypos, params).send(callback);
        },

        get: (terminalId, callback) => {
            new GetDeviceDetailsRequest(mypos, terminalId).send(callback);
        },

        transactions: {
            get: (terminalId, params, callback) => {
                new ListDeviceTransactionsRequest(mypos, terminalId, params).send(callback);
            },
            list: (params, callback) => {
                new ListDevicesTransactionsRequest(mypos, params).send(callback);
            },
        },
    };

    mypos.transactions = {
        list: (params, callback) => {
            new ListTransactionsRequest(mypos, params).send(callback);
        },
        get: (trnRef, callback) => {
            new GetTransactionDetailsRequest(mypos, trnRef).send(callback);
        },
    };

    mypos.accounts = {
        list: (params, callback) => {
            new ListAccountsRequest(mypos, params).send(callback);
        }
    };

    mypos.webhooks = {
        list: (params, callback) => {
            new ListWebHooksRequest(mypos, params).send(callback);
        },

        details: (webHookId, callback) => {
            new GetWebHooksDetailsRequest(mypos, webHookId).send(callback);
        },

        create: (payloadUrl, secret, callback) => {
            new CreateWebHookRequest(mypos, payloadUrl, secret).send(callback);
        },

        update: (webHookId, payloadUrl, secret, isActive, callback) => {
            new UpdateWebHookRequest(mypos, webHookId, payloadUrl, secret, isActive).send(callback);
        },

        delete: (webHookId, callback) => {
            new DeleteWebHookRequest(mypos, webHookId).send(callback);
        },

        events: {
            list: (params, callback) => {
                new ListWebHookEventsRequest(mypos, params).send(callback);
            }
        },

        subscriptions: {
            list: (params, callback) => {
                new ListWebHookSubscriptionsRequest(mypos, params).send(callback);
            },

            details: (webHookSubscriptionId, callback) => {
                new GetWebHookSubscriptionDetailsRequest(mypos, webHookSubscriptionId).send(callback);
            },

            create: (webHookId, webHookEventId, callback, filter=undefined) => {
                new CreateWebHookSubscriptionsRequest(mypos, webHookId, webHookEventId, filter).send(callback);
            },

            delete: (webHookSubscriptionId, callback) => {
                new DeleteWebHookSubscriptionsRequest(mypos, webHookSubscriptionId).send(callback);
            }
        }
    }
};
