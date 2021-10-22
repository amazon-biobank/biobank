const Dinero = require('./../dinero.js')

class BiocoinOperations {
    static async withdraw_biocoins(ctx, account, value) {
        const accountDinero = Dinero({ amount: account.balance })
        const valueDinero = Dinero({ amount: Number(value) })
        account.balance = accountDinero.subtract(valueDinero).getAmount()
        verify(account, valueDinero)
        await ctx.accountList.updateState(account);
        return account
    }

    static async deposit_biocoins(ctx, account, value) {
        const accountDinero = Dinero({ amount: account.balance })
        const valueDinero = Dinero({ amount: Number(value) })
        account.balance = accountDinero.add(valueDinero).getAmount()
        verify(account, valueDinero)
        await ctx.accountList.updateState(account);
        return account
    }

    static async transferBiocoins(ctx, senderAccount, receiverAccount, amount){
        this.validateTransference(ctx, senderAccount, amount)

        const newSenderAccount = await BiocoinOperations.withdraw_biocoins(ctx, senderAccount, amount)
        const newReceiverAccount = await BiocoinOperations.deposit_biocoins(ctx, receiverAccount, amount)
        return { senderAccount: newSenderAccount, receiverAccount: newReceiverAccount }
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

function verify(account, valueDinero){
    if(account.balance < 0 ){
        throw new Error('insuficient balance')
    } 
    if(isNaN(account.balance)){
        throw new Error('invalid transference')
    }
    if(valueDinero.isNegative()){
        throw new Error('Negative Values are not allowed')
    }
    return
}



module.exports = BiocoinOperations;
