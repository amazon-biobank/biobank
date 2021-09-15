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

    async createEscrowToken(ctx, paymentIntentionAttributes){
        const escrowToken = createInstanceEscrowToken(paymentIntentionAttributes)
        var user = await BiocoinOperations.withdraw_biocoins(ctx, ctx.user, escrowToken.value)
        user.tokens.push(escrowToken)
        await ctx.accountList.updateAccount(user)
        return user
    }

    async redeemExpiredEscrowToken(ctx, paymentIntentionId){ 
        const { userToken, index } = findUserToken(ctx.user.tokens, paymentIntentionId)
        if (new Date(userToken.redeemDate) > new Date()){
            throw new Error("cant redeem token: not expired")
        }
        var user = await BiocoinOperations.deposit_biocoins(ctx, ctx.user, userToken.value)
        return await deleteUserToken(ctx, user, index)
    }
}

function createInstanceEscrowToken(paymentIntentionAttributes){
    const paymentIntention = JSON.parse(paymentIntentionAttributes)
    return escrowToken = {
        type: "escrow_token",
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

module.exports =  TokenContract;
