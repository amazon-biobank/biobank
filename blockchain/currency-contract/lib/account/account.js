'use strict';

const State = require('../../ledger-api/state.js');


class Account extends State {
    constructor(obj) {
        super(Account.getClass(), [obj.id]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */

    static fromBuffer(buffer) {
        return Account.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state Account to commercial paper
     * @param {Buffer} Account to form back into the object
     */
    static deserialize(account) {
        return State.deserializeClass(account, Account);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(accountAttributes) {
      return new Account(accountAttributes);
    }

    static getClass() {
        return 'org.account';
    }
}

module.exports = Account;
