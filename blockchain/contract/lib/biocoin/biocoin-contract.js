'use strict';

const { Contract, Context } = require('fabric-contract-api');
const AccountList = require('./../account/account-list.js');
const BiocoinOperations = require('./biocoin-operations.js');

const CryptoUtils = require('./../crypto-utils')




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

    async transferBiocoins(ctx, senderAddress, receiverAddress, amount){
        let senderAccount = await ctx.accountList.getAccount(senderAddress);
        let receiverAccount = await ctx.accountList.getAccount(receiverAddress);
        
        if( validateTransference(ctx, senderAccount, amount) == false ) return
        senderAccount = await BiocoinOperations.withdraw_biocoins(ctx, senderAccount, amount)
        receiverAddress = await BiocoinOperations.deposit_biocoins(ctx, receiverAccount, amount)

        return [senderAccount, receiverAccount]
    }
}

function validateTransference(ctx, senderAccount, amount){
    if(verifySenderAccount(ctx, senderAccount)){
        throw new Error('unauthorized')
    }
    if(amount<0){
        throw new Error('invalid Transaction')
    }
    if(senderAccount.balance < amount){
        throw new Error('balance Insuficient')
    }
    return true
}

function verifySenderAccount(ctx, senderAccount){
    const certificate = CryptoUtils.getUserCertificate(ctx)
    const publicKey = CryptoUtils.getPublicKeyFromCertificate(certificate)
    const userAddress = CryptoUtils.getAddressFromPublicKey(publicKey)
    return ( (userAddress == senderAccount.address)? false : true)
}

module.exports = BiocoinContract;
