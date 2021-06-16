'use strict';

const State = require('../../ledger-api/state.js');


class PaymentIntention extends State {
    constructor(obj) {
        super(PaymentIntention.getClass(), [obj.id]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */

    static fromBuffer(buffer) {
        return PaymentIntention.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state PaymentIntention to commercial paper
     * @param {Buffer} PaymentIntention to form back into the object
     */
    static deserialize(paymentIntention) {
        return State.deserializeClass(paymentIntention, PaymentIntention);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(paymentIntentionAttributes) {
      return new PaymentIntention(paymentIntentionAttributes);
    }

    static getClass() {
        return 'org.paymentIntention';
    }
}

module.exports = PaymentIntention;
