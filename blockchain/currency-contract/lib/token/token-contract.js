const { pathToFileURL } = require('url');
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

    async createScrewToken(ctx, paymentIntentionAttributes){
        const screwToken = createInstanceScrewToken(paymentIntentionAttributes)
        var user = await BiocoinOperations.withdraw_biocoins(ctx, ctx.user, screwToken.value)
        user.tokens.push(screwToken)
        await ctx.accountList.updateAccount(user)
        return user
    }

    async redeemExpiredScrewToken(ctx, paymentIntentionId){
        const { userToken, index } = findUserToken(ctx.user.tokens, paymentIntentionId)
        if (new Date(userToken.redeemDate) > new Date()){
            throw new Error("cant redeem token: not expired")
        }
        var user = await BiocoinOperations.deposit_biocoins(ctx, ctx.user, userToken.value)
        return await deleteUserToken(ctx, user, index)
    }
}

function createInstanceScrewToken(paymentIntentionAttributes){
    const paymentIntention = JSON.parse(paymentIntentionAttributes)
    return screwToken = {
        payment_intention_id: paymentIntention.id, 
        value: paymentIntention.value_to_freeze,
        expiration_date: paymentIntention.expiration_date
    }
}

function findUserToken(tokens, id){
    const isIdEqual = (element) => element.payment_intention_id == id
    const index = tokens.findIndex(isIdEqual)
    const userToken = tokens[index]
    return { userToken, index }
}

async function deleteUserToken(ctx, user, index){
    user.tokens.splice(index, 1)
    await ctx.accountList.updateAccount(user)
    return user
}

module.exports = TokenContract;
