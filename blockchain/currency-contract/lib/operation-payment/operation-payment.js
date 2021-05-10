'use strict';

const State = require('../../ledger-api/state.js');


class OperationPayment extends State {
    constructor(obj) {
        super(OperationPayment.getClass(), [obj.id]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */

    static fromBuffer(buffer) {
        return OperationPayment.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state OperationPayment to commercial paper
     * @param {Buffer} OperationPayment to form back into the object
     */
    static deserialize(operationPayment) {
        return State.deserializeClass(operationPayment, OperationPayment);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(operationPaymentAttributes) {
      return new OperationPayment(operationPaymentAttributes);
    }

    static getClass() {
        return 'org.operationPayment';
    }
}

module.exports = OperationPayment;
