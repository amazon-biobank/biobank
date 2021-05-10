'use strict';

const StateList = require('../../ledger-api/statelist.js');

const OperationPayment = require('./operation-payment.js');

class OperationPaymentList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.operationPaymentList');
        this.use(OperationPayment);
    }

    async addOperationPayment(operationPayment) {
        return this.addState(operationPayment);
    }

    async getOperationPayment(id) {
        const operationPaymentKey = OperationPayment.makeKey([id]);
        return this.getState(operationPaymentKey);
    }

    async updateOperationPayment(operationPayment) {
        return this.updateState(operationPayment);
    }

    async getAllOperationPayment() {
        return this.getStateByRange()
    }
}


module.exports = OperationPaymentList;
