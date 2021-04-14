'use strict';

const State = require('../../ledger-api/state.js');


class Operation extends State {
    constructor(obj) {
        super(Operation.getClass(), [obj.id]);
        Object.assign(this, obj);
    }

    getOwners() {
        return this.owners;
    }

    setOwners(newOwners) {
        this.owners = newOwners;
    }


    static fromBuffer(buffer) {
        return Operation.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(operation) {
        return State.deserializeClass(operation, Operation);
    }

    static createInstance(operationAttributes) {
      return new Operation(operationAttributes);
    }

    static getClass() {
        return 'org.operation';
    }
}

module.exports = Operation;
