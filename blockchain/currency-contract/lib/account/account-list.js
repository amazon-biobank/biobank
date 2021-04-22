'use strict';

const StateList = require('../../ledger-api/statelist.js');

const Account = require('./account.js');

class AccountList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.accountList');
        this.use(Account);
    }

    async addAccount(account) {
        return this.addState(account);
    }

    async getAccount(id) {
        const accountKey = Account.makeKey([id]);
        return this.getState(accountKey);
    }

    async updateAccount(account) {
        return this.updateState(account);
    }

    async getAllAccount() {
        return this.getStateByRange()
    }
}


module.exports = AccountList;
