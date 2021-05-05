'use strict';

const Operation = require('./operation.js');
const OperationList = require('./operation-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract')


class OperationContext extends ActiveContext {
    constructor() {
        super();
        this.operationList = new OperationList(this);
    }
}

class OperationContract extends ActiveContract {
    createContext() {
        return new OperationContext();
    }

    async createOperation(ctx, id, operationAttributes) {
        const newOperationAttributes = handleOperationAttributes(ctx, id, operationAttributes)
        const operation = Operation.createInstance(newOperationAttributes);
        await ctx.operationList.addOperation(operation);
        return operation;
    }

    async readOperation(ctx, id) {
        const operation = await ctx.operationList.getOperation(id);
        return operation;
    }

    async getAllOperation(ctx) {
        return await ctx.operationList.getAllOperation();
    }

    async getOperationByData(ctx, dataId) {
        const allOperation = await this.getAllOperation(ctx);
        const filteredOperation = allOperation.filter(function(operation) {
            return operation.data_id == dataId
        })
        return filteredOperation
    }
}

function handleOperationAttributes(ctx, id, operationAttributes) {
    const { type, userAddress, created_at, details, input, output } = JSON.parse(operationAttributes);
    details.transaction_id = ctx.stub.getTxID()
    const newOperationAttributes = {
        id, type, userAddress, created_at, details, input, output
    }
    return newOperationAttributes;
}

module.exports = OperationContract;
