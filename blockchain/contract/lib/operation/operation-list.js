'use strict';

const StateList = require('../../ledger-api/statelist.js');

const Operation = require('./operation.js');

class OperationList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.operationList');
        this.use(Operation);
    }

    async addOperation(operation) {
        return this.addState(operation);
    }

    async getOperation(id) {
        const operationKey = Operation.makeKey([id]);
        return this.getState(operationKey);
    }

    async getAllOperation() {
        return this.getStateByRange()
    }
}


module.exports = OperationList;
