'use strict';

const StateList = require('../../ledger-api/statelist.js');

const PaymentIntention = require('./payment-intention.js');

class PaymentIntentionList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.paymentIntentionList');
        this.use(PaymentIntention);
    }

    async addPaymentIntention(paymentIntention) {
        return this.addState(paymentIntention);
    }

    async getPaymentIntention(id) {
        const paymentIntentionKey = PaymentIntention.makeKey([id]);
        return this.getState(paymentIntentionKey);
    }

    async updatePaymentIntention(paymentIntention) {
        return this.updateState(paymentIntention);
    }

    async getAllPaymentIntention() {
        return this.getStateByRange()
    }
}


module.exports = PaymentIntentionList;
