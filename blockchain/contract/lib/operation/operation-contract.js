'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Operation = require('./operation.js');
const OperationList = require('./operation-list.js');


class OperationContext extends Context {
    constructor() {
        super();
        this.operationList = new OperationList(this);
    }
}

class OperationContract extends Contract {
    createContext() {
        return new OperationContext();
    }

    async createOperation(ctx, id, operationAttributes) {
        const newOperationAttributes = handleOperationAttributes(id, operationAttributes)
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

function handleOperationAttributes(id, operationAttributes) {
    const { data_id, type, user, transaction_id, created_at, details } = JSON.parse(operationAttributes);
    const newOperationAttributes = {
        id, data_id, type, user, transaction_id, created_at, details
    }
    return newOperationAttributes;
}

module.exports = OperationContract;
