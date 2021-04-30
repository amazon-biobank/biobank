'use strict';

const OperationPaymentList = require('./operation-payment-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract')

class OperationPaymentContext extends ActiveContext {
    constructor() {
        super();
        this.operationPaymentList = new OperationPaymentList(this);
    }
}


class OperationPaymentContract extends ActiveContract {
    createContext() {
        return new OperationPaymentContext();
    }

    async readOperationPayment(ctx, id) {
        const operationPayment = await ctx.operationPaymentList.getOperationPayment(id);
        return operationPayment;
    }
}

module.exports = OperationPaymentContract;
