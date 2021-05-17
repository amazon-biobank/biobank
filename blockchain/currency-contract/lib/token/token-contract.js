const { ActiveContext, ActiveContract } = require('./../active-contract')
const BiocoinOperations = require('./../biocoin/biocoin-operations.js');
const { v4: uuidv4 } = require('uuid');

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

        var user = await BiocoinOperations.withdraw_biocoins(ctx, ctx.user, value)
        const tokenId = uuidv4()
        const screwToken = {
            tokenId, dnaId, value, redeemDate
        }
        user.tokens.push(screwToken)
        await ctx.accountList.updateAccount(user)
        return user
    }

    async redeemScrewToken(ctx, tokenId){
        const userTokens = ctx.user.tokens
        const isTokenIdEqual = (token) => token.tokenId == tokenId
        const index = userTokens.findIndex(isTokenIdEqual)

        if (new Date(userTokens[index].redeemDate) > new Date()){
            throw new Error("cant redeem token: not expired")
        }

        var user = await BiocoinOperations.deposit_biocoins(ctx, ctx.user, userTokens[index].value)
        user.tokens.splice(index, 1)
        await ctx.accountList.updateAccount(user)
        return user
    }
}


module.exports = TokenContract;
