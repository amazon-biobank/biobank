class BiocoinOperations {
    static async withdraw_biocoins(ctx, account, amount) {
        account.balance = Number(account.balance) - Number(amount)   
        if(account.balance < 0 ){
            throw new Error('insuficient balance')
        }    

        await ctx.accountList.updateState(account);
        return account
    }

    static async deposit_biocoins(ctx, account, amount) {
        account.balance = Number(account.balance) + Number(amount)   
        if(account.balance < 0 ){
            throw new Error('insuficient balance')
        }    

        await ctx.accountList.updateState(account);
        return account
    }

    static async transferBiocoins(ctx, senderAddress, receiverAddress, amount){
        let senderAccount = await ctx.accountList.getAccount(senderAddress);
        this.validateTransference(ctx, senderAccount, amount)

        senderAccount = await BiocoinOperations.withdraw_biocoins(ctx, senderAccount, amount)
        let receiverAccount = await this.getReceiverAccount(ctx, senderAddress, receiverAddress, senderAccount)
        receiverAccount = await BiocoinOperations.deposit_biocoins(ctx, receiverAccount, amount)

        return [senderAccount, receiverAccount]
    }

    static validateTransference(ctx, senderAccount, amount){
        if(this.verifySenderAccount(ctx, senderAccount) == false){
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

    static verifySenderAccount(ctx, senderAccount){
        return ctx.user.address == senderAccount.address
    }

    static async getReceiverAccount(ctx, senderAddress, receiverAddress, senderAccount) {
        return (senderAddress == receiverAddress) ? senderAccount : await ctx.accountList.getAccount(receiverAddress);
    }
}



module.exports = BiocoinOperations;
