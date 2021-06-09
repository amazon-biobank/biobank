'use strict';

const AccountContract = require('./lib/account/account-contract');
const BiocoinContract = require('./lib/biocoin/biocoin-contract');
const OperationPaymentContract = require('./lib/operation-payment/operation-payment-contract');
const TokenContract = require('./lib/token/token-contract');
const PaymentIntentionContract = require('./lib/payment-intention/payment-intention-contract');



module.exports.AccountContract = AccountContract;
module.exports.BiocoinContract = BiocoinContract;
module.exports.OperationPaymentContract = OperationPaymentContract;
module.exports.TokenContract = TokenContract;
module.exports.PaymentIntentionContract = PaymentIntentionContract;

module.exports.contracts = [ AccountContract, BiocoinContract, OperationPaymentContract, TokenContract, PaymentIntentionContract ];
