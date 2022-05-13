'use strict';

const AccountContract = require('./lib/account/account-contract');
const BiocoinContract = require('./lib/biocoin/biocoin-contract');
const OperationPaymentContract = require('./lib/operation-payment/operation-payment-contract');
const EscrowTokenContract = require('./lib/token/escrow-token-contract');
const ProcessTokenContract = require('./lib/token/process-token-contract')
const PaymentIntentionContract = require('./lib/payment-intention/payment-intention-contract');
const PaymentRedeemContract = require('./lib/payment-redeem/payment-redeem-contract');
const RedeemContract = require('./lib/payment-redeem/redeem-contract');


module.exports.AccountContract = AccountContract;
module.exports.BiocoinContract = BiocoinContract;
module.exports.OperationPaymentContract = OperationPaymentContract;
module.exports.EscrowTokenContract = EscrowTokenContract;
module.exports.ProcessTokenContract = ProcessTokenContract;
module.exports.PaymentIntentionContract = PaymentIntentionContract;
module.exports.PaymentRedeemContract = PaymentRedeemContract;
module.exports.RedeemContract = RedeemContract;

module.exports.contracts = [ AccountContract, BiocoinContract, OperationPaymentContract, EscrowTokenContract, ProcessTokenContract,PaymentIntentionContract, PaymentRedeemContract, RedeemContract ];
