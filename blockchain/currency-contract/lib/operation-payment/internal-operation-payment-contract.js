'use strict';

const OperationPayment = require('./operation-payment.js');
const OperationPaymentContract = require('./operation-payment-contract.js');

class InternalOperationPaymentContract extends OperationPaymentContract {
    async createOperationPayment(ctx, operationPaymentAttributes) {
        const newAccontAttributes = handleOperationPaymentAttributes(operationPaymentAttributes)
        const operationPayment = OperationPayment.createInstance(newAccontAttributes);
        await ctx.operationPaymentList.addOperationPayment(operationPayment);
        return operationPayment;
    }
}

function handleOperationPaymentAttributes(operationPaymentAttributes) {
    const { id, status, created_at } = JSON.parse(operationPaymentAttributes);
    const newOperationPaymentAttributes = {
        id: id, status, created_at
    }
    return newOperationPaymentAttributes;
}

module.exports = InternalOperationPaymentContract;
