'use strict';

const { Contract, Context } = require('fabric-contract-api');
const AccountList = require('./../account/account-list.js');
const BiocoinOperations = require('./biocoin-operations.js');



class AccountContext extends Context {
    constructor() {
        super();
        this.accountList = new AccountList(this);
    }
}

class BiocoinContract extends Contract {
    createContext() {
        return new AccountContext();
    }

    async transfer_biocoins(ctx, sender_address, receiver_address, amount){
        let sender_account = await ctx.accountList.getAccount(sender_address);
        let receiver_account = await ctx.accountList.getAccount(receiver_address);
        
        if( validate_transference(sender_account, amount) == false ) return
        // throw new Error(amount)
        sender_account = await BiocoinOperations.withdraw_biocoins(ctx, sender_account, amount)
        receiver_address = await BiocoinOperations.deposit_biocoins(ctx, receiver_account, amount)

        return [sender_account, receiver_account]
    }
}

function validate_transference(sender_account, amount){
    if(amount<0){
        throw new Error('invalid Transaction')
    }
    if(sender_account.balance < amount){
        throw new Error('balance Insuficient')
    }
    if(false){
        throw new Error('unauthorized')
    }
    return true
}

module.exports = BiocoinContract;
