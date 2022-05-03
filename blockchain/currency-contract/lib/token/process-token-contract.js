const { ActiveContext, ActiveContract } = require('./../active-contract')
const BiocoinOperations = require('./../biocoin/biocoin-operations.js');

class AccountContext extends ActiveContext {
    constructor() {
        super();
    }
}

class ProcessTokenContract extends ActiveContract {
    createContext() {
        return new AccountContext();
    }

    async createProcessToken(ctx, processTokenAttributes){
        const processToken = createInstanceProcessToken(processTokenAttributes)
        var user = await BiocoinOperations.withdraw_biocoins(ctx, ctx.user, processToken.value)
        user.tokens.push(processToken)
        await ctx.accountList.updateAccount(user)
        return user
    }

    async redeemProcessToken(ctx, paymentIntentionId){ 
        // const { userToken, index } = findUserToken(ctx.user.tokens, paymentIntentionId)
        // if (new Date(userToken.redeemDate) > new Date()){
        //     throw new Error("cant redeem token: not expired")
        // }
        // var user = await BiocoinOperations.deposit_biocoins(ctx, ctx.user, userToken.value)
        // return await deleteUserToken(ctx, user, index)
    }
}

function createInstanceProcessToken(processTokenAttributes){
    const paymentIntention = JSON.parse(processTokenAttributes)
    return processToken = {
        process_request_id: paymentIntention.process_request_id,
        token_id: paymentIntention.process_request_id,
        type: "process_token",
        value: paymentIntention.value,
        owner: paymentIntention.owner, 
        raw_dna_id: paymentIntention.raw_dna_id
    }
}

module.exports =  ProcessTokenContract;