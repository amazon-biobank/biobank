const { ActiveContext, ActiveContract } = require('./../active-contract')
const BiocoinOperations = require('./../biocoin/biocoin-operations.js');

class AccountContext extends ActiveContext {
    constructor() {
        super();
    }
}

class TokenContract extends ActiveContract {
    createContext() {
        return new AccountContext();
    }

    async createScrewToken(ctx, dnaId, value, redeemDateString){
        const redeemDate = new Date(redeemDateString)
        if(redeemDate < new Date()){
            throw new Error("Inválid redeemDate")
        }

        await BiocoinOperations.withdraw_biocoins(ctx, ctx.user, value)
        
        // const isDnaIdEqual = (token) => token.dnaId == dnaId
        // if(ctx.user.tokens.some(isDnaIdEqual))
        const screwToken = {
            dnaId, value, redeemDate
        }
        ctx.user.tokens.push(screwToken)
        await ctx.accountList.updateAccount(ctx.user)
        return ctx.user
    }
}


module.exports = TokenContract;
