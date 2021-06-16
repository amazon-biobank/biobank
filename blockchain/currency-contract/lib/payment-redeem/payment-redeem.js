'use strict';

const State = require('../../ledger-api/state.js');


class PaymentRedeem extends State {
    constructor(obj) {
        super(PaymentRedeem.getClass(), [obj.id]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */

    static fromBuffer(buffer) {
        return PaymentRedeem.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state PaymentRedeem to commercial paper
     * @param {Buffer} PaymentRedeem to form back into the object
     */
    static deserialize(paymentRedeem) {
        return State.deserializeClass(paymentRedeem, PaymentRedeem);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(paymentRedeemAttributes) {
      return new PaymentRedeem(paymentRedeemAttributes);
    }

    static getClass() {
        return 'org.paymentRedeem';
    }
}

module.exports = PaymentRedeem;
