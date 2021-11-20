const BalanceInsuficient = require('../errors/balanceInsuficient.js')
const InvalidTransaction = require('../errors/invalidTransaction.js')
const Unauthorized = require('../errors/unauthorized.js')
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
        if(amount<0){
            throw new InvalidTransaction();
        }
        if(senderAccount.balance < amount){
            throw new BalanceInsuficient();
        }
        return true
    }

    static verifyUserEqualsSender(ctx, senderAccount){
        if(ctx.user.address != senderAccount.address){
            throw new Unauthorized();
        }
        return 
    }

    static async getReceiverAccount(ctx, senderAddress, receiverAddress, senderAccount) {
        return (senderAddress == receiverAddress) ? senderAccount : await ctx.accountList.getAccount(receiverAddress);
    }
}

function verify(account, valueDinero){
    if(account.balance < 0 ){
        throw new BalanceInsuficient();
    } 
    if(isNaN(account.balance)){
        throw new InvalidTransaction();
    }
    if(valueDinero.isNegative()){
        throw new InvalidTransaction();
    }
    return
}



module.exports = BiocoinOperations;
