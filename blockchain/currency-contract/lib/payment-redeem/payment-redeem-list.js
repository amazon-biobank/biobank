'use strict';

const StateList = require('../../ledger-api/statelist.js');

const PaymentRedeem = require('./payment-redeem.js');

class PaymentRedeemList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.paymentRedeemList');
        this.use(PaymentRedeem);
    }

    async addPaymentRedeem(paymentRedeem) {
        return this.addState(paymentRedeem);
    }

    async getPaymentRedeem(id) {
        const paymentRedeemKey = PaymentRedeem.makeKey([id]);
        return this.getState(paymentRedeemKey);
    }

    async updatePaymentRedeem(paymentRedeem) {
        return this.updateState(paymentRedeem);
    }

    async getAllPaymentRedeem() {
        return this.getStateByRange()
    }
}


module.exports = PaymentRedeemList;
