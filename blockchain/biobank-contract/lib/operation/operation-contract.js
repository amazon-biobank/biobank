'use strict';

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

    async readOperation(ctx, id) {
        const operation = await ctx.operationList.getOperation(id);
        return operation;
    }

    async operationExists(ctx, id){
        const operation = await ctx.operationList.getOperation(id);
        return (operation != undefined)
    }

    async getAllOperation(ctx) {
        return await ctx.operationList.getAllOperation();
    }

    async getOperationByData(ctx, dataId) {
        const allOperation = await this.getAllOperation(ctx);
        const filteredOperation = allOperation.filter(function(operation) {
            return operation.details.data_id == dataId
        })
        return filteredOperation
    }
}

module.exports = OperationContract;
