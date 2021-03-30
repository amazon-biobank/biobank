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
}

module.exports = BiocoinOperations;
